import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BatteryCharging, Boxes, FolderTree, PackageOpen, Plus, Search, type LucideIcon } from "lucide-react";
import { AddProductModal, getStatusFromStock } from "@/components/add-product-modal";
import { ProductCard, ProductImagePreview } from "@/components/product-card";
import { SolarEquipmentModal } from "@/components/solar-equipment-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSolarProductImage } from "@/data/solar-products";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import type { NewSolarProductInput, SolarCategory, SolarProduct } from "@/types/solar-product";

export function SolarDashboard() {
  const { toast } = useToast();
  const { categories, products, loadingProducts, productsError, addProduct, updateProduct, deleteProduct } = useInventory();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SolarProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<SolarProduct | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryId("");
      return;
    }

    if (!categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategoryData = categories.find((category) => category.id === selectedCategoryId) ?? categories[0] ?? null;
  const formDefaultCategory = selectedCategoryData?.name ?? categories[0]?.name ?? "";

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = Boolean(selectedCategoryId) && product.categoryId === selectedCategoryId;
      const matchesSearch =
        query.length === 0 ||
        [product.name, product.category, product.status, product.unit].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategoryId]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.status === "ใกล้หมด").length;
  const outOfStock = products.filter((product) => product.status === "หมดสต๊อก").length;
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
      return;
    }

    const nextCategoryId = getCategoryIdByName(product.category);
    if (nextCategoryId) setSelectedCategoryId(nextCategoryId);
    setSearch("");
    toast({ title: "เพิ่มสินค้าเรียบร้อยแล้ว" });
  };

  const handleUpdateProduct = async (product: NewSolarProductInput) => {
    if (!editingProduct) return;

    const result = await updateProduct(editingProduct.id, toProductPayload(product));

    if (!result.ok) {
      toast({ title: result.message ?? "แก้ไขสินค้าไม่สำเร็จ" });
      return;
    }

    const nextCategoryId = getCategoryIdByName(product.category);
    if (nextCategoryId) setSelectedCategoryId(nextCategoryId);
    setEditingProduct(null);
    setSearch("");
    toast({ title: "แก้ไขสินค้าเรียบร้อยแล้ว" });
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
    <div className="animate-soft-in space-y-5 rounded-3xl bg-slate-100/80 p-4 pb-6 dark:bg-slate-950/30 sm:p-5">
      <SolarEquipmentModal open={equipmentOpen} onOpenChange={setEquipmentOpen} />
      <ProductImagePreview product={previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)} />
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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard icon={Boxes} label="รายการสินค้า" value={products.length.toLocaleString("th-TH")} />
        <SummaryCard icon={BatteryCharging} label="สต็อกรวม" value={totalStock.toLocaleString("th-TH")} />
        <SummaryCard icon={AlertTriangle} label="ใกล้หมด" value={lowStock.toLocaleString("th-TH")} />
        <SummaryCard icon={PackageOpen} label="หมดสต็อก" value={outOfStock.toLocaleString("th-TH")} />
        <SummaryCard icon={FolderTree} label="หมวดสต็อก" value={categories.length.toLocaleString("th-TH")} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">หมวดหมู่สินค้า Solar</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">เลือกหมวดหมู่จากข้อมูลจริงใน Supabase เพื่อดูรายการสินค้า</p>
          </div>
          <Button variant="outline" onClick={() => setEquipmentOpen(true)}>
            ดูรายการอุปกรณ์ติดตั้ง
          </Button>
        </div>

        {categories.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const isActive = selectedCategoryId === category.id;
              const productCount = getProductCountByCategoryId(category.id);

              return (
                <button
                  key={category.id}
                  className={[
                    "rounded-lg border bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950",
                    isActive
                      ? "border-orange-300 ring-2 ring-orange-200 dark:border-orange-400/60 dark:ring-orange-400/20"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                  ].join(" ")}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setSearch("");
                  }}
                >
                  <div className="flex items-start gap-3">
                    <CategoryIcon category={category} />
                    <span className="min-w-0">
                      <span className="block text-base font-bold text-slate-950 dark:text-white">{category.name}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-slate-500 dark:text-slate-400">{category.description || "ไม่มีคำอธิบายหมวดหมู่"}</span>
                      <Badge className="mt-3" variant={isActive ? "amber" : "blue"}>
                        {productCount.toLocaleString("th-TH")} รายการ
                      </Badge>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <SolarEmptyState title="ยังไม่มีหมวดหมู่สินค้า" description="เพิ่มหมวดหมู่ใน Supabase หรือหน้าจัดการหมวดหมู่ก่อนเริ่มแสดงรายการสินค้า" />
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-300">Product Marketplace</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{selectedCategoryData?.name ?? "ยังไม่มีหมวดหมู่"}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedCategoryData?.description || "เลือกหมวดหมู่เพื่อดูสินค้าใน Supabase"}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge variant="blue">{filteredProducts.length.toLocaleString("th-TH")} รายการ</Badge>
            <Button onClick={() => setAddProductOpen(true)} disabled={categories.length === 0}>
              <Plus className="h-4 w-4" />
              เพิ่มสินค้า
            </Button>
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาสินค้า..." />
            </div>
          </div>
        </div>

        {productsError ? <ErrorState message={productsError} /> : null}

        {loadingProducts ? (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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

function CategoryIcon({ category }: { category: SolarCategory }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
      style={{ backgroundColor: category.color || "#F97316" }}
    >
      {category.icon || category.name.slice(0, 2)}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300">
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
      <h3 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
