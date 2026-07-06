import type { LucideIcon } from "lucide-react";

export type ProductStatus = "active" | "low-stock" | "out-of-stock" | "draft";
export type MovementType = "in" | "out" | "adjust";
export type MovementStatus = "completed" | "pending" | "cancelled";

export interface KpiMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export interface Product {
  id: string;
  image: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  status: ProductStatus;
  supplier: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  color: string;
}

export interface Movement {
  id: string;
  documentNo: string;
  type: MovementType;
  productName: string;
  quantity: number;
  actor: string;
  date: string;
  status: MovementStatus;
  note: string;
}

export interface DocumentLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
}

export interface ReportRow {
  id: string;
  name: string;
  category: string;
  stock: number;
  turnover: number;
}
