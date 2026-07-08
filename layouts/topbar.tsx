import { Bell, Menu, Moon, ShieldCheck, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-[12.5px] font-medium text-emerald-700 shadow-sm md:flex dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <Zap className="h-4 w-4" />
            Grid Online
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-2 text-[12.5px] font-medium text-blue-700 shadow-sm xl:flex dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
            <ShieldCheck className="h-4 w-4" />
            Supabase Ready
          </div>

          <Button variant="ghost" size="icon" aria-label="แจ้งเตือน">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="สลับโหมดสี" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
