"use client";

import Link from "next/link";
import { circuits2026, isRaceCompleted, getCurrentOrNextRace } from "@/lib/data/circuits";
import StatusBadge from "@/components/ui/StatusBadge";

const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

export default function MobileRaceList() {
  const currentRace = getCurrentOrNextRace();

  return (
    <div className="px-4 py-6 space-y-3">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold italic text-on-surface mb-4">
        2026 RACE CALENDAR
      </h2>
      {circuits2026.map((circuit) => {
        const completed = isRaceCompleted(circuit);
        const isCurrent = circuit.id === currentRace?.id;

        return (
          <Link
            key={circuit.id}
            href={`/race/${circuit.id}`}
            className={`
              block p-4 bg-surface-container transition-all transition-gearbox
              ${isCurrent ? "glow-red-sm bg-surface-container-high" : "hover:bg-surface-container-high"}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="label-engineering text-outline w-8">
                  R{String(circuit.round).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] font-semibold text-on-surface">
                    {circuit.raceName}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {circuit.city}, {circuit.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant">
                  {formatDate(circuit.date)}
                </span>
                <StatusBadge status={completed ? "completed" : "upcoming"} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
