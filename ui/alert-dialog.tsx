export { Dialog as AlertDialog, DialogContent as AlertDialogContent, DialogHeader as AlertDialogHeader, DialogTitle as AlertDialogTitle } from "./dialog";

export function AlertDialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={className ?? "text-sm text-muted-foreground"}>{children}</p>;
}

export function AlertDialogCancel({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className ?? "rounded-md border border-border px-4 py-2 text-sm"} {...props}>{children}</button>;
}

export function AlertDialogAction({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className ?? "rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"} {...props}>{children}</button>;
}
