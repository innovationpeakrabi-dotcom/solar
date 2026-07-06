import { useEffect, useMemo, useState } from "react";
import { PackageOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { AddProductModal, getStatusFromStock } from "@/components/add-product-modal";
import { ProductCard, ProductImagePreview } from "@/components/product-card";
import { SolarEquipmentModal } from "@/components/solar-equipment-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSolarProductImage } from "@/data/solar-products";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { NewSolarProductInput, SolarProduct, SolarProductCategoryName } from "@/types/solar-product";

export function SolarDashboard() {
  const { toast } = useToast();
  const { categories, products, addProduct, getProductCountByCategory } = useInventory();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<SolarProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SolarProductCategoryName>(categories[0]?.name ?? "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategory("");
      return;
    }

    if (!categories.some((category) => category.name === selectedCategory)) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  const selectedCategoryData = categories.find((category) => category.name === selectedCategory) ?? categories[0];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory.length > 0 && product.category === selectedCategory;
      const matchesSearch =
        query.length === 0 ||
        [product.sku, product.name, product.category, product.brand, product.status].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const handleAddProduct = (product: NewSolarProductInput) => {
    const nextProduct: SolarProduct = {
      ...product,
      id: Date.now(),
      status: getStatusFromStock(product.stock),
      image: product.image.trim() || getSolarProductImage(product.category)
    };

    addProduct(nextProduct);
    setSelectedCategory(product.category);
    setSearch("");
    toast({
      title: "เพิ่มสินค้าเรียบร้อยแล้ว",
      description: `${product.sku} ถูกเพิ่มในหมวด ${product.category}`
    });
  };

  return (
    <div className="space-y-5 pb-1">
      <SolarEquipmentModal open={equipmentOpen} onOpenChange={setEquipmentOpen} />
      <ProductImagePreview product={previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)} />
      <AddProductModal
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        defaultCategory={selectedCategory}
        categories={categories}
        onSubmit={handleAddProduct}
      />

      <section className="flex flex-col gap-3 rounded-lg border border-cyan-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-left dark:border-yellow-400/30 dark:bg-yellow-400/10 lg:max-w-xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-yellow-300">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-cyan-700 dark:text-cyan-300">หมวดหมู่สินค้า Solar</span>
            <span className="mt-1 block text-lg font-semibold text-slate-950 dark:text-white">{selectedCategoryData?.name ?? "ยังไม่มีหมวดหมู่"}</span>
            <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">
              {selectedCategoryData?.description ?? "เพิ่มหมวดหมู่ก่อนเริ่มบันทึกรายการสินค้า"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="green">Grid Online</Badge>
          <Badge variant="blue">Solar Stock</Badge>
          <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300" onClick={() => setEquipmentOpen(true)}>
            ดูรายการอุปกรณ์ติดตั้ง Solar
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Category Selector</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">เลือกหมวดหมู่สินค้า</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">กดหมวดหมู่เพื่อดูรายการสินค้าเฉพาะกลุ่มนั้น ๆ</p>
          </div>
          <Badge variant="blue">{categories.length} หมวดหมู่</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category) => {
            const productCount = getProductCountByCategory(category.name);
            const isActive = selectedCategory === category.name;

            return (
              <button
                key={category.id}
                className={cn(
                  "rounded-lg border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft",
                  isActive
                    ? "border-yellow-300 bg-yellow-50 ring-2 ring-yellow-200 dark:border-yellow-400/50 dark:bg-yellow-400/10 dark:ring-yellow-400/20"
                    : "border-slate-200 bg-white hover:border-cyan-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-800"
                )}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSearch("");
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white" style={{ backgroundColor: category.color }}>
                        {category.icon || category.name.slice(0, 2)}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-slate-950 dark:text-white">{category.name}</h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{category.description}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
                      isActive ? "bg-slate-950 text-yellow-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    {productCount} รายการ
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {categories.length === 0 ? <SolarEmptyState title="ยังไม่มีหมวดหมู่สินค้า" description="ไปที่หน้าจัดการหมวดหมู่เพื่อเพิ่มหมวดหมู่ก่อน" /> : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Solar Product List</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{selectedCategoryData?.name ?? "ยังไม่มีหมวดหมู่"}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {selectedCategoryData?.description ?? "เพิ่มหมวดหมู่เพื่อเริ่มแสดงรายการสินค้า"}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Badge variant="blue">{filteredProducts.length} รายการ</Badge>
            <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300" onClick={() => setAddProductOpen(true)}>
              <Plus className="h-4 w-4" />
              + เพิ่มสินค้า
            </Button>
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหา SKU, ชื่อสินค้า, ยี่ห้อ..."
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onPreview={setPreviewProduct} />
          ))}
        </div>

        {filteredProducts.length === 0 ? <SolarEmptyState title="ไม่พบสินค้าในหมวดหมู่นี้" description="ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูรายการสินค้า Solar" /> : null}
      </section>
    </div>
  );
}

function SolarEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-900">
        <PackageOpen className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
