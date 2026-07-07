import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPersistableImageUrl, isBlobImageUrl, resolveProductImageUrl, uploadProductImage } from "@/lib/product-images";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { CategoryFormInput, SolarCategory, SolarProduct, SolarProductStatus } from "@/types/solar-product";

type MutationResult = {
  ok: boolean;
  message?: string;
};

type ProductPayload = Pick<SolarProduct, "name" | "category" | "stock" | "unit" | "status" | "image"> & {
  imageFile?: File | null;
};

type InventoryContextValue = {
  categories: SolarCategory[];
  products: SolarProduct[];
  loadingProducts: boolean;
  productsError: string | null;
  loadProducts: () => Promise<void>;
  addProduct: (product: ProductPayload) => Promise<MutationResult>;
  updateProduct: (id: string, product: ProductPayload) => Promise<MutationResult>;
  deleteProduct: (id: string) => Promise<MutationResult>;
  addCategory: (category: CategoryFormInput) => Promise<MutationResult>;
  updateCategory: (id: string, category: CategoryFormInput) => Promise<MutationResult>;
  deleteCategory: (id: string) => Promise<MutationResult>;
  getProductCountByCategory: (categoryName: string) => number;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  category_id: string | null;
  image_url: string | null;
  stock_quantity: number;
  unit: string;
  status: SolarProductStatus;
  categories?: { name: string } | { name: string }[] | null;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

function getRelationCategoryName(product: ProductRow) {
  if (Array.isArray(product.categories)) return product.categories[0]?.name ?? "";
  return product.categories?.name ?? "";
}

function mapCategory(category: CategoryRow): SolarCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    color: category.color ?? "#FACC15",
    icon: category.icon ?? "",
    productCount: 0
  };
}

function mapProduct(product: ProductRow): SolarProduct {
  const categoryName = getRelationCategoryName(product);
  const image = resolveProductImageUrl(product.image_url);

  if (isBlobImageUrl(product.image_url)) {
    console.warn(`Product ${product.id} has an invalid blob image_url. Using fallback image.`);
  }

  return {
    id: product.id,
    sku: product.id.slice(0, 8).toUpperCase(),
    name: product.name,
    categoryId: product.category_id,
    category: categoryName,
    brand: "-",
    stock: product.stock_quantity,
    unit: product.unit,
    status: product.status,
    image,
    note: ""
  };
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<SolarCategory[]>([]);
  const [products, setProducts] = useState<SolarProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!supabase || !hasSupabaseConfig) {
      const message = "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY";
      console.error(message);
      setProductsError(message);
      setCategories([]);
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    setProductsError(null);

    const { data: categoryData, error: categoryError } = await supabase.from("categories").select("*").order("created_at", { ascending: true });

    if (categoryError) {
      console.error("Supabase categories error", categoryError);
      setProductsError(categoryError.message);
      setCategories([]);
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    const nextCategories = ((categoryData ?? []) as CategoryRow[]).map(mapCategory);
    const visibilityWarning =
      nextCategories.length === 0
        ? "Connected to Supabase, but no categories are visible to the frontend. If Supabase Table Editor has rows, run supabase/rls-policies.sql to allow anon reads."
        : null;
    console.log("Supabase Connected");
    console.log(nextCategories);
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (productError) {
      console.error("Supabase products error", productError);
      setCategories(nextCategories);
      setProductsError(productError.message);
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    const nextProducts = ((productData ?? []) as unknown as ProductRow[]).map(mapProduct);
    const categoriesWithCounts = nextCategories.map((category) => ({
      ...category,
      productCount: nextProducts.filter((product) => product.categoryId === category.id).length
    }));

    console.log("Supabase products", nextProducts);
    setCategories(categoriesWithCounts);
    setProducts(nextProducts);
    setProductsError(visibilityWarning);
    setLoadingProducts(false);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const getCategoryId = (categoryName: string) => categories.find((category) => category.name === categoryName)?.id ?? null;

  const addProduct = async (product: ProductPayload): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const categoryId = getCategoryId(product.category);
    if (!categoryId) return { ok: false, message: "ไม่พบหมวดหมู่สินค้าใน Supabase" };

    const productId = crypto.randomUUID();
    const imageResult = await getProductImageForSave(product, productId);
    if (!imageResult.ok) return { ok: false, message: imageResult.message };

    // Save the public Supabase Storage URL into products.image_url.
    const { error } = await supabase.from("products").insert({
      id: productId,
      name: product.name,
      category_id: categoryId,
      image_url: imageResult.imageUrl,
      stock_quantity: product.stock,
      unit: product.unit,
      status: product.status
    });

    if (error) {
      console.error("Supabase insert product error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const updateProduct = async (id: string, product: ProductPayload): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const categoryId = getCategoryId(product.category);
    if (!categoryId) return { ok: false, message: "ไม่พบหมวดหมู่สินค้าใน Supabase" };

    const imageResult = await getProductImageForSave(product, id);
    if (!imageResult.ok) return { ok: false, message: imageResult.message };

    const { error } = await supabase
      .from("products")
      // Save the public Supabase Storage URL into products.image_url.
      .update({
        name: product.name,
        category_id: categoryId,
        image_url: imageResult.imageUrl,
        stock_quantity: product.stock,
        unit: product.unit,
        status: product.status
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase update product error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const deleteProduct = async (id: string): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete product error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const addCategory = async (input: CategoryFormInput): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const name = input.name.trim();
    if (!name) return { ok: false, message: "กรุณากรอกชื่อหมวดหมู่" };

    const { error } = await supabase.from("categories").insert({
      name,
      description: input.description.trim() || null,
      icon: input.icon.trim() || null,
      color: input.color
    });

    if (error) {
      console.error("Supabase insert category error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const updateCategory = async (id: string, input: CategoryFormInput): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const name = input.name.trim();
    if (!name) return { ok: false, message: "กรุณากรอกชื่อหมวดหมู่" };

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        description: input.description.trim() || null,
        icon: input.icon.trim() || null,
        color: input.color
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase update category error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const deleteCategory = async (id: string): Promise<MutationResult> => {
    if (!supabase || !hasSupabaseConfig) return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase" };

    const category = categories.find((item) => item.id === id);
    if (category && getProductCountByCategory(category.name) > 0) {
      return { ok: false, message: "หมวดหมู่นี้ยังมีสินค้าอยู่ กรุณาย้ายสินค้าหรือเปลี่ยนหมวดหมู่ก่อน" };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete category error", error);
      return { ok: false, message: error.message };
    }

    await loadProducts();
    return { ok: true };
  };

  const getProductCountByCategory = (categoryName: string) => {
    const categoryId = categories.find((category) => category.name === categoryName)?.id;
    if (!categoryId) return 0;
    return products.filter((product) => product.categoryId === categoryId).length;
  };

  const value = useMemo(
    () => ({
      categories,
      products,
      loadingProducts,
      productsError,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      getProductCountByCategory
    }),
    [categories, products, loadingProducts, productsError, loadProducts]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

async function getProductImageForSave(product: ProductPayload, productId: string) {
  if (product.imageFile) {
    const uploaded = await uploadProductImage(product.imageFile, productId);
    if (!uploaded.ok) {
      return { ok: false as const, message: uploaded.message };
    }

    return { ok: true as const, imageUrl: uploaded.url };
  }

  return { ok: true as const, imageUrl: getPersistableImageUrl(product.image) };
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
}
