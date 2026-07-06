import { movements } from "@/data/mock";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovementStatusBadge, MovementTypeBadge } from "@/components/status-badge";

export function MovementTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {movements.map((movement) => (
            <div key={movement.id} className="relative pl-8">
              <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-blue-100 dark:ring-blue-950" />
              <span className="absolute bottom-[-24px] left-[5px] top-5 w-px bg-slate-200 last:hidden dark:bg-slate-800" />
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-2">
                  <MovementTypeBadge type={movement.type} />
                  <MovementStatusBadge status={movement.status} />
                  <span className="text-xs text-slate-500">{formatDate(movement.date)}</span>
                </div>
                <p className="mt-2 font-medium text-slate-950 dark:text-white">{movement.productName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{movement.note}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
