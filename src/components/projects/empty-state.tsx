import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyProjectsState() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <h1 className="serif text-3xl font-medium leading-tight md:text-4xl">
        No projects yet
      </h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        Generate a design proposal in the Design Studio, then pick a verified
        contractor. Your first project will appear here as soon as you request
        a consultation.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/design">
            Start in Design Studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/matching">Browse contractors</Link>
        </Button>
      </div>
    </div>
  );
}
