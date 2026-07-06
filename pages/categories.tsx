import { useMemo, useState } from "react";
import { FolderPlus, Search } from "lucide-react";
import { AddCategoryModal } from "@/components/category/add-category-modal";
import { CategoryTable } from "@/components/category/category-table";
import { DeleteCategoryDialog } from "@/components/category/delete-category-dialog";
import { EditCategoryModal } from "@/components/category/edit-category-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";
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

  const handleAddCategory = (category: CategoryFormInput) => {
    const result = addCategory(category);
    if (result.ok) {
      toast({ title: "เพิ่มหมวดหมู่เรียบร้อยแล้ว" });
    }
    return result;
  };

  const handleEditCategory = (id: string, category: CategoryFormInput) => {
    const result = updateCategory(id, category);
    if (result.ok) {
      toast({ title: "แก้ไขหมวดหมู่เรียบร้อยแล้ว" });
    }
    return result;
  };

  const handleDeleteCategory = (category: SolarCategory) => {
    const result = deleteCategory(category.id);

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
        description="เพิ่ม แก้ไข ลบ และค้นหาหมวดหมู่สินค้า Solar Inventory"
        actions={
          <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300" onClick={() => setAddOpen(true)}>
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

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Category Management</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">รายการหมวดหมู่ทั้งหมด</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Badge variant="blue">{filteredCategories.length} หมวดหมู่</Badge>
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหมวดหมู่..." />
            </div>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : filteredCategories.length > 0 ? (
            <CategoryTable
              categories={filteredCategories}
              getProductCount={getProductCountByCategory}
              onEdit={setEditingCategory}
              onDelete={setDeletingCategory}
            />
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-900">
                <FolderPlus className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">ไม่พบหมวดหมู่</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">ลองเปลี่ยนคำค้นหา หรือเพิ่มหมวดหมู่ใหม่สำหรับสินค้า Solar</p>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
