import { useMemo, useState } from "react";
import { FolderPlus, Search } from "lucide-react";
import { AddCategoryModal } from "@/components/category/add-category-modal";
import { CategoryTable } from "@/components/category/category-table";
import { DeleteCategoryDialog } from "@/components/category/delete-category-dialog";
import { EditCategoryModal } from "@/components/category/edit-category-modal";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import type { CategoryFormInput, SolarCategory } from "@/types/solar-product";

export default function CategoriesPage() {
  const { toast } = useToast();
  const { categories, addCategory, updateCategory, deleteCategory, getProductCountByCategory } = useInventory();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SolarCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<SolarCategory | null>(null);
  const [loading] = useState(false);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [category.name, category.description, category.icon ?? "", category.color].some((value) => value.toLowerCase().includes(query))
    );
  }, [categories, search]);

  const handleAddCategory = async (category: CategoryFormInput) => {
    const result = await addCategory(category);
    if (result.ok) toast({ title: "เพิ่มหมวดหมู่เรียบร้อยแล้ว" });
    return result;
  };

  const handleEditCategory = async (id: string, category: CategoryFormInput) => {
    const result = await updateCategory(id, category);
    if (result.ok) toast({ title: "แก้ไขหมวดหมู่เรียบร้อยแล้ว" });
    return result;
  };

  const handleDeleteCategory = async (category: SolarCategory) => {
    const result = await deleteCategory(category.id);

    if (!result.ok) {
      toast({ title: result.message ?? "ไม่สามารถลบหมวดหมู่ได้" });
      setDeletingCategory(null);
      return;
    }

    toast({ title: "ลบหมวดหมู่เรียบร้อยแล้ว" });
    setDeletingCategory(null);
  };

  return (
    <DashboardLayout title="จัดการหมวดหมู่">
      <PageHeader
        title="จัดการหมวดหมู่"
        description="เพิ่ม แก้ไข ลบ และค้นหาหมวดหมู่สินค้า Solar Inventory จากข้อมูลจริงใน Supabase"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            เพิ่มหมวดหมู่
          </Button>
        }
      />

      <AddCategoryModal open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAddCategory} />
      <EditCategoryModal
        open={Boolean(editingCategory)}
        category={editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        onSubmit={handleEditCategory}
      />
      <DeleteCategoryDialog
        open={Boolean(deletingCategory)}
        category={deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
        onConfirm={handleDeleteCategory}
      />

      <section className="premium-panel animate-soft-in rounded-[28px] p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-orange-600 dark:text-orange-300">Category Management</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">รายการหมวดหมู่ทั้งหมด</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Badge variant="blue">{filteredCategories.length} หมวดหมู่</Badge>
            <div className="relative w-full sm:w-96">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหมวดหมู่..." />
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : filteredCategories.length > 0 ? (
            <CategoryTable
              categories={filteredCategories}
              getProductCount={getProductCountByCategory}
              onEdit={setEditingCategory}
              onDelete={setDeletingCategory}
            />
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-cyan-100 text-slate-600 shadow-sm dark:from-orange-400/10 dark:to-cyan-400/10 dark:text-slate-300">
                <FolderPlus className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">ไม่พบหมวดหมู่</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                ลองเปลี่ยนคำค้นหา หรือเพิ่มหมวดหมู่ใหม่สำหรับสินค้า Solar
              </p>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
