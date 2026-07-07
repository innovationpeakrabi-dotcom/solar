import { CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-slate-950 dark:text-white">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-[13px] font-normal leading-5 text-slate-500 dark:text-slate-400">{toast.description}</p> : null}
            </div>
            <Button variant="ghost" size="icon" aria-label="ปิดแจ้งเตือน" onClick={() => dismiss(toast.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
