import { createClient } from "./client";

const BUCKET = "habitus-uploads";

export async function uploadSpacePhoto(blobUrl: string, userId: string): Promise<string> {
  const supabase = createClient();
  const blob = await fetch(blobUrl).then((r) => r.blob());
  const ext = blob.type.split("/")[1] ?? "jpg";
  const path = `user-spaces/${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadReferencePhoto(blobUrl: string, userId: string): Promise<string> {
  const supabase = createClient();
  const blob = await fetch(blobUrl).then((r) => r.blob());
  const ext = blob.type.split("/")[1] ?? "jpg";
  const path = `user-references/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export type StorageClient = ReturnType<typeof createClient>["storage"];

export async function uploadAiOutputFromBase64(
  storage: StorageClient,
  base64: string,
  planId: string,
  index: number
): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const path = `ai-outputs/${planId}/${index}.png`;

  const { error } = await storage.from(BUCKET).upload(path, buffer, {
    cacheControl: "31536000",
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw error;

  return storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export function isBlobUrl(url: string | undefined | null): boolean {
  return typeof url === "string" && url.startsWith("blob:");
}
