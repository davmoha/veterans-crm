import * as React from "react";
import { cn } from "../utils";

type DropdownContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <DropdownContext.Provider value={{ open, setOpen }}>{children}</DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const context = React.useContext(DropdownContext)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(!context.open)
    } as React.HTMLAttributes<HTMLElement>);
  }
  return <button onClick={() => context.setOpen(!context.open)}>{children}</button>;
}

export function DropdownMenuContent({ children, className }: { children: React.ReactNode; className?: string; align?: "start" | "end" }) {
  const context = React.useContext(DropdownContext)!;
  if (!context.open) return null;
  return <div className={cn("absolute right-3 bottom-16 z-50 min-w-40 rounded-md border border-border bg-popover p-1 shadow-lg", className)}>{children}</div>;
}

export function DropdownMenuItem({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const context = React.useContext(DropdownContext)!;
  return (
    <button
      className={cn("flex w-full items-center rounded-sm px-2 py-2 text-sm hover:bg-accent", className)}
      onClick={() => {
        onClick?.();
        context.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}
