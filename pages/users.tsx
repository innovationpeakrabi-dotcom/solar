import type { ReactNode } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { users } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function UsersPage() {
  return (
    <DashboardLayout title="ผู้ใช้งาน">
      <PageHeader
        title="ผู้ใช้งาน"
        description="บริหารผู้ใช้งาน บทบาท และสิทธิ์การเข้าถึงข้อมูลคลังสินค้า"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" />เพิ่มผู้ใช้งาน</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
                <DialogDescription>กรอกข้อมูลพื้นฐานและเลือกบทบาทสำหรับระบบสต๊อกสินค้า</DialogDescription>
              </DialogHeader>
              <div className="mt-5 grid gap-4">
                <Field label="ชื่อผู้ใช้งาน"><Input placeholder="ชื่อ-นามสกุล" /></Field>
                <Field label="อีเมล"><Input type="email" placeholder="name@company.co.th" /></Field>
                <Field label="บทบาท">
                  <Select>
                    <option>Inventory Manager</option>
                    <option>Warehouse Staff</option>
                    <option>Auditor</option>
                  </Select>
                </Field>
                <Button><ShieldCheck className="h-4 w-4" />ส่งคำเชิญ</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>ทีมคลังสินค้า</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-950 dark:text-white">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell><Badge variant={user.status === "Active" ? "green" : "amber"}>{user.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
