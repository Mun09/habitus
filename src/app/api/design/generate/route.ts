import { NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { buildPrompt } from "@/lib/ai/generate-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type GenerateBody = {
  planId: string;
  spaceImageUrl: string;
  selectedOptionIds: string[];
  styleKey: string;
};

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

  // 3. Env checks
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // 4. Mark plan as generating
  await supabase
    .from("design_plans")
    .update({ status: "generating" })
    .eq("id", planId)
    .eq("user_id", user.id);

  try {
    // 5. Fetch the source space image and convert to File for the SDK
    const sourceResponse = await fetch(spaceImageUrl);
    if (!sourceResponse.ok) {
      throw new Error(`Failed to fetch source image: ${sourceResponse.status}`);
    }
    const sourceArrayBuffer = await sourceResponse.arrayBuffer();
    const sourceContentType = sourceResponse.headers.get("content-type") ?? "image/jpeg";
    const sourceExtension = sourceContentType.includes("png")
      ? "png"
      : sourceContentType.includes("webp")
        ? "webp"
        : "jpg";
    const sourceFile = await toFile(
      Buffer.from(sourceArrayBuffer),
      `space.${sourceExtension}`,
      { type: sourceContentType }
    );

    // 6. Call OpenAI gpt-image-1 image edit
    const prompt = buildPrompt(selectedOptionIds ?? [], styleKey ?? "random");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.images.edit({
      model: "gpt-image-1",
      image: sourceFile,
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const first = result.data?.[0];
    const b64 = first?.b64_json;
    if (!b64) {
      throw new Error("OpenAI returned no image data");
    }

    // 7. Upload generated image to Supabase Storage via service role
    const service = await createServiceClient();
    const buffer = Buffer.from(b64, "base64");
    const path = `ai-outputs/${planId}/0.png`;
    const { error: uploadError } = await service.storage
      .from("habitus-uploads")
      .upload(path, buffer, {
        contentType: "image/png",
        upsert: true,
        cacheControl: "31536000",
      });
    if (uploadError) throw uploadError;

    const { data: pub } = service.storage.from("habitus-uploads").getPublicUrl(path);
    const afterUrl = pub.publicUrl;

    // 8. Persist plan + generated_image rows
    await service
      .from("design_plans")
      .update({
        proposal_urls: [afterUrl],
        hero_proposal_url: afterUrl,
        status: "done",
      })
      .eq("id", planId);

    await service.from("generated_images").insert({
      plan_id: planId,
      space_index: 0,
      before_url: spaceImageUrl,
      after_url: afterUrl,
      prompt,
    });

    return NextResponse.json({ urls: [afterUrl] });
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
