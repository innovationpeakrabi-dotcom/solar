import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { solarCategories as initialCategories } from "@/data/solar-categories";
import { solarProducts as initialProducts } from "@/data/solar-products";
import type { CategoryFormInput, NewSolarProductInput, SolarCategory, SolarProduct } from "@/types/solar-product";

type MutationResult = {
  ok: boolean;
  message?: string;
};

type InventoryContextValue = {
  categories: SolarCategory[];
  products: SolarProduct[];
  addProduct: (product: SolarProduct) => void;
  addCategory: (category: CategoryFormInput) => MutationResult;
  updateCategory: (id: string, category: CategoryFormInput) => MutationResult;
  deleteCategory: (id: string) => MutationResult;
  getProductCountByCategory: (categoryName: string) => number;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<SolarCategory[]>(initialCategories);
  const [products, setProducts] = useState<SolarProduct[]>(initialProducts);

  const getProductCountByCategory = (categoryName: string) => products.filter((product) => product.category === categoryName).length;

  const categoryNameExists = (name: string, ignoredId?: string) =>
    categories.some((category) => category.id !== ignoredId && category.name.trim().toLowerCase() === name.trim().toLowerCase());

  const addProduct = (product: SolarProduct) => {
    setProducts((currentProducts) => [product, ...currentProducts]);
  };

  const addCategory = (input: CategoryFormInput): MutationResult => {
    const name = input.name.trim();

    if (!name) return { ok: false, message: "กรุณากรอกชื่อหมวดหมู่" };
    if (categoryNameExists(name)) return { ok: false, message: "มีหมวดหมู่นี้อยู่แล้ว" };

    setCategories((currentCategories) => [
      {
        id: `category-${Date.now()}`,
        name,
        description: input.description.trim(),
        icon: input.icon.trim(),
        color: input.color
      },
      ...currentCategories
    ]);

    return { ok: true };
  };

  const updateCategory = (id: string, input: CategoryFormInput): MutationResult => {
    const name = input.name.trim();
    const category = categories.find((item) => item.id === id);

    if (!category) return { ok: false, message: "ไม่พบหมวดหมู่ที่ต้องการแก้ไข" };
    if (!name) return { ok: false, message: "กรุณากรอกชื่อหมวดหมู่" };
    if (categoryNameExists(name, id)) return { ok: false, message: "มีหมวดหมู่นี้อยู่แล้ว" };

    setCategories((currentCategories) =>
      currentCategories.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              description: input.description.trim(),
              icon: input.icon.trim(),
              color: input.color
            }
          : item
      )
    );

    if (category.name !== name) {
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.category === category.name ? { ...product, category: name } : product))
      );
    }

    return { ok: true };
  };

  const deleteCategory = (id: string): MutationResult => {
    const category = categories.find((item) => item.id === id);

    if (!category) return { ok: false, message: "ไม่พบหมวดหมู่ที่ต้องการลบ" };
    if (getProductCountByCategory(category.name) > 0) {
      return { ok: false, message: "หมวดหมู่นี้ยังมีสินค้าอยู่ กรุณาย้ายสินค้าหรือเปลี่ยนหมวดหมู่ก่อน" };
    }

    setCategories((currentCategories) => currentCategories.filter((item) => item.id !== id));
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      categories,
      products,
      addProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      getProductCountByCategory
    }),
    [categories, products]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
}

export type { NewSolarProductInput };
