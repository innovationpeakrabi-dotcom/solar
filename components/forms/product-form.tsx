import type { ReactNode } from "react";
import { ImagePlus, Save } from "lucide-react";
import { categories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ProductForm() {
  const { toast } = useToast();

  return (
    <form
      className="grid gap-6 lg:grid-cols-[360px_1fr]"
      onSubmit={(event) => {
        event.preventDefault();
        toast({ title: "บันทึกสินค้าใหม่แล้ว", description: "Mock UI พร้อมต่อ API ในอนาคต" });
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>รูปสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900">
            <ImagePlus className="h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">อัปโหลดรูปสินค้า</p>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG สูงสุด 5MB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Field label="รหัสสินค้า"><Input defaultValue="ITM-1007" /></Field>
          <Field label="Barcode"><Input defaultValue="8850123456787" /></Field>
          <Field label="ชื่อสินค้า" className="md:col-span-2"><Input placeholder="ระบุชื่อสินค้า" /></Field>
          <Field label="หมวดหมู่">
            <Select defaultValue={categories[0].name}>
              {categories.map((category) => <option key={category.id}>{category.name}</option>)}
            </Select>
          </Field>
          <Field label="หน่วย"><Input placeholder="ชิ้น / กล่อง / รีม" /></Field>
          <Field label="จำนวนเริ่มต้น"><Input type="number" placeholder="0" /></Field>
          <Field label="จุดสั่งซื้อขั้นต่ำ"><Input type="number" placeholder="0" /></Field>
          <Field label="หมายเหตุ" className="md:col-span-2"><Textarea placeholder="รายละเอียดเพิ่มเติม เช่น เงื่อนไขการจัดเก็บ" /></Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline">ยกเลิก</Button>
            <Button type="submit"><Save className="h-4 w-4" />บันทึกสินค้า</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
