import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/hooks/use-inventory";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SolarProduct, SolarProductStatus } from "@/types/solar-product";

const allCategories = "ทั้งหมด";

export function SolarEquipmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { categories, products, loadingProducts, productsError } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(allCategories);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesCategory = categoryId === allCategories || item.categoryId === categoryId;
      const matchesSearch =
        query.length === 0 ||
        [item.sku, item.name, item.category, item.status, item.unit].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [categoryId, products, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-[min(1180px,calc(100vw-32px))] max-w-none flex-col overflow-hidden p-0">
        <DialogTitle className="sr-only">รายการอุปกรณ์สำหรับงานติดตั้งระบบผลิตไฟฟ้าจากแสงอาทิตย์</DialogTitle>

        <div className="border-b border-slate-200 bg-slate-50 p-4 pr-14 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาสินค้า หมวดหมู่ หรือสถานะ..." />
            </div>
            <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value={allCategories}>{allCategories}</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <SummaryPill label="ทั้งหมด" value={products.length} />
            <SummaryPill label="พร้อมใช้งาน" value={products.filter((item) => item.status === "พร้อมใช้งาน").length} />
            <SummaryPill label="ใกล้หมด" value={products.filter((item) => item.status === "ใกล้หมด").length} />
            <SummaryPill label="หมดสต๊อก" value={products.filter((item) => item.status === "หมดสต๊อก").length} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {productsError ? (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
              {productsError}
            </div>
          ) : null}

          <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
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
                    <TableCell>{item.category || "-"}</TableCell>
                    <TableCell className="text-right font-semibold">{formatNumber(item.stock)}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <EquipmentStatusBadge status={item.status} />
                    </TableCell>
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

          {!loadingProducts && filteredItems.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
              ไม่พบรายการอุปกรณ์ตามเงื่อนไขที่เลือก
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EquipmentCard({ item }: { item: SolarProduct }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">{item.sku}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{item.name}</h3>
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

function EquipmentStatusBadge({ status }: { status: SolarProductStatus }) {
  const styles: Record<SolarProductStatus, string> = {
    "พร้อมใช้งาน": "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900",
    "ใกล้หมด": "bg-yellow-50 text-yellow-700 ring-yellow-100 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-900",
    "หมดสต๊อก": "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900"
  };

  return <span className={cn("shrink-0 rounded-md px-2 py-1 text-xs font-semibold ring-1", styles[status])}>{status}</span>;
}
