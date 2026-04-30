import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-foreground",
        primary: "bg-primary/10 border-primary/20 text-primary",
        secondary: "bg-secondary/10 border-secondary/20 text-secondary",
        success: "bg-success/10 border-success/30 text-[color:var(--success)]",
        warning: "bg-warning/10 border-warning/30 text-[color:var(--warning)]",
        muted: "bg-muted border-transparent text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
