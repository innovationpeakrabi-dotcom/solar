import { Download, Printer } from "lucide-react";
import { BarChartCard } from "@/components/charts/bar-chart";
import { DonutChartCard } from "@/components/charts/donut-chart";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/format";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function ReportsPage() {
  const { toast } = useToast();
  const { categories, products, productsError } = useInventory();
  const lowStock = products.filter((product) => product.status === "ใกล้หมด").length;
  const outOfStock = products.filter((product) => product.status === "หมดสต๊อก").length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const categoryStockData = categories
    .map((category) => ({
      label: category.name,
      stock: products.filter((product) => product.categoryId === category.id).reduce((sum, product) => sum + product.stock, 0)
    }))
    .filter((item) => item.stock > 0)
    .slice(0, 8);

  return (
    <DashboardLayout title="รายงาน">
      <PageHeader
        title="รายงาน"
        description="วิเคราะห์จำนวนสินค้า สต็อกคงเหลือ และสถานะสินค้าจากข้อมูลจริงใน Supabase"
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "เตรียม Export รายงาน", description: "ข้อมูลมาจาก Supabase แล้ว" })}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "เตรียมพิมพ์รายงาน", description: "ข้อมูลมาจาก Supabase แล้ว" })}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </>
        }
      />

      {productsError ? (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {productsError}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Products" value={formatNumber(products.length)} caption={`${formatNumber(categories.length)} หมวดหมู่จาก Supabase`} />
        <SummaryCard label="Total Stock" value={formatNumber(totalStock)} caption="รวมจำนวนคงเหลือทั้งหมด" />
        <SummaryCard label="Stock Alerts" value={formatNumber(lowStock + outOfStock)} caption={`${formatNumber(lowStock)} ใกล้หมด / ${formatNumber(outOfStock)} หมดสต็อก`} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <BarChartCard
          title="Stock by Category"
          description="จำนวนคงเหลือรวมตามหมวดหมู่จาก Supabase"
          data={categoryStockData.length > 0 ? categoryStockData : [{ label: "No data", stock: 0 }]}
          keys={["stock"]}
          colors={["#F97316"]}
        />
        <DonutChartCard categories={categories} products={products} />
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
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 12).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-slate-950 dark:text-white">{row.name}</TableCell>
                    <TableCell>{row.category || "-"}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.stock)}</TableCell>
                    <TableCell>{row.status}</TableCell>
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
