"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";

export function Testimonials() {
  const { t, pick } = useLocale();

  const items = [
    {
      avatar: IMAGES.testimonials[0],
      name: { ko: "김민지", en: "Minji K." },
      role: { ko: "마포 32평 거주", en: "Mapo, 105m²" },
      body: {
        ko: "사진 업데이트가 매일 와서 출장 중에도 안심됐어요. 견적 단계에서 시장가를 비교해주는 게 결정적이었습니다.",
        en: "Daily photo updates kept me at ease even on business trips. The market price comparison sealed it.",
      },
    },
    {
      avatar: IMAGES.testimonials[1],
      name: { ko: "박서준", en: "Seojun P." },
      role: { ko: "송파 25평 신혼", en: "Songpa, 82m² newlyweds" },
      body: {
        ko: "다른 데서 4500만원 부른 공사를 합리적인 가격에 끝냈어요. AI가 자재 빼돌리기 위험을 미리 짚어줬어요.",
        en: "Quoted ₩45M elsewhere — finished at a fair price here. The AI flagged material-swap risk upfront.",
      },
    },
    {
      avatar: IMAGES.testimonials[2],
      name: { ko: "이하늘", en: "Haneul L." },
      role: { ko: "성수 40평 카페", en: "Seongsu, 130m² cafe" },
      body: {
        ko: "분쟁이 한 번 있었는데 24시간 안에 PM이 개입해서 깔끔히 정리됐습니다. 이제 어디 인테리어 맡기든 Gather입니다.",
        en: "Had one dispute. PM intervened within 24h and resolved it cleanly. Gather has my trust now.",
      },
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
                <p className="serif text-lg leading-snug mt-5">"{pick(it.body)}"</p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src={it.avatar} alt={pick(it.name)} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{pick(it.name)}</div>
                    <div className="text-xs text-muted-foreground">{pick(it.role)}</div>
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
