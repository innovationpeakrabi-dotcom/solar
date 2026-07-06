import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LineChartCard({
  title,
  description,
  data
}: {
  title: string;
  description: string;
  data: { label: string; in: number; out: number }[];
}) {
  const width = 640;
  const height = 220;
  const max = Math.max(...data.flatMap((item) => [item.in, item.out]));
  const point = (value: number, index: number) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (value / max) * (height - 24) - 8;
    return `${x},${y}`;
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
            <defs>
              <linearGradient id="inLine" x1="0" x2="1">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((line) => (
              <line
                key={line}
                x1="0"
                x2={width}
                y1={(height / 4) * line + 12}
                y2={(height / 4) * line + 12}
                stroke="#E2E8F0"
                strokeDasharray="4 6"
              />
            ))}
            <polyline points={data.map((item, index) => point(item.in, index)).join(" ")} fill="none" stroke="url(#inLine)" strokeWidth="4" strokeLinecap="round" />
            <polyline points={data.map((item, index) => point(item.out, index)).join(" ")} fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
            {data.map((item, index) => (
              <text key={item.label} x={(index / (data.length - 1)) * width} y={height - 2} textAnchor="middle" className="fill-slate-500 text-xs">
                {item.label}
              </text>
            ))}
          </svg>
        </div>
        <div className="mt-3 flex gap-5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-brand-500" />รับเข้า</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-orange-500" />เบิกออก</span>
        </div>
      </CardContent>
    </Card>
  );
}
