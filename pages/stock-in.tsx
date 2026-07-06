import { DocumentForm } from "@/components/forms/document-form";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function StockInPage() {
  return (
    <DashboardLayout title="รับสินค้าเข้า">
      <PageHeader title="รับสินค้าเข้า" description="บันทึกเอกสารรับสินค้าเข้าแบบ ERP พร้อมรายการสินค้าและจำนวน" />
      <DocumentForm type="in" />
    </DashboardLayout>
  );
}
