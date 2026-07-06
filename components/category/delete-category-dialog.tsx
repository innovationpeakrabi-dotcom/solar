import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SolarCategory } from "@/types/solar-product";

type DeleteCategoryDialogProps = {
  category: SolarCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (category: SolarCategory) => void;
};

export function DeleteCategoryDialog({ category, open, onOpenChange, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(460px,calc(100vw-32px))] max-w-none p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3">คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่</DialogTitle>
          <DialogDescription>{category?.name ?? "หมวดหมู่สินค้า"}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (category) onConfirm(category);
            }}
          >
            ลบ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
