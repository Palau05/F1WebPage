export const teamColors: Record<string, string> = {
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  mclaren: "#FF8000",
  aston_martin: "#229971",
  alpine: "#00A1E8",
  williams: "#64C4FF",
  rb: "#6692FF",
  audi: "#C00D0D",
  haas: "#DEE1E2",
  cadillac: "#C5A027",
};

export const teamNames: Record<string, string> = {
  red_bull: "Oracle Red Bull Racing",
  ferrari: "Scuderia Ferrari HP",
  mercedes: "Mercedes-AMG PETRONAS F1 Team",
  mclaren: "McLaren Mastercard F1 Team",
  aston_martin: "Aston Martin Aramco F1 Team",
  alpine: "BWT Alpine F1 Team",
  williams: "Atlassian Williams Racing",
  rb: "Visa Cash App Racing Bulls",
  audi: "Audi Revolut F1 Team",
  haas: "TGR Haas F1 Team",
  cadillac: "Cadillac Formula 1 Team",
};

export function getTeamColor(constructorId: string): string {
  return teamColors[constructorId] || "#888888";
}
