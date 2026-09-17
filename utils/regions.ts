export interface CountryData {
  code: string;
  name: string;
  phoneCode: string;
  regions: string[];
}

export const COUNTRIES: CountryData[] = [
  {
    code: "UG",
    name: "Uganda",
    phoneCode: "+256",
    regions: [
      "Kampala Central",
      "Buhweju Gold Concession",
      "Karamoja Mineral Belt (Moroto)",
      "Kasese Cobalt Basin",
      "Mubende Mining District",
      "Tororo Phosphate Zone",
      "Busia Gold Corridor",
      "Kisoro Wolfram / Tin Hub",
    ],
  },
  {
    code: "CD",
    name: "Democratic Republic of Congo (DRC)",
    phoneCode: "+243",
    regions: [
      "Haut-Katanga (Lubumbashi)",
      "Lualaba (Kolwezi Cobalt / Copper)",
      "North Kivu (Goma / Coltan)",
      "South Kivu (Bukavu)",
      "Ituri Gold Corridor (Bunia)",
      "Tanganyika Tin Basin (Kalemie)",
    ],
  },
  {
    code: "ZM",
    name: "Zambia",
    phoneCode: "+260",
    regions: [
      "Copperbelt (Kitwe / Ndola)",
      "North-Western (Solwezi / Kansanshi)",
      "Lusaka Industrial Zone",
      "Central Province (Kabwe)",
      "Southern Province (Batoka)",
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    phoneCode: "+233",
    regions: [
      "Ashanti Basin (Obuasi Gold)",
      "Western Region (Tarkwa / Bogoso)",
      "Greater Accra Vault Depot",
      "Eastern Region (Kibi / Akyem)",
      "Central Region (Dunkwa)",
    ],
  },
  {
    code: "RW",
    name: "Rwanda",
    phoneCode: "+250",
    regions: [
      "Kigali Free Economic Zone",
      "Bugesera Logistics Hub",
      "Western Province (Rutsiro)",
      "Southern Province (Muhanga / Cassiterite)",
      "Northern Province (Musanze)",
    ],
  },
  {
    code: "TZ",
    name: "Tanzania",
    phoneCode: "+255",
    regions: [
      "Geita Gold Field",
      "Merelani Hills (Tanzanite Block C)",
      "Mwanza Lake Zone",
      "Kahama / Bulyanhulu",
      "Dar es Salaam Port Logistics",
    ],
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    phoneCode: "+263",
    regions: [
      "Great Dyke Mineral Complex",
      "Bikita Lithium Hub",
      "Harare Inland Port",
      "Midlands (Kwekwe / Gweru Gold)",
      "Manicaland (Chiadzwa Diamonds)",
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    phoneCode: "+27",
    regions: [
      "Gauteng (Johannesburg / Rand)",
      "North West (Rustenburg Platinum)",
      "Limpopo (Polokwane / Bushveld)",
      "Northern Cape (Sishen Iron / Manganese)",
      "Mpumalanga (Witbank Coal & Metals)",
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    phoneCode: "+254",
    regions: [
      "Nairobi Commercial Exchange",
      "Coast Province (Mombasa Port)",
      "Taita Taveta Gemstone Corridor",
      "Western (Migori Gold Belt)",
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    phoneCode: "+971",
    regions: [
      "Dubai (DMCC Free Zone)",
      "Abu Dhabi Commodity Hub",
      "Sharjah International",
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    phoneCode: "+44",
    regions: [
      "London (LBMA Bullion District)",
      "Greater London",
      "Scotland / North",
    ],
  },
  {
    code: "US",
    name: "United States",
    phoneCode: "+1",
    regions: [
      "New York (Commodity Exchange)",
      "Texas (Energy & Minerals)",
      "California",
      "Nevada (Gold Mines)",
      "Other States",
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    phoneCode: "+41",
    regions: [
      "Geneva (Commodity Trading Hub)",
      "Zurich (Bullion Vaults)",
      "Ticino (Refinery District)",
    ],
  },
  {
    code: "CN",
    name: "China",
    phoneCode: "+86",
    regions: [
      "Shanghai (Gold & Metals Exchange)",
      "Guangdong (Processing Hub)",
      "Beijing",
      "Jiangsu",
    ],
  },
  {
    code: "IN",
    name: "India",
    phoneCode: "+91",
    regions: [
      "Mumbai (Bullion & Gems Hub)",
      "Gujarat (Surat Diamond Center)",
      "Delhi",
      "Karnataka",
    ],
  },
];
