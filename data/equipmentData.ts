export interface EquipmentItem {
  id: string;
  name: string;
  manufacturer?: string;
  machineType: string;
  category?: string;
  capacity: string;
  capacityTPH?: number;
  powerRequirement: string;
  deliveryIncoterms: string;
  leadTime: string;
  priceUSD: string;
  status: "In Stock" | "Made to Order";
  location: string;
  headquarters?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  specSheetFileName?: string;
  photoUrl?: string;
}

export const DEFAULT_EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    id: "EQP-CAT-797F",
    name: "Cat® 797F Ultra-Class Mining Haul Truck (400-Ton)",
    manufacturer: "Caterpillar Inc. (Cat Mining)",
    machineType: "Haul Truck",
    category: "Surface Heavy Haulage",
    capacity: "400 Short Tons (363 Metric Tonnes)",
    capacityTPH: 1800,
    powerRequirement: "4,000 HP (2,983 kW) Cat C175-20 Quad-Turbo Diesel",
    deliveryIncoterms: "FOB Durban / CIF Dar es Salaam",
    leadTime: "In Stock (Immediate Inspection)",
    priceUSD: "$5,250,000",
    status: "In Stock",
    location: "Barloworld / Cat Mining Hub, Johannesburg, South Africa",
    headquarters: "501 SW Jefferson St, Peoria, IL 61614, USA",
    contactPhone: "+1 (309) 675-2337",
    contactEmail: "mining_sales@cat.com",
    website: "https://www.cat.com",
    photoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    specSheetFileName: "Cat_797F_Mining_Truck_Specs.pdf",
  },
  {
    id: "EQP-KOM-PC5500",
    name: "Komatsu PC5500-11 Hydraulic Super Mining Shovel (29 m³)",
    manufacturer: "Komatsu Mining Corp.",
    machineType: "Excavator",
    category: "High-Volume Extraction Shovel",
    capacity: "29.0 m³ Heavy Rock Bucket (552 Tonnes Operating Weight)",
    capacityTPH: 2400,
    powerRequirement: "2,520 HP (2 x 940 kW Dual Tier 4 Diesel Engines)",
    deliveryIncoterms: "FOB Richards Bay / CIF Mombasa",
    leadTime: "4 Weeks Transit",
    priceUSD: "$6,800,000",
    status: "In Stock",
    location: "Komatsu Africa Logistics Depot, Durban, South Africa",
    headquarters: "2-3-6 Akasaka, Minato-ku, Tokyo 107-8414, Japan",
    contactPhone: "+27 11 923 1000",
    contactEmail: "info@komatsu.co.za",
    website: "https://www.komatsu.com",
    photoUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80",
    specSheetFileName: "Komatsu_PC5500-11_SpecSheet.pdf",
  },
  {
    id: "EQP-SDV-LH621I",
    name: "Sandvik Toro™ LH621i Intelligent Underground LHD Loader",
    manufacturer: "Sandvik Mining and Rock Solutions",
    machineType: "Underground Loader",
    category: "Subsurface Hard-Rock Comminution",
    capacity: "21.0 Metric Tonnes (10.7 m³ Bucket Capacity)",
    capacityTPH: 450,
    powerRequirement: "375 kW (503 HP) Volvo Penta Stage V Low-Emission Engine",
    deliveryIncoterms: "EXW Kitwe Depot, Zambia",
    leadTime: "Immediate Dispatch",
    priceUSD: "$1,250,000",
    status: "In Stock",
    location: "Sandvik Central Africa Yard, Kitwe, Copperbelt, Zambia",
    headquarters: "Kungsbron 1, 111 22 Stockholm, Sweden",
    contactPhone: "+46 8 456 11 00",
    contactEmail: "mining.africa@sandvik.com",
    website: "https://www.rocktechnology.sandvik",
    photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    specSheetFileName: "Sandvik_Toro_LH621i_Technical_Brochure.pdf",
  },
  {
    id: "EQP-EPI-D65MK2",
    name: "Epiroc SmartROC D65 MKII Automated Surface DTH Drill Rig",
    manufacturer: "Epiroc AB",
    machineType: "Drill Rig",
    category: "Down-The-Hole Blast Hole Drilling",
    capacity: "110 mm - 203 mm Hole Diameter (Up to 56m Drill Depth)",
    capacityTPH: 120,
    powerRequirement: "403 kW (540 HP) Cat C15 Engine with 30 bar Air Compressor",
    deliveryIncoterms: "CIF Dar es Salaam Port",
    leadTime: "2 Weeks Transit",
    priceUSD: "$890,000",
    status: "In Stock",
    location: "Epiroc East Africa Base, Dar es Salaam, Tanzania",
    headquarters: "Sickla Industriväg 19, 131 54 Nacka, Sweden",
    contactPhone: "+46 10 755 00 00",
    contactEmail: "info.eastafrica@epiroc.com",
    website: "https://www.epiroc.com",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    specSheetFileName: "Epiroc_SmartROC_D65_Brochure.pdf",
  },
  {
    id: "EQP-MET-HP400",
    name: "Metso Nordberg® HP400™ High-Performance Secondary Cone Crusher",
    manufacturer: "Metso Corporation",
    machineType: "Cone Crusher",
    category: "Secondary & Tertiary Hard-Rock Crushing",
    capacity: "700 TPH Hard Rock Feed (304 mm Feed Opening)",
    capacityTPH: 700,
    powerRequirement: "315 kW (400 HP) Electric Drive with IC70C Automation",
    deliveryIncoterms: "DAP Kampala Namanve Industrial Depot",
    leadTime: "Immediate Delivery",
    priceUSD: "$385,000",
    status: "In Stock",
    location: "Namanve Industrial Business Park, Kampala, Uganda",
    headquarters: "Rauhalanpuisto 9, 02230 Espoo, Finland",
    contactPhone: "+358 20 484 100",
    contactEmail: "crushers.sales@metso.com",
    website: "https://www.metso.com",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    specSheetFileName: "Metso_HP400_Cone_Crusher_Manual.pdf",
  },
];
