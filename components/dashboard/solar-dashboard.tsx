import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, BatteryCharging, Boxes, FolderTree, PackageOpen, Plus, Search, type LucideIcon } from "lucide-react";
import { AddProductModal, getStatusFromStock } from "@/components/add-product-modal";
import { ProductCard, StockCheckModal } from "@/components/product-card";
import { SolarEquipmentModal } from "@/components/solar-equipment-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSolarProductImage } from "@/data/solar-products";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import type { NewSolarProductInput, SolarCategory, SolarProduct } from "@/types/solar-product";

const lowStockStatus = getStatusFromStock(1);
const outOfStockStatus = getStatusFromStock(0);

export function SolarDashboard() {
  const { toast } = useToast();
  const { categories, products, loadingProducts, productsError, addProduct, updateProduct, deleteProduct } = useInventory();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SolarProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<SolarProduct | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [search, setSearch] = useState("");

  const selectedCategoryData = categories.find((category) => category.id === selectedCategoryId) ?? null;
  const formDefaultCategory = selectedCategoryData?.name ?? categories[0]?.name ?? "";
  const isAllCategoriesSelected = selectedCategoryId === "";

  useEffect(() => {
    if (selectedCategoryId && !categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId("");
    }
  }, [categories, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
      const matchesSearch =
        query.length === 0 ||
        [product.name, product.category, product.status, product.unit].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategoryId]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.status === lowStockStatus).length;
  const outOfStock = products.filter((product) => product.status === outOfStockStatus).length;
  const getProductCountByCategoryId = (categoryId: string) => products.filter((product) => product.categoryId === categoryId).length;
  const getCategoryIdByName = (categoryName: string) => categories.find((category) => category.name === categoryName)?.id;

  const toProductPayload = (product: NewSolarProductInput) => ({
    name: product.name,
    category: product.category,
    stock: product.stock,
    unit: product.unit,
    status: getStatusFromStock(product.stock),
    image: product.image.trim() || getSolarProductImage(product.category),
    imageFile: product.imageFile ?? null
  });

  const handleAddProduct = async (product: NewSolarProductInput) => {
    const result = await addProduct(toProductPayload(product));

    if (!result.ok) {
      toast({ title: result.message ?? "เพิ่มสินค้าไม่สำเร็จ" });
      return result;
    }

    const nextCategoryId = getCategoryIdByName(product.category);
    if (nextCategoryId) setSelectedCategoryId(nextCategoryId);
    setSearch("");
    toast({ title: "เพิ่มสินค้าเรียบร้อยแล้ว" });
    return result;
  };

  const handleUpdateProduct = async (product: NewSolarProductInput) => {
    if (!editingProduct) return { ok: false, message: "ไม่พบสินค้าที่ต้องการแก้ไข" };

    const result = await updateProduct(editingProduct.id, toProductPayload(product));

    if (!result.ok) {
      toast({ title: result.message ?? "แก้ไขสินค้าไม่สำเร็จ" });
      return result;
    }

    const nextCategoryId = getCategoryIdByName(product.category);
    if (nextCategoryId) setSelectedCategoryId(nextCategoryId);
    setEditingProduct(null);
    setSearch("");
    toast({ title: "แก้ไขสินค้าเรียบร้อยแล้ว" });
    return result;
  };

  const handleStockCheck = async (product: SolarProduct, stock: number, imageFile?: File | null) => {
    const result = await updateProduct(product.id, {
      name: product.name,
      category: product.category,
      stock,
      unit: product.unit,
      status: getStatusFromStock(stock),
      image: imageFile ? "" : product.image,
      imageFile: imageFile ?? null
    });

    if (!result.ok) return result;

    toast({ title: "บันทึกจำนวนใหม่เรียบร้อยแล้ว" });
    return result;
  };

  const handleDeleteProduct = async (product: SolarProduct) => {
    const result = await deleteProduct(product.id);

    if (!result.ok) {
      toast({ title: "ไม่สามารถลบสินค้าได้", description: result.message });
      return false;
    }

    toast({ title: "ลบสินค้าเรียบร้อย" });
    return true;
  };

  const handleCopyProduct = async (product: SolarProduct) => {
    try {
      await navigator.clipboard.writeText(product.name);
      toast({ title: "คัดลอกชื่อสินค้าแล้ว" });
    } catch (error) {
      console.error("Copy product name error", error);
      toast({ title: "ไม่สามารถคัดลอกชื่อสินค้าได้" });
    }
  };

  return (
    <div className="animate-soft-in space-y-5 rounded-2xl bg-gradient-to-br from-white via-sky-50 to-orange-50/80 p-0 pb-[calc(90px+env(safe-area-inset-bottom))] dark:from-slate-950 dark:via-slate-950 dark:to-orange-950/20 sm:space-y-6 sm:rounded-3xl sm:bg-slate-100/80 sm:bg-none sm:p-6 sm:pb-7 dark:sm:bg-slate-950/30">
      <SolarEquipmentModal open={equipmentOpen} onOpenChange={setEquipmentOpen} />
      <StockCheckModal product={previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)} onSaveStock={handleStockCheck} />
      <AddProductModal open={addProductOpen} onOpenChange={setAddProductOpen} defaultCategory={formDefaultCategory} categories={categories} onSubmit={handleAddProduct} />
      <AddProductModal
        open={Boolean(editingProduct)}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
        defaultCategory={editingProduct?.category ?? formDefaultCategory}
        categories={categories}
        product={editingProduct}
        title="แก้ไขรายการสินค้า"
        submitLabel="บันทึกการแก้ไข"
        onSubmit={handleUpdateProduct}
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        <SummaryCard icon={Boxes} label="รายการสินค้า" value={products.length.toLocaleString("th-TH")} />
        <SummaryCard icon={BatteryCharging} label="สต็อกรวม" value={totalStock.toLocaleString("th-TH")} />
        <SummaryCard icon={AlertTriangle} label="ใกล้หมด" value={lowStock.toLocaleString("th-TH")} />
        <SummaryCard icon={PackageOpen} label="หมดสต๊อก" value={outOfStock.toLocaleString("th-TH")} />
        <SummaryCard icon={FolderTree} label="หมวดสต็อก" value={categories.length.toLocaleString("th-TH")} />
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:rounded-xl sm:bg-white sm:p-6 sm:backdrop-blur-0 sm:dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3 sm:items-end">
          <h2 className="text-[21px] font-semibold leading-tight text-slate-950 dark:text-white sm:text-[23px]">หมวดหมู่สินค้า Solar</h2>
          <Button className="h-9 min-w-[86px] shrink-0 px-3 text-xs shadow-sm sm:h-10 sm:min-w-0 sm:px-4 sm:text-sm" variant="outline" onClick={() => setEquipmentOpen(true)}>
            ดูรายการ
          </Button>
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-5 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
          <CategoryButton
            active={isAllCategoriesSelected}
            label="ทั้งหมด"
            count={products.length}
            icon={
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-950 sm:h-9 sm:w-9">
                <Boxes className="h-4 w-4" />
              </span>
            }
            onClick={() => {
              setSelectedCategoryId("");
              setSearch("");
            }}
          />

          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;
            const productCount = getProductCountByCategoryId(category.id);

            return (
              <CategoryButton
                key={category.id}
                active={isActive}
                label={category.name}
                count={productCount}
                icon={<CategoryIcon category={category} />}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setSearch("");
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:rounded-xl sm:bg-white sm:p-6 sm:backdrop-blur-0 sm:dark:bg-slate-950">
        <div className="space-y-3 sm:flex sm:flex-col sm:gap-4 sm:space-y-0 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start justify-between gap-3 sm:block">
            <div>
              <p className="text-[13px] font-medium text-orange-600 dark:text-orange-300">Product Marketplace</p>
              <h2 className="mt-1 text-[21px] font-semibold leading-tight text-slate-950 dark:text-white sm:text-[23px]">
                {isAllCategoriesSelected ? "สินค้าทั้งหมด" : (selectedCategoryData?.name ?? "ยังไม่มีหมวดหมู่")}
              </h2>
            </div>
            <Badge className="mt-1 shrink-0 text-[11px] sm:hidden" variant="blue">
              {filteredProducts.length.toLocaleString("th-TH")} รายการ
            </Badge>
            <p className="mt-1.5 hidden text-[13.5px] font-normal leading-6 text-slate-500 dark:text-slate-400 sm:block">
              {isAllCategoriesSelected ? "แสดงสินค้าทุกหมวดหมู่จาก Supabase" : "เลือกหมวดหมู่เพื่อดูสินค้าใน Supabase"}
            </p>
          </div>

          <div className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-row sm:gap-2">
            <Badge className="hidden sm:inline-flex" variant="blue">
              {filteredProducts.length.toLocaleString("th-TH")} รายการ
            </Badge>
            <Button className="h-10 w-[104px] px-2 text-xs shadow-sm sm:h-10 sm:w-auto sm:px-4 sm:text-sm" onClick={() => setAddProductOpen(true)} disabled={categories.length === 0}>
              <Plus className="h-4 w-4" />
              เพิ่มสินค้า
            </Button>
            <div className="relative min-w-0 sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4" />
              <Input className="h-10 rounded-full pl-9 text-base shadow-sm sm:pl-11 sm:text-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาสินค้า..." />
            </div>
          </div>
        </div>

        {productsError ? <ErrorState message={productsError} /> : null}

        {loadingProducts ? (
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-2xl sm:h-72 sm:rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onPreview={setPreviewProduct} onEdit={setEditingProduct} onCopy={handleCopyProduct} onDelete={handleDeleteProduct} />
            ))}
          </div>
        )}

        {!loadingProducts && filteredProducts.length === 0 ? (
          <SolarEmptyState title="ไม่พบสินค้า" description={search ? "ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น" : "ยังไม่มีสินค้าในหมวดหมู่นี้จาก Supabase"} />
        ) : null}
      </section>
    </div>
  );
}

function CategoryButton({
  active,
  label,
  count,
  icon,
  onClick
}: {
  active: boolean;
  label: string;
  count: number;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "h-[74px] w-[112px] shrink-0 rounded-2xl border bg-white p-3 text-left shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:bg-slate-950 sm:h-auto sm:w-auto sm:rounded-lg sm:p-3.5 sm:hover:-translate-y-0.5",
        active
          ? "border-orange-300 bg-orange-50/70 ring-2 ring-orange-200 dark:border-orange-400/60 dark:bg-orange-400/10 dark:ring-orange-400/20"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
      ].join(" ")}
      onClick={onClick}
    >
      <div className="flex h-full flex-col justify-between sm:h-auto sm:flex-row sm:items-center sm:gap-2.5">
        <div className="flex items-center justify-between gap-2 sm:contents">
          {icon}
          <Badge className="text-[11px] sm:hidden" variant={active ? "amber" : "blue"}>
            {count.toLocaleString("th-TH")}
          </Badge>
        </div>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold leading-snug text-slate-950 dark:text-white sm:text-[15.5px]">{label}</span>
          <Badge className="mt-2 hidden sm:inline-flex" variant={active ? "amber" : "blue"}>
            {count.toLocaleString("th-TH")} รายการ
          </Badge>
        </span>
      </div>
    </button>
  );
}

function CategoryIcon({ category }: { category: SolarCategory }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white shadow-sm sm:h-9 sm:w-9 sm:text-xs"
      style={{ backgroundColor: category.color || "#F97316" }}
    >
      {category.icon || category.name.slice(0, 2)}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <article className="h-[88px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:h-auto sm:rounded-xl sm:p-5">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-normal leading-4 text-slate-500 dark:text-slate-400 sm:text-[13px] sm:leading-5">{label}</p>
          <p className="mt-1 text-3xl font-bold leading-none text-slate-950 dark:text-white sm:mt-1.5 sm:text-[32px]">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-sm dark:bg-orange-400/10 dark:text-orange-300 sm:h-11 sm:w-11 sm:rounded-lg">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
      {message}
    </div>
  );
}

function SolarEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-4 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <PackageOpen className="h-10 w-10 text-slate-400" />
      <h3 className="mt-3 text-[16.5px] font-semibold leading-snug text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] font-normal leading-5 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
