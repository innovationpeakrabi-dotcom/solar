import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, PlugZap, SunMedium, Tags } from "lucide-react";
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
        className={cn("fixed inset-0 z-30 bg-slate-950/40 lg:hidden", open ? "block" : "hidden")}
        aria-label="ปิดเมนู"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-cyan-300/20 bg-[#07111f] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-slate-950 shadow-[0_0_24px_rgba(250,204,21,.25)]">
            <SunMedium className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Solar Stock Pro</p>
            <p className="text-xs text-cyan-200">Electrical ERP Suite</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
            <div className="flex items-center gap-2">
              <PlugZap className="h-4 w-4 text-yellow-300" />
              <p className="text-sm font-semibold text-white">คลังโซลาร์หลัก</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Bangkok Solar Distribution</p>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-cyan-300" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
