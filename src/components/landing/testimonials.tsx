"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";

export function Testimonials() {
  const { t } = useLocale();

  const items = [
    {
      avatar: IMAGES.testimonials[0],
      name: "Minji K.",
      role: "Mapo, 105m²",
      body: "Daily photo updates kept me at ease even on business trips. The market price comparison sealed it.",
    },
    {
      avatar: IMAGES.testimonials[1],
      name: "Seojun P.",
      role: "Songpa, 82m² newlyweds",
      body: "Quoted ₩45M elsewhere. Finished at a fair price here. The AI flagged material-swap risk upfront.",
    },
    {
      avatar: IMAGES.testimonials[2],
      name: "Haneul L.",
      role: "Seongsu, 130m² cafe",
      body: "Had one dispute. PM intervened within 24h and resolved it cleanly. Habitus has my trust now.",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow={t("landing.testimonials.eyebrow")}
            title={t("landing.testimonials.title")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-card border border-border p-7">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="serif text-lg leading-snug mt-5">&ldquo;{it.body}&rdquo;</p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src={it.avatar} alt={it.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
