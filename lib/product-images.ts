import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_FALLBACK = "/products/solar-panel.svg";

export function isBlobImageUrl(value?: string | null) {
  return Boolean(value?.trim().startsWith("blob:"));
}

export function resolveProductImageUrl(value?: string | null) {
  const imageUrl = value?.trim();

  if (!imageUrl || isBlobImageUrl(imageUrl)) {
    return PRODUCT_IMAGE_FALLBACK;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  if (!supabase || !hasSupabaseConfig) {
    return PRODUCT_IMAGE_FALLBACK;
  }

  const storagePath = imageUrl.startsWith(`${PRODUCT_IMAGE_BUCKET}/`) ? imageUrl.slice(PRODUCT_IMAGE_BUCKET.length + 1) : imageUrl;
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl || PRODUCT_IMAGE_FALLBACK;
}

export function getPersistableImageUrl(value?: string | null) {
  const imageUrl = value?.trim();
  if (!imageUrl || isBlobImageUrl(imageUrl)) return null;
  return imageUrl;
}

export async function uploadProductImage(file: File) {
  if (!supabase || !hasSupabaseConfig) {
    return { ok: false as const, message: "ยังไม่ได้ตั้งค่า Supabase" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const fileName = `${crypto.randomUUID()}-${safeName || "product"}.${extension}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    contentType: file.type || "image/png",
    upsert: false
  });

  if (error) {
    console.error("Supabase upload product image error", error);
    return { ok: false as const, message: error.message };
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);
  return { ok: true as const, url: data.publicUrl };
}
