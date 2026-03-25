"use client";

import { getCurrentOrNextRace } from "@/lib/data/circuits";
import { getFlagEmoji } from "@/lib/data/country-flags";

export default function Footer() {
  const next = getCurrentOrNextRace();

  const dateFormatted = next
    ? new Date(next.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <footer className="sticky bottom-0 z-50 border-t border-white/5">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-surface-container-lowest/85 backdrop-blur-md" />

      {/* Top neon line */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent" />

      <div className="relative hidden md:flex items-center justify-between px-8 h-10">

        {/* Left: NEXT RACE label + name */}
        <div className="flex items-center gap-4">
          <span className="label-engineering text-primary-container/70 tracking-widest">
            NEXT RACE
          </span>
          <span className="w-px h-3.5 bg-outline-variant/30" />
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold italic text-on-surface">
            {next?.raceName ?? "—"}
          </span>
        </div>

        {/* Center: location + date */}
        <div className="flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
          {next && (
            <span className="text-lg leading-none">{getFlagEmoji(next.country)}</span>
          )}
          <span className="font-[family-name:var(--font-display)] text-[13px] font-light italic text-on-surface/70 tracking-wide">
            {next ? `${next.city}, ${next.country}` : "—"}
          </span>
          <span className="w-px h-3 bg-outline-variant/30" />
          <span className="font-[family-name:var(--font-display)] text-[13px] font-light italic text-on-surface/50 tracking-wide">
            {dateFormatted}
          </span>
        </div>

        {/* Right: round */}
        <div className="flex items-center gap-4">
          <span className="label-engineering text-outline/50">2026 SEASON</span>
          <span className="w-px h-3.5 bg-outline-variant/30" />
          <span className="label-engineering text-primary-container/60">
            ROUND {next?.round ?? "—"} / 24
          </span>
        </div>
      </div>
    </footer>
  );
}
