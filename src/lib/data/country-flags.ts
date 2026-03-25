// Driver/constructor nationality → flag emoji (Ergast nationality strings)
const nationalityToCode: Record<string, string> = {
  Australian: "AU",
  Austrian: "AT",
  American: "US",
  Belgian: "BE",
  Brazilian: "BR",
  British: "GB",
  Canadian: "CA",
  Chinese: "CN",
  Danish: "DK",
  Dutch: "NL",
  Finnish: "FI",
  French: "FR",
  German: "DE",
  Hungarian: "HU",
  Italian: "IT",
  Japanese: "JP",
  Mexican: "MX",
  Monegasque: "MC",
  "New Zealander": "NZ",
  Polish: "PL",
  Russian: "RU",
  Spanish: "ES",
  Swedish: "SE",
  Swiss: "CH",
  Thai: "TH",
};

export function getNationalityFlag(nationality: string): string {
  const code = nationalityToCode[nationality];
  if (!code) return "";
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

// Country to ISO 3166-1 alpha-2 code mapping for flag emojis
const countryToCode: Record<string, string> = {
  Australia: "AU",
  China: "CN",
  Japan: "JP",
  Bahrain: "BH",
  "Saudi Arabia": "SA",
  USA: "US",
  Italy: "IT",
  Monaco: "MC",
  Spain: "ES",
  Canada: "CA",
  Austria: "AT",
  "United Kingdom": "GB",
  Belgium: "BE",
  Hungary: "HU",
  Netherlands: "NL",
  Azerbaijan: "AZ",
  Singapore: "SG",
  Mexico: "MX",
  Brazil: "BR",
  Qatar: "QA",
  UAE: "AE",
};

export function getCountryCode(country: string): string {
  return countryToCode[country] || "UN";
}

// Convert country code to flag emoji
export function getFlagEmoji(country: string): string {
  const code = getCountryCode(country);
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

// Country to ISO 3166-1 numeric code — matches world-atlas@2 feature.id values
export const countryToNumericISO: Record<string, number> = {
  Australia: 36,
  China: 156,
  Japan: 392,
  Bahrain: 48,
  "Saudi Arabia": 682,
  USA: 840,
  Italy: 380,
  Monaco: 492,
  Spain: 724,
  Canada: 124,
  Austria: 40,
  "United Kingdom": 826,
  Belgium: 56,
  Hungary: 348,
  Netherlands: 528,
  Azerbaijan: 31,
  Singapore: 702,
  Mexico: 484,
  Brazil: 76,
  Qatar: 634,
  UAE: 784,
};
