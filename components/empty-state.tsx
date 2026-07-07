import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
        <PackageOpen className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-[17px] font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-[13.5px] font-normal leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      <Button className="mt-5" variant="outline">รีเฟรชข้อมูล</Button>
    </div>
  );
}
