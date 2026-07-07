export type SolarProductStatus = "พร้อมใช้งาน" | "ใกล้หมด" | "หมดสต๊อก";

export type SolarProductCategoryName = string;

export type SolarCategory = {
  id: string;
  name: SolarProductCategoryName;
  description: string;
  icon?: string;
  color: string;
  productCount?: number;
};

export type SolarProduct = {
  id: string;
  sku: string;
  name: string;
  categoryId: string | null;
  category: SolarProductCategoryName;
  brand: string;
  stock: number;
  unit: string;
  status: SolarProductStatus;
  image?: string;
  note?: string;
};

export type NewSolarProductInput = {
  sku: string;
  name: string;
  category: SolarProductCategoryName;
  brand: string;
  stock: number;
  unit: string;
  image: string;
  imageFile?: File | null;
  note: string;
};

export type CategoryFormInput = {
  name: string;
  description: string;
  icon: string;
  color: string;
};
