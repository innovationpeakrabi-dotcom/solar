import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
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
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange, triggerRef }}>
      <div className="relative overflow-visible">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const { open, onOpenChange, triggerRef } = useDropdownMenu();

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as ReactElement<{
      onClick?: (event: React.MouseEvent) => void;
      "aria-expanded"?: boolean;
      ref?: Ref<HTMLElement>;
    }>;

    return cloneElement(child, {
      "aria-expanded": open,
      ref: mergeRefs(triggerRef, child.props.ref),
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        onOpenChange(!open);
      }
    });
  }

  return (
    <button ref={triggerRef as React.RefObject<HTMLButtonElement>} type="button" aria-expanded={open} onClick={() => onOpenChange(!open)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  className,
  children,
  side = "bottom",
  align = "end",
  ...props
}: HTMLAttributes<HTMLDivElement> & { side?: "bottom" | "top"; align?: "start" | "center" | "end" }) {
  const { open, onOpenChange, triggerRef } = useDropdownMenu();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", left: 0, top: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (!trigger || !content) return;

      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const gap = 8;
      const viewportPadding = 8;
      const bottomTop = triggerRect.bottom + gap;
      const topTop = triggerRect.top - contentRect.height - gap;
      const shouldFlipTop = side === "bottom" && bottomTop + contentRect.height > window.innerHeight - viewportPadding && topTop >= viewportPadding;
      const nextTop = shouldFlipTop || side === "top" ? Math.max(viewportPadding, topTop) : bottomTop;

      const alignedLeft =
        align === "start"
          ? triggerRect.left
          : align === "center"
            ? triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            : triggerRect.right - contentRect.width;
      const nextLeft = Math.min(Math.max(viewportPadding, alignedLeft), window.innerWidth - contentRect.width - viewportPadding);

      setStyle({ position: "fixed", left: nextLeft, top: nextTop });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, open, side, triggerRef]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onOpenChange(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onOpenChange, open, triggerRef]);

  if (!open) return null;

  const content = (
    <div
      ref={contentRef}
      style={style}
      className={cn(
        "z-[9999] w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  return mounted ? createPortal(content, document.body) : null;
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
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] font-normal leading-6 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
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

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
        return;
      }
      (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}
