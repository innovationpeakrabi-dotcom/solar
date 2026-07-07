import { MovementTable } from "@/components/movements/movement-table";
import { MovementTimeline } from "@/components/movements/timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockMovements } from "@/hooks/use-stock-movements";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function MovementsPage() {
  const { movements, loading, error } = useStockMovements();

  return (
    <DashboardLayout title="ประวัติการเคลื่อนไหว">
      <PageHeader title="ประวัติการเคลื่อนไหว" description="Timeline และ Activity Log จากตาราง stock_movements ใน Supabase" />

      {error ? (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      ) : movements.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <MovementTimeline movements={movements} />
          <MovementTable movements={movements} />
        </div>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
          ยังไม่มีข้อมูล stock_movements ใน Supabase
        </div>
      )}
    </DashboardLayout>
  );
}
