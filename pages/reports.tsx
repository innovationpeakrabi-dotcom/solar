import { Download, Printer } from "lucide-react";
import { BarChartCard } from "@/components/charts/bar-chart";
import { DonutChartCard } from "@/components/charts/donut-chart";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { monthlyMovement, reportRows } from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const { toast } = useToast();

  return (
    <DashboardLayout title="รายงาน">
      <PageHeader
        title="รายงาน"
        description="วิเคราะห์จำนวนสินค้า อัตราหมุนเวียน และความเคลื่อนไหวของคลัง"
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "Export รายงานแล้ว", description: "ตัวอย่าง UI สำหรับไฟล์ Excel/PDF" })}><Download className="h-4 w-4" />Export</Button>
            <Button variant="outline" onClick={() => toast({ title: "เตรียมพิมพ์รายงาน", description: "Mock print action" })}><Printer className="h-4 w-4" />Print</Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total SKUs" value="1,284" caption="+8.2% จากเดือนก่อน" />
        <SummaryCard label="Turnover Rate" value="6.8x" caption="เฉลี่ย 90 วันล่าสุด" />
        <SummaryCard label="Dead Stock" value="18 SKU" caption="ไม่มีความเคลื่อนไหว 120 วัน" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <BarChartCard
          title="Movement Analysis"
          description="รับเข้าและเบิกออกตามเดือน"
          data={monthlyMovement}
          keys={["in", "out"]}
          colors={["#2563EB", "#F97316"]}
        />
        <DonutChartCard />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Inventory Performance</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead className="text-right">คงเหลือ</TableHead>
                  <TableHead className="text-right">Turnover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-slate-950 dark:text-white">{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.stock)}</TableCell>
                    <TableCell className="text-right">{row.turnover}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <EmptyState title="ไม่มีรายงานค้างส่ง" description="เมื่อมีรายงานที่รออนุมัติหรือส่งออก ระบบจะแสดงในพื้นที่นี้" />
      </section>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
        <p className="mt-3 text-xs text-emerald-600">{caption}</p>
      </CardContent>
    </Card>
  );
}
