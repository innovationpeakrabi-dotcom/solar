import type { ReactNode } from "react";
import { Bell, Database, LockKeyhole, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  return (
    <DashboardLayout title="ตั้งค่า">
      <PageHeader title="ตั้งค่า" description="ตั้งค่าคลังสินค้า การแจ้งเตือน เอกสาร และสิทธิ์การใช้งาน" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลคลังหลัก</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="ชื่อคลัง"><Input defaultValue="Bangkok Distribution Center" /></Field>
            <Field label="รหัสคลัง"><Input defaultValue="BKK-DC-01" /></Field>
            <Field label="วิธีคิดต้นทุน">
              <Select defaultValue="fifo">
                <option value="fifo">FIFO</option>
                <option value="batch">Batch Tracking</option>
              </Select>
            </Field>
            <Field label="สกุลเงิน"><Input defaultValue="THB" /></Field>
            <div className="flex justify-end md:col-span-2">
              <Button onClick={() => toast({ title: "บันทึกการตั้งค่าแล้ว", description: "Mock setting updated" })}><Save className="h-4 w-4" />บันทึก</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <SettingCard icon={Bell} title="การแจ้งเตือน" description="แจ้งเตือนสินค้าใกล้หมดและเอกสารรออนุมัติ" />
          <SettingCard icon={LockKeyhole} title="ความปลอดภัย" description="กำหนด session, 2FA และสิทธิ์ตามบทบาท" />
          <SettingCard icon={Database} title="การเชื่อมต่อข้อมูล" description="พื้นที่สำหรับต่อฐานข้อมูลและ API ในอนาคต" />
        </div>
      </div>
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

function SettingCard({
  icon: Icon,
  title,
  description
}: {
  icon: typeof Bell;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-soft">
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
