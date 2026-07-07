import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-full border border-slate-200 bg-white/90 px-4 text-[14.5px] font-normal leading-none text-slate-900 shadow-sm backdrop-blur transition-all placeholder:font-normal placeholder:text-slate-400/80 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/10 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-400/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-[13.5px] font-medium leading-5 text-slate-700 dark:text-slate-200", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-[14.5px] font-normal leading-6 text-slate-900 shadow-sm transition-all placeholder:text-slate-400/80 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/10 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-full border border-slate-200 bg-white/90 px-4 text-[14.5px] font-normal leading-none text-slate-900 shadow-sm transition-all focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/10 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100",
        className
      )}
      {...props}
    />
  );
}
