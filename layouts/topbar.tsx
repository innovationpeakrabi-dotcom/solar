import { Bell, Menu, Moon, Search, ShieldCheck, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({
  onMenuClick,
  darkMode,
  onToggleDarkMode
}: {
  onMenuClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button className="lg:hidden" variant="ghost" size="icon" aria-label="เปิดเมนู" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-12 max-w-2xl border-white/70 bg-white/90 pl-11 text-[14.5px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] placeholder:text-slate-400/75 focus:border-orange-300 dark:border-white/10 dark:bg-slate-900/80"
            placeholder="ค้นหาสินค้า หมวดหมู่ เอกสาร หรือสต็อก..."
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-[12.5px] font-medium text-emerald-700 shadow-sm md:flex dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <Zap className="h-4 w-4" />
            Grid Online
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-2 text-[12.5px] font-medium text-blue-700 shadow-sm xl:flex dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
            <ShieldCheck className="h-4 w-4" />
            Supabase Ready
          </div>

          <Button variant="ghost" size="icon" aria-label="ค้นหา">
            <Search className="h-5 w-5 sm:hidden" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="แจ้งเตือน">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="สลับโหมดสี" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="ml-1 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-2 py-1.5 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/80 sm:flex">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
              alt="Profile"
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800"
            />
            <div className="pr-2 leading-tight">
              <p className="text-[14px] font-medium text-slate-950 dark:text-white">อริสา เมธากุล</p>
              <p className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400">Solar Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
