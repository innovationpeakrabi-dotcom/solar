import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SolarCategory } from "@/types/solar-product";

type CategoryTableProps = {
  categories: SolarCategory[];
  getProductCount: (categoryName: string) => number;
  onEdit: (category: SolarCategory) => void;
  onDelete: (category: SolarCategory) => void;
};

export function CategoryTable({ categories, getProductCount, onEdit, onDelete }: CategoryTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/80">
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>คำอธิบาย</TableHead>
              <TableHead>สี</TableHead>
              <TableHead className="text-right">จำนวนสินค้า</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="transition-colors hover:bg-orange-50/50 dark:hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={category} />
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{category.name}</p>
                      <p className="text-xs text-slate-500">{category.icon || "ไม่มีไอคอน"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-slate-500 dark:text-slate-400">{category.description || "-"}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full ring-4 ring-slate-100 dark:ring-slate-800" style={{ backgroundColor: category.color }} />
                    <span className="font-mono text-xs text-slate-500">{category.color}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="blue">{getProductCount(category.name)} รายการ</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" aria-label="แก้ไขหมวดหมู่" onClick={() => onEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="ลบหมวดหมู่" onClick={() => onDelete(category)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {categories.map((category) => (
          <article key={category.id} className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_16px_46px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/75">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <CategoryIcon category={category} />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-950 dark:text-white">{category.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{category.description || "-"}</p>
                </div>
              </div>
              <Badge variant="blue">{getProductCount(category.name)}</Badge>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onEdit(category)}>
                <Pencil className="h-4 w-4" />
                แก้ไข
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => onDelete(category)}>
                <Trash2 className="h-4 w-4 text-rose-500" />
                ลบ
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function CategoryIcon({ category }: { category: SolarCategory }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]" style={{ backgroundColor: category.color }}>
      {category.icon || category.name.slice(0, 2)}
    </span>
  );
}
