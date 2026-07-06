import { DocumentForm } from "@/components/forms/document-form";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function StockOutPage() {
  return (
    <DashboardLayout title="เบิกสินค้าออก">
      <PageHeader title="เบิกสินค้าออก" description="ควบคุมการเบิกสินค้า แผนกผู้เบิก จำนวน และรายการเอกสาร" />
      <DocumentForm type="out" />
    </DashboardLayout>
  );
}
