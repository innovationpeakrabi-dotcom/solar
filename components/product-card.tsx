import { useState } from "react";
import { Copy, EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/format";
import { PRODUCT_IMAGE_FALLBACK, resolveProductImageUrl } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { SolarProduct } from "@/types/solar-product";

type ProductCardProps = {
  product: SolarProduct;
  onPreview: (product: SolarProduct) => void;
  onEdit: (product: SolarProduct) => void;
  onCopy: (product: SolarProduct) => Promise<void>;
  onDelete: (product: SolarProduct) => Promise<boolean>;
};

export function ProductCard({ product, onPreview, onEdit, onCopy, onDelete }: ProductCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const imageUrl = resolveProductImageUrl(product.image);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const deleted = await onDelete(product);
    setDeleting(false);

    if (deleted) {
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <article className="group relative overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <button
          type="button"
          className="block w-full border-b border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
          onClick={() => onPreview(product)}
          aria-label={`ดูรายละเอียดสินค้า ${product.name}`}
        >
          <div className="aspect-square w-full overflow-hidden rounded-md bg-white p-4 dark:bg-slate-950">
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
              }}
            />
          </div>
        </button>

        <div className="space-y-3.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-h-10 text-[15px] font-semibold leading-6 text-slate-950 dark:text-white">{product.name}</h3>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="เมนูสินค้า"
                  className="h-8 w-8 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onSelect={() => onPreview(product)}>
                  <Eye className="h-4 w-4" />
                  ดูรายละเอียด
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onEdit(product)}>
                  <Pencil className="h-4 w-4" />
                  แก้ไขสินค้า
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onCopy(product)}>
                  <Copy className="h-4 w-4" />
                  คัดลอกข้อมูลสินค้า
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-rose-600 dark:text-rose-300" onSelect={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  ลบสินค้า
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400">คงเหลือ</p>
              <p className="text-[18px] font-bold leading-none text-slate-950 dark:text-white">
                {formatNumber(product.stock)} <span className="text-[12.5px] font-normal text-slate-500">{product.unit}</span>
              </p>
            </div>
            <StockBadge stock={product.stock} status={product.status} />
          </div>
        </div>
      </article>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => !deleting && setDeleteOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบสินค้า</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบสินค้า
              <span className="mt-2 block font-medium text-slate-950 dark:text-white">"{product.name}"</span>
              ออกจากระบบใช่หรือไม่?
              <span className="mt-2 block text-rose-600 dark:text-rose-300">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={deleting}>
                ยกเลิก
              </Button>
            </AlertDialogCancel>
            <Button type="button" variant="danger" disabled={deleting} onClick={handleConfirmDelete}>
              {deleting ? "กำลังลบ..." : "ลบสินค้า"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ProductImagePreview({ product, onOpenChange }: { product: SolarProduct | null; onOpenChange: (open: boolean) => void }) {
  const imageUrl = resolveProductImageUrl(product?.image);

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(860px,calc(100vw-32px))] max-w-none overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <DialogTitle>{product?.name ?? "รายละเอียดสินค้า"}</DialogTitle>
          <DialogDescription>{product ? "ข้อมูลสินค้าจาก Supabase" : ""}</DialogDescription>
        </DialogHeader>
        {product ? (
          <div className="grid gap-5 bg-slate-50 p-4 dark:bg-slate-900 sm:grid-cols-[240px_minmax(0,1fr)] sm:p-6">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <img
                src={imageUrl}
                alt={product.name}
                loading="lazy"
                className="h-56 w-full object-contain"
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.src.endsWith(PRODUCT_IMAGE_FALLBACK)) return;
                  image.src = PRODUCT_IMAGE_FALLBACK;
                }}
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-[18px] font-semibold leading-snug text-slate-950 dark:text-white">{product.name}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailItem label="หมวดหมู่" value={product.category || "-"} />
                <DetailItem label="จำนวนคงเหลือ" value={formatNumber(product.stock)} />
                <DetailItem label="หน่วย" value={product.unit} />
                <div>
                  <p className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400">สถานะ</p>
                  <div className="mt-1">
                    <StockBadge stock={product.stock} status={product.status} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-[14px] font-medium leading-6 text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function StockBadge({ stock, status }: { stock: number; status: string }) {
  const style =
    stock === 0
      ? "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-400/20"
      : stock <= 5
        ? "bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-400/10 dark:text-orange-200 dark:ring-orange-400/20"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20";

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1", style)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
