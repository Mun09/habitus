"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/user-provider";
import { cn } from "@/lib/utils";

const BUCKET = "habitus-uploads";

type Props = {
  folder: "user-references" | "user-spaces";
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
};

export function PhotoUploader({
  folder,
  value,
  onChange,
  max = 6,
  className,
}: Props) {
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const pickFiles = () => inputRef.current?.click();

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    const room = max - value.length;
    if (room <= 0) {
      toast.error(`Up to ${max} photos.`);
      return;
    }
    const queue = Array.from(files).slice(0, room);
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];
    try {
      for (const file of queue) {
        const ext = (file.type.split("/")[1] ?? "jpg").replace("jpeg", "jpg");
        const path = `${folder}/${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "31536000",
            contentType: file.type || "image/jpeg",
            upsert: false,
          });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => {
    onChange(value.filter((v) => v !== url));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-3 gap-2">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label="Remove"
              className="absolute right-1 top-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground/75 text-background hover:bg-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={pickFiles}
            disabled={uploading || !user}
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition hover:bg-muted",
              uploading && "opacity-60"
            )}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wider">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {value.length} / {max} photos
      </div>
    </div>
  );
}
