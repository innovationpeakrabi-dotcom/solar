import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { solarEquipment, solarEquipmentCategories } from "@/data/solar-equipment";
import type { SolarEquipment, SolarEquipmentCategory, SolarEquipmentStatus } from "@/types/equipment";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const allCategories = "ทั้งหมด";

export function SolarEquipmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SolarEquipmentCategory | typeof allCategories>(allCategories);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return solarEquipment.filter((item) => {
      const matchesCategory = category === allCategories || item.category === category;
      const matchesSearch =
        query.length === 0 ||
        [item.sku, item.name, item.category, item.brand, item.status].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-[min(1180px,calc(100vw-32px))] max-w-none flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex w-fit items-center gap-2 rounded-md bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-100 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-900">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Solar Installation Equipment
          </div>
          <DialogTitle className="mt-3">รายการอุปกรณ์สำหรับงานติดตั้งระบบผลิตไฟฟ้าจากแสงอาทิตย์</DialogTitle>
          <DialogDescription>ค้นหาและกรองรายการสินค้า mock สำหรับงานติดตั้งระบบ Solar พร้อมมุมมองที่เหมาะกับทีมคลังและทีมติดตั้ง</DialogDescription>
        </DialogHeader>

        <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหารหัสสินค้า, ชื่อสินค้า, ยี่ห้อ, สถานะ..." />
            </div>
            <Select value={category} onChange={(event) => setCategory(event.target.value as SolarEquipmentCategory | typeof allCategories)}>
              <option value={allCategories}>{allCategories}</option>
              {solarEquipmentCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <SummaryPill label="ทั้งหมด" value={solarEquipment.length} />
            <SummaryPill label="แสดงผล" value={filteredItems.length} />
            <SummaryPill label="ใกล้หมด" value={solarEquipment.filter((item) => item.status === "ใกล้หมด").length} />
            <SummaryPill label="หมดสต๊อก" value={solarEquipment.filter((item) => item.status === "หมดสต๊อก").length} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ยี่ห้อ</TableHead>
                  <TableHead className="text-right">จำนวนคงเหลือ</TableHead>
                  <TableHead>หน่วย</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{item.sku}</TableCell>
                    <TableCell className="font-medium text-slate-950 dark:text-white">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell className="text-right font-semibold">{formatNumber(item.stock)}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell><EquipmentStatusBadge status={item.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden">
            {filteredItems.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
              ไม่พบรายการอุปกรณ์ตามเงื่อนไขที่เลือก
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EquipmentCard({ item }: { item: SolarEquipment }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">{item.sku}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{item.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{item.brand}</p>
        </div>
        <EquipmentStatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200">{item.category}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs text-slate-500">จำนวนคงเหลือ</p>
          <p className="mt-1 font-semibold text-slate-950 dark:text-white">{formatNumber(item.stock)}</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs text-slate-500">หน่วย</p>
          <p className="mt-1 font-semibold text-slate-950 dark:text-white">{item.unit}</p>
        </div>
      </div>
    </article>
  );
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800">
      {label}: {formatNumber(value)}
    </span>
  );
}

function EquipmentStatusBadge({ status }: { status: SolarEquipmentStatus }) {
  const styles = {
    "พร้อมใช้งาน": "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900",
    "ใกล้หมด": "bg-yellow-50 text-yellow-700 ring-yellow-100 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-900",
    "หมดสต๊อก": "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900"
  };

  return <span className={cn("shrink-0 rounded-md px-2 py-1 text-xs font-semibold ring-1", styles[status])}>{status}</span>;
}
