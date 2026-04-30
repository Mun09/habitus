import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="text-xs font-medium tracking-[0.18em] text-primary uppercase mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="serif text-3xl md:text-5xl font-medium leading-[1.1] whitespace-pre-line">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
          {body}
        </p>
      )}
    </div>
  );
}
