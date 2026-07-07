import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart3, LayoutDashboard, PlugZap, Sparkles, SunMedium, Tags, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "จัดการหมวดหมู่", href: "/categories", icon: Tags }
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  return (
    <>
      <button
        className={cn("fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")}
        aria-label="ปิดเมนู"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden border-r border-white/10 bg-[#06101f] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.25),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(6,182,212,0.2),transparent_26%)]" />

        <div className="relative flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-500 text-slate-950 shadow-[0_18px_40px_rgba(249,115,22,0.32)]">
            <SunMedium className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">Solar Stock Pro</p>
            <p className="mt-0.5 text-xs font-medium text-cyan-100/80">Premium Inventory Suite</p>
          </div>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</div>
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = router.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-white text-slate-950 shadow-[0_16px_38px_rgba(8,47,73,0.25)]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      active ? "bg-gradient-to-br from-orange-400 to-yellow-300 text-slate-950" : "bg-white/8 text-cyan-100 group-hover:bg-white/12"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <p className="text-sm font-semibold text-white">Live Solar Ops</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric icon={Zap} label="Grid" value="Online" />
              <Metric icon={BarChart3} label="Stock" value="Synced" />
            </div>
          </div>
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <PlugZap className="h-4 w-4 text-yellow-300" />
              <p className="text-sm font-semibold text-white">คลังโซลาร์หลัก</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Bangkok Solar Distribution</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <Icon className="h-4 w-4 text-cyan-200" />
      <p className="mt-2 text-[11px] text-slate-400">{label}</p>
      <p className="text-xs font-bold text-white">{value}</p>
    </div>
  );
}
