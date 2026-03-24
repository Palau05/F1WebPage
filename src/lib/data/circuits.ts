export interface Circuit {
  id: string;
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  length: string;
  laps: number;
  distance: string;
  round: number;
  raceName: string;
  date: string; // ISO date string
  svgFile: string;
}

export const circuits2026: Circuit[] = [
  { id: "albert_park", name: "Albert Park Grand Prix Circuit", country: "Australia", city: "Melbourne", lat: -37.8497, lng: 144.968, length: "5.278 km", laps: 58, distance: "306.124 km", round: 1, raceName: "Australian Grand Prix", date: "2026-03-08", svgFile: "albert_park.svg" },
  { id: "shanghai", name: "Shanghai International Circuit", country: "China", city: "Shanghai", lat: 31.3389, lng: 121.22, length: "5.451 km", laps: 56, distance: "305.066 km", round: 2, raceName: "Chinese Grand Prix", date: "2026-03-15", svgFile: "shanghai.svg" },
  { id: "suzuka", name: "Suzuka International Racing Course", country: "Japan", city: "Suzuka", lat: 34.8431, lng: 136.5407, length: "5.807 km", laps: 53, distance: "307.471 km", round: 3, raceName: "Japanese Grand Prix", date: "2026-03-29", svgFile: "suzuka.svg" },
  { id: "miami", name: "Miami International Autodrome", country: "USA", city: "Miami", lat: 25.9581, lng: -80.2389, length: "5.412 km", laps: 57, distance: "308.326 km", round: 4, raceName: "Miami Grand Prix", date: "2026-05-03", svgFile: "miami.svg" },
  { id: "villeneuve", name: "Circuit Gilles Villeneuve", country: "Canada", city: "Montreal", lat: 45.5017, lng: -73.5228, length: "4.361 km", laps: 70, distance: "305.270 km", round: 5, raceName: "Canadian Grand Prix", date: "2026-05-24", svgFile: "villeneuve.svg" },
  { id: "monaco", name: "Circuit de Monaco", country: "Monaco", city: "Monte Carlo", lat: 43.7347, lng: 7.4206, length: "3.337 km", laps: 78, distance: "260.286 km", round: 6, raceName: "Monaco Grand Prix", date: "2026-06-07", svgFile: "monaco.svg" },
  { id: "catalunya", name: "Circuit de Barcelona-Catalunya", country: "Spain", city: "Barcelona", lat: 41.57, lng: 2.2611, length: "4.657 km", laps: 66, distance: "307.236 km", round: 7, raceName: "Barcelona Grand Prix", date: "2026-06-14", svgFile: "catalunya.svg" },
  { id: "red_bull_ring", name: "Red Bull Ring", country: "Austria", city: "Spielberg", lat: 47.2197, lng: 14.7647, length: "4.326 km", laps: 71, distance: "307.146 km", round: 8, raceName: "Austrian Grand Prix", date: "2026-06-28", svgFile: "red_bull_ring.svg" },
  { id: "silverstone", name: "Silverstone Circuit", country: "United Kingdom", city: "Silverstone", lat: 52.0786, lng: -1.0169, length: "5.891 km", laps: 52, distance: "306.198 km", round: 9, raceName: "British Grand Prix", date: "2026-07-05", svgFile: "silverstone.svg" },
  { id: "spa", name: "Circuit de Spa-Francorchamps", country: "Belgium", city: "Stavelot", lat: 50.4372, lng: 5.9714, length: "7.004 km", laps: 44, distance: "308.052 km", round: 10, raceName: "Belgian Grand Prix", date: "2026-07-19", svgFile: "spa.svg" },
  { id: "hungaroring", name: "Hungaroring", country: "Hungary", city: "Budapest", lat: 47.5789, lng: 19.2486, length: "4.381 km", laps: 70, distance: "306.630 km", round: 11, raceName: "Hungarian Grand Prix", date: "2026-07-26", svgFile: "hungaroring.svg" },
  { id: "zandvoort", name: "Circuit Zandvoort", country: "Netherlands", city: "Zandvoort", lat: 52.3888, lng: 4.5409, length: "4.259 km", laps: 72, distance: "306.587 km", round: 12, raceName: "Dutch Grand Prix", date: "2026-08-23", svgFile: "zandvoort.svg" },
  { id: "monza", name: "Autodromo Nazionale Monza", country: "Italy", city: "Monza", lat: 45.6156, lng: 9.2811, length: "5.793 km", laps: 53, distance: "306.720 km", round: 13, raceName: "Italian Grand Prix", date: "2026-09-06", svgFile: "monza.svg" },
  { id: "madring", name: "Circuito de Madrid", country: "Spain", city: "Madrid", lat: 40.4653, lng: -3.6153, length: "5.416 km", laps: 57, distance: "308.712 km", round: 14, raceName: "Spanish Grand Prix", date: "2026-09-13", svgFile: "madring.svg" },
  { id: "baku", name: "Baku City Circuit", country: "Azerbaijan", city: "Baku", lat: 40.3725, lng: 49.8533, length: "6.003 km", laps: 51, distance: "306.049 km", round: 15, raceName: "Azerbaijan Grand Prix", date: "2026-09-26", svgFile: "baku.svg" },
  { id: "marina_bay", name: "Marina Bay Street Circuit", country: "Singapore", city: "Singapore", lat: 1.2914, lng: 103.8644, length: "4.940 km", laps: 62, distance: "306.143 km", round: 16, raceName: "Singapore Grand Prix", date: "2026-10-11", svgFile: "marina_bay.svg" },
  { id: "americas", name: "Circuit of the Americas", country: "USA", city: "Austin", lat: 30.1328, lng: -97.6411, length: "5.513 km", laps: 56, distance: "308.405 km", round: 17, raceName: "United States Grand Prix", date: "2026-10-25", svgFile: "americas.svg" },
  { id: "rodriguez", name: "Autódromo Hermanos Rodríguez", country: "Mexico", city: "Mexico City", lat: 19.4042, lng: -99.0907, length: "4.304 km", laps: 71, distance: "305.354 km", round: 18, raceName: "Mexico City Grand Prix", date: "2026-11-01", svgFile: "rodriguez.svg" },
  { id: "interlagos", name: "Autódromo José Carlos Pace", country: "Brazil", city: "São Paulo", lat: -23.7036, lng: -46.6997, length: "4.309 km", laps: 71, distance: "305.879 km", round: 19, raceName: "São Paulo Grand Prix", date: "2026-11-08", svgFile: "interlagos.svg" },
  { id: "vegas", name: "Las Vegas Street Circuit", country: "USA", city: "Las Vegas", lat: 36.1147, lng: -115.173, length: "6.201 km", laps: 50, distance: "309.958 km", round: 20, raceName: "Las Vegas Grand Prix", date: "2026-11-22", svgFile: "vegas.svg" },
  { id: "losail", name: "Losail International Circuit", country: "Qatar", city: "Lusail", lat: 25.49, lng: 51.4542, length: "5.419 km", laps: 57, distance: "308.611 km", round: 21, raceName: "Qatar Grand Prix", date: "2026-11-29", svgFile: "losail.svg" },
  { id: "yas_marina", name: "Yas Marina Circuit", country: "UAE", city: "Abu Dhabi", lat: 24.4672, lng: 54.6031, length: "5.281 km", laps: 58, distance: "306.183 km", round: 22, raceName: "Abu Dhabi Grand Prix", date: "2026-12-06", svgFile: "yas_marina.svg" },
];

export function getCircuitById(id: string): Circuit | undefined {
  return circuits2026.find((c) => c.id === id);
}

export function getCurrentOrNextRace(): Circuit | undefined {
  const now = new Date();
  const upcoming = circuits2026.find((c) => new Date(c.date) >= now);
  return upcoming || circuits2026[circuits2026.length - 1];
}

export function isRaceCompleted(circuit: Circuit): boolean {
  return new Date(circuit.date) < new Date();
}
