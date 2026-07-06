import { Eye, Pencil, Trash2 } from "lucide-react";
import { products } from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductStatusBadge } from "@/components/status-badge";
import { useToast } from "@/hooks/use-toast";

export function ProductTable({ compact = false }: { compact?: boolean }) {
  const { toast } = useToast();
  const rows = compact ? products.slice(0, 5) : products;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>สินค้า</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>รหัส</TableHead>
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
                    <img src={product.image} alt={product.name} className="h-11 w-11 rounded-md object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-950 dark:text-white">{product.name}</p>
                      <p className="truncate text-xs text-slate-500">{product.supplier}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(product.stock)}</TableCell>
                <TableCell><ProductStatusBadge status={product.status} /></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="ดูสินค้า" onClick={() => toast({ title: "เปิดรายละเอียดสินค้า", description: product.name })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="แก้ไขสินค้า" onClick={() => toast({ title: "พร้อมแก้ไขสินค้า", description: product.sku })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="ลบสินค้า" onClick={() => toast({ title: "แสดง Dialog ยืนยันลบ", description: "ตัวอย่างนี้ยังไม่ลบข้อมูลจริง" })}>
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
