import { useState } from "react";
import { Edit3, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSolarProductImage } from "@/data/solar-products";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SolarProduct, SolarProductStatus } from "@/types/solar-product";

type ProductCardProps = {
  product: SolarProduct;
  onPreview: (product: SolarProduct) => void;
};

export function ProductCard({ product, onPreview }: ProductCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="group relative flex min-h-[168px] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-cyan-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-800 sm:gap-5 sm:p-5">
      <ProductImage product={product} onPreview={onPreview} />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 pr-9">
        <h3 className="line-clamp-3 text-lg font-semibold leading-7 text-slate-950 dark:text-white sm:text-xl">{product.name}</h3>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">คงเหลือ</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              {formatNumber(product.stock)} <span className="text-base font-medium text-slate-500">{product.unit}</span>
            </p>
          </div>
          <SolarStatusBadge status={product.status} />
        </div>
      </div>

      <div className="absolute right-3 top-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="เมนูสินค้า"
          onClick={() => setMenuOpen((open) => !open)}
          onBlur={() => window.setTimeout(() => setMenuOpen(false), 120)}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>

        {menuOpen ? (
          <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <ActionItem icon={Eye} label="ดูรายละเอียด" onClick={() => onPreview(product)} />
            <ActionItem icon={Edit3} label="แก้ไข" onClick={() => setMenuOpen(false)} />
            <ActionItem icon={Trash2} label="ลบ" danger onClick={() => setMenuOpen(false)} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProductImagePreview({ product, onOpenChange }: { product: SolarProduct | null; onOpenChange: (open: boolean) => void }) {
  const fallbackImage = product ? getSolarProductImage(product.category) : "/products/placeholder.svg";

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(780px,calc(100vw-32px))] max-w-none overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 pr-12 dark:border-slate-800 dark:bg-slate-900">
          <DialogTitle>{product?.name ?? "รูปสินค้า"}</DialogTitle>
          <DialogDescription>{product ? `${product.sku} · ${product.category}` : ""}</DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[70vh] items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
          <img
            src={product?.image || fallbackImage}
            alt={product?.name ?? "รูปสินค้า"}
            loading="lazy"
            className="max-h-[62vh] w-full rounded-xl border border-slate-200 bg-white object-contain p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            onError={(event) => {
              const image = event.currentTarget;
              if (image.src.endsWith(fallbackImage)) return;
              image.src = fallbackImage;
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductImage({ product, onPreview }: ProductCardProps) {
  const fallbackImage = getSolarProductImage(product.category);

  return (
    <button
      type="button"
      className="group/image flex h-20 w-20 shrink-0 items-center justify-center self-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-yellow-300/50 dark:border-slate-800 dark:bg-slate-900 md:h-[100px] md:w-[100px]"
      onClick={() => onPreview(product)}
      aria-label={`ดูรูปสินค้า ${product.name}`}
    >
      <img
        src={product.image || fallbackImage}
        alt={product.name}
        loading="lazy"
        className="h-full w-full rounded-lg object-contain transition-transform duration-200 group-hover/image:scale-105"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.src.endsWith(fallbackImage)) return;
          image.src = fallbackImage;
        }}
      />
    </button>
  );
}

function ActionItem({
  icon: Icon,
  label,
  danger,
  onClick
}: {
  icon: typeof Eye;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
        danger ? "text-rose-600 dark:text-rose-300" : "text-slate-700 dark:text-slate-200"
      )}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SolarStatusBadge({ status }: { status: SolarProductStatus }) {
  const styles: Record<SolarProductStatus, string> = {
    "พร้อมใช้งาน": "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900",
    "ใกล้หมด": "bg-yellow-50 text-yellow-700 ring-yellow-100 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-900",
    "หมดสต๊อก": "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900"
  };

  return (
    <span className={cn("inline-flex w-fit shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1", styles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
