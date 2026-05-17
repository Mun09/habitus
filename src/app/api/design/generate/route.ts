import { NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  buildPrompt,
  buildPromptForVariant,
  RANDOM_STYLE_VARIANTS,
} from "@/lib/ai/generate-prompt";

export const runtime = "nodejs";
export const maxDuration = 120;

type GenerateBody = {
  planId: string;
  spaceImageUrl: string;
  selectedOptionIds: string[];
  styleKey: string;
};

type SourceFile = Awaited<ReturnType<typeof toFile>>;

async function fetchSourceFile(spaceImageUrl: string): Promise<SourceFile> {
  const sourceResponse = await fetch(spaceImageUrl);
  if (!sourceResponse.ok) {
    throw new Error(`Failed to fetch source image: ${sourceResponse.status}`);
  }
  const sourceArrayBuffer = await sourceResponse.arrayBuffer();
  const sourceContentType =
    sourceResponse.headers.get("content-type") ?? "image/jpeg";
  const sourceExtension = sourceContentType.includes("png")
    ? "png"
    : sourceContentType.includes("webp")
      ? "webp"
      : "jpg";
  return toFile(
    Buffer.from(sourceArrayBuffer),
    `space.${sourceExtension}`,
    { type: sourceContentType }
  );
}

async function generateOne(
  openai: OpenAI,
  sourceFile: SourceFile,
  prompt: string
): Promise<Buffer> {
  const result = await openai.images.edit({
    model: "gpt-image-1",
    image: sourceFile,
    prompt,
    n: 1,
    size: "1024x1024",
  });
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image data");
  return Buffer.from(b64, "base64");
}

type UploadedRender = {
  index: number;
  url: string;
  prompt: string;
  variant: string;
};

async function snapshotMaterials(
  service: Awaited<ReturnType<typeof createServiceClient>>,
  planId: string,
  variants: readonly string[]
) {
  const { data: catalog } = await service
    .from("material_catalog")
    .select("id, style_key, qty, unit_price, tier")
    .in("style_key", variants as string[]);
  if (!catalog || catalog.length === 0) return;

  const rows = catalog.flatMap((row) => {
    const variantIdx = variants.indexOf(row.style_key);
    if (variantIdx === -1) return [];
    return [
      {
        plan_id: planId,
        material_id: row.id,
        variant_idx: variantIdx,
        qty: row.qty,
        unit_price: row.unit_price,
        tier: row.tier,
      },
    ];
  });
  if (rows.length > 0) {
    await service.from("design_plan_materials").insert(rows);
  }
}

export async function POST(request: Request) {
  // 1. Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { planId, spaceImageUrl, selectedOptionIds, styleKey } = body;
  if (!planId || !spaceImageUrl) {
    return NextResponse.json(
      { error: "planId and spaceImageUrl are required" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // 3. Mark plan as generating
  await supabase
    .from("design_plans")
    .update({ status: "generating" })
    .eq("id", planId)
    .eq("user_id", user.id);

  try {
    const sourceFile = await fetchSourceFile(spaceImageUrl);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const service = await createServiceClient();

    // For Random style we fan out to five variant prompts in parallel.
    // Any other style returns a single proposal.
    const variants: string[] =
      styleKey === "random"
        ? [...RANDOM_STYLE_VARIANTS]
        : [styleKey];
    const prompts = variants.map((v, i) =>
      styleKey === "random"
        ? buildPromptForVariant(
            v as (typeof RANDOM_STYLE_VARIANTS)[number],
            selectedOptionIds ?? []
          )
        : buildPrompt(selectedOptionIds ?? [], styleKey ?? "random") +
          (i === 0 ? "" : "")
    );

    const buffers = await Promise.all(
      prompts.map((p) => generateOne(openai, sourceFile, p))
    );

    const uploads: UploadedRender[] = await Promise.all(
      buffers.map(async (buffer, index) => {
        const path = `ai-outputs/${planId}/${index}.png`;
        const { error: uploadError } = await service.storage
          .from("habitus-uploads")
          .upload(path, buffer, {
            contentType: "image/png",
            upsert: true,
            cacheControl: "31536000",
          });
        if (uploadError) throw uploadError;
        const { data: pub } = service.storage
          .from("habitus-uploads")
          .getPublicUrl(path);
        return {
          index,
          url: pub.publicUrl,
          prompt: prompts[index],
          variant: variants[index],
        };
      })
    );

    const urls = uploads.map((u) => u.url);

    await service
      .from("design_plans")
      .update({
        proposal_urls: urls,
        hero_proposal_url: urls[0],
        status: "done",
      })
      .eq("id", planId);

    await service.from("generated_images").insert(
      uploads.map((u) => ({
        plan_id: planId,
        space_index: u.index,
        before_url: spaceImageUrl,
        after_url: u.url,
        prompt: u.prompt,
      }))
    );

    await snapshotMaterials(service, planId, variants);

    return NextResponse.json({ urls });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await supabase
      .from("design_plans")
      .update({ status: "failed", error_message: message })
      .eq("id", planId)
      .eq("user_id", user.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
