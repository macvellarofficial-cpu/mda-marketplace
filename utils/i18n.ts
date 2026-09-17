export type SupportedLanguage = "auto" | "en" | "fr" | "sw" | "ar" | "zh" | "es" | "de";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "auto", label: "Auto (Browser)", nativeName: "Auto", dir: "ltr", flag: "🌐" },
  { code: "en", label: "English (EN)", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", label: "Français (FR)", nativeName: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "sw", label: "Kiswahili (SW)", nativeName: "Kiswahili", dir: "ltr", flag: "🇹🇿" },
  { code: "ar", label: "العربية (AR)", nativeName: "العربية", dir: "rtl", flag: "🇦🇪" },
  { code: "zh", label: "中文 (ZH)", nativeName: "中文", dir: "ltr", flag: "🇨🇳" },
  { code: "es", label: "Español (ES)", nativeName: "Español", dir: "ltr", flag: "🇪🇸" },
  { code: "de", label: "Deutsch (DE)", nativeName: "Deutsch", dir: "ltr", flag: "🇩🇪" },
];

export const translations: Record<string, Record<string, string>> = {
  en: {
    // Nav
    "nav.marketplace": "Marketplace",
    "nav.services": "Services",
    "nav.dueDiligence": "Due Diligence",
    "nav.contact": "Contact",
    "nav.signIn": "Institutional Sign In",
    "nav.accessPortal": "Access Portal",
    
    // Hero
    "hero.badge.network": "Sovereign Concession Network",
    "hero.badge.escrow": "$45M+ Bonded Escrow Reserve",
    "hero.title.prefix": "Africa's Most Trusted",
    "hero.title.highlight": "Digital Mineral Marketplace",
    "hero.subtitle": "Direct B2B execution between verified African mining concessions and global institutional buyers. Fully backed by independent laboratory assays, multi-signature custody, and statutory export compliance.",
    "hero.cta.source": "Source Mineral Batches",
    "hero.cta.registerConcession": "Register Mining Concession",

    // Trust Ribbon
    "trust.verified": "Verified Mineral Provenance",
    "trust.memd": "MEMD Registered",
    "trust.oecd": "OECD Compliant",
    "trust.assays": "SGS / Alex Stewart Assays",
    "trust.icglr": "ICGLR Certified",

    // Market filters & cards
    "market.all": "All Batches",
    "market.preciousMetals": "Precious Metals",
    "market.batteryMinerals": "Battery Minerals",
    "market.rareEarths": "Rare Earths",
    "market.gemstones": "Gemstones",
    "market.searchPlaceholder": "Filter by lot ID, commodity, or concession origin...",
    "market.purity": "Certified Purity",
    "market.quantity": "Batch Weight",
    "market.price": "Indicative Value",
    "market.viewDetails": "View Batch Dossier",
    "market.requestAssay": "Request Assay",
  },
  fr: {
    // Nav
    "nav.marketplace": "Marché Minier",
    "nav.services": "Services",
    "nav.dueDiligence": "Diligence Raisonnable",
    "nav.contact": "Contact",
    "nav.signIn": "Connexion Institutionnelle",
    "nav.accessPortal": "Portail d'Accès",
    
    // Hero
    "hero.badge.network": "Réseau de Concessions Souveraines",
    "hero.badge.escrow": "+45 M$ en Réserve de Séquestre Cautionné",
    "hero.title.prefix": "Le Marché Minéral Numérique",
    "hero.title.highlight": "Le Plus Fiable d'Afrique",
    "hero.subtitle": "Exécution B2B directe entre concessions minières africaines certifiées et acheteurs institutionnels mondiaux. Soutenue par des analyses de laboratoire indépendantes et conformité légale.",
    "hero.cta.source": "Consulter les Lots de Minerais",
    "hero.cta.registerConcession": "Enregistrer une Concession",

    // Trust Ribbon
    "trust.verified": "Traçabilité des Minerais Vérifiée",
    "trust.memd": "Agréé MEMD",
    "trust.oecd": "Conforme OCDE",
    "trust.assays": "Analyses SGS / Alex Stewart",
    "trust.icglr": "Certifié CIRGL",

    // Market
    "market.all": "Tous les Lots",
    "market.preciousMetals": "Métaux Précieux",
    "market.batteryMinerals": "Minéraux de Batterie",
    "market.rareEarths": "Terres Rares",
    "market.gemstones": "Pierres Précieuses",
    "market.searchPlaceholder": "Filtrer par lot, matière première ou origine...",
    "market.purity": "Pureté Certifiée",
    "market.quantity": "Poids du Lot",
    "market.price": "Valeur Indicative",
    "market.viewDetails": "Voir le Dossier du Lot",
    "market.requestAssay": "Demander l'Analyse",
  },
  sw: {
    // Nav
    "nav.marketplace": "Soko la Madini",
    "nav.services": "Huduma",
    "nav.dueDiligence": "Uhakiki na Usalama",
    "nav.contact": "Mawasiliano",
    "nav.signIn": "Ingia Kama Taasisi",
    "nav.accessPortal": "Fungua Tovuti",
    
    // Hero
    "hero.badge.network": "Mtandao wa Migodi Iliyothibitishwa",
    "hero.badge.escrow": "$45M+ Hifadhi ya Dhamana ya Escrow",
    "hero.title.prefix": "Soko Kuu la Madini Dijitali",
    "hero.title.highlight": "Linaloaminika Zaidi Barani Afrika",
    "hero.subtitle": "Biashara ya moja kwa moja ya B2B kati ya migodi iliyoidhinishwa ya Afrika na wanunuzi wa kimataifa. Inaungwa mkono na vipimo vya maabara huru na uzingatiaji wa sheria za usafirishaji.",
    "hero.cta.source": "Tazama Madini Yanayopatikana",
    "hero.cta.registerConcession": "Sajili Mgodi wa Madini",

    // Trust Ribbon
    "trust.verified": "Asili ya Madini Imethibitishwa",
    "trust.memd": "Imesajiliwa MEMD",
    "trust.oecd": "Inafuata Mwongozo wa OECD",
    "trust.assays": "Vipimo vya SGS / Alex Stewart",
    "trust.icglr": "Cheti cha ICGLR",

    // Market
    "market.all": "Kundi Zote",
    "market.preciousMetals": "Madini ya Thamani",
    "market.batteryMinerals": "Madini ya Betri",
    "market.rareEarths": "Madini Adimu",
    "market.gemstones": "Vito vya Thamani",
    "market.searchPlaceholder": "Tafuta kwa nambari ya kundi, jina au asili...",
    "market.purity": "Kiwango cha Usafi",
    "market.quantity": "Uzito wa Kundi",
    "market.price": "Thamani Inayokadiriwa",
    "market.viewDetails": "Angalia Taarifa za Kundi",
    "market.requestAssay": "Omba Ripoti ya Maabara",
  },
  ar: {
    // Nav
    "nav.marketplace": "سوق المعادن",
    "nav.services": "الخدمات اللوجستية",
    "nav.dueDiligence": "العناية الواجبة",
    "nav.contact": "اتصل بنا",
    "nav.signIn": "تسجيل دخول المؤسسات",
    "nav.accessPortal": "دخول المنصة",
    
    // Hero
    "hero.badge.network": "شبكة الامتيازات التعدينية المعتمدة",
    "hero.badge.escrow": "+45 مليون دولار احتياطي الضمان البنكي",
    "hero.title.prefix": "سوق المعادن الرقمي الإفريقي",
    "hero.title.highlight": "الأكثر ثقة وموثوقية في إفريقيا",
    "hero.subtitle": "تنفيذ مباشر للمعاملات التجارية بين مناجم التعدين الإفريقية المعتمدة والمشترين والمصافي العالمية. مدعومة بتحليلات معملية مستقلة وحسابات ضمان بنكية موثوقة.",
    "hero.cta.source": "استعراض شحنات المعادن",
    "hero.cta.registerConcession": "تسجيل امتياز تعديني",

    // Trust Ribbon
    "trust.verified": "منشأ تعديني معتمد وموثق",
    "trust.memd": "مسجل لدى MEMD",
    "trust.oecd": "مطابق لمعايير OECD",
    "trust.assays": "فحوصات SGS و Alex Stewart",
    "trust.icglr": "شهادة ICGLR الإقليمية",

    // Market
    "market.all": "جميع الشحنات",
    "market.preciousMetals": "المعادن النفيسة والذهب",
    "market.batteryMinerals": "معادن البطاريات والليثيوم",
    "market.rareEarths": "العناصر الأرضية النادرة",
    "market.gemstones": "الأحجار الكريمة",
    "market.searchPlaceholder": "بحث برقم الشحنة أو نوع المعدن أو بلد المنشأ...",
    "market.purity": "درجة النقاء المعتمدة",
    "market.quantity": "وزن الشحنة",
    "market.price": "القيمة التقديرية (USD)",
    "market.viewDetails": "عرض الملف الفني للشحنة",
    "market.requestAssay": "طلب شهادة الفحص المخبري",
  },
  zh: {
    // Nav
    "nav.marketplace": "矿产交易市场",
    "nav.services": "供应链服务",
    "nav.dueDiligence": "尽职合规调查",
    "nav.contact": "联系我们",
    "nav.signIn": "机构用户登录",
    "nav.accessPortal": "进入交易门户",
    
    // Hero
    "hero.badge.network": "主权矿区直通网络",
    "hero.badge.escrow": "$4500万+ 履约托管准备金",
    "hero.title.prefix": "非洲最受信赖的",
    "hero.title.highlight": "数字化矿产大宗交易平台",
    "hero.subtitle": "连接经认证的非洲采矿特许权区与全球冶炼及机构买家。由独立第三方实验室化验鉴定、双签信托托管及法定出口合规全力支持。",
    "hero.cta.source": "浏览矿石与精矿批次",
    "hero.cta.registerConcession": "注册矿山特许权",

    // Trust Ribbon
    "trust.verified": "矿产原产地真实性核验",
    "trust.memd": "MEMD 矿产部注册",
    "trust.oecd": "符合经合组织 OECD 标准",
    "trust.assays": "SGS / Alex Stewart 化验认证",
    "trust.icglr": "大湖区 ICGLR 认证",

    // Market
    "market.all": "全部大宗矿批",
    "market.preciousMetals": "贵金属 (黄金/白银)",
    "market.batteryMinerals": "电池矿产 (锂/铜/钴)",
    "market.rareEarths": "稀土元素 (铌钽/钽铁)",
    "market.gemstones": "宝石系列 (坦桑石/祖母绿)",
    "market.searchPlaceholder": "按批次编号、矿种或产地检索...",
    "market.purity": "认证品位与纯度",
    "market.quantity": "批次重量",
    "market.price": "参考结算价",
    "market.viewDetails": "查验矿产卷宗",
    "market.requestAssay": "索取化验报告",
  },
  es: {
    // Nav
    "nav.marketplace": "Mercado Minero",
    "nav.services": "Servicios",
    "nav.dueDiligence": "Diligencia Debida",
    "nav.contact": "Contacto",
    "nav.signIn": "Acceso Institucional",
    "nav.accessPortal": "Portal de Comercio",
    
    // Hero
    "hero.badge.network": "Red de Concesiones Soberanas",
    "hero.badge.escrow": "+$45M en Depósito en Garantía",
    "hero.title.prefix": "El Mercado Digital de Minerales",
    "hero.title.highlight": "Más Confiable de África",
    "hero.subtitle": "Negociación B2B directa entre concesiones mineras africanas verificadas y compradores institucionales internacionales.",
    "hero.cta.source": "Explorar Lotes Disponibles",
    "hero.cta.registerConcession": "Registrar Concesión Minera",

    // Trust Ribbon
    "trust.verified": "Trazabilidad de Minerales Verificada",
    "trust.memd": "Registrado ante MEMD",
    "trust.oecd": "Cumplimiento OCDE",
    "trust.assays": "Ensayos SGS / Alex Stewart",
    "trust.icglr": "Certificado ICGLR",

    // Market
    "market.all": "Todos los Lotes",
    "market.preciousMetals": "Metales Preciosos",
    "market.batteryMinerals": "Minerales de Batería",
    "market.rareEarths": "Tierras Raras",
    "market.gemstones": "Piedras Preciosas",
    "market.searchPlaceholder": "Filtrar por lote, mineral u origen...",
    "market.purity": "Pureza Certificada",
    "market.quantity": "Peso del Lote",
    "market.price": "Valor Indicativo",
    "market.viewDetails": "Ver Expediente del Lote",
    "market.requestAssay": "Solicitar Ensayo",
  },
  de: {
    // Nav
    "nav.marketplace": "Mineralien-Marktplatz",
    "nav.services": "Dienstleistungen",
    "nav.dueDiligence": "Due Diligence",
    "nav.contact": "Kontakt",
    "nav.signIn": "Institutioneller Login",
    "nav.accessPortal": "Portal Öffnen",
    
    // Hero
    "hero.badge.network": "Souveränes Konzessionsnetzwerk",
    "hero.badge.escrow": "$45M+ Treuhand-Treuhandreserve",
    "hero.title.prefix": "Afrikas Vertrauenswürdigster",
    "hero.title.highlight": "Digitaler Mineralien-Marktplatz",
    "hero.subtitle": "Direkte B2B-Ausführung zwischen zertifizierten afrikanischen Bergbaukonzessionen und weltweiten Großabnehmern.",
    "hero.cta.source": "Mineralienchargen Durchsuchen",
    "hero.cta.registerConcession": "Bergbaukonzession Registrieren",

    // Trust Ribbon
    "trust.verified": "Verifizierte Mineralienherkunft",
    "trust.memd": "MEMD Registriert",
    "trust.oecd": "OECD-Konform",
    "trust.assays": "SGS / Alex Stewart Gutachten",
    "trust.icglr": "ICGLR Zertifiziert",

    // Market
    "market.all": "Alle Chargen",
    "market.preciousMetals": "Edelmetalle",
    "market.batteryMinerals": "Batteriemineralien",
    "market.rareEarths": "Seltene Erden",
    "market.gemstones": "Edelsteine",
    "market.searchPlaceholder": "Nach Chargennummer, Rohstoff oder Herkunft filtern...",
    "market.purity": "Zertifizierter Reinheitsgrad",
    "market.quantity": "Chargengewicht",
    "market.price": "Richtwert",
    "market.viewDetails": "Chargendossier Anzeigen",
    "market.requestAssay": "Laboranalyse Anfordern",
  }
};

export function getTranslation(lang: string, key: string): string {
  const effectiveLang = (lang === "auto" ? "en" : lang) in translations ? (lang === "auto" ? "en" : lang) : "en";
  if (translations[effectiveLang] && translations[effectiveLang][key]) {
    return translations[effectiveLang][key];
  }
  return translations.en[key] || key;
}
