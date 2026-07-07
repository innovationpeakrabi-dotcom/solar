import type { KpiMetric } from "@/types/inventory";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const Icon = metric.icon;

  return (
    <Card className="animate-slide-up hover:-translate-y-0.5 hover:shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-normal text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className="mt-2 text-[32px] font-bold leading-none tracking-normal text-slate-950 dark:text-white">{metric.value}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-blue-200">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p
          className={cn(
            "mt-5 text-[12.5px] font-medium",
            metric.trend === "up" && "text-emerald-600",
            metric.trend === "down" && "text-amber-600",
            metric.trend === "neutral" && "text-slate-500"
          )}
        >
          {metric.change}
        </p>
      </CardContent>
    </Card>
  );
}
