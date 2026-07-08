import { SolarDashboard } from "@/components/dashboard/solar-dashboard";
import { DashboardLayout } from "@/layouts/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Solar Dashboard">
      <SolarDashboard />
    </DashboardLayout>
  );
}
