import type { SolarCategory } from "@/types/solar-product";

export const solarCategories: SolarCategory[] = [
  {
    id: "solar-panel",
    name: "แผงโซลาร์เซลล์",
    description: "แผง Mono, Half Cell, Bifacial และแผงเฉพาะงานสำหรับระบบผลิตไฟฟ้าจากแสงอาทิตย์",
    icon: "☀️",
    color: "#FACC15"
  },
  {
    id: "inverter",
    name: "อินเวอร์เตอร์",
    description: "อุปกรณ์แปลงไฟสำหรับระบบ Grid Tie, Hybrid, String, Micro และ Off Grid",
    icon: "⚡",
    color: "#2563EB"
  },
  {
    id: "battery",
    name: "แบตเตอรี่",
    description: "แบตเตอรี่และอุปกรณ์ประกอบสำหรับระบบสำรองพลังงาน Solar",
    icon: "🔋",
    color: "#16A34A"
  },
  {
    id: "mounting",
    name: "โครงสร้างติดตั้ง",
    description: "ราง แคลมป์ และอุปกรณ์ยึดแผงสำหรับหลังคาและโครงสร้างติดตั้งภาคสนาม",
    icon: "▰",
    color: "#64748B"
  },
  {
    id: "dc-cable",
    name: "สายไฟ DC",
    description: "สาย PV และสายไฟฝั่ง DC สำหรับเชื่อมต่อแผงเข้าระบบควบคุม",
    icon: "DC",
    color: "#F97316"
  },
  {
    id: "ac-cable",
    name: "สายไฟ AC",
    description: "สายไฟ AC สำหรับเดินระบบจากอินเวอร์เตอร์เข้าสู่ตู้ไฟและโหลดปลายทาง",
    icon: "AC",
    color: "#06B6D4"
  },
  {
    id: "mc4",
    name: "MC4 Connector",
    description: "หัวต่อ MC4 และอุปกรณ์ประกอบสำหรับการเข้าสาย Solar ภาคสนาม",
    icon: "MC4",
    color: "#0EA5E9"
  },
  {
    id: "combiner-box",
    name: "Combiner Box",
    description: "ตู้รวมสาย DC/AC สำหรับจัดการ string และจุดป้องกันในระบบ Solar",
    icon: "▣",
    color: "#7C3AED"
  },
  {
    id: "breaker-dc",
    name: "Breaker DC",
    description: "เบรกเกอร์และสวิตช์ตัดตอนฝั่ง DC สำหรับงาน Solar โดยเฉพาะ",
    icon: "B",
    color: "#DC2626"
  },
  {
    id: "breaker-ac",
    name: "Breaker AC",
    description: "เบรกเกอร์ RCCB และ RCBO ฝั่ง AC สำหรับควบคุมและป้องกันวงจร",
    icon: "AC",
    color: "#EA580C"
  },
  {
    id: "surge-protection",
    name: "Surge Protection",
    description: "อุปกรณ์ป้องกันไฟกระชากและฟ้าผ่าสำหรับฝั่ง DC/AC",
    icon: "SPD",
    color: "#EAB308"
  },
  {
    id: "grounding",
    name: "Grounding",
    description: "หลักดิน สายดิน แคลมป์ และอุปกรณ์ตรวจสอบระบบกราวด์",
    icon: "⏚",
    color: "#059669"
  },
  {
    id: "tools",
    name: "เครื่องมือช่าง",
    description: "เครื่องมือสำหรับช่างติดตั้ง Solar เช่น คีมย้ำ MC4 เครื่องวัด และประแจแรงบิด",
    icon: "🛠",
    color: "#475569"
  }
];
