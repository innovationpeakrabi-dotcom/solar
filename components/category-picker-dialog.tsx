import { useState } from "react";
import {
  BatteryCharging,
  Cable,
  Drill,
  HardHat,
  Home,
  Lightbulb,
  PanelTop,
  PlugZap,
  ShieldCheck,
  SunMedium,
  Wrench,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type InventoryCategorySelection = {
  topic: string;
  category: string;
  description: string;
};

type Topic = {
  id: string;
  title: string;
  description: string;
  icon: typeof SunMedium;
  categories: Array<{
    name: string;
    description: string;
    icon: typeof SunMedium;
    stock: string;
  }>;
};

const topics: Topic[] = [
  {
    id: "tools",
    title: "อุปกรณ์เครื่องมือ",
    description: "เครื่องมือช่าง เครื่องมือวัด และอุปกรณ์ความปลอดภัย",
    icon: Wrench,
    categories: [
      { name: "เครื่องมือช่าง", description: "สว่าน ไขควง คีม ประแจ และชุดเครื่องมือ", icon: Drill, stock: "184 SKU" },
      { name: "เครื่องมือวัดไฟ", description: "มัลติมิเตอร์ Clamp meter และเครื่องวัดฉนวน", icon: Zap, stock: "42 SKU" },
      { name: "อุปกรณ์ Safety", description: "หมวก ถุงมือ เข็มขัดนิรภัย และ PPE", icon: HardHat, stock: "96 SKU" },
      { name: "อะไหล่ติดตั้ง", description: "น็อต พุก ราง สกรู และอุปกรณ์ยึดจับ", icon: Wrench, stock: "238 SKU" }
    ]
  },
  {
    id: "solar",
    title: "อุปกรณ์ Solar",
    description: "อุปกรณ์หลักสำหรับระบบพลังงานแสงอาทิตย์",
    icon: SunMedium,
    categories: [
      { name: "แผงโซลาร์", description: "Mono, Half-cell, Bifacial และแผงกำลังสูง", icon: PanelTop, stock: "428 แผง" },
      { name: "อินเวอร์เตอร์", description: "String inverter, Hybrid inverter และ Micro inverter", icon: PlugZap, stock: "32 เครื่อง" },
      { name: "แบตเตอรี่", description: "Lithium battery, Rack battery และ BMS", icon: BatteryCharging, stock: "18 ชุด" },
      { name: "อุปกรณ์ DC Protection", description: "Combiner box, Fuse, SPD และ DC breaker", icon: ShieldCheck, stock: "76 SKU" }
    ]
  },
  {
    id: "indoor",
    title: "อุปกรณ์ภายในอาคาร",
    description: "ระบบไฟฟ้าและอุปกรณ์ติดตั้งภายในอาคาร",
    icon: Home,
    categories: [
      { name: "ตู้ไฟและเบรกเกอร์", description: "Consumer unit, MDB, MCB, RCBO และ MCCB", icon: ShieldCheck, stock: "64 SKU" },
      { name: "สายไฟ AC", description: "THW, VCT, NYY และสายควบคุม", icon: Cable, stock: "120 ม้วน" },
      { name: "โคมไฟและหลอดไฟ", description: "LED panel, Downlight, Highbay และ Emergency light", icon: Lightbulb, stock: "310 ชิ้น" },
      { name: "Smart Meter", description: "มิเตอร์ดิจิทัล ระบบวัดพลังงาน และ CT", icon: Zap, stock: "28 เครื่อง" }
    ]
  },
  {
    id: "outdoor",
    title: "อุปกรณ์ภายนอกอาคาร",
    description: "งานติดตั้งกลางแจ้ง กันน้ำ และเดินระบบภายนอก",
    icon: Cable,
    categories: [
      { name: "ท่อและรางเดินสาย", description: "EMT, IMC, HDPE, Wireway และ Cable tray", icon: Cable, stock: "156 SKU" },
      { name: "กล่องกันน้ำ", description: "Weatherproof box, Junction box และตู้ Outdoor", icon: ShieldCheck, stock: "88 SKU" },
      { name: "สายกราวด์และ Lightning", description: "Ground rod, Ground wire และอุปกรณ์กันฟ้าผ่า", icon: Zap, stock: "54 SKU" },
      { name: "Mounting ภายนอก", description: "โครงยึดหลังคา Standing seam และ Ground mount", icon: PanelTop, stock: "92 SKU" }
    ]
  }
];

export function CategoryPickerDialog({
  open,
  onOpenChange,
  selected,
  onSelect
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: InventoryCategorySelection;
  onSelect: (selection: InventoryCategorySelection) => void;
}) {
  const [activeTopicId, setActiveTopicId] = useState(topics[1].id);
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(980px,calc(100vw-32px))] max-w-none p-0">
        <DialogHeader className="border-b border-slate-200 p-5 pr-12 dark:border-slate-800">
          <DialogTitle>เลือกหัวข้อและหมวดหมู่สินค้า</DialogTitle>
          <DialogDescription>เลือกกลุ่มสินค้าเพื่อกรอง Dashboard และใช้เป็นค่าเริ่มต้นในเอกสารสต๊อก</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[72vh] min-h-[520px] overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 md:border-b-0 md:border-r">
            <div className="space-y-2">
              {topics.map((topic) => {
                const Icon = topic.icon;
                const active = topic.id === activeTopicId;

                return (
                  <button
                    key={topic.id}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all",
                      active
                        ? "bg-white text-slate-950 shadow-sm ring-1 ring-yellow-300 dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:bg-white/80 dark:text-slate-300 dark:hover:bg-slate-900"
                    )}
                    onClick={() => setActiveTopicId(topic.id)}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        active ? "bg-yellow-100 text-yellow-700" : "bg-slate-200 text-slate-500 dark:bg-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{topic.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{topic.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-y-auto p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">หัวข้อที่เลือก</p>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{activeTopic.title}</h3>
              </div>
              <div className="rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">
                ปัจจุบัน: {selected.category}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {activeTopic.categories.map((category) => {
                const Icon = category.icon;
                const active = selected.topic === activeTopic.title && selected.category === category.name;

                return (
                  <button
                    key={category.name}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all duration-200",
                      active
                        ? "border-yellow-400 bg-yellow-50 shadow-soft dark:bg-yellow-400/10"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
                    )}
                    onClick={() => {
                      onSelect({
                        topic: activeTopic.title,
                        category: category.name,
                        description: category.description
                      });
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-yellow-300 dark:bg-yellow-300 dark:text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                        {category.stock}
                      </span>
                    </div>
                    <p className="mt-4 font-semibold text-slate-950 dark:text-white">{category.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
