import { SunMedium } from "lucide-react";
import { SolarDashboard } from "@/components/dashboard/solar-dashboard";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Solar Dashboard">
      <PageHeader
        title="Solar Inventory UI"
        description="ระบบจัดการสต็อกอุปกรณ์ Solar แบบ Modern SaaS Dashboard สำหรับดูหมวดหมู่ สินค้าคงเหลือ และรายการอุปกรณ์ติดตั้งจากข้อมูลจริงใน Supabase"
        actions={
          <Button>
            <SunMedium className="h-4 w-4" />
            Solar Theme
          </Button>
        }
      />
      <SolarDashboard />
    </DashboardLayout>
  );
}
