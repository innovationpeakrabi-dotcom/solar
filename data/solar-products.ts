import type { SolarProductCategoryName } from "@/types/solar-product";

const productImages: Record<string, string> = {
  "อุปกรณ์ Solar": "/products/solar.png",
  "อุปกรณ์เครื่องมือช่าง": "/products/tools.png",
  "อุปกรณ์ภายในอาคาร": "/products/electrical.png",
  "แผงโซลาร์เซลล์": "/products/solar-panel.svg",
  "อินเวอร์เตอร์": "/products/inverter.svg",
  "แบตเตอรี่": "/products/battery.svg",
  "สายไฟ DC": "/products/cable.svg",
  "สายไฟ AC": "/products/cable.svg",
  "MC4 Connector": "/products/cable.svg",
  "Combiner Box": "/products/breaker.svg",
  "Breaker DC": "/products/breaker.svg",
  "Breaker AC": "/products/breaker.svg",
  "Surge Protection": "/products/breaker.svg",
  Grounding: "/products/mounting.svg",
  "โครงสร้างติดตั้ง": "/products/mounting.svg",
  "เครื่องมือช่าง": "/products/tools.svg"
};

export function getSolarProductImage(category: SolarProductCategoryName) {
  return productImages[category] ?? "/products/placeholder.svg";
}
