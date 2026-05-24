"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Clock, Eye, Hammer, Pencil, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { DemoBanner } from "@/components/contractor/demo-banner";
import { useLocale } from "@/lib/i18n/locale-provider";
import { BADGE_LABELS, type Contractor } from "@/lib/mock/contractors";
import { formatKRW } from "@/lib/utils";

type Props = {
  contractor: Contractor;
};

export function ProfilePreviewClient({ contractor }: Props) {
  const { t } = useLocale();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(contractor.bio);
  const [startingPrice, setStartingPrice] = useState(contractor.startingPrice);
  const [responseHours, setResponseHours] = useState(contractor.responseHours);

  const handleSave = () => {
    setEditing(false);
    toast.success(t("contractor.profile.saveToast"));
  };
  const handleCancel = () => {
    setBio(contractor.bio);
    setStartingPrice(contractor.startingPrice);
    setResponseHours(contractor.responseHours);
    setEditing(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
            {t("contractor.profile.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("contractor.profile.subtitle")}
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              {t("contractor.profile.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("contractor.profile.save")}</Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
            {t("contractor.profile.edit")}
          </Button>
        )}
      </div>

      <div className="mt-5">
        <DemoBanner />
      </div>

      {/* Preview hero */}
      <div className="mt-8 relative overflow-hidden rounded-3xl border border-border bg-card">
        {/* Cover */}
        <div className="relative h-48 md:h-64 bg-muted">
          <Image
            src={contractor.cover}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/40 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge variant="primary" className="text-[10px]">
              <Eye className="h-3 w-3" />
              {t("contractor.profile.previewBadge")}
            </Badge>
          </div>
          {editing && (
            <div className="absolute right-4 top-4">
              <Badge variant="warning" className="text-[10px]">
                {t("contractor.profile.editing")}
              </Badge>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            <div className="relative -mt-16 h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-4 border-card bg-muted shadow md:h-28 md:w-28">
              <Image
                src={contractor.profileImage}
                alt={contractor.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="serif text-2xl font-medium md:text-3xl">
                {contractor.company}
              </h2>
              <div className="mt-1 text-sm text-muted-foreground">
                {contractor.name} · {contractor.region}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            {editing ? (
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            ) : (
              <p className="text-base leading-relaxed text-foreground/85">
                {bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat
              icon={<Star className="h-4 w-4 fill-primary text-primary" />}
              label={t("contractor.profile.stats.rating")}
              value={`${contractor.rating} · ${contractor.reviewCount}`}
            />
            <Stat
              icon={<Hammer className="h-4 w-4 text-primary" />}
              label={t("contractor.profile.stats.completed")}
              value={`${contractor.completedProjects}+`}
            />
            <Stat
              icon={<Clock className="h-4 w-4 text-primary" />}
              label={t("contractor.profile.stats.response")}
              value={
                editing ? (
                  <Input
                    type="number"
                    min={1}
                    value={responseHours}
                    onChange={(e) =>
                      setResponseHours(Number(e.target.value) || 1)
                    }
                    className="h-8 text-sm"
                  />
                ) : (
                  `${responseHours}h`
                )
              }
            />
            <Stat
              label={t("contractor.profile.stats.years")}
              value={`${contractor.yearsExperience}y`}
            />
          </div>

          {/* Starting price (editable) */}
          <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("contractor.profile.startingPriceLabel")}
            </div>
            {editing ? (
              <Input
                type="number"
                min={0}
                step={100000}
                value={startingPrice}
                onChange={(e) =>
                  setStartingPrice(Number(e.target.value) || 0)
                }
                className="mt-2"
              />
            ) : (
              <div className="serif mt-1 text-2xl font-medium">
                {formatKRW(startingPrice)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <section className="mt-10">
        <h3 className="serif text-xl font-medium text-secondary">
          {t("contractor.profile.section.badges")}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {contractor.licensed && (
            <Badge variant="success" className="text-xs">
              <BadgeCheck className="h-3 w-3" />
              Licensed
            </Badge>
          )}
          {contractor.badges.map((b) => (
            <Badge key={b} variant="muted" className="text-xs">
              <BadgeCheck className="h-3 w-3" />
              {BADGE_LABELS[b]}
            </Badge>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="mt-10">
        <h3 className="serif text-xl font-medium text-secondary">
          {t("contractor.profile.section.portfolio")}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {contractor.portfolio.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 240px, 45vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="serif mt-1 text-xl font-medium">{value}</div>
    </div>
  );
}
