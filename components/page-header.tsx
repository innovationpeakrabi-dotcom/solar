import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-5 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:flex-row sm:items-end sm:justify-between lg:p-6">
      <div className="min-w-0">
        <div className="mb-3 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200">
          Solar Inventory Platform
        </div>
        <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
