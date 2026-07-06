import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  PackageCheck,
  PackageSearch,
} from "lucide-react";
import type { Category, DocumentLine, KpiMetric, Movement, Product, ReportRow } from "@/types/inventory";

export const products: Product[] = [
  {
    id: "p-001",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1001",
    barcode: "8850123456781",
    name: "เธเธฃเธฐเธ”เธฒเธฉเธ–เนเธฒเธขเน€เธญเธเธชเธฒเธฃ A4 80 เนเธเธฃเธก",
    category: "เธญเธธเธเธเธฃเธ“เนเธชเธณเธเธฑเธเธเธฒเธ",
    unit: "เธฃเธตเธก",
    stock: 428,
    minStock: 80,
    status: "active",
    supplier: "Bangkok Office Supply"
  },
  {
    id: "p-002",
    image: "https://images.unsplash.com/photo-1587135991058-8816b028691f?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1002",
    barcode: "8850123456782",
    name: "เธซเธกเธถเธเธเธดเธกเธเน LaserJet 410A",
    category: "เนเธญเธ—เธตเนเธฅเธฐเธญเธธเธเธเธฃเธ“เน",
    unit: "เธเธฅเนเธญเธ",
    stock: 32,
    minStock: 25,
    status: "active",
    supplier: "Metro Technology"
  },
  {
    id: "p-003",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1003",
    barcode: "8850123456783",
    name: "เน€เธเธฃเธทเนเธญเธเธชเนเธเธเธเธฒเธฃเนเนเธเนเธ”เนเธฃเนเธชเธฒเธข",
    category: "เธเธฅเธฑเธเธชเธดเธเธเนเธฒ",
    unit: "เน€เธเธฃเธทเนเธญเธ",
    stock: 8,
    minStock: 12,
    status: "low-stock",
    supplier: "Warehouse Pro"
  },
  {
    id: "p-004",
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1004",
    barcode: "8850123456784",
    name: "เธเธฅเนเธญเธเธเธฑเธชเธ”เธธเน€เธเธญเธฃเน 0",
    category: "เธเธฃเธฃเธเธธเธ เธฑเธ“เธ‘เน",
    unit: "เนเธเนเธ",
    stock: 0,
    minStock: 50,
    status: "out-of-stock",
    supplier: "Pack Master"
  },
  {
    id: "p-005",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1005",
    barcode: "8850123456785",
    name: "เธเธญเธกเธญเธเธดเน€เธ•เธญเธฃเน 24 เธเธดเนเธง",
    category: "เนเธญเธ—เธตเนเธฅเธฐเธญเธธเธเธเธฃเธ“เน",
    unit: "เน€เธเธฃเธทเนเธญเธ",
    stock: 18,
    minStock: 10,
    status: "active",
    supplier: "Metro Technology"
  },
  {
    id: "p-006",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=160&q=80",
    sku: "ITM-1006",
    barcode: "8850123456786",
    name: "เนเธเนเธ•เธเธธเนเธเธชเธณเธซเธฃเธฑเธเธเธเธฑเธเธเธฒเธ",
    category: "เธ—เธฃเธฑเธเธขเนเธชเธดเธเธเธฃเธดเธฉเธฑเธ—",
    unit: "เน€เธเธฃเธทเนเธญเธ",
    stock: 14,
    minStock: 6,
    status: "active",
    supplier: "Capital Computer"
  }
];

export const categories: Category[] = [
  { id: "c-001", name: "เธญเธธเธเธเธฃเธ“เนเธชเธณเธเธฑเธเธเธฒเธ", productCount: 84, color: "#2563EB" },
  { id: "c-002", name: "เนเธญเธ—เธตเนเธฅเธฐเธญเธธเธเธเธฃเธ“เน", productCount: 56, color: "#14B8A6" },
  { id: "c-003", name: "เธเธฅเธฑเธเธชเธดเธเธเนเธฒ", productCount: 22, color: "#F97316" },
  { id: "c-004", name: "เธเธฃเธฃเธเธธเธ เธฑเธ“เธ‘เน", productCount: 37, color: "#8B5CF6" },
  { id: "c-005", name: "เธ—เธฃเธฑเธเธขเนเธชเธดเธเธเธฃเธดเธฉเธฑเธ—", productCount: 18, color: "#64748B" }
];

export const movements: Movement[] = [
  {
    id: "m-001",
    documentNo: "GR-2026-0703-001",
    type: "in",
    productName: "เธเธฃเธฐเธ”เธฒเธฉเธ–เนเธฒเธขเน€เธญเธเธชเธฒเธฃ A4 80 เนเธเธฃเธก",
    quantity: 120,
    actor: "เธเธฃเธดเธเธ—เธฃเน เธงเธเธจเนเนเธเธข",
    date: "2026-07-03T09:20:00+07:00",
    status: "completed",
    note: "เธฃเธฑเธเน€เธเนเธฒเธเธฒเธเนเธเธชเธฑเนเธเธเธทเนเธญ PO-2641"
  },
  {
    id: "m-002",
    documentNo: "GI-2026-0703-004",
    type: "out",
    productName: "เธซเธกเธถเธเธเธดเธกเธเน LaserJet 410A",
    quantity: 4,
    actor: "เธจเธดเธฃเธดเธเธฃ เนเธเนเธงเธกเธ“เธต",
    date: "2026-07-03T10:10:00+07:00",
    status: "completed",
    note: "เน€เธเธดเธเนเธซเนเนเธเธเธเธเธฑเธเธเธต"
  },
  {
    id: "m-003",
    documentNo: "ADJ-2026-0702-002",
    type: "adjust",
    productName: "เธเธฅเนเธญเธเธเธฑเธชเธ”เธธเน€เธเธญเธฃเน 0",
    quantity: 12,
    actor: "เธญเธฃเธฑเธ เธ เธฑเธเธ”เธต",
    date: "2026-07-02T16:30:00+07:00",
    status: "pending",
    note: "เธฃเธญเธ•เธฃเธงเธเธเธฑเธเธฃเธญเธเธชเธธเธ”เธ—เนเธฒเธข"
  },
  {
    id: "m-004",
    documentNo: "GI-2026-0702-007",
    type: "out",
    productName: "เน€เธเธฃเธทเนเธญเธเธชเนเธเธเธเธฒเธฃเนเนเธเนเธ”เนเธฃเนเธชเธฒเธข",
    quantity: 2,
    actor: "เธเธฃเธดเธเธ—เธฃเน เธงเธเธจเนเนเธเธข",
    date: "2026-07-02T13:05:00+07:00",
    status: "completed",
    note: "เธขเนเธฒเธขเนเธเธเธฅเธฑเธเธชเธฒเธเธฒเน€เธเธตเธขเธเนเธซเธกเน"
  }
];

export const kpis: KpiMetric[] = [
  { label: "เธเธณเธเธงเธเธชเธดเธเธเนเธฒ", value: "1,284", change: "+8.2% เธเธฒเธเน€เธ”เธทเธญเธเธเนเธญเธ", trend: "up", icon: PackageSearch },
  { label: "เธเธณเธเธงเธเธเธเน€เธซเธฅเธทเธญ", value: "48,920", change: "+3,120 เธซเธเนเธงเธข", trend: "up", icon: Boxes },
  { label: "เธชเธดเธเธเนเธฒเนเธเธฅเนเธซเธกเธ”", value: "27", change: "เธ•เนเธญเธเธชเธฑเนเธเธเธทเนเธญเน€เธเธดเนเธก", trend: "down", icon: AlertTriangle },
  { label: "เธฃเธฑเธเน€เธเนเธฒเนเธเธงเธฑเธเธเธตเน", value: "186", change: "6 เน€เธญเธเธชเธฒเธฃ", trend: "up", icon: ArrowDownToLine },
  { label: "เน€เธเธดเธเธญเธญเธเนเธเธงเธฑเธเธเธตเน", value: "74", change: "12 เธฃเธฒเธขเธเธฒเธฃ", trend: "neutral", icon: ArrowUpFromLine },
];

export const stockOverview = [
  { label: "Mon", available: 72, reserved: 22 },
  { label: "Tue", available: 76, reserved: 18 },
  { label: "Wed", available: 69, reserved: 28 },
  { label: "Thu", available: 82, reserved: 20 },
  { label: "Fri", available: 88, reserved: 16 },
  { label: "Sat", available: 79, reserved: 24 },
  { label: "Sun", available: 91, reserved: 14 }
];

export const monthlyMovement = [
  { label: "Jan", in: 320, out: 240 },
  { label: "Feb", in: 410, out: 280 },
  { label: "Mar", in: 380, out: 340 },
  { label: "Apr", in: 470, out: 390 },
  { label: "May", in: 520, out: 410 },
  { label: "Jun", in: 590, out: 445 }
];

export const documentLines: DocumentLine[] = [
  { id: "l-001", productName: "เธเธฃเธฐเธ”เธฒเธฉเธ–เนเธฒเธขเน€เธญเธเธชเธฒเธฃ A4 80 เนเธเธฃเธก", sku: "ITM-1001", quantity: 60 },
  { id: "l-002", productName: "เธซเธกเธถเธเธเธดเธกเธเน LaserJet 410A", sku: "ITM-1002", quantity: 8 },
  { id: "l-003", productName: "เธเธฅเนเธญเธเธเธฑเธชเธ”เธธเน€เธเธญเธฃเน 0", sku: "ITM-1004", quantity: 100 }
];

export const reportRows: ReportRow[] = [
  { id: "r-001", name: "เธซเธกเธถเธเธเธดเธกเธเน LaserJet 410A", category: "เนเธญเธ—เธตเนเธฅเธฐเธญเธธเธเธเธฃเธ“เน", stock: 32, turnover: 7.4 },
  { id: "r-002", name: "เนเธเนเธ•เธเธธเนเธเธชเธณเธซเธฃเธฑเธเธเธเธฑเธเธเธฒเธ", category: "เธ—เธฃเธฑเธเธขเนเธชเธดเธเธเธฃเธดเธฉเธฑเธ—", stock: 14, turnover: 2.1 },
  { id: "r-003", name: "เธเธฃเธฐเธ”เธฒเธฉเธ–เนเธฒเธขเน€เธญเธเธชเธฒเธฃ A4 80 เนเธเธฃเธก", category: "เธญเธธเธเธเธฃเธ“เนเธชเธณเธเธฑเธเธเธฒเธ", stock: 428, turnover: 11.8 },
  { id: "r-004", name: "เน€เธเธฃเธทเนเธญเธเธชเนเธเธเธเธฒเธฃเนเนเธเนเธ”เนเธฃเนเธชเธฒเธข", category: "เธเธฅเธฑเธเธชเธดเธเธเนเธฒ", stock: 8, turnover: 4.9 }
];

export const users = [
  { id: "u-001", name: "เธเธฃเธดเธเธ—เธฃเน เธงเธเธจเนเนเธเธข", role: "Inventory Manager", email: "narin@company.co.th", status: "Active" },
  { id: "u-002", name: "เธจเธดเธฃเธดเธเธฃ เนเธเนเธงเธกเธ“เธต", role: "Warehouse Staff", email: "siriporn@company.co.th", status: "Active" },
  { id: "u-003", name: "เธญเธฃเธฑเธ เธ เธฑเธเธ”เธต", role: "Auditor", email: "aran@company.co.th", status: "Invited" }
];

