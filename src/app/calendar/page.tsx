import Link from "next/link";
import { circuits2026, isRaceCompleted, getCurrentOrNextRace } from "@/lib/data/circuits";
import { getFlagEmoji } from "@/lib/data/country-flags";
import StatusBadge from "@/components/ui/StatusBadge";
import SlashedContainer from "@/components/ui/SlashedContainer";

export default function CalendarPage() {
  const currentRace = getCurrentOrNextRace();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="label-engineering text-outline mb-2">SEASON SCHEDULE</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold italic text-on-surface">
          2026 RACE CALENDAR
        </h1>
        <p className="text-on-surface-variant mt-2">
          Engineered for Maximum Velocity — 22 Rounds
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-surface-container-highest" />

        <div className="space-y-4">
          {circuits2026.map((circuit) => {
            const completed = isRaceCompleted(circuit);
            const isCurrent = circuit.id === currentRace?.id;
            const raceDate = new Date(circuit.date);

            return (
              <Link key={circuit.id} href={`/race/${circuit.id}`} className="block group">
                <div className="flex items-start gap-4 md:gap-6 relative">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 md:w-16 flex justify-center pt-4">
                    <div
                      className={`w-3 h-3 ${
                        isCurrent
                          ? "bg-primary-container glow-red-sm animate-pulse-pin"
                          : completed
                            ? "bg-surface-container-highest"
                            : "bg-outline-variant"
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <SlashedContainer
                    variant="small"
                    className={`
                      flex-1 p-5 transition-all transition-gearbox
                      ${
                        isCurrent
                          ? "bg-surface-container-high glow-red-sm"
                          : "bg-surface-container group-hover:bg-surface-container-high"
                      }
                    `}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="label-engineering text-outline">
                            ROUND {String(circuit.round).padStart(2, "0")}
                          </span>
                          <StatusBadge status={completed ? "completed" : "upcoming"} />
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface group-hover:text-primary">
                          {circuit.raceName}
                        </h3>
                        <p className="text-sm text-on-surface-variant mt-1">
                          {circuit.name} — {circuit.city}, {getFlagEmoji(circuit.country)} {circuit.country}
                        </p>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-1">
                        <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                          {raceDate.toLocaleDateString("en-GB", { day: "numeric" })}
                        </p>
                        <p className="text-sm text-on-surface-variant uppercase">
                          {raceDate.toLocaleDateString("en-GB", { month: "long" })}
                        </p>
                      </div>
                    </div>

                    {/* Circuit stats */}
                    <div className="flex gap-6 mt-4 pt-3" style={{ borderTop: "1px solid rgba(94,63,58,0.15)" }}>
                      <div>
                        <p className="label-engineering text-outline">LENGTH</p>
                        <p className="text-sm text-on-surface">{circuit.length}</p>
                      </div>
                      <div>
                        <p className="label-engineering text-outline">LAPS</p>
                        <p className="text-sm text-on-surface">{circuit.laps}</p>
                      </div>
                      <div>
                        <p className="label-engineering text-outline">DISTANCE</p>
                        <p className="text-sm text-on-surface">{circuit.distance}</p>
                      </div>
                    </div>
                  </SlashedContainer>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
