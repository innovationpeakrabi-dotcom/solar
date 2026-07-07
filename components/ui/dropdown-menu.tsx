import { Children, cloneElement, createContext, isValidElement, useContext, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used inside DropdownMenu");
  }
  return context;
}

export function DropdownMenu({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const { open, onOpenChange } = useDropdownMenu();

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as ReactElement<{ onClick?: (event: React.MouseEvent) => void; "aria-expanded"?: boolean }>;

    return cloneElement(child, {
      "aria-expanded": open,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        onOpenChange(!open);
      }
    });
  }

  return (
    <button type="button" aria-expanded={open} onClick={() => onOpenChange(!open)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open } = useDropdownMenu();
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onSelect,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { onSelect?: () => void | Promise<void> }) {
  const { onOpenChange } = useDropdownMenu();

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
      onClick={() => {
        void onSelect?.();
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-slate-200 dark:bg-slate-800", className)} {...props} />;
}
