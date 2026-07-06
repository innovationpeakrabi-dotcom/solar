import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BarItem = Record<string, number | string> & { label: string };

export function BarChartCard({
  title,
  description,
  data,
  keys,
  colors
}: {
  title: string;
  description: string;
  data: BarItem[];
  keys: string[];
  colors: string[];
}) {
  const max = Math.max(...data.flatMap((item) => keys.map((key) => Number(item[key]))));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-end gap-3">
          {data.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-52 w-full items-end justify-center gap-1">
                {keys.map((key, index) => (
                  <div
                    key={key}
                    className="w-full max-w-8 rounded-t-md transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(Number(item[key]) / max) * 100}%`,
                      backgroundColor: colors[index]
                    }}
                    title={`${key}: ${item[key]}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {keys.map((key, index) => (
            <div key={key} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors[index] }} />
              {key}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
