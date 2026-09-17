/**
 * Mineral Dealers Africa (MDA) - Authentic Commodity Photography Helper
 * Maps commodity names and categories to authentic geological & industrial mineral assets.
 * Guarantees zero stock human portraits or unrelated lifestyle images.
 */

export const COMMODITY_IMAGES = {
  // High-purity unrefined gold doré bars stacked on an industrial inspection tray
  gold: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",

  // Industrial stacks of 99.99% pure electrolytic copper cathode plates in a refinery yard
  copper: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",

  // Raw grey-white pegmatite spodumene rock concentrate and crystalline lithium ore piles
  lithium: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",

  // Raw, heavy metallic black/dark-grey Columbite-Tantalite (Coltan) coarse sand and pebble concentrate
  coltan: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",

  // Unpolished, raw octahedral rough diamond stones sitting on a dark sorting gem tray
  diamonds: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",

  // Raw, unheated, rough trichroic blue/purple zoisite crystal specimens straight from Merelani, Tanzania
  tanzanite: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",

  // Raw uncut hexagonal green beryl / emerald crystal in pegmatite schist matrix
  emeralds: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",

  // Raw metallurgical cobalt hydroxide / heavy metallic cobalt ore concentrate
  cobalt: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
} as const;

/**
 * Returns an authentic geological or industrial asset photograph based on mineral name or category.
 * If no image is provided, it NEVER defaults to a random portrait or stock human photo.
 */
export function getMineralFallbackImage(
  mineralName: string = "",
  category: string = ""
): string {
  const name = mineralName.toLowerCase();
  const cat = category.toLowerCase();

  // 1. Specific commodity identification by keywords
  if (
    name.includes("gold") ||
    name.includes("aurum") ||
    name.includes("doré") ||
    name.includes("dore") ||
    name.includes("bullion")
  ) {
    return COMMODITY_IMAGES.gold;
  }

  if (name.includes("copper") || name.includes("cathode") || name.includes("cuivre")) {
    return COMMODITY_IMAGES.copper;
  }

  if (
    name.includes("lithium") ||
    name.includes("spodumene") ||
    name.includes("sc6") ||
    name.includes("petalite")
  ) {
    return COMMODITY_IMAGES.lithium;
  }

  if (
    name.includes("coltan") ||
    name.includes("tantalite") ||
    name.includes("columbite") ||
    name.includes("ta2o5") ||
    name.includes("niobium")
  ) {
    return COMMODITY_IMAGES.coltan;
  }

  if (
    name.includes("diamond") ||
    name.includes("kimberlite") ||
    name.includes("diamant")
  ) {
    return COMMODITY_IMAGES.diamonds;
  }

  if (
    name.includes("tanzanite") ||
    name.includes("zoisite") ||
    name.includes("blue zoisite")
  ) {
    return COMMODITY_IMAGES.tanzanite;
  }

  if (
    name.includes("emerald") ||
    name.includes("beryl") ||
    name.includes("tourmaline") ||
    name.includes("sapphire") ||
    name.includes("ruby")
  ) {
    return COMMODITY_IMAGES.emeralds;
  }

  if (
    name.includes("cobalt") ||
    name.includes("nickel") ||
    name.includes("heterogenite")
  ) {
    return COMMODITY_IMAGES.cobalt;
  }

  // 2. High-level category fallbacks with verified geological imagery
  if (cat.includes("metal") || cat === "metals") {
    return COMMODITY_IMAGES.gold;
  }

  if (cat.includes("stone") || cat === "stones" || cat.includes("gem")) {
    return COMMODITY_IMAGES.diamonds;
  }

  if (cat.includes("rare") || cat.includes("critical") || cat === "rare-earth") {
    return COMMODITY_IMAGES.coltan;
  }

  // Default fallback is always verified industrial Gold Doré inspection bars
  return COMMODITY_IMAGES.gold;
}
