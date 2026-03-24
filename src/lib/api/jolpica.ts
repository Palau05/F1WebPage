import type {
  JolpicaResponse,
  RaceTable,
  StandingsTable,
} from "./types";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchJolpica<T>(
  endpoint: string,
  revalidate: number = 86400
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Jolpica API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Season schedule
export async function getSeasonSchedule(year: number = 2026) {
  const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
    `/${year}.json`,
    86400
  );
  return data.MRData.RaceTable.Races;
}

// Race results
export async function getRaceResults(year: number, round: number) {
  const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
    `/${year}/${round}/results.json`,
    3600
  );
  return data.MRData.RaceTable.Races[0]?.Results || [];
}

// Qualifying results
export async function getQualifyingResults(year: number, round: number) {
  const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
    `/${year}/${round}/qualifying.json`,
    3600
  );
  return data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
}

// Driver standings
export async function getDriverStandings(year: number = 2026) {
  const data = await fetchJolpica<JolpicaResponse<StandingsTable>>(
    `/${year}/driverStandings.json`,
    21600
  );
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}

// Constructor standings
export async function getConstructorStandings(year: number = 2026) {
  const data = await fetchJolpica<JolpicaResponse<StandingsTable>>(
    `/${year}/constructorStandings.json`,
    21600
  );
  return (
    data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []
  );
}

// Single race with session times
export async function getRaceSchedule(year: number, round: number) {
  const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
    `/${year}/${round}.json`,
    86400
  );
  return data.MRData.RaceTable.Races[0];
}

// Pit stops for a race
export async function getPitStops(year: number, round: number) {
  const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
    `/${year}/${round}/pitstops.json?limit=100`,
    3600
  );
  return data.MRData.RaceTable.Races[0]?.PitStops || [];
}

// Lap-by-lap data for position chart (paginated — API limits to ~100 timing entries per page)
export async function getLapData(year: number, round: number) {
  const allLaps: import("./types").Lap[] = [];
  const seenLaps = new Set<string>();
  let offset = 0;
  const pageSize = 100;
  let total = Infinity;

  while (offset < total) {
    const data = await fetchJolpica<JolpicaResponse<RaceTable>>(
      `/${year}/${round}/laps.json?limit=${pageSize}&offset=${offset}`,
      3600
    );
    total = Number(data.MRData.total);
    const laps = data.MRData.RaceTable.Races[0]?.Laps || [];

    for (const lap of laps) {
      if (seenLaps.has(lap.number)) {
        // Merge timings into existing lap
        const existing = allLaps.find((l) => l.number === lap.number);
        if (existing) {
          const existingIds = new Set(existing.Timings.map((t) => t.driverId));
          for (const timing of lap.Timings) {
            if (!existingIds.has(timing.driverId)) {
              existing.Timings.push(timing);
            }
          }
        }
      } else {
        seenLaps.add(lap.number);
        allLaps.push({ ...lap, Timings: [...lap.Timings] });
      }
    }

    offset += pageSize;
  }

  return allLaps;
}
