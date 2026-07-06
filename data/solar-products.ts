import type { SolarProduct, SolarProductCategoryName } from "@/types/solar-product";

const productImages: Record<SolarProductCategoryName, string> = {
  "แผงโซลาร์เซลล์": "/products/solar-panel.svg",
  "อินเวอร์เตอร์": "/products/inverter.svg",
  "แบตเตอรี่": "/products/battery.svg",
  "โครงสร้างติดตั้ง": "/products/mounting.svg",
  "สายไฟ DC": "/products/cable.svg",
  "สายไฟ AC": "/products/cable.svg",
  "MC4 Connector": "/products/cable.svg",
  "Combiner Box": "/products/breaker.svg",
  "Breaker DC": "/products/breaker.svg",
  "Breaker AC": "/products/breaker.svg",
  "Surge Protection": "/products/breaker.svg",
  "Grounding": "/products/mounting.svg",
  "เครื่องมือช่าง": "/products/tools.svg"
};

const productsByCategory: Record<SolarProductCategoryName, Omit<SolarProduct, "id" | "category">[]> = {
  "แผงโซลาร์เซลล์": [
    { sku: "PNL-550-MONO", name: "Mono Solar Panel 550W", brand: "Longi", stock: 42, unit: "แผง", status: "พร้อมใช้งาน" },
    { sku: "PNL-580-HALF", name: "Half Cell Solar Panel 580W", brand: "Jinko Solar", stock: 28, unit: "แผง", status: "พร้อมใช้งาน" },
    { sku: "PNL-600-BIF", name: "Bifacial Solar Panel 600W", brand: "Trina Solar", stock: 9, unit: "แผง", status: "ใกล้หมด" },
    { sku: "PNL-200-FLX", name: "Flexible Solar Panel 200W", brand: "Sunman", stock: 0, unit: "แผง", status: "หมดสต๊อก" },
    { sku: "PNL-450-POLY", name: "Poly Solar Panel 450W", brand: "Canadian Solar", stock: 17, unit: "แผง", status: "พร้อมใช้งาน" }
  ],
  "อินเวอร์เตอร์": [
    { sku: "INV-GT-5K", name: "Grid Tie Inverter 5kW", brand: "Huawei", stock: 13, unit: "เครื่อง", status: "พร้อมใช้งาน" },
    { sku: "INV-HY-10K", name: "Hybrid Inverter 10kW", brand: "Growatt", stock: 5, unit: "เครื่อง", status: "ใกล้หมด" },
    { sku: "INV-ST-20K", name: "String Inverter 20kW", brand: "Sungrow", stock: 7, unit: "เครื่อง", status: "พร้อมใช้งาน" },
    { sku: "INV-MI-800", name: "Micro Inverter 800W", brand: "Hoymiles", stock: 24, unit: "เครื่อง", status: "พร้อมใช้งาน" },
    { sku: "INV-OG-3K", name: "Off Grid Inverter 3kW", brand: "SMA", stock: 0, unit: "เครื่อง", status: "หมดสต๊อก" }
  ],
  "แบตเตอรี่": [
    { sku: "BAT-LFP-5K", name: "LiFePO4 Battery 5kWh", brand: "Pylontech", stock: 11, unit: "ชุด", status: "พร้อมใช้งาน" },
    { sku: "BAT-LFP-10K", name: "LiFePO4 Battery 10kWh", brand: "BYD", stock: 4, unit: "ชุด", status: "ใกล้หมด" },
    { sku: "BAT-RACK-48V", name: "Solar Battery Rack 48V", brand: "Dyness", stock: 6, unit: "ตู้", status: "พร้อมใช้งาน" },
    { sku: "BAT-BMS-MOD", name: "Battery BMS Module", brand: "Daly", stock: 18, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BAT-CBL-SET", name: "Battery Cable Set", brand: "Amphenol", stock: 0, unit: "ชุด", status: "หมดสต๊อก" }
  ],
  "โครงสร้างติดตั้ง": [
    { sku: "MNT-RAIL-42", name: "Aluminum Rail 4.2m", brand: "Solar Mount", stock: 160, unit: "เส้น", status: "พร้อมใช้งาน" },
    { sku: "MNT-MID-CLP", name: "Mid Clamp", brand: "K2 Systems", stock: 360, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "MNT-END-CLP", name: "End Clamp", brand: "K2 Systems", stock: 32, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "MNT-L-FOOT", name: "L-Foot Mount", brand: "Solar Mount", stock: 88, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "MNT-RF-HOOK", name: "Roof Hook", brand: "Clenergy", stock: 0, unit: "ตัว", status: "หมดสต๊อก" }
  ],
  "สายไฟ DC": [
    { sku: "DC-PV-4SQ", name: "PV Cable 4 sq.mm", brand: "PV Link", stock: 620, unit: "เมตร", status: "พร้อมใช้งาน" },
    { sku: "DC-PV-6SQ", name: "PV Cable 6 sq.mm", brand: "Link Solar", stock: 1180, unit: "เมตร", status: "พร้อมใช้งาน" },
    { sku: "DC-PV-10SQ", name: "PV Cable 10 sq.mm", brand: "Thai Yazaki", stock: 140, unit: "เมตร", status: "ใกล้หมด" },
    { sku: "DC-CBL-RED", name: "DC Cable Red", brand: "Bangkok Cable", stock: 0, unit: "เมตร", status: "หมดสต๊อก" },
    { sku: "DC-CBL-BLK", name: "DC Cable Black", brand: "Bangkok Cable", stock: 310, unit: "เมตร", status: "พร้อมใช้งาน" }
  ],
  "สายไฟ AC": [
    { sku: "AC-CBL-25", name: "AC Cable 2.5 sq.mm", brand: "Thai Yazaki", stock: 450, unit: "เมตร", status: "พร้อมใช้งาน" },
    { sku: "AC-CBL-4", name: "AC Cable 4 sq.mm", brand: "Bangkok Cable", stock: 260, unit: "เมตร", status: "พร้อมใช้งาน" },
    { sku: "AC-CBL-10", name: "AC Cable 10 sq.mm", brand: "Phelps Dodge", stock: 72, unit: "เมตร", status: "ใกล้หมด" },
    { sku: "AC-THW", name: "THW Cable", brand: "Thai Yazaki", stock: 0, unit: "เมตร", status: "หมดสต๊อก" },
    { sku: "AC-NYY", name: "NYY Cable", brand: "Bangkok Cable", stock: 180, unit: "เมตร", status: "พร้อมใช้งาน" }
  ],
  "MC4 Connector": [
    { sku: "MC4-PAIR", name: "MC4 Connector Pair", brand: "Staubli", stock: 320, unit: "คู่", status: "พร้อมใช้งาน" },
    { sku: "MC4-BRANCH", name: "MC4 Branch Connector", brand: "Staubli", stock: 44, unit: "ชุด", status: "ใกล้หมด" },
    { sku: "MC4-FUSE", name: "MC4 Fuse Connector", brand: "Weidmuller", stock: 36, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "MC4-PIN", name: "MC4 Crimp Pin", brand: "Amphenol", stock: 700, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "MC4-CAP", name: "MC4 Waterproof Cap", brand: "Staubli", stock: 0, unit: "ตัว", status: "หมดสต๊อก" }
  ],
  "Combiner Box": [
    { sku: "CBX-DC-2S", name: "DC Combiner Box 2 String", brand: "SolarBox", stock: 15, unit: "ตู้", status: "พร้อมใช้งาน" },
    { sku: "CBX-DC-4S", name: "DC Combiner Box 4 String", brand: "ABB", stock: 9, unit: "ตู้", status: "ใกล้หมด" },
    { sku: "CBX-DC-8S", name: "DC Combiner Box 8 String", brand: "Schneider Electric", stock: 5, unit: "ตู้", status: "ใกล้หมด" },
    { sku: "CBX-AC", name: "AC Combiner Box", brand: "Hager", stock: 12, unit: "ตู้", status: "พร้อมใช้งาน" },
    { sku: "CBX-ENC", name: "Combiner Box Enclosure", brand: "Rittal", stock: 0, unit: "ตู้", status: "หมดสต๊อก" }
  ],
  "Breaker DC": [
    { sku: "BDC-2P-32", name: "DC Breaker 2P 32A", brand: "Schneider Electric", stock: 48, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BDC-2P-63", name: "DC Breaker 2P 63A", brand: "ABB", stock: 18, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BDC-1000V", name: "DC Breaker 1000V", brand: "Noark", stock: 8, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "BDC-ISO-SW", name: "DC Isolator Switch", brand: "IMO", stock: 20, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BDC-FUSE-HLD", name: "DC Fuse Holder", brand: "Mersen", stock: 0, unit: "ตัว", status: "หมดสต๊อก" }
  ],
  "Breaker AC": [
    { sku: "BAC-1P-32", name: "AC Breaker 1P 32A", brand: "Schneider Electric", stock: 55, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BAC-2P-63", name: "AC Breaker 2P 63A", brand: "ABB", stock: 21, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "BAC-3P-100", name: "AC Breaker 3P 100A", brand: "Hager", stock: 6, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "BAC-RCCB-2P", name: "RCCB 2P", brand: "Schneider Electric", stock: 0, unit: "ตัว", status: "หมดสต๊อก" },
    { sku: "BAC-RCBO-1PN", name: "RCBO 1P+N", brand: "ABB", stock: 14, unit: "ตัว", status: "พร้อมใช้งาน" }
  ],
  "Surge Protection": [
    { sku: "SPD-DC-T2", name: "DC SPD Type 2", brand: "Phoenix Contact", stock: 19, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "SPD-AC-T2", name: "AC SPD Type 2", brand: "ABB", stock: 11, unit: "ตัว", status: "พร้อมใช้งาน" },
    { sku: "SPD-ARR-1000", name: "Surge Arrester 1000V", brand: "Citel", stock: 5, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "SPD-LPB", name: "Lightning Protection Box", brand: "Kumwell", stock: 3, unit: "ตู้", status: "ใกล้หมด" },
    { sku: "SPD-FUSE-HLD", name: "SPD Fuse Holder", brand: "Mersen", stock: 0, unit: "ตัว", status: "หมดสต๊อก" }
  ],
  "Grounding": [
    { sku: "GRD-ROD-58", name: "Ground Rod 5/8 inch", brand: "Kumwell", stock: 80, unit: "แท่ง", status: "พร้อมใช้งาน" },
    { sku: "GRD-WIRE-16", name: "Ground Wire 16 sq.mm", brand: "Thai Yazaki", stock: 240, unit: "เมตร", status: "พร้อมใช้งาน" },
    { sku: "GRD-CLAMP", name: "Ground Clamp", brand: "Kumwell", stock: 16, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "GRD-PIT-COV", name: "Earth Pit Cover", brand: "Kumwell", stock: 9, unit: "ฝา", status: "ใกล้หมด" },
    { sku: "GRD-TEST-BOX", name: "Ground Test Box", brand: "Solar Safety", stock: 0, unit: "กล่อง", status: "หมดสต๊อก" }
  ],
  "เครื่องมือช่าง": [
    { sku: "TLS-MC4-CRP", name: "MC4 Crimping Tool", brand: "IWISS", stock: 12, unit: "ชุด", status: "พร้อมใช้งาน" },
    { sku: "TLS-CBL-CUT", name: "Solar Cable Cutter", brand: "Knipex", stock: 8, unit: "ตัว", status: "ใกล้หมด" },
    { sku: "TLS-MULTI", name: "Digital Multimeter", brand: "Fluke", stock: 6, unit: "เครื่อง", status: "ใกล้หมด" },
    { sku: "TLS-INS-TEST", name: "Insulation Tester", brand: "Hioki", stock: 0, unit: "เครื่อง", status: "หมดสต๊อก" },
    { sku: "TLS-TORQUE", name: "Torque Wrench", brand: "Tohnichi", stock: 10, unit: "ตัว", status: "พร้อมใช้งาน" }
  ]
};

export const solarProducts: SolarProduct[] = Object.entries(productsByCategory).flatMap(([category, products], categoryIndex) =>
  products.map((product, productIndex) => ({
    id: categoryIndex * 100 + productIndex + 1,
    category: category as SolarProductCategoryName,
    image: getSolarProductImage(category as SolarProductCategoryName),
    ...product
  }))
);

export function getSolarProductImage(category: SolarProductCategoryName) {
  return productImages[category] ?? "/products/placeholder.svg";
}
