"use client";

import { useState } from "react";
import type { RaceResult, QualifyingResult, PitStop, Lap } from "@/lib/api/types";
import { getTeamColor } from "@/lib/data/team-colors";
import StrategyView from "./StrategyView";
import PositionChart from "./PositionChart";

interface RaceDetailTabsProps {
  raceResults: RaceResult[] | null;
  qualifyingResults: QualifyingResult[] | null;
  pitStops: PitStop[] | null;
  lapData: Lap[] | null;
  totalLaps: number;
}

type TabId = "results" | "qualifying" | "strategy" | "positions";

const tabs: { id: TabId; label: string }[] = [
  { id: "results", label: "RACE RESULT" },
  { id: "qualifying", label: "QUALIFYING" },
  { id: "strategy", label: "STRATEGY" },
  { id: "positions", label: "POSITIONS" },
];

export default function RaceDetailTabs({
  raceResults,
  qualifyingResults,
  pitStops,
  lapData,
  totalLaps,
}: RaceDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("results");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-[0.9rem] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-2.5 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider
              transition-all transition-gearbox whitespace-nowrap cursor-pointer
              ${
                activeTab === tab.id
                  ? "bg-surface-container-high text-on-surface"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-surface-container-low p-6">
        {activeTab === "results" && (
          <RaceResultsView results={raceResults} />
        )}
        {activeTab === "qualifying" && (
          <QualifyingResultsView results={qualifyingResults} />
        )}
        {activeTab === "strategy" && (
          raceResults && pitStops ? (
            <StrategyView results={raceResults} pitStops={pitStops} totalLaps={totalLaps} />
          ) : (
            <p className="text-on-surface-variant">Strategy data not available.</p>
          )
        )}
        {activeTab === "positions" && (
          raceResults && lapData ? (
            <PositionChart laps={lapData} results={raceResults} totalLaps={totalLaps} />
          ) : (
            <p className="text-on-surface-variant">Position data not available.</p>
          )
        )}
      </div>
    </div>
  );
}

function RaceResultsView({
  results,
}: {
  results: RaceResult[] | null;
}) {
  if (!results || results.length === 0) {
    return <p className="text-on-surface-variant">Results not available yet.</p>;
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant">
        <span className="font-[family-name:var(--font-display)] text-xs font-semibold w-8 text-center">POS</span>
        <span className="w-1" />
        <span className="flex-1 font-[family-name:var(--font-display)] text-xs font-semibold">DRIVER</span>
        <span className="w-16 text-right font-[family-name:var(--font-display)] text-xs font-semibold hidden md:block">GRID</span>
        <span className="w-28 text-right font-[family-name:var(--font-display)] text-xs font-semibold">TIME / STATUS</span>
        <span className="w-14 text-right font-[family-name:var(--font-display)] text-xs font-semibold">PTS</span>
      </div>

      {results.map((result, i) => (
        <div
          key={result.Driver.driverId}
          className={`
            flex items-center gap-3 px-4 py-3 transition-all transition-gearbox
            ${i % 2 === 0 ? "bg-surface-container" : "bg-surface-container-low"}
            hover:bg-surface-container-high
          `}
        >
          <span className="font-[family-name:var(--font-display)] text-lg font-bold w-8 text-center text-on-surface-variant">
            {result.position}
          </span>
          <span
            className="w-1 h-8 inline-block flex-shrink-0"
            style={{ backgroundColor: getTeamColor(result.Constructor.constructorId) }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-[family-name:var(--font-display)] font-semibold text-on-surface text-sm">
              {result.Driver.givenName}{" "}
              <span className="font-bold">{result.Driver.familyName.toUpperCase()}</span>
            </p>
            <p className="text-xs text-on-surface-variant">{result.Constructor.name}</p>
          </div>
          <span className="w-16 text-right text-sm text-on-surface-variant hidden md:block">
            P{result.grid}
          </span>
          <span className="w-28 text-right text-sm text-on-surface font-mono">
            {result.Time?.time || result.status}
          </span>
          <span className="w-14 text-right font-[family-name:var(--font-display)] font-bold text-on-surface">
            {result.points}
          </span>
        </div>
      ))}
    </div>
  );
}

function QualifyingResultsView({
  results,
}: {
  results: QualifyingResult[] | null;
}) {
  if (!results || results.length === 0) {
    return <p className="text-on-surface-variant">Qualifying results not available.</p>;
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant">
        <span className="font-[family-name:var(--font-display)] text-xs font-semibold w-8 text-center">POS</span>
        <span className="w-1" />
        <span className="flex-1 font-[family-name:var(--font-display)] text-xs font-semibold">DRIVER</span>
        <span className="w-24 text-right font-[family-name:var(--font-display)] text-xs font-semibold hidden md:block">Q1</span>
        <span className="w-24 text-right font-[family-name:var(--font-display)] text-xs font-semibold hidden md:block">Q2</span>
        <span className="w-24 text-right font-[family-name:var(--font-display)] text-xs font-semibold">Q3</span>
      </div>

      {results.map((result, i) => (
        <div
          key={result.Driver.driverId}
          className={`
            flex items-center gap-3 px-4 py-3 transition-all transition-gearbox
            ${i % 2 === 0 ? "bg-surface-container" : "bg-surface-container-low"}
            hover:bg-surface-container-high
          `}
        >
          <span className="font-[family-name:var(--font-display)] text-lg font-bold w-8 text-center text-on-surface-variant">
            {result.position}
          </span>
          <span
            className="w-1 h-8 inline-block flex-shrink-0"
            style={{ backgroundColor: getTeamColor(result.Constructor.constructorId) }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-[family-name:var(--font-display)] font-semibold text-on-surface text-sm">
              {result.Driver.givenName}{" "}
              <span className="font-bold">{result.Driver.familyName.toUpperCase()}</span>
            </p>
            <p className="text-xs text-on-surface-variant">{result.Constructor.name}</p>
          </div>
          <span className="w-24 text-right text-sm font-mono text-on-surface-variant hidden md:block">
            {result.Q1 || "—"}
          </span>
          <span className="w-24 text-right text-sm font-mono text-on-surface-variant hidden md:block">
            {result.Q2 || "—"}
          </span>
          <span className={`w-24 text-right text-sm font-mono ${result.Q3 ? "text-primary" : "text-on-surface-variant"}`}>
            {result.Q3 || result.Q2 || result.Q1 || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
