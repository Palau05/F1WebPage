import type { PitStop, RaceResult } from "@/lib/api/types";
import { getTeamColor } from "@/lib/data/team-colors";

interface StrategyViewProps {
  results: RaceResult[];
  pitStops: PitStop[];
  totalLaps: number;
}

interface DriverStrategy {
  driverId: string;
  code: string;
  constructorId: string;
  position: string;
  stints: { startLap: number; endLap: number; compound: string }[];
}

function inferCompound(stopIndex: number, totalStops: number): string {
  // Heuristic: common strategies
  if (totalStops === 1) {
    return stopIndex === 0 ? "MEDIUM" : "HARD";
  }
  if (totalStops === 2) {
    if (stopIndex === 0) return "SOFT";
    if (stopIndex === 1) return "MEDIUM";
    return "HARD";
  }
  // 3+ stops
  if (stopIndex === 0) return "SOFT";
  if (stopIndex === totalStops) return "HARD";
  return "MEDIUM";
}

const compoundColors: Record<string, string> = {
  SOFT: "#e10600",
  MEDIUM: "#ffd700",
  HARD: "#e4e1ee",
};

function buildStrategies(
  results: RaceResult[],
  pitStops: PitStop[],
  totalLaps: number
): DriverStrategy[] {
  return results.slice(0, 10).map((result) => {
    const driverStops = pitStops
      .filter((ps) => ps.driverId === result.Driver.driverId)
      .sort((a, b) => Number(a.lap) - Number(b.lap));

    const stints: { startLap: number; endLap: number; compound: string }[] = [];
    let prevLap = 1;

    driverStops.forEach((stop, i) => {
      stints.push({
        startLap: prevLap,
        endLap: Number(stop.lap),
        compound: inferCompound(i, driverStops.length),
      });
      prevLap = Number(stop.lap) + 1;
    });

    // Final stint
    stints.push({
      startLap: prevLap,
      endLap: totalLaps,
      compound: inferCompound(driverStops.length, driverStops.length),
    });

    return {
      driverId: result.Driver.driverId,
      code: result.Driver.code,
      constructorId: result.Constructor.constructorId,
      position: result.position,
      stints,
    };
  });
}

export default function StrategyView({ results, pitStops, totalLaps }: StrategyViewProps) {
  const strategies = buildStrategies(results, pitStops, totalLaps);

  if (strategies.length === 0) {
    return <p className="text-on-surface-variant">Strategy data not available.</p>;
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-4 mb-6">
        {Object.entries(compoundColors).map(([compound, color]) => (
          <div key={compound} className="flex items-center gap-2">
            <span
              className="w-3 h-3 inline-block"
              style={{ backgroundColor: color }}
            />
            <span className="label-engineering text-on-surface-variant">{compound}</span>
          </div>
        ))}
      </div>

      {/* Strategy bars */}
      <div className="space-y-2">
        {strategies.map((driver) => (
          <div key={driver.driverId} className="flex items-center gap-3">
            {/* Position + Driver */}
            <div className="flex items-center gap-2 w-20 flex-shrink-0">
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-on-surface-variant w-6 text-right">
                P{driver.position}
              </span>
              <span
                className="w-0.5 h-4 inline-block"
                style={{ backgroundColor: getTeamColor(driver.constructorId) }}
              />
              <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-on-surface">
                {driver.code}
              </span>
            </div>

            {/* Stint bar */}
            <div className="flex-1 flex h-6 bg-surface-container-lowest">
              {driver.stints.map((stint, i) => {
                const width = ((stint.endLap - stint.startLap + 1) / totalLaps) * 100;
                return (
                  <div
                    key={i}
                    className="h-full relative group"
                    style={{
                      width: `${width}%`,
                      backgroundColor: compoundColors[stint.compound] || "#888",
                      opacity: 0.85,
                    }}
                  >
                    {/* Stint separator */}
                    {i > 0 && (
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-surface" />
                    )}
                    {/* Lap label if stint is wide enough */}
                    {width > 8 && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-surface">
                        {stint.endLap - stint.startLap + 1}L
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lap axis */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-20 flex-shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="label-engineering text-outline">LAP 1</span>
          <span className="label-engineering text-outline">LAP {totalLaps}</span>
        </div>
      </div>
    </div>
  );
}
