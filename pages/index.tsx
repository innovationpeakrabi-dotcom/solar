import { SunMedium } from "lucide-react";
import { SolarDashboard } from "@/components/dashboard/solar-dashboard";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Solar Dashboard">
      <PageHeader
        title="Solar Inventory UI"
        description="รูปแบบ UI ใหม่แนวไฟฟ้าและโซลาร์ สำหรับระบบสต๊อกอุปกรณ์พลังงาน แผงโซลาร์ อินเวอร์เตอร์ แบตเตอรี่ และอะไหล่หน้างาน"
        actions={
          <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300">
            <SunMedium className="h-4 w-4" />
            Solar Theme
          </Button>
        }
      />
      <SolarDashboard />
    </DashboardLayout>
  );
}
