import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { CategoryFormInput } from "@/types/solar-product";

type AddCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: CategoryFormInput) => Promise<{ ok: boolean; message?: string }>;
};

const initialForm: CategoryFormInput = {
  name: "",
  description: "",
  icon: "",
  color: "#FACC15"
};

export function AddCategoryModal({ open, onOpenChange, onSubmit }: AddCategoryModalProps) {
  const [form, setForm] = useState<CategoryFormInput>(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError("");
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await onSubmit(form);

    if (!result.ok) {
      setError(result.message ?? "ไม่สามารถเพิ่มหมวดหมู่ได้");
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(560px,calc(100vw-32px))] max-w-none p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-950">
            <FolderPlus className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3">เพิ่มหมวดหมู่สินค้า</DialogTitle>
          <DialogDescription>สร้างหมวดหมู่ใหม่สำหรับจัดกลุ่มรายการสินค้า Solar</DialogDescription>
        </DialogHeader>

        <CategoryForm form={form} setForm={setForm} error={error} onSubmit={handleSubmit} submitLabel="บันทึก" onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function CategoryForm({
  form,
  setForm,
  error,
  submitLabel,
  onSubmit,
  onCancel
}: {
  form: CategoryFormInput;
  setForm: (form: CategoryFormInput) => void;
  error?: string;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="space-y-5 p-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="ชื่อหมวดหมู่">
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="เช่น อุปกรณ์ติดตั้งหลังคา" />
        </Field>
        <Field label="สีประจำหมวดหมู่">
          <div className="flex gap-2">
            <Input className="w-14 p-1" type="color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
            <Input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <Field label="ไอคอน">
          <Input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} placeholder="เช่น ☀️, SPD, AC" />
        </Field>
        <Field label="คำอธิบาย">
          <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="รายละเอียดหมวดหมู่" />
        </Field>
      </div>

      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-100">{error}</p> : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button type="submit" className="bg-yellow-400 text-slate-950 hover:bg-yellow-300">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
