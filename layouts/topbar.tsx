import { Bell, Menu, Moon, Search, Sun, Zap } from "lucide-react";
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
    <header className="sticky top-0 z-20 border-b border-cyan-900/10 bg-white/82 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button className="lg:hidden" variant="ghost" size="icon" aria-label="เปิดเมนู" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-700/60" />
          <Input
            className="max-w-xl border-cyan-100 bg-white/90 pl-9 focus:border-cyan-400 focus:ring-cyan-400/15"
            placeholder="ค้นหาแผงโซลาร์, inverter, battery, เอกสาร..."
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 md:flex">
            <Zap className="h-4 w-4" />
            Grid Online
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

          <div className="ml-1 hidden items-center gap-3 rounded-md border border-cyan-100 bg-white px-2 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-md object-cover"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">อริสา เมธากุล</p>
              <p className="text-xs text-slate-500">Solar Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
