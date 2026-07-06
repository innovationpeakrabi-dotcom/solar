import { Badge } from "@/components/ui/badge";
import type { MovementStatus, MovementType, ProductStatus } from "@/types/inventory";

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const map = {
    active: { label: "พร้อมขาย", variant: "green" as const },
    "low-stock": { label: "ใกล้หมด", variant: "amber" as const },
    "out-of-stock": { label: "หมดสต๊อก", variant: "red" as const },
    draft: { label: "ฉบับร่าง", variant: "slate" as const }
  };

  return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
}

export function MovementTypeBadge({ type }: { type: MovementType }) {
  const map = {
    in: { label: "รับเข้า", variant: "green" as const },
    out: { label: "เบิกออก", variant: "blue" as const },
    adjust: { label: "ปรับยอด", variant: "amber" as const }
  };

  return <Badge variant={map[type].variant}>{map[type].label}</Badge>;
}

export function MovementStatusBadge({ status }: { status: MovementStatus }) {
  const map = {
    completed: { label: "สำเร็จ", variant: "green" as const },
    pending: { label: "รอดำเนินการ", variant: "amber" as const },
    cancelled: { label: "ยกเลิก", variant: "red" as const }
  };

  return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
}
