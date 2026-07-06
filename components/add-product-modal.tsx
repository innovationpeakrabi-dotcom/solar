import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ImagePlus, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import type { NewSolarProductInput, SolarCategory, SolarProductCategoryName, SolarProductStatus } from "@/types/solar-product";

type AddProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory: SolarProductCategoryName;
  categories: SolarCategory[];
  onSubmit: (product: NewSolarProductInput) => void;
};

type AddProductForm = Pick<NewSolarProductInput, "name" | "category" | "stock" | "unit" | "image">;

const initialForm = (category: SolarProductCategoryName): AddProductForm => ({
  name: "",
  category,
  stock: 0,
  unit: "ชิ้น",
  image: ""
});

export function AddProductModal({ open, onOpenChange, defaultCategory, categories, onSubmit }: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<AddProductForm>(() => initialForm(defaultCategory));
  const [stockText, setStockText] = useState("0");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const computedStatus = useMemo(() => getStatusFromStock(Number(stockText)), [stockText]);

  useEffect(() => {
    if (open) {
      resetForm(defaultCategory);
    }
  }, [defaultCategory, open]);

  const updateField = <Key extends keyof AddProductForm>(key: Key, value: AddProductForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetForm(defaultCategory, { revokePreview: true });
    }
  };

  const resetForm = (category: SolarProductCategoryName, options: { revokePreview?: boolean } = {}) => {
    if (options.revokePreview && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm(category));
    setStockText("0");
    setSelectedImage(null);
    setImagePreview("");
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);
    updateField("image", previewUrl);
  };

  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");
    updateField("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const stock = Number(stockText);
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.category || categories.length === 0) nextErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!Number.isFinite(stock) || stock < 0) nextErrors.stock = "จำนวนต้องเป็นตัวเลขและไม่ติดลบ";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      sku: `TEMP-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      brand: "-",
      stock,
      unit: form.unit.trim() || "ชิ้น",
      image: form.image.trim(),
      note: ""
    });

    resetForm(form.category, { revokePreview: false });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(720px,calc(100vw-32px))] max-w-none overflow-y-auto p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-950">
            <PackagePlus className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3">เพิ่มรายการสินค้าใหม่</DialogTitle>
          <DialogDescription>บันทึกรายการสินค้าไว้ในหน้านี้ชั่วคราว โดยยังไม่เชื่อมต่อฐานข้อมูลหรือ API</DialogDescription>
        </DialogHeader>

        <form className="space-y-5 p-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-3">
              <Label>รูปภาพสินค้า</Label>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex aspect-square items-center justify-center p-3">
                  {imagePreview ? (
                    <img src={imagePreview} alt={selectedImage?.name ?? form.name} className="h-full w-full rounded-md object-contain" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900">
                      <ImagePlus className="h-10 w-10 text-slate-400" />
                      <p className="mt-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">เลือกรูปภาพสินค้า</p>
                      <p className="mt-1 px-4 text-xs text-slate-400">ใช้ preview ชั่วคราวก่อนบันทึก</p>
                    </div>
                  )}
                </div>
                {selectedImage ? (
                  <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">
                    <p className="truncate">{selectedImage.name}</p>
                  </div>
                ) : null}
              </div>
              <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={handleImageChange} />
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  เปลี่ยนรูป
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={removeSelectedImage} disabled={!imagePreview}>
                  <Trash2 className="h-3.5 w-3.5" />
                  ลบรูป
                </Button>
              </div>
            </div>

            <div className="grid content-start gap-4 md:grid-cols-2">
              <Field label="ชื่อสินค้า" error={errors.name}>
                <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="เช่น Solar Panel 700W" />
              </Field>

              <Field label="หมวดหมู่" error={errors.category}>
                <Select
                  value={form.category}
                  disabled={categories.length === 0}
                  onChange={(event) => updateField("category", event.target.value as SolarProductCategoryName)}
                >
                  {categories.length === 0 ? <option value="">ยังไม่มีหมวดหมู่</option> : null}
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="จำนวนคงเหลือ" error={errors.stock}>
                <Input
                  min={0}
                  type="number"
                  value={stockText}
                  onChange={(event) => {
                    setStockText(event.target.value);
                    setErrors((current) => ({ ...current, stock: "" }));
                  }}
                  placeholder="0"
                />
              </Field>

              <Field label="หน่วยนับ">
                <Input value={form.unit} onChange={(event) => updateField("unit", event.target.value)} placeholder="เช่น ชิ้น, แผง, เมตร" />
              </Field>

              <Field label="สถานะ">
                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {computedStatus}
                </div>
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-yellow-400 text-slate-950 hover:bg-yellow-300">
              บันทึกสินค้า
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

export function getStatusFromStock(stock: number): SolarProductStatus {
  if (stock === 0) return "หมดสต๊อก";
  if (stock <= 5) return "ใกล้หมด";
  return "พร้อมใช้งาน";
}
