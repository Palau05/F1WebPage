export const circuitDescriptions: Record<string, { description: string; topSpeed: string }> = {
  albert_park: { description: "A street circuit through a beautiful park setting. The smooth, fast layout rewards brave braking and precise cornering.", topSpeed: "320 km/h" },
  shanghai: { description: "A Hermann Tilke classic with its distinctive snail-shaped Turn 1-2-3 complex testing the limits of grip.", topSpeed: "327 km/h" },
  suzuka: { description: "The legendary figure-eight circuit. Esses, 130R, and the Casio Triangle — a true driver's track.", topSpeed: "310 km/h" },
  bahrain: { description: "Racing under the desert lights. The Sakhir circuit demands strong traction out of its many slow-speed corners.", topSpeed: "320 km/h" },
  jeddah: { description: "The fastest street circuit on the calendar. Blind corners at incredible speeds through the Corniche.", topSpeed: "322 km/h" },
  miami: { description: "A modern circuit around Hard Rock Stadium. Technical middle sector with high-speed straights.", topSpeed: "320 km/h" },
  imola: { description: "Old-school racing at its finest. Tamburello, Villeneuve, and the challenging Acque Minerali chicane.", topSpeed: "315 km/h" },
  monaco: { description: "The jewel in the crown. The most iconic and challenging street circuit where concentration is everything.", topSpeed: "290 km/h" },
  catalunya: { description: "The ultimate all-rounder circuit. High-speed sweeps, technical chicanes, and a punishing final sector.", topSpeed: "320 km/h" },
  villeneuve: { description: "The Wall of Champions awaits. A semi-permanent circuit on an island with heavy braking zones.", topSpeed: "320 km/h" },
  red_bull_ring: { description: "Short, sharp, and stunning. Nestled in the Styrian Alps with massive elevation changes.", topSpeed: "320 km/h" },
  silverstone: { description: "The home of motorsport. Maggots, Becketts, and Copse — a high-speed ballet of commitment.", topSpeed: "325 km/h" },
  spa: { description: "The greatest circuit in the world. Eau Rouge, Raidillon, and Pouhon through the Ardennes forest.", topSpeed: "340 km/h" },
  hungaroring: { description: "Monaco without the walls. A twisty, demanding circuit where overtaking is an art form.", topSpeed: "310 km/h" },
  zandvoort: { description: "Banked turns and a stadium atmosphere. The Dutch GP brings old-school banking to modern F1.", topSpeed: "310 km/h" },
  monza: { description: "The fastest circuit on the calendar. High-speed chicanes, legendary corners like Parabolica, and the soul of the Tifosi.", topSpeed: "360 km/h" },
  baku: { description: "Narrow streets, a medieval old town section, and the longest straight on the calendar.", topSpeed: "340 km/h" },
  marina_bay: { description: "A demanding night race through the streets of Singapore. The most physically challenging race of the year.", topSpeed: "310 km/h" },
  americas: { description: "Inspired by the best corners in the world. The multi-apex Turn 1 and massive elevation change set it apart.", topSpeed: "330 km/h" },
  rodriguez: { description: "Racing at altitude. The thin air reduces downforce and engine power, creating unique challenges.", topSpeed: "340 km/h" },
  interlagos: { description: "A short, anti-clockwise classic that always delivers drama. The Senna S and final corner are legendary.", topSpeed: "320 km/h" },
  vegas: { description: "Glitz, glamour, and raw speed on the Las Vegas Strip. Night racing under the neon lights.", topSpeed: "340 km/h" },
  losail: { description: "A fast, flowing circuit under the lights. Long corners test the limits of tyre performance.", topSpeed: "330 km/h" },
  yas_marina: { description: "The season finale under the Abu Dhabi sunset. A technical circuit that decides championships.", topSpeed: "325 km/h" },
  madring: { description: "F1 arrives in the Spanish capital for the first time. The Circuito de Madrid winds through IFEMA with a signature banked corner — La Monumental — at 24% banking.", topSpeed: "328 km/h" },
};

export function getCircuitDescription(id: string) {
  return circuitDescriptions[id] || { description: "A world-class Formula 1 circuit.", topSpeed: "320 km/h" };
}
