/**
 * 🗺️ MOCK LOCATION DATA
 * Sample data for dynamic Country > State > District > City > Pincode dropdowns.
 */

export const COUNTRIES = [
  { id: "in", name: "India", code: "+91", flag: "🇮🇳" },
  { id: "us", name: "United States", code: "+1", flag: "🇺🇸" },
  { id: "ae", name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { id: "it", name: "Italy", code: "+39", flag: "🇮🇹" },
];

export const STATES: Record<string, { id: string; name: string }[]> = {
  in: [
    { id: "gj", name: "Gujarat" },
    { id: "mh", name: "Maharashtra" },
    { id: "dl", name: "Delhi" },
  ],
  us: [
    { id: "ca", name: "California" },
    { id: "ny", name: "New York" },
  ],
  ae: [
    { id: "du", name: "Dubai" },
  ],
  it: [
    { id: "rm", name: "Rome" },
  ]
};

export const DISTRICTS: Record<string, { id: string; name: string }[]> = {
  gj: [
    { id: "mo", name: "Morbi" },
    { id: "ah", name: "Ahmedabad" },
    { id: "su", name: "Surat" },
  ],
  mh: [
    { id: "mu", name: "Mumbai" },
    { id: "pu", name: "Pune" },
  ],
  dl: [
    { id: "nd", name: "New Delhi" },
  ],
  rm: [
    { id: "ro", name: "Roma" },
  ],
};

export const CITIES: Record<string, string[]> = {
  mo: ["Morbi City", "Wankaner", "Halvad"],
  ah: ["Ahmedabad City", "Sanand", "Bavla"],
  su: ["Surat City", "Varachha", "Adajan"],
  mu: ["Andheri", "Bandra", "Borivali"],
  pu: ["Kothrud", "Baner", "Hinjewadi"],
  nd: ["Connaught Place", "Dwarka", "Saket"],
  ro: ["Central Rome", "Vatican City"],
};

export const PINCODES: Record<string, string[]> = {
  "Morbi City": ["363641", "363642"],
  "Ahmedabad City": ["380001", "380002"],
  "Mumbai City": ["400001", "400002"],
  "Andheri": ["400053", "400058"],
  "Dwarka": ["110075", "110078"],
  "Central Rome": ["00118", "00119"],
};
