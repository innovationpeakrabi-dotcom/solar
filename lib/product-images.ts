import { hasSupabaseConfig, supabase } from "@/lib/supabase";

// Storage bucket name for product image uploads.
export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_FALLBACK = "/products/solar-panel.svg";

const ALLOWED_PRODUCT_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"] as readonly string[];
const ALLOWED_PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

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

export function validateProductImageFile(file: File) {
  const extension = getProductImageExtension(file.name);
  const hasAllowedExtension = ALLOWED_PRODUCT_IMAGE_EXTENSIONS.includes(extension);
  const hasAllowedType = !file.type || ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type);

  if (!hasAllowedExtension || !hasAllowedType) {
    return { ok: false as const, message: "รองรับเฉพาะไฟล์รูปภาพ jpg, jpeg, png, webp และ svg" };
  }

  return { ok: true as const, extension };
}

export async function uploadProductImage(file: File, productId: string) {
  if (!supabase || !hasSupabaseConfig) {
    return { ok: false as const, message: "ยังไม่ได้ตั้งค่า Supabase" };
  }

  const validation = validateProductImageFile(file);
  if (!validation.ok) return validation;

  const safeProductId = productId.replace(/[^a-zA-Z0-9-]/g, "");
  const filePath = `products/${safeProductId}-${Date.now()}.${validation.extension}`;

  // Upload the selected product image file to Supabase Storage.
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    contentType: file.type || getContentTypeFromExtension(validation.extension),
    upsert: false
  });

  if (error) {
    console.error("Supabase upload product image error", error);
    return { ok: false as const, message: error.message };
  }

  // Convert the uploaded Storage object path into the public URL saved on the product.
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);
  return { ok: true as const, url: data.publicUrl };
}

function getProductImageExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return extension;
}

function getContentTypeFromExtension(extension: string) {
  if (extension === "svg") return "image/svg+xml";
  if (extension === "jpg") return "image/jpeg";
  return `image/${extension}`;
}
