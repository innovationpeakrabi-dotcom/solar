import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { SolarProduct, SolarProductStatus } from "@/types/solar-product";

type ProductTableProps = {
  products: SolarProduct[];
  compact?: boolean;
  onView?: (product: SolarProduct) => void;
  onEdit?: (product: SolarProduct) => void;
  onDelete?: (product: SolarProduct) => void;
};

export function ProductTable({ products, compact = false, onView, onEdit, onDelete }: ProductTableProps) {
  const rows = compact ? products.slice(0, 5) : products;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>สินค้า</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>หน่วย</TableHead>
              <TableHead className="text-right">คงเหลือ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex min-w-56 items-center gap-3">
                    <img
                      src={product.image || "/products/placeholder.svg"}
                      alt={product.name}
                      className="h-11 w-11 rounded-md object-contain ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <p className="truncate font-medium text-slate-950 dark:text-white">{product.name}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(product.stock)}</TableCell>
                <TableCell>
                  <ProductSupabaseStatusBadge status={product.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="ดูสินค้า" onClick={() => onView?.(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="แก้ไขสินค้า" onClick={() => onEdit?.(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="ลบสินค้า" onClick={() => onDelete?.(product)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function ProductSupabaseStatusBadge({ status }: { status: SolarProductStatus }) {
  const variantByStatus: Record<SolarProductStatus, "green" | "amber" | "red"> = {
    "พร้อมใช้งาน": "green",
    "ใกล้หมด": "amber",
    "หมดสต๊อก": "red"
  };

  return <Badge variant={variantByStatus[status]}>{status}</Badge>;
}
