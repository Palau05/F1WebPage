import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircuitById, isRaceCompleted, circuits2026 } from "@/lib/data/circuits";
import { getCircuitDescription } from "@/lib/data/circuit-descriptions";
import {
  getRaceResults,
  getQualifyingResults,
  getRaceSchedule,
  getPitStops,
  getLapData,
} from "@/lib/api/jolpica";
import StatusBadge from "@/components/ui/StatusBadge";
import CountdownDisplay from "@/components/race/CountdownDisplay";
import CircuitLayout from "@/components/race/CircuitLayout";
import StrategyView from "@/components/race/StrategyView";
import PositionChart from "@/components/race/PositionChart";
import RaceDetailTabs from "@/components/race/RaceDetailTabs";

export function generateStaticParams() {
  return circuits2026.map((c) => ({ circuitId: c.id }));
}

interface PageProps {
  params: Promise<{ circuitId: string }>;
}

export default async function RaceDetailPage({ params }: PageProps) {
  const { circuitId } = await params;
  const circuit = getCircuitById(circuitId);

  if (!circuit) {
    notFound();
  }

  const completed = isRaceCompleted(circuit);
  let raceResults = null;
  let qualifyingResults = null;
  let raceSchedule = null;
  let pitStops = null;
  let lapData = null;

  try {
    if (completed) {
      [raceResults, qualifyingResults, pitStops, lapData] = await Promise.all([
        getRaceResults(2026, circuit.round),
        getQualifyingResults(2026, circuit.round),
        getPitStops(2026, circuit.round),
        getLapData(2026, circuit.round),
      ]);
    } else {
      raceSchedule = await getRaceSchedule(2026, circuit.round);
    }
  } catch {
    // Fallback: show static data only
  }

  const circuitInfo = getCircuitDescription(circuitId);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 label-engineering"
      >
        ← BACK TO GLOBE
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-engineering text-outline">
            ROUND {String(circuit.round).padStart(2, "0")}
          </span>
          <StatusBadge status={completed ? "completed" : "upcoming"} />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold italic text-on-surface">
          {circuit.raceName.toUpperCase()}
        </h1>
        <p className="text-lg text-on-surface-variant mt-2">
          {circuit.name} — {circuit.city}, {circuit.country}
        </p>
      </div>

      {/* Top section: Circuit Layout + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[0.9rem] mb-[0.9rem]">
        {/* Circuit Layout (large) */}
        <div className="bg-surface-container-low p-6 lg:col-span-2">
          <CircuitLayout circuitId={circuitId} className="h-[280px] md:h-[360px]" />
          {/* Description overlay */}
          <p className="text-on-surface-variant text-sm mt-4 italic leading-relaxed">
            &ldquo;{circuitInfo.description}&rdquo;
          </p>
        </div>

        {/* Circuit Stats */}
        <div className="bg-surface-container-low p-6">
          <h3 className="label-engineering text-outline mb-4">CIRCUIT DATA</h3>
          <div className="space-y-5">
            <div>
              <p className="label-engineering text-outline">TOP SPEED</p>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary-container">
                {circuitInfo.topSpeed}
              </p>
            </div>
            <div>
              <p className="label-engineering text-outline">TRACK LENGTH</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                {circuit.length}
              </p>
            </div>
            <div>
              <p className="label-engineering text-outline">RACE LAPS</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                {circuit.laps}
              </p>
            </div>
            <div>
              <p className="label-engineering text-outline">RACE DISTANCE</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                {circuit.distance}
              </p>
            </div>
            <div>
              <p className="label-engineering text-outline">RACE DATE</p>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-on-surface">
                {new Date(circuit.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown for upcoming races */}
      {!completed && (
        <div className="bg-surface-container-high p-6 glow-red-sm mb-[0.9rem]">
          <h3 className="label-engineering text-outline mb-4">COUNTDOWN TO RACE</h3>
          <CountdownDisplay targetDate={circuit.date} />

          {raceSchedule && (
            <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(94,63,58,0.15)" }}>
              <h4 className="label-engineering text-outline mb-3">SESSION SCHEDULE</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {raceSchedule.FirstPractice && (
                  <SessionCard
                    name="PRACTICE 1"
                    date={raceSchedule.FirstPractice.date}
                    time={raceSchedule.FirstPractice.time}
                  />
                )}
                {raceSchedule.SecondPractice && (
                  <SessionCard
                    name="PRACTICE 2"
                    date={raceSchedule.SecondPractice.date}
                    time={raceSchedule.SecondPractice.time}
                  />
                )}
                {raceSchedule.ThirdPractice && (
                  <SessionCard
                    name="PRACTICE 3"
                    date={raceSchedule.ThirdPractice.date}
                    time={raceSchedule.ThirdPractice.time}
                  />
                )}
                {raceSchedule.SprintQualifying && (
                  <SessionCard
                    name="SPRINT QUALI"
                    date={raceSchedule.SprintQualifying.date}
                    time={raceSchedule.SprintQualifying.time}
                  />
                )}
                {raceSchedule.Sprint && (
                  <SessionCard
                    name="SPRINT"
                    date={raceSchedule.Sprint.date}
                    time={raceSchedule.Sprint.time}
                  />
                )}
                {raceSchedule.Qualifying && (
                  <SessionCard
                    name="QUALIFYING"
                    date={raceSchedule.Qualifying.date}
                    time={raceSchedule.Qualifying.time}
                  />
                )}
                <SessionCard
                  name="RACE"
                  date={raceSchedule.date}
                  time={raceSchedule.time || ""}
                  highlight
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabbed content for completed races */}
      {completed && (
        <RaceDetailTabs
          raceResults={raceResults}
          qualifyingResults={qualifyingResults}
          pitStops={pitStops}
          lapData={lapData}
          totalLaps={circuit.laps}
        />
      )}
    </div>
  );
}

function SessionCard({
  name,
  date,
  time,
  highlight = false,
}: {
  name: string;
  date: string;
  time: string;
  highlight?: boolean;
}) {
  const sessionDate = new Date(`${date}T${time || "00:00:00Z"}`);

  return (
    <div className={`p-3 ${highlight ? "bg-primary-container" : "bg-surface-container"}`}>
      <p className={`label-engineering mb-1 ${highlight ? "text-on-primary-container/70" : "text-outline"}`}>
        {name}
      </p>
      <p className={`text-sm font-semibold ${highlight ? "text-on-primary-container" : "text-on-surface"}`}>
        {sessionDate.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
      </p>
      {time && (
        <p className={`text-xs mt-0.5 ${highlight ? "text-on-primary-container/80" : "text-on-surface-variant"}`}>
          {sessionDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC
        </p>
      )}
    </div>
  );
}
