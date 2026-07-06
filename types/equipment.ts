export type SolarEquipmentStatus = "พร้อมใช้งาน" | "ใกล้หมด" | "หมดสต๊อก";

export type SolarEquipmentCategory =
  | "แผงโซลาร์เซลล์"
  | "อินเวอร์เตอร์"
  | "โครงสร้างติดตั้ง"
  | "สายไฟ DC"
  | "สายไฟ AC"
  | "ตู้ Combiner Box"
  | "Breaker DC"
  | "Breaker AC"
  | "Surge Protection Device"
  | "Ground Rod"
  | "MC4 Connector"
  | "Battery"
  | "Charge Controller"
  | "อุปกรณ์เดินสาย"
  | "เครื่องมือช่างติดตั้ง";

export type SolarEquipment = {
  id: number;
  sku: string;
  name: string;
  category: SolarEquipmentCategory;
  brand: string;
  stock: number;
  unit: string;
  status: SolarEquipmentStatus;
};
