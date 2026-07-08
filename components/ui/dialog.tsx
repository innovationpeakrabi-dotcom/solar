import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          className={cn(
            "relative w-[min(560px,calc(100vw-32px))] rounded-xl border border-slate-200 bg-white p-6 shadow-soft outline-none data-[state=open]:animate-modal-scale dark:border-slate-800 dark:bg-slate-900",
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <Button className="absolute right-3 top-3" size="icon" variant="ghost" aria-label="ปิด">
              <X className="h-4 w-4" />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-[22px] font-semibold leading-tight tracking-[0.004em] text-slate-950 dark:text-white", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("mt-2 text-[13.5px] font-normal leading-6 text-slate-500 dark:text-slate-400", className)} {...props} />;
}
