import type { ReactNode } from "react";
import { Plus, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function UsersPage() {
  return (
    <DashboardLayout title="ผู้ใช้งาน">
      <PageHeader
        title="ผู้ใช้งาน"
        description="หน้านี้ยังไม่เชื่อมตารางผู้ใช้งานใน Supabase จึงไม่แสดงข้อมูล mock เพื่อป้องกันข้อมูลไม่ตรงกับฐานข้อมูล"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                เพิ่มผู้ใช้งาน
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
                <DialogDescription>ฟอร์มตัวอย่างนี้ยังไม่บันทึกลงฐานข้อมูล เพราะยังไม่มีตาราง users ใน schema ปัจจุบัน</DialogDescription>
              </DialogHeader>
              <div className="mt-5 grid gap-4">
                <Field label="ชื่อผู้ใช้งาน">
                  <Input placeholder="ชื่อ-นามสกุล" />
                </Field>
                <Field label="อีเมล">
                  <Input type="email" placeholder="name@company.co.th" />
                </Field>
                <Field label="บทบาท">
                  <Select>
                    <option>Inventory Manager</option>
                    <option>Warehouse Staff</option>
                    <option>Auditor</option>
                  </Select>
                </Field>
                <Button>
                  <ShieldCheck className="h-4 w-4" />
                  เตรียมส่งคำเชิญ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">ยังไม่มีตารางผู้ใช้งานใน Supabase</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            ลบข้อมูล mock ออกจากหน้านี้แล้ว เพื่อให้ข้อมูลบนหน้าเว็บไม่คลาดเคลื่อนจากฐานข้อมูลจริง
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
