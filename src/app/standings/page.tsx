import { getDriverStandings, getConstructorStandings } from "@/lib/api/jolpica";
import { getTeamColor } from "@/lib/data/team-colors";

export const revalidate = 21600; // 6 hours

export default async function StandingsPage() {
  let drivers;
  let constructors;

  try {
    [drivers, constructors] = await Promise.all([
      getDriverStandings(2026),
      getConstructorStandings(2026),
    ]);
  } catch {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Failed to load standings data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="label-engineering text-outline mb-2">CHAMPIONSHIP</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold italic text-on-surface">
          2026 STANDINGS
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[0.9rem]">
        {/* Driver Standings */}
        <div className="bg-surface-container-low p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold italic text-on-surface mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary-container inline-block" />
            DRIVERS
          </h2>

          <div className="space-y-1">
            {drivers.map((standing, i) => (
              <div
                key={standing.Driver.driverId}
                className={`
                  flex items-center gap-4 px-4 py-3 transition-all transition-gearbox
                  ${i % 2 === 0 ? "bg-surface-container" : "bg-surface-container-low"}
                  hover:bg-surface-container-high
                `}
              >
                <span className="font-[family-name:var(--font-display)] text-lg font-bold w-8 text-center text-on-surface-variant">
                  {standing.position}
                </span>
                <span
                  className="w-1 h-8 inline-block"
                  style={{ backgroundColor: getTeamColor(standing.Constructors[0]?.constructorId || "") }}
                />
                <div className="flex-1">
                  <p className="font-[family-name:var(--font-display)] font-semibold text-on-surface">
                    {standing.Driver.givenName}{" "}
                    <span className="font-bold">{standing.Driver.familyName.toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {standing.Constructors[0]?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold text-on-surface">
                    {standing.points}
                  </p>
                  <p className="text-xs text-on-surface-variant">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constructor Standings */}
        <div className="bg-surface-container-low p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold italic text-on-surface mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary-container inline-block" />
            CONSTRUCTORS
          </h2>

          <div className="space-y-1">
            {constructors.map((standing, i) => (
              <div
                key={standing.Constructor.constructorId}
                className={`
                  flex items-center gap-4 px-4 py-3 transition-all transition-gearbox
                  ${i % 2 === 0 ? "bg-surface-container" : "bg-surface-container-low"}
                  hover:bg-surface-container-high
                `}
              >
                <span className="font-[family-name:var(--font-display)] text-lg font-bold w-8 text-center text-on-surface-variant">
                  {standing.position}
                </span>
                <span
                  className="w-1 h-8 inline-block"
                  style={{ backgroundColor: getTeamColor(standing.Constructor.constructorId) }}
                />
                <div className="flex-1">
                  <p className="font-[family-name:var(--font-display)] font-semibold text-on-surface">
                    {standing.Constructor.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {standing.wins} wins
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold text-on-surface">
                    {standing.points}
                  </p>
                  <p className="text-xs text-on-surface-variant">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      {drivers.length >= 2 && constructors.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.9rem] mt-[0.9rem]">
          <div className="bg-surface-container p-5">
            <p className="label-engineering text-outline mb-2">CHAMPIONSHIP LEADER</p>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface">
              {drivers[0].Driver.givenName} {drivers[0].Driver.familyName.toUpperCase()}
            </p>
            <p className="text-sm text-primary mt-1">
              +{Number(drivers[0].points) - Number(drivers[1].points)} pts ahead of {drivers[1].Driver.familyName}
            </p>
          </div>
          <div className="bg-surface-container p-5">
            <p className="label-engineering text-outline mb-2">TOP CONSTRUCTOR</p>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface">
              {constructors[0].Constructor.name}
            </p>
            <p className="text-sm text-primary mt-1">
              +{Number(constructors[0].points) - Number(constructors[1].points)} pts ahead of {constructors[1].Constructor.name}
            </p>
          </div>
          <div className="bg-surface-container p-5">
            <p className="label-engineering text-outline mb-2">MOST WINS</p>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface">
              {drivers[0].wins} VICTORIES
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              {drivers[0].Driver.givenName} {drivers[0].Driver.familyName} — {drivers[0].Constructors[0]?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
