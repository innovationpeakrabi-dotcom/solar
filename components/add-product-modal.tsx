import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ImagePlus, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { PRODUCT_IMAGE_FALLBACK, validateProductImageFile } from "@/lib/product-images";
import type { NewSolarProductInput, SolarCategory, SolarProduct, SolarProductCategoryName, SolarProductStatus } from "@/types/solar-product";

type AddProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory: SolarProductCategoryName;
  categories: SolarCategory[];
  product?: SolarProduct | null;
  title?: string;
  submitLabel?: string;
  onSubmit: (product: NewSolarProductInput) => void | { ok: boolean; message?: string } | Promise<void | { ok: boolean; message?: string }>;
};

type AddProductForm = Pick<NewSolarProductInput, "name" | "category" | "stock" | "unit" | "image">;

const initialForm = (category: SolarProductCategoryName, product?: SolarProduct | null): AddProductForm => ({
  name: product?.name ?? "",
  category: product?.category || category,
  stock: product?.stock ?? 0,
  unit: product?.unit ?? "ชิ้น",
  image: product?.image ?? ""
});

export function AddProductModal({
  open,
  onOpenChange,
  defaultCategory,
  categories,
  product,
  title = "เพิ่มรายการสินค้าใหม่",
  submitLabel = "บันทึกสินค้า",
  onSubmit
}: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<AddProductForm>(() => initialForm(defaultCategory, product));
  const [stockText, setStockText] = useState("0");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const computedStatus = useMemo(() => getStatusFromStock(Number(stockText)), [stockText]);

  useEffect(() => {
    if (open) {
      resetForm(defaultCategory, { nextProduct: product });
    }
  }, [defaultCategory, open, product]);

  const updateField = <Key extends keyof AddProductForm>(key: Key, value: AddProductForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSubmitError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetForm(defaultCategory, { revokePreview: true, nextProduct: product });
    }
  };

  const resetForm = (
    category: SolarProductCategoryName,
    options: { revokePreview?: boolean; nextProduct?: SolarProduct | null } = {}
  ) => {
    if (options.revokePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm(category, options.nextProduct));
    setStockText(`${options.nextProduct?.stock ?? 0}`);
    setSelectedImage(null);
    setImagePreview(options.nextProduct?.image ?? "");
    setErrors({});
    setSubmitError("");
    setSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateProductImageFile(file);
    if (!validation.ok) {
      setErrors((current) => ({ ...current, image: validation.message }));
      setSubmitError(validation.message);
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setErrors((current) => ({ ...current, image: "" }));
    setSubmitError("");
    updateField("image", "");
  };

  const removeSelectedImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");
    setSubmitError("");
    updateField("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const stock = Number(stockText);
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.category || categories.length === 0) nextErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!Number.isFinite(stock) || stock < 0) nextErrors.stock = "จำนวนต้องเป็นตัวเลขและไม่ติดลบ";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await onSubmit({
      sku: `TEMP-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      brand: "-",
      stock,
      unit: form.unit.trim() || "ชิ้น",
      image: selectedImage ? "" : form.image.trim(),
      imageFile: selectedImage,
      note: ""
      });

      if (result && !result.ok) {
        setSubmitError(result.message ?? "บันทึกสินค้าไม่สำเร็จ");
        return;
      }

      resetForm(form.category, { revokePreview: false });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(720px,calc(100vw-32px))] max-w-none overflow-y-auto p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-950">
            <PackagePlus className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3">{title}</DialogTitle>
          <DialogDescription>บันทึกรายการสินค้าไว้ในหน้านี้ชั่วคราว โดยยังไม่เชื่อมต่อฐานข้อมูลหรือ API</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-3">
              <Label>รูปภาพสินค้า</Label>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex aspect-square items-center justify-center p-3">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={selectedImage?.name ?? form.name}
                      className="h-full w-full rounded-md object-contain"
                      onError={(event) => {
                        event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900">
                      <ImagePlus className="h-10 w-10 text-slate-400" />
                      <p className="mt-3 px-4 text-[14px] font-normal leading-6 text-slate-600 dark:text-slate-300">เลือกรูปภาพสินค้า</p>
                      <p className="mt-1 px-4 text-[12.5px] font-normal leading-5 text-slate-400">ใช้ preview ชั่วคราวก่อนบันทึก</p>
                    </div>
                  )}
                </div>
                {selectedImage ? (
                  <div className="border-t border-slate-200 px-3 py-2 text-[12.5px] font-normal text-slate-500 dark:border-slate-800">
                    <p className="truncate">{selectedImage.name}</p>
                  </div>
                ) : null}
              </div>
              <input ref={fileInputRef} className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleImageChange} />
              {errors.image ? <p className="text-[12.5px] font-normal leading-5 text-rose-600">{errors.image}</p> : null}
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={submitting}>
                  เปลี่ยนรูป
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={removeSelectedImage} disabled={!imagePreview || submitting}>
                  <Trash2 className="h-3.5 w-3.5" />
                  ลบรูป
                </Button>
              </div>
            </div>

            <div className="grid content-start gap-5 md:grid-cols-2">
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
                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-[14px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {computedStatus}
                </div>
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            {submitting && selectedImage ? <p className="self-center text-[14px] font-normal leading-6 text-slate-600 dark:text-slate-300">กำลังอัปโหลดรูป...</p> : null}
            {submitError ? <p className="self-center text-[13.5px] font-normal text-rose-600">{submitError}</p> : null}
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-yellow-400 text-slate-950 hover:bg-yellow-300" disabled={submitting}>
              {submitting && selectedImage ? "กำลังอัปโหลดรูป..." : submitLabel}
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
      {error ? <p className="text-[12.5px] font-normal leading-5 text-rose-600">{error}</p> : null}
    </div>
  );
}

export function getStatusFromStock(stock: number): SolarProductStatus {
  if (stock === 0) return "หมดสต๊อก";
  if (stock <= 5) return "ใกล้หมด";
  return "พร้อมใช้งาน";
}
