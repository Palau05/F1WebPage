import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDriverStandings,
  getDriverSeasonResults,
  getDriverSeasonQualifying,
} from "@/lib/api/jolpica";
import { getTeamColor } from "@/lib/data/team-colors";
import { getNationalityFlag } from "@/lib/data/country-flags";
import { getFlagEmoji } from "@/lib/data/country-flags";

export const revalidate = 3600; // 1 hour

// Render driver pages on-demand (ISR) instead of prerendering every driver at
// build time. Building all of them at once hammers the rate-limited Jolpica API
// and fails the build with 429s. Pages are generated on first visit and cached.
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

interface PageProps {
  params: Promise<{ driverId: string }>;
}

export default async function DriverPage({ params }: PageProps) {
  const { driverId } = await params;

  const [standings, raceResults, qualifyingResults] = await Promise.all([
    getDriverStandings(2026),
    getDriverSeasonResults(2026, driverId),
    getDriverSeasonQualifying(2026, driverId),
  ]);

  const standing = standings.find((s) => s.Driver.driverId === driverId);
  if (!standing) notFound();

  const { Driver, Constructors } = standing;
  const team = Constructors[0];
  const teamColor = getTeamColor(team?.constructorId || "");

  // Build a map of round → qualifying position
  const qualiMap: Record<string, string> = {};
  for (const race of qualifyingResults) {
    const q = race.QualifyingResults?.[0];
    if (q) qualiMap[race.round] = q.position;
  }

  const wins = raceResults.filter((r) => r.Results?.[0]?.position === "1").length;
  const podiums = raceResults.filter((r) => {
    const pos = Number(r.Results?.[0]?.position);
    return pos >= 1 && pos <= 3;
  }).length;
  const poles = Object.values(qualiMap).filter((p) => p === "1").length;
  const fastestLaps = raceResults.filter(
    (r) => r.Results?.[0]?.FastestLap?.rank === "1"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Back */}
      <Link
        href="/standings"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 label-engineering"
      >
        ← BACK TO STANDINGS
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-engineering text-outline">
            #{Driver.permanentNumber}
          </span>
          <span className="label-engineering text-outline">
            {getNationalityFlag(Driver.nationality)} {Driver.nationality.toUpperCase()}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold italic text-on-surface">
          {Driver.givenName.toUpperCase()}{" "}
          <span style={{ color: teamColor }}>{Driver.familyName.toUpperCase()}</span>
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="w-3 h-3 inline-block" style={{ backgroundColor: teamColor }} />
          <p className="text-lg text-on-surface-variant">{team?.name}</p>
        </div>
      </div>

      {/* Season stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[0.9rem] mb-[0.9rem]">
        {[
          { label: "POINTS", value: standing.points },
          { label: "POSITION", value: `P${standing.position}` },
          { label: "WINS", value: wins },
          { label: "PODIUMS", value: podiums },
          { label: "POLES", value: poles },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-container-low p-5">
            <p className="label-engineering text-outline mb-2">{label}</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-on-surface">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Round-by-round results */}
      {raceResults.length > 0 && (
        <div className="bg-surface-container-low p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold italic text-on-surface mb-6 flex items-center gap-3">
            <span className="w-1 h-6 inline-block" style={{ backgroundColor: teamColor }} />
            2026 SEASON RESULTS
          </h2>
          {fastestLaps > 0 && (
            <p className="label-engineering text-outline mb-4">
              FASTEST LAPS: {fastestLaps}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="label-engineering text-outline pb-3 pr-4">RND</th>
                  <th className="label-engineering text-outline pb-3 pr-4">RACE</th>
                  <th className="label-engineering text-outline pb-3 pr-4">GRID</th>
                  <th className="label-engineering text-outline pb-3 pr-4">QUALI</th>
                  <th className="label-engineering text-outline pb-3 pr-4">POS</th>
                  <th className="label-engineering text-outline pb-3 pr-4">PTS</th>
                  <th className="label-engineering text-outline pb-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {raceResults.map((race) => {
                  const result = race.Results?.[0];
                  if (!result) return null;
                  const pos = Number(result.position);
                  const isPodium = pos >= 1 && pos <= 3;
                  const isWin = pos === 1;
                  const qualiPos = qualiMap[race.round];
                  const country = race.Circuit.Location.country;

                  return (
                    <tr
                      key={race.round}
                      className="border-t border-surface-container-highest hover:bg-surface-container transition-colors transition-gearbox"
                    >
                      <td className="py-3 pr-4 font-[family-name:var(--font-display)] font-bold text-on-surface-variant">
                        {String(race.round).padStart(2, "0")}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/race/${race.Circuit.circuitId}`}
                          className="text-on-surface hover:text-primary transition-colors"
                        >
                          {getFlagEmoji(country)} {race.raceName.replace(" Grand Prix", " GP")}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-on-surface-variant">
                        {result.grid === "0" ? "PL" : result.grid}
                      </td>
                      <td className="py-3 pr-4 text-on-surface-variant">
                        {qualiPos ? `P${qualiPos}` : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-[family-name:var(--font-display)] font-bold ${
                            isWin
                              ? "text-primary-container"
                              : isPodium
                              ? "text-on-surface"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {result.positionText === "R" ? "DNF" : `P${result.position}`}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-[family-name:var(--font-display)] font-bold text-on-surface">
                        {result.points}
                      </td>
                      <td className="py-3 text-on-surface-variant text-xs">
                        {result.status === "Finished" || result.status.startsWith("+")
                          ? result.FastestLap?.rank === "1"
                            ? "FL"
                            : ""
                          : result.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {raceResults.length === 0 && (
        <div className="bg-surface-container-low p-6 text-center">
          <p className="text-on-surface-variant">No race results yet for the 2026 season.</p>
        </div>
      )}
    </div>
  );
}
