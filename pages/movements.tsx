import { MovementTable } from "@/components/movements/movement-table";
import { MovementTimeline } from "@/components/movements/timeline";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function MovementsPage() {
  return (
    <DashboardLayout title="ประวัติการเคลื่อนไหว">
      <PageHeader title="ประวัติการเคลื่อนไหว" description="Timeline และ Activity Log สำหรับตรวจสอบการรับเข้า เบิกออก และปรับยอด" />
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <MovementTimeline />
        <MovementTable />
      </div>
    </DashboardLayout>
  );
}
