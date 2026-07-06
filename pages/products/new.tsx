import { ProductForm } from "@/components/forms/product-form";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function NewProductPage() {
  return (
    <DashboardLayout title="เพิ่มสินค้า">
      <PageHeader title="เพิ่มสินค้า" description="สร้างข้อมูลสินค้าใหม่พร้อมจุดสั่งซื้อและจำนวนเริ่มต้น" />
      <ProductForm />
    </DashboardLayout>
  );
}
