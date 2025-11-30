export interface GNItem {
  gnName: string;
  divisionalSecretariat: string;
}

export const gnList: GNItem[] = [
  { gnName: "Nuwarawewa", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (I) Part (I)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Maha Kalaththawa", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Thariyankulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Nelunkanniya", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Kuda Nelumkulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Keerikkulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Thammannapura", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vannithammannawa", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Thammannakulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (I) Part (II)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (II) Part (III)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (II) Part (II)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Pothanegama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (III) Part (III)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (II) Part (I)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (II) Part (IV)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (IV)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (V)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (VI)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Ghanikulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Kawarakkulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Maha Paladikulama", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (III) Part (I)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Stage (III) Part (II)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (III)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (I)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Vanniyankulama (II)", divisionalSecretariat: "Nuwaragam Palatha East" },
  { gnName: "Sucharithagama", divisionalSecretariat: "Nuwaragam Palatha East" }
];

// Helper function to get unique divisional secretariats
export function getDivisionalSecretariats(): string[] {
  const secretariats = new Set<string>();
  gnList.forEach(item => secretariats.add(item.divisionalSecretariat));
  return Array.from(secretariats).sort();
}

// Helper function to get GN names for a specific divisional secretariat
export function getGNNamesBySecretariat(secretariat: string): string[] {
  return gnList
    .filter(item => item.divisionalSecretariat === secretariat)
    .map(item => item.gnName)
    .sort();
}

// Backward compatibility - export the old array format
export const gnEnglishNames: string[] = gnList.map(item => item.gnName);
