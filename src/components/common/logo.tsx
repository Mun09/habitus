import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="2" y="2" width="24" height="24" rx="7" fill="#C97B5A" />
        <path
          d="M9 13.5C9 11.0147 11.0147 9 13.5 9H19V13.5C19 16.5376 16.5376 19 13.5 19H9V13.5Z"
          fill="#FAF7F2"
        />
        <circle cx="13.5" cy="13.5" r="1.6" fill="#3F4A3C" />
      </svg>
      <span className="serif text-xl font-semibold tracking-tight">Gather</span>
    </div>
  );
}
