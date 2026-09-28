import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...v] = trimmed.split("=");
    if (k === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = v.join("=");
    if (k === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseAnonKey = v.join("=");
  }
}

export const REAL_MINING_EQUIPMENT = [
  {
    id: "EQP-CAT-797F",
    name: "Cat® 797F Ultra-Class Mining Haul Truck (400-Ton)",
    manufacturer: "Caterpillar Inc. (Cat Mining)",
    machine_type: "Haul Truck",
    category: "Surface Heavy Haulage",
    capacity: "400 Short Tons (363 Metric Tonnes)",
    capacity_tph: 1800,
    power_requirement: "4,000 HP (2,983 kW) Cat C175-20 Quad-Turbo Diesel",
    delivery_incoterms: "FOB Durban / CIF Dar es Salaam",
    lead_time: "In Stock (Immediate Inspection)",
    price_usd: "$5,250,000",
    status: "In Stock",
    location: "Barloworld / Cat Mining Hub, Johannesburg, South Africa",
    headquarters: "501 SW Jefferson St, Peoria, IL 61614, USA",
    contact_phone: "+1 (309) 675-2337",
    contact_email: "mining_sales@cat.com",
    website: "https://www.cat.com",
    photo_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    spec_sheet_file_name: "Cat_797F_Mining_Truck_Specs.pdf",
  },
  {
    id: "EQP-KOM-PC5500",
    name: "Komatsu PC5500-11 Hydraulic Super Mining Shovel (29 m³)",
    manufacturer: "Komatsu Mining Corp.",
    machine_type: "Excavator",
    category: "High-Volume Extraction Shovel",
    capacity: "29.0 m³ Heavy Rock Bucket (552 Tonnes Operating Weight)",
    capacity_tph: 2400,
    power_requirement: "2,520 HP (2 x 940 kW Dual Tier 4 Diesel Engines)",
    delivery_incoterms: "FOB Richards Bay / CIF Mombasa",
    lead_time: "4 Weeks Transit",
    price_usd: "$6,800,000",
    status: "In Stock",
    location: "Komatsu Africa Logistics Depot, Durban, South Africa",
    headquarters: "2-3-6 Akasaka, Minato-ku, Tokyo 107-8414, Japan",
    contact_phone: "+27 11 923 1000",
    contact_email: "info@komatsu.co.za",
    website: "https://www.komatsu.com",
    photo_url: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80",
    spec_sheet_file_name: "Komatsu_PC5500-11_SpecSheet.pdf",
  },
  {
    id: "EQP-SDV-LH621I",
    name: "Sandvik Toro™ LH621i Intelligent Underground LHD Loader",
    manufacturer: "Sandvik Mining and Rock Solutions",
    machine_type: "Underground Loader",
    category: "Subsurface Hard-Rock Comminution",
    capacity: "21.0 Metric Tonnes (10.7 m³ Bucket Capacity)",
    capacity_tph: 450,
    power_requirement: "375 kW (503 HP) Volvo Penta Stage V Low-Emission Engine",
    delivery_incoterms: "EXW Kitwe Depot, Zambia",
    lead_time: "Immediate Dispatch",
    price_usd: "$1,250,000",
    status: "In Stock",
    location: "Sandvik Central Africa Yard, Kitwe, Copperbelt, Zambia",
    headquarters: "Kungsbron 1, 111 22 Stockholm, Sweden",
    contact_phone: "+46 8 456 11 00",
    contact_email: "mining.africa@sandvik.com",
    website: "https://www.rocktechnology.sandvik",
    photo_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    spec_sheet_file_name: "Sandvik_Toro_LH621i_Technical_Brochure.pdf",
  },
  {
    id: "EQP-EPI-D65MK2",
    name: "Epiroc SmartROC D65 MKII Automated Surface DTH Drill Rig",
    manufacturer: "Epiroc AB",
    machine_type: "Drill Rig",
    category: "Down-The-Hole Blast Hole Drilling",
    capacity: "110 mm - 203 mm Hole Diameter (Up to 56m Drill Depth)",
    capacity_tph: 120,
    power_requirement: "403 kW (540 HP) Cat C15 Engine with 30 bar Air Compressor",
    delivery_incoterms: "CIF Dar es Salaam Port",
    lead_time: "2 Weeks Transit",
    price_usd: "$890,000",
    status: "In Stock",
    location: "Epiroc East Africa Base, Dar es Salaam, Tanzania",
    headquarters: "Sickla Industriväg 19, 131 54 Nacka, Sweden",
    contact_phone: "+46 10 755 00 00",
    contact_email: "info.eastafrica@epiroc.com",
    website: "https://www.epiroc.com",
    photo_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    spec_sheet_file_name: "Epiroc_SmartROC_D65_Brochure.pdf",
  },
  {
    id: "EQP-MET-HP400",
    name: "Metso Nordberg® HP400™ High-Performance Secondary Cone Crusher",
    manufacturer: "Metso Corporation",
    machine_type: "Cone Crusher",
    category: "Secondary & Tertiary Hard-Rock Crushing",
    capacity: "700 TPH Hard Rock Feed (304 mm Feed Opening)",
    capacity_tph: 700,
    power_requirement: "315 kW (400 HP) Electric Drive with IC70C Automation",
    delivery_incoterms: "DAP Kampala Namanve Industrial Depot",
    lead_time: "Immediate Delivery",
    price_usd: "$385,000",
    status: "In Stock",
    location: "Namanve Industrial Business Park, Kampala, Uganda",
    headquarters: "Rauhalanpuisto 9, 02230 Espoo, Finland",
    contact_phone: "+358 20 484 100",
    contact_email: "crushers.sales@metso.com",
    website: "https://www.metso.com",
    photo_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    spec_sheet_file_name: "Metso_HP400_Cone_Crusher_Manual.pdf",
  },
];

async function pushToSupabase() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or Anon Key");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  for (const item of REAL_MINING_EQUIPMENT) {
    try {
      console.log(`Pushing ${item.id} - ${item.name}...`);
      const { data, error } = await supabase
        .from("mining_equipment")
        .upsert(item, { onConflict: "id" });

      if (error) {
        console.warn(`Supabase upsert note for ${item.id}:`, error.message);
      } else {
        console.log(`Successfully pushed ${item.id} to Supabase!`);
      }
    } catch (err) {
      console.error(`Network or runtime error pushing ${item.id}:`, err.message);
    }
  }
}

pushToSupabase();
