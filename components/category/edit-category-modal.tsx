import { useEffect, useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { CategoryForm } from "@/components/category/add-category-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CategoryFormInput, SolarCategory } from "@/types/solar-product";

type EditCategoryModalProps = {
  category: SolarCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, category: CategoryFormInput) => { ok: boolean; message?: string };
};

export function EditCategoryModal({ category, open, onOpenChange, onSubmit }: EditCategoryModalProps) {
  const [form, setForm] = useState<CategoryFormInput>({
    name: "",
    description: "",
    icon: "",
    color: "#FACC15"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (category && open) {
      setForm({
        name: category.name,
        description: category.description,
        icon: category.icon ?? "",
        color: category.color
      });
      setError("");
    }
  }, [category, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category) return;

    const result = onSubmit(category.id, form);
    if (!result.ok) {
      setError(result.message ?? "ไม่สามารถแก้ไขหมวดหมู่ได้");
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(560px,calc(100vw-32px))] max-w-none p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-950">
            <Pencil className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3">แก้ไขหมวดหมู่สินค้า</DialogTitle>
          <DialogDescription>ปรับชื่อ คำอธิบาย สี และไอคอนของหมวดหมู่</DialogDescription>
        </DialogHeader>

        <CategoryForm form={form} setForm={setForm} error={error} submitLabel="บันทึก" onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
