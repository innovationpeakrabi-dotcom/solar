import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Copy, EllipsisVertical, Eye, ImagePlus, Minus, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Input, Textarea } from "@/components/ui/input";
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
      <article
        className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:border-slate-800 dark:bg-slate-950 sm:overflow-visible sm:rounded-lg sm:hover:-translate-y-1 sm:hover:scale-100 sm:hover:shadow-lg"
        onClick={() => onPreview(product)}
      >
        <button
          type="button"
          className="block w-full border-b border-slate-100 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900 sm:p-3"
          aria-label={`ตรวจนับสินค้า ${product.name}`}
        >
          <div className="aspect-square w-full overflow-hidden rounded-[14px] bg-white p-1.5 dark:bg-slate-950 sm:rounded-md sm:p-4">
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 sm:object-contain"
              onError={(event) => {
                event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
              }}
            />
          </div>
        </button>

        <div className="space-y-2 p-2.5 sm:space-y-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-h-9 text-[13px] font-semibold leading-5 text-slate-950 dark:text-white sm:min-h-10 sm:text-[15px] sm:leading-6">{product.name}</h3>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="เมนูสินค้า"
                  className="h-8 w-8 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={(event) => event.stopPropagation()}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" onClick={(event) => event.stopPropagation()}>
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
              <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 sm:text-[12.5px]">คงเหลือ</p>
              <p className="text-sm font-bold leading-none text-slate-950 dark:text-white sm:text-[18px]">
                {formatNumber(product.stock)} <span className="text-[11px] font-normal text-slate-500 sm:text-[12.5px]">{product.unit}</span>
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

export function StockCheckModal({
  product,
  onOpenChange,
  onSaveStock
}: {
  product: SolarProduct | null;
  onOpenChange: (open: boolean) => void;
  onSaveStock: (product: SolarProduct, stock: number, imageFile?: File | null) => Promise<{ ok: boolean; message?: string }>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [countText, setCountText] = useState("0");
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageUrl = resolveProductImageUrl(product?.image);
  const displayImageUrl = imagePreview || imageUrl;

  useEffect(() => {
    if (!product) return;
    setCountText(`${product.stock}`);
    setNote("");
    setSelectedImage(null);
    setImagePreview("");
    setError("");
    setSaving(false);
  }, [product]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const count = Math.max(0, Number(countText) || 0);

  const handleSave = async () => {
    if (!product) return;
    if (!Number.isFinite(Number(countText)) || Number(countText) < 0) {
      setError("จำนวนที่ตรวจนับต้องเป็นตัวเลขและไม่ติดลบ");
      return;
    }

    setSaving(true);
    setError("");
    const result = await onSaveStock(product, Number(countText), selectedImage);
    setSaving(false);

    if (!result.ok) {
      setError(result.message ?? "บันทึกจำนวนใหม่ไม่สำเร็จ กรุณาลองอีกครั้ง");
      return;
    }

    onOpenChange(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const validExtension = ["jpg", "jpeg", "png", "webp"].includes(extension);
    const validType = !file.type || ["image/jpeg", "image/png", "image/webp"].includes(file.type);

    if (!validExtension || !validType) {
      setError("รองรับเฉพาะไฟล์รูปภาพ jpg, jpeg, png หรือ webp");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !saving && onOpenChange(open)}>
      <DialogContent className="max-h-[calc(100vh-32px)] w-[min(920px,calc(100vw-32px))] max-w-none overflow-y-auto rounded-xl border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <DialogTitle className="text-[26px]">{product?.name ?? "ตรวจนับสินค้า"}</DialogTitle>
          <DialogDescription>{product ? "ตรวจนับและอัปเดตจำนวนคงเหลือ" : ""}</DialogDescription>
        </DialogHeader>
        {product ? (
          <>
            <div className="grid gap-5 bg-slate-50 p-4 dark:bg-slate-900 sm:p-6 md:grid-cols-[minmax(0,1fr)_340px]">
              <div className="relative flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <img
                  src={displayImageUrl}
                  alt={product.name}
                  loading="lazy"
                  className="h-80 w-full object-contain"
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.src.endsWith(PRODUCT_IMAGE_FALLBACK)) return;
                    image.src = PRODUCT_IMAGE_FALLBACK;
                  }}
                />
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
                  <a
                    href={displayImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/90 px-3 py-2 text-[12.5px] font-medium text-slate-700 shadow-sm backdrop-blur hover:bg-white dark:bg-slate-900/90 dark:text-slate-100"
                  >
                    ดูรูปเต็ม
                  </a>
                  <Button type="button" size="sm" disabled={saving} onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="h-4 w-4" />
                    เปลี่ยนรูป
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">ชื่อสินค้า</p>
                  <h3 className="mt-1 text-[20px] font-semibold leading-snug text-slate-950 dark:text-white">{product.name}</h3>

                  <div className="mt-5 grid gap-4">
                    <div>
                      <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">หน่วยสินค้า</p>
                      <p className="mt-1 text-[16px] font-semibold text-slate-950 dark:text-white">{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">สถานะสินค้า</p>
                      <div className="mt-2">
                        <StockBadge stock={product.stock} status={product.status} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">จำนวนคงเหลือในระบบ</p>
                      <p className="mt-1 text-[42px] font-bold leading-none text-slate-950 dark:text-white">
                        {formatNumber(product.stock)}
                        <span className="ml-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">{product.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-5 shadow-sm dark:border-orange-400/20 dark:bg-orange-400/10">
                  <p className="text-[15px] font-semibold text-slate-950 dark:text-white">จำนวนที่ตรวจนับ</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0 rounded-full"
                      disabled={saving || count <= 0}
                      onClick={() => setCountText(`${Math.max(0, count - 1)}`)}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      value={countText}
                      disabled={saving}
                      onChange={(event) => {
                        setError("");
                        setCountText(event.target.value.replace("-", ""));
                      }}
                      className="h-14 rounded-xl text-center text-[24px] font-bold"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0 rounded-full"
                      disabled={saving}
                      onClick={() => setCountText(`${count + 1}`)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[13.5px] font-medium text-slate-700 dark:text-slate-200">หมายเหตุ</p>
                  <Textarea
                    value={note}
                    disabled={saving}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="เช่น ตรวจนับประจำเดือน, พบสินค้าเพิ่ม, เบิกไปใช้งานแล้ว, นับใหม่หลังจัดเรียงคลัง"
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>

            {error ? <p className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-[13.5px] font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p> : null}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button type="button" disabled={saving} onClick={handleSave}>
                {saving ? "กำลังบันทึก..." : "บันทึกจำนวนใหม่"}
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
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
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 sm:px-2.5 sm:py-1 sm:text-[12px]", style)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
