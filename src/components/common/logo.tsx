import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Habitus"
        width={28}
        height={28}
        priority
        className="h-7 w-7 object-contain"
      />
      <span className="serif text-xl font-semibold tracking-tight">Habitus</span>
    </div>
  );
}
