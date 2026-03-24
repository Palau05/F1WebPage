"use client";

import { useMemo, useState } from "react";
import type { Lap, RaceResult } from "@/lib/api/types";
import { getTeamColor } from "@/lib/data/team-colors";

interface PositionChartProps {
  laps: Lap[];
  results: RaceResult[];
  totalLaps: number;
}

interface DriverLapData {
  driverId: string;
  code: string;
  constructorId: string;
  positions: { lap: number; position: number }[];
}

export default function PositionChart({ laps, results, totalLaps }: PositionChartProps) {
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

  const driverData: DriverLapData[] = useMemo(() => {
    // Top 10 drivers
    const topDrivers = results.slice(0, 10);

    return topDrivers.map((result) => {
      const positions: { lap: number; position: number }[] = [];

      // Starting position (grid)
      positions.push({ lap: 0, position: Number(result.grid) || 20 });

      // Lap-by-lap positions
      laps.forEach((lap) => {
        const timing = lap.Timings.find((t) => t.driverId === result.Driver.driverId);
        if (timing) {
          positions.push({ lap: Number(lap.number), position: Number(timing.position) });
        }
      });

      return {
        driverId: result.Driver.driverId,
        code: result.Driver.code,
        constructorId: result.Constructor.constructorId,
        positions,
      };
    });
  }, [laps, results]);

  if (driverData.length === 0 || laps.length === 0) {
    return <p className="text-on-surface-variant">Position data not available for this race.</p>;
  }

  const maxDrivers = 20;
  const chartWidth = 900;
  const chartHeight = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const xScale = (lap: number) => padding.left + (lap / totalLaps) * innerWidth;
  const yScale = (pos: number) => padding.top + ((pos - 1) / (maxDrivers - 1)) * innerHeight;

  // Generate path for each driver
  const driverPaths = driverData.map((driver) => {
    const points = driver.positions
      .map((p) => `${xScale(p.lap)},${yScale(p.position)}`)
      .join(" L");
    return {
      ...driver,
      pathD: `M${points}`,
      color: getTeamColor(driver.constructorId),
    };
  });

  // Y-axis positions to show
  const yTicks = [1, 5, 10, 15, 20];
  // X-axis lap ticks
  const xTickCount = Math.min(10, totalLaps);
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) =>
    Math.round((i / xTickCount) * totalLaps)
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full min-w-[600px]"
        style={{ maxHeight: "450px" }}
      >
        {/* Grid lines */}
        {yTicks.map((pos) => (
          <line
            key={`y-${pos}`}
            x1={padding.left}
            y1={yScale(pos)}
            x2={chartWidth - padding.right}
            y2={yScale(pos)}
            stroke="#292933"
            strokeWidth="1"
          />
        ))}
        {xTicks.map((lap) => (
          <line
            key={`x-${lap}`}
            x1={xScale(lap)}
            y1={padding.top}
            x2={xScale(lap)}
            y2={chartHeight - padding.bottom}
            stroke="#292933"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((pos) => (
          <text
            key={`yl-${pos}`}
            x={padding.left - 10}
            y={yScale(pos) + 4}
            textAnchor="end"
            fill="#af8781"
            fontSize="10"
            fontFamily="var(--font-display)"
          >
            P{pos}
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map((lap) => (
          <text
            key={`xl-${lap}`}
            x={xScale(lap)}
            y={chartHeight - padding.bottom + 20}
            textAnchor="middle"
            fill="#af8781"
            fontSize="10"
            fontFamily="var(--font-display)"
          >
            {lap === 0 ? "START" : `L${lap}`}
          </text>
        ))}

        {/* Driver lines */}
        {driverPaths.map((driver) => (
          <path
            key={driver.driverId}
            d={driver.pathD}
            fill="none"
            stroke={driver.color}
            strokeWidth={hoveredDriver === driver.driverId ? 3 : 1.5}
            opacity={
              hoveredDriver === null || hoveredDriver === driver.driverId
                ? 1
                : 0.2
            }
            className="transition-all duration-200"
            onMouseEnter={() => setHoveredDriver(driver.driverId)}
            onMouseLeave={() => setHoveredDriver(null)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Driver end labels */}
        {driverPaths.map((driver) => {
          const lastPos = driver.positions[driver.positions.length - 1];
          if (!lastPos) return null;
          return (
            <text
              key={`label-${driver.driverId}`}
              x={xScale(lastPos.lap) + 6}
              y={yScale(lastPos.position) + 3}
              fill={driver.color}
              fontSize="9"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={
                hoveredDriver === null || hoveredDriver === driver.driverId
                  ? 1
                  : 0.2
              }
            >
              {driver.code}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {driverPaths.map((driver) => (
          <button
            key={driver.driverId}
            className={`flex items-center gap-1.5 px-2 py-1 transition-all transition-gearbox cursor-pointer ${
              hoveredDriver === driver.driverId
                ? "bg-surface-container-high"
                : "bg-surface-container hover:bg-surface-container-high"
            }`}
            onMouseEnter={() => setHoveredDriver(driver.driverId)}
            onMouseLeave={() => setHoveredDriver(null)}
          >
            <span
              className="w-3 h-1 inline-block"
              style={{ backgroundColor: driver.color }}
            />
            <span className="label-engineering text-on-surface">{driver.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
