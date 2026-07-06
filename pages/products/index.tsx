import Link from "next/link";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function ProductsPage() {
  return (
    <DashboardLayout title="สินค้า">
      <PageHeader
        title="สินค้า"
        description="จัดการข้อมูลสินค้า บาร์โค้ด สถานะ และปริมาณคงเหลือในคลัง"
        actions={
          <Link href="/products/new">
            <Button><Plus className="h-4 w-4" />เพิ่มสินค้า</Button>
          </Link>
        }
      />

      <Card className="mb-5">
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="ค้นหาชื่อสินค้า, SKU, Barcode" />
          </div>
          <Select defaultValue="all">
            <option value="all">ทุกหมวดหมู่</option>
            <option>ไอทีและอุปกรณ์</option>
            <option>อุปกรณ์สำนักงาน</option>
            <option>บรรจุภัณฑ์</option>
          </Select>
          <Select defaultValue="latest">
            <option value="latest">เรียงล่าสุด</option>
            <option value="stock">คงเหลือน้อยสุด</option>
            <option value="name">ชื่อสินค้า A-Z</option>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="h-4 w-4" />Filter</Button>
            <Button variant="outline" size="icon" aria-label="ตั้งค่าตาราง"><SlidersHorizontal className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <ProductTable />
    </DashboardLayout>
  );
}
