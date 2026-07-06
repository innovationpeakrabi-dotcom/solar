import { movements } from "@/data/mock";
import { formatDate, formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { MovementStatusBadge, MovementTypeBadge } from "@/components/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MovementTable({ compact = false }: { compact?: boolean }) {
  const rows = compact ? movements.slice(0, 4) : movements;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เอกสาร</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>สินค้า</TableHead>
              <TableHead className="text-right">จำนวน</TableHead>
              <TableHead>ผู้ทำรายการ</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-medium text-slate-950 dark:text-white">{movement.documentNo}</TableCell>
                <TableCell><MovementTypeBadge type={movement.type} /></TableCell>
                <TableCell>{movement.productName}</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(movement.quantity)}</TableCell>
                <TableCell>{movement.actor}</TableCell>
                <TableCell>{formatDate(movement.date)}</TableCell>
                <TableCell><MovementStatusBadge status={movement.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
