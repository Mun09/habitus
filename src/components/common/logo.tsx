import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "serif flex items-center text-xl font-semibold tracking-tight",
        className,
      )}
      aria-label="Habitus"
    >
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        priority
        aria-hidden
        className="-mr-0.5 inline-block h-[1.15em] w-auto object-contain"
      />
      <span aria-hidden>abitus</span>
    </div>
  );
}
