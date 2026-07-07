import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import type { StockMovement } from "@/hooks/use-stock-movements";

export function MovementTable({ movements, compact = false }: { movements: StockMovement[]; compact?: boolean }) {
  const rows = compact ? movements.slice(0, 4) : movements;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ประเภท</TableHead>
              <TableHead>สินค้า</TableHead>
              <TableHead className="text-right">จำนวน</TableHead>
              <TableHead className="text-right">ก่อนหน้า</TableHead>
              <TableHead className="text-right">หลังทำรายการ</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>รายละเอียด</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <MovementTypeBadge type={movement.movementType} />
                </TableCell>
                <TableCell>{movement.productName}</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(movement.quantity)}</TableCell>
                <TableCell className="text-right">{movement.beforeQuantity ?? "-"}</TableCell>
                <TableCell className="text-right">{movement.afterQuantity ?? "-"}</TableCell>
                <TableCell>{formatDate(movement.createdAt)}</TableCell>
                <TableCell>{movement.description ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function MovementTypeBadge({ type }: { type: StockMovement["movementType"] }) {
  const map = {
    IN: { label: "รับเข้า", variant: "green" as const },
    OUT: { label: "เบิกออก", variant: "blue" as const },
    ADJUST: { label: "ปรับยอด", variant: "amber" as const }
  };

  return <Badge variant={map[type].variant}>{map[type].label}</Badge>;
}
