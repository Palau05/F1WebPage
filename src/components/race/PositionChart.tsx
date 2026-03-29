"use client";

import { useMemo, useState } from "react";
import type { Lap, RaceResult } from "@/lib/api/types";
import { getTeamColor } from "@/lib/data/team-colors";
import { deOverlapLabels } from "@/lib/chart-utils";

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
  didNotStart: boolean;
  retiredLap: number | null;
}

const MAX_DRIVERS = 22;

export default function PositionChart({ laps, results, totalLaps }: PositionChartProps) {
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

  const driverData: DriverLapData[] = useMemo(() => {
    // Identify DNS drivers
    const dnsDriverIds = new Set(
      results
        .filter((r) => Number(r.laps) === 0 && r.status !== "Finished")
        .map((r) => r.Driver.driverId)
    );

    // DNS drivers sorted by their original grid position
    const dnsGridPositions = results
      .filter((r) => dnsDriverIds.has(r.Driver.driverId))
      .map((r) => Number(r.grid))
      .sort((a, b) => a - b);

    const totalStarters = results.length - dnsDriverIds.size;

    // Assign DNS drivers to the bottom positions
    const dnsBottomPositions = new Map<string, number>();
    const dnsSorted = results
      .filter((r) => dnsDriverIds.has(r.Driver.driverId))
      .sort((a, b) => Number(a.grid) - Number(b.grid));
    dnsSorted.forEach((r, i) => {
      dnsBottomPositions.set(r.Driver.driverId, totalStarters + 1 + i);
    });

    return results.map((result) => {
      const driverId = result.Driver.driverId;
      const completedLaps = Number(result.laps);
      const didNotStart = dnsDriverIds.has(driverId);

      // Determine retirement lap
      let retiredLap: number | null = null;
      if (didNotStart) {
        retiredLap = 0;
      } else if (result.status === "Retired" || (completedLaps < totalLaps && result.status !== "Finished" && result.status !== "Lapped" && !result.status.startsWith("+"))) {
        retiredLap = completedLaps;
      }

      const positions: { lap: number; position: number }[] = [];
      const rawGrid = Number(result.grid) || MAX_DRIVERS;

      if (didNotStart) {
        // DNS: place at bottom positions
        positions.push({ lap: 0, position: dnsBottomPositions.get(driverId) ?? MAX_DRIVERS });
      } else {
        // Adjust starting grid: move up for each DNS driver that was above this driver
        const dnsAbove = dnsGridPositions.filter((g) => g < rawGrid).length;
        const adjustedGrid = rawGrid - dnsAbove;
        positions.push({ lap: 0, position: adjustedGrid });

        // Lap-by-lap positions
        laps.forEach((lap) => {
          const timing = lap.Timings.find((t) => t.driverId === driverId);
          if (timing) {
            positions.push({ lap: Number(lap.number), position: Number(timing.position) });
          }
        });

        // For retired drivers: add a final point dropping to the bottom
        if (retiredLap !== null && retiredLap > 0) {
          const lastTracked = positions[positions.length - 1];
          if (lastTracked) {
            // Add drop-off point slightly after last tracked lap
            positions.push({ lap: lastTracked.lap + 0.5, position: MAX_DRIVERS });
          }
        }
      }

      return {
        driverId,
        code: result.Driver.code,
        constructorId: result.Constructor.constructorId,
        positions,
        didNotStart,
        retiredLap,
      };
    });
  }, [laps, results, totalLaps]);

  if (driverData.length === 0 || laps.length === 0) {
    return <p className="text-on-surface-variant">Position data not available for this race.</p>;
  }

  const chartWidth = 900;
  const chartHeight = 440;
  const padding = { top: 20, right: 60, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const xScale = (lap: number) => padding.left + (lap / totalLaps) * innerWidth;
  const yScale = (pos: number) => padding.top + ((pos - 1) / (MAX_DRIVERS - 1)) * innerHeight;

  // Generate path for each driver
  const driverPaths = driverData
    .filter((d) => !d.didNotStart) // DNS drivers get no line
    .map((driver) => {
      const points = driver.positions
        .map((p) => `${xScale(p.lap)},${yScale(p.position)}`)
        .join(" L");
      return {
        ...driver,
        pathD: `M${points}`,
        color: getTeamColor(driver.constructorId),
      };
    });

  // DNS drivers (shown only as labels on the left)
  const dnsDrivers = driverData
    .filter((d) => d.didNotStart)
    .map((d) => ({
      ...d,
      color: getTeamColor(d.constructorId),
    }));

  // De-overlap start labels (only for drivers who started)
  const startLabelPositions = deOverlapLabels(
    driverPaths.map((d) => ({
      id: d.driverId,
      y: yScale(d.positions[0]?.position ?? MAX_DRIVERS),
    })),
    10
  );

  // De-overlap end labels — only for non-DNF drivers
  const finisherPaths = driverPaths.filter((d) => d.retiredLap === null);
  const dnfPaths = driverPaths.filter((d) => d.retiredLap !== null);

  const endLabelPositions = deOverlapLabels(
    finisherPaths.map((d) => {
      const last = d.positions[d.positions.length - 1];
      return {
        id: d.driverId,
        y: yScale(last?.position ?? MAX_DRIVERS),
      };
    }),
    10
  );

  // De-overlap DNS labels on the left
  const dnsLabelPositions = deOverlapLabels(
    dnsDrivers.map((d) => ({
      id: d.driverId,
      y: yScale(d.positions[0]?.position ?? MAX_DRIVERS),
    })),
    10
  );

  // Y-axis grid lines
  const yTicks = [1, 5, 10, 15, 20, 22];
  // X-axis lap ticks
  const xTickCount = Math.min(10, totalLaps);
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) =>
    Math.round((i / xTickCount) * totalLaps)
  );

  const isHighlighted = (driverId: string) =>
    hoveredDriver === null || hoveredDriver === driverId;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full min-w-[600px]"
        style={{ maxHeight: "500px" }}
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
            opacity={isHighlighted(driver.driverId) ? 1 : 0.15}
            strokeDasharray={driver.retiredLap !== null ? "4 2" : undefined}
            className="transition-all duration-200"
            onMouseEnter={() => setHoveredDriver(driver.driverId)}
            onMouseLeave={() => setHoveredDriver(null)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Driver start labels */}
        {driverPaths.map((driver) => {
          const firstPos = driver.positions[0];
          if (!firstPos) return null;
          const labelY = startLabelPositions.get(driver.driverId) ?? yScale(firstPos.position);
          return (
            <text
              key={`start-${driver.driverId}`}
              x={xScale(0) - 6}
              y={labelY + 3}
              textAnchor="end"
              fill={driver.color}
              fontSize="8"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={isHighlighted(driver.driverId) ? 1 : 0.15}
              className="transition-opacity duration-200"
              onMouseEnter={() => setHoveredDriver(driver.driverId)}
              onMouseLeave={() => setHoveredDriver(null)}
              style={{ cursor: "pointer" }}
            >
              {driver.code}
            </text>
          );
        })}

        {/* DNS driver labels on the left */}
        {dnsDrivers.map((driver) => {
          const labelY = dnsLabelPositions.get(driver.driverId) ?? yScale(driver.positions[0]?.position ?? MAX_DRIVERS);
          return (
            <text
              key={`dns-${driver.driverId}`}
              x={xScale(0) - 6}
              y={labelY + 3}
              textAnchor="end"
              fill={driver.color}
              fontSize="8"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={isHighlighted(driver.driverId) ? 0.4 : 0.1}
              className="transition-opacity duration-200"
              onMouseEnter={() => setHoveredDriver(driver.driverId)}
              onMouseLeave={() => setHoveredDriver(null)}
              style={{ cursor: "pointer" }}
            >
              {driver.code} ✕
            </text>
          );
        })}

        {/* Finisher end labels */}
        {finisherPaths.map((driver) => {
          const lastPos = driver.positions[driver.positions.length - 1];
          if (!lastPos) return null;
          const labelY = endLabelPositions.get(driver.driverId) ?? yScale(lastPos.position);
          return (
            <text
              key={`label-${driver.driverId}`}
              x={xScale(lastPos.lap) + 6}
              y={labelY + 3}
              fill={driver.color}
              fontSize="8"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={isHighlighted(driver.driverId) ? 1 : 0.15}
              className="transition-opacity duration-200"
              onMouseEnter={() => setHoveredDriver(driver.driverId)}
              onMouseLeave={() => setHoveredDriver(null)}
              style={{ cursor: "pointer" }}
            >
              {driver.code}
            </text>
          );
        })}

        {/* DNF end labels — all pinned to P22 line */}
        {dnfPaths.map((driver) => {
          const lastPos = driver.positions[driver.positions.length - 1];
          if (!lastPos) return null;
          return (
            <text
              key={`dnf-label-${driver.driverId}`}
              x={xScale(lastPos.lap) + 6}
              y={yScale(MAX_DRIVERS) + 3}
              fill={driver.color}
              fontSize="8"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={isHighlighted(driver.driverId) ? 1 : 0.15}
              className="transition-opacity duration-200"
              onMouseEnter={() => setHoveredDriver(driver.driverId)}
              onMouseLeave={() => setHoveredDriver(null)}
              style={{ cursor: "pointer" }}
            >
              {driver.code} DNF
            </text>
          );
        })}

        {/* DNS end labels on the right */}
        {dnsDrivers.map((driver) => {
          const labelY = dnsLabelPositions.get(driver.driverId) ?? yScale(driver.positions[0]?.position ?? MAX_DRIVERS);
          return (
            <text
              key={`dns-end-${driver.driverId}`}
              x={xScale(0) + 6}
              y={labelY + 3}
              fill={driver.color}
              fontSize="8"
              fontFamily="var(--font-display)"
              fontWeight="600"
              opacity={isHighlighted(driver.driverId) ? 0.4 : 0.1}
              className="transition-opacity duration-200"
            >
              DNS
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {[...driverPaths, ...dnsDrivers].map((driver) => (
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
              style={{ backgroundColor: driver.color, opacity: driver.didNotStart ? 0.4 : 1 }}
            />
            <span className={`label-engineering ${driver.didNotStart ? "text-on-surface-variant" : "text-on-surface"}`}>
              {driver.code}
              {driver.didNotStart ? " DNS" : driver.retiredLap !== null ? " DNF" : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
