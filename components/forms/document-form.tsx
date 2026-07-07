import type { ReactNode } from "react";
import { Plus, Printer, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";

export function DocumentForm({ type }: { type: "in" | "out" }) {
  const { toast } = useToast();
  const { products } = useInventory();
  const isIn = type === "in";
  const documentLines = products.slice(0, 3).map((product) => ({
    id: product.id,
    productName: product.name,
    sku: product.sku,
    quantity: Math.max(1, Math.min(product.stock || 1, 10))
  }));

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        toast({
          title: isIn ? "บันทึกรับสินค้าเข้าแล้ว" : "บันทึกเบิกสินค้าออกแล้ว",
          description: "ตัวอย่างฟอร์มใช้รายการสินค้าจาก Supabase"
        });
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{isIn ? "เอกสารรับสินค้าเข้า" : "เอกสารเบิกสินค้าออก"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <Field label="เลขที่เอกสาร">
            <Input defaultValue={isIn ? "GR-2026-0703-002" : "GI-2026-0703-005"} />
          </Field>
          <Field label="วันที่">
            <Input type="date" defaultValue="2026-07-03" />
          </Field>
          <Field label={isIn ? "ผู้จำหน่าย" : "แผนกผู้เบิก"}>
            <Select defaultValue={isIn ? "Supabase Supplier" : "Operations"}>
              <option>Supabase Supplier</option>
              <option>Operations</option>
              <option>Finance</option>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>รายการสินค้า</CardTitle>
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            เพิ่มรายการ
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>รหัสสินค้า</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead className="text-right">ลบ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="min-w-64 font-medium text-slate-950 dark:text-white">{line.productName}</TableCell>
                  <TableCell>{line.sku}</TableCell>
                  <TableCell className="text-right font-semibold">{line.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="icon" aria-label="ลบรายการ">
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 p-5 dark:border-slate-800">
          <Button type="button" variant="outline">
            <Printer className="h-4 w-4" />
            พิมพ์
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            บันทึกเอกสาร
          </Button>
        </div>
      </Card>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
