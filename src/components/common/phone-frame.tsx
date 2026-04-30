import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="phone-frame">
        <div className="phone-screen">{children}</div>
      </div>
      {label && (
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  );
}
