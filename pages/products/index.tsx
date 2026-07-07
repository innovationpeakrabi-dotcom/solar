import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function ProductsPage() {
  const { toast } = useToast();
  const { categories, products, loadingProducts, productsError, deleteProduct } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState("latest");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        [product.name, product.category, product.status, product.unit].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = categoryId === "all" || product.categoryId === categoryId;

      return matchesSearch && matchesCategory;
    });

    if (sort === "stock") return [...nextProducts].sort((a, b) => a.stock - b.stock);
    if (sort === "name") return [...nextProducts].sort((a, b) => a.name.localeCompare(b.name, "th"));

    return nextProducts;
  }, [categoryId, products, search, sort]);

  return (
    <DashboardLayout title="สินค้า">
      <PageHeader
        title="สินค้า"
        description="จัดการข้อมูลสินค้า สถานะ และปริมาณคงเหลือจาก Supabase"
        actions={
          <Link href="/products/new">
            <Button>
              <Plus className="h-4 w-4" />
              เพิ่มสินค้า
            </Button>
          </Link>
        }
      />

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาชื่อสินค้า หรือสถานะ" />
          </div>
          <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">เรียงล่าสุด</option>
            <option value="stock">คงเหลือน้อยสุด</option>
            <option value="name">ชื่อสินค้า A-Z</option>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="icon" aria-label="ตั้งค่าตาราง">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {productsError ? (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-[13.5px] font-normal leading-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {productsError}
        </div>
      ) : null}

      {loadingProducts ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onView={(product) => toast({ title: "เปิดรายละเอียดสินค้า", description: product.name })}
          onEdit={(product) => toast({ title: "พร้อมแก้ไขสินค้า", description: product.name })}
          onDelete={async (product) => {
            const result = await deleteProduct(product.id);
            toast({ title: result.ok ? "ลบสินค้าเรียบร้อยแล้ว" : result.message ?? "ลบสินค้าไม่สำเร็จ" });
          }}
        />
      )}
    </DashboardLayout>
  );
}
