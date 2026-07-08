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
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 pt-[env(safe-area-inset-top)] shadow-[0_10px_28px_rgba(15,23,42,0.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 sm:bg-white/70 sm:pt-0 sm:shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex min-h-[56px] items-center gap-2 px-4 py-2 sm:min-h-16 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <Button className="h-10 w-10 shadow-sm lg:hidden" variant="ghost" size="icon" aria-label="เปิดเมนู" onClick={onMenuClick}>
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

          <Button className="h-10 w-10 shadow-sm sm:h-9 sm:w-9 sm:shadow-none" variant="ghost" size="icon" aria-label="แจ้งเตือน">
            <Bell className="h-5 w-5" />
          </Button>
          <Button className="h-10 w-10 shadow-sm sm:h-9 sm:w-9 sm:shadow-none" variant="ghost" size="icon" aria-label="สลับโหมดสี" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

