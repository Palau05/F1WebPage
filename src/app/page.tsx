"use client";

import dynamic from "next/dynamic";
import { getCurrentOrNextRace } from "@/lib/data/circuits";

const GlobeScene = dynamic(() => import("@/components/globe/GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-16 h-1 bg-primary-container mx-auto mb-4 animate-pulse" />
        <p className="label-engineering text-on-surface-variant">INITIALIZING GLOBE</p>
      </div>
    </div>
  ),
});

const MobileRaceList = dynamic(
  () => import("@/components/globe/MobileRaceList"),
  { ssr: true }
);

export default function HomePage() {
  const nextRace = getCurrentOrNextRace();

  return (
    <div className="relative">
      {/* Desktop: 3D Globe */}
      <div className="hidden md:block h-[calc(100vh-4rem)]">
        <GlobeScene />
      </div>

      {/* Mobile: Race List */}
      <div className="md:hidden">
        <MobileRaceList />
      </div>

      {/* Bottom telemetry bar */}
      <div className="absolute bottom-0 left-0 right-0 glass-panel px-6 py-3 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="label-engineering text-outline">NEXT RACE</p>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold italic text-on-surface">
              {nextRace?.raceName || "—"}
            </p>
          </div>
          <div>
            <p className="label-engineering text-outline">LOCATION</p>
            <p className="text-sm text-on-surface-variant">
              {nextRace?.city}, {nextRace?.country}
            </p>
          </div>
          <div>
            <p className="label-engineering text-outline">DATE</p>
            <p className="text-sm text-on-surface-variant">
              {nextRace
                ? new Date(nextRace.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="label-engineering text-tertiary">
            SEASON 2026 — {nextRace ? `ROUND ${nextRace.round}/22` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
