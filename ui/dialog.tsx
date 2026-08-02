import * as React from "react";
import { cn } from "../utils";

type DialogContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  return <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const context = React.useContext(DialogContext);
  if (!context?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => context.setOpen(false)}>
      <div className={cn("w-full rounded-xl border border-border bg-card p-6 shadow-xl", className)} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}
