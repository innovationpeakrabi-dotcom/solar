import { categories } from "@/data/mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DonutChartCard() {
  const total = categories.reduce((sum, category) => sum + category.productCount, 0);
  let offset = 25;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>สัดส่วนจำนวนสินค้าตามหมวดหมู่</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <svg viewBox="0 0 42 42" className="h-44 w-44 shrink-0">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
            {categories.map((category) => {
              const dash = (category.productCount / total) * 100;
              const segment = (
                <circle
                  key={category.id}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={category.color}
                  strokeWidth="6"
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeDashoffset={offset}
                />
              );
              offset -= dash;
              return segment;
            })}
            <text x="21" y="20" textAnchor="middle" className="fill-slate-950 text-[5px] font-semibold dark:fill-white">
              {total}
            </text>
            <text x="21" y="25" textAnchor="middle" className="fill-slate-500 text-[3px]">
              รายการ
            </text>
          </svg>
          <div className="w-full space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: category.color }} />
                  <span className="truncate text-slate-700 dark:text-slate-200">{category.name}</span>
                </div>
                <span className="font-medium text-slate-950 dark:text-white">{category.productCount}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
