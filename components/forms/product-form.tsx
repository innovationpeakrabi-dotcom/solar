import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { ImagePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { getSolarProductImage } from "@/data/solar-products";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { validateProductImageFile } from "@/lib/product-images";
import type { SolarProductStatus } from "@/types/solar-product";

function getStatusFromStock(stock: number): SolarProductStatus {
  if (stock <= 0) return "หมดสต๊อก";
  if (stock <= 5) return "ใกล้หมด";
  return "พร้อมใช้งาน";
}

export function ProductForm() {
  const { categories, addProduct } = useInventory();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("ชิ้น");
  const [stock, setStock] = useState("0");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const validation = validateProductImageFile(file);
    if (!validation.ok) {
      setImageFile(null);
      setUploadError(validation.message);
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImage("");
    setUploadError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const stockNumber = Number(stock);
    if (!name.trim()) {
      toast({ title: "กรุณากรอกชื่อสินค้า" });
      return;
    }
    if (!category) {
      toast({ title: "กรุณาเลือกหมวดหมู่" });
      return;
    }
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      toast({ title: "จำนวนคงเหลือต้องเป็นตัวเลขและไม่ติดลบ" });
      return;
    }

    setSubmitting(true);
    setUploadError("");

    const result = await addProduct({
      name: name.trim(),
      category,
      stock: stockNumber,
      unit,
      status: getStatusFromStock(stockNumber),
      image: imageFile ? "" : image.trim() || getSolarProductImage(category),
      imageFile
    });

    setSubmitting(false);

    toast({ title: result.ok ? "บันทึกสินค้าใน Supabase แล้ว" : result.message ?? "บันทึกสินค้าไม่สำเร็จ" });

    if (!result.ok) setUploadError(result.message ?? "บันทึกสินค้าไม่สำเร็จ");

    if (result.ok) {
      setName("");
      setStock("0");
      setImage("");
      setImageFile(null);
      setUploadError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form className="grid gap-6 lg:grid-cols-[360px_1fr]" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>รูปสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900">
            <ImagePlus className="h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">รูปสินค้า</p>
            <p className="mt-1 text-xs text-slate-500">ใช้ URL รูปหรือ placeholder ตามหมวดหมู่</p>
          </div>
          <Field label="Image URL">
            <Input value={image} onChange={(event) => setImage(event.target.value)} placeholder="/products/solar.png" disabled={Boolean(imageFile) || submitting} />
          </Field>
          <Field label="Image Upload">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleImageFileChange}
              disabled={submitting}
            />
            {imageFile ? <p className="mt-2 truncate text-xs text-slate-500">{imageFile.name}</p> : null}
            {uploadError ? <p className="mt-2 text-xs font-medium text-rose-600">{uploadError}</p> : null}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Field label="ชื่อสินค้า" className="md:col-span-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="ระบุชื่อสินค้า" />
          </Field>
          <Field label="หมวดหมู่">
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="หน่วย">
            <Input value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="ชิ้น / เครื่อง / ชุด" />
          </Field>
          <Field label="จำนวนคงเหลือ">
            <Input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" />
          </Field>
          <Field label="สถานะ">
            <Input value={getStatusFromStock(Number(stock) || 0)} readOnly />
          </Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline">
              ยกเลิก
            </Button>
            {submitting && imageFile ? <span className="self-center text-sm font-medium text-slate-600 dark:text-slate-300">กำลังอัปโหลดรูป...</span> : null}
            <Button type="submit" disabled={submitting}>
              <Save className="h-4 w-4" />
              บันทึกสินค้า
            </Button>
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
