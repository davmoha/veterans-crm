import * as React from "react";
import { cn } from "../utils";

type SidebarState = "expanded" | "collapsed";
const SidebarContext = React.createContext<{ state: SidebarState; toggleSidebar: () => void } | null>(null);

export function SidebarProvider({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [state, setState] = React.useState<SidebarState>("expanded");
  const toggleSidebar = () => setState((value) => (value === "expanded" ? "collapsed" : "expanded"));
  return <SidebarContext.Provider value={{ state, toggleSidebar }}><div style={style} className="flex min-h-screen w-full bg-background">{children}</div></SidebarContext.Provider>;
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("Sidebar context missing");
  return context;
}

export function Sidebar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { collapsible?: string; disableTransition?: boolean }) {
  const { state } = useSidebar();
  return <aside data-collapsible={state === "collapsed" ? "icon" : "full"} className={cn("relative flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", state === "collapsed" ? "w-16" : "w-[var(--sidebar-width,280px)]", className)} {...props}>{children}</aside>;
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("border-b border-sidebar-border p-2", className)} {...props} />; }
export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />; }
export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("border-t border-sidebar-border", className)} {...props} />; }
export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <main className={cn("min-w-0 flex-1 p-4 md:p-6", className)} {...props} />; }
export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("space-y-1", className)} {...props} />; }
export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={className} {...props} />; }
export function SidebarMenuButton({ className, isActive, tooltip, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean; tooltip?: string }) {
  return <button title={tooltip} className={cn("flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent", isActive && "bg-sidebar-accent text-sidebar-accent-foreground", className)} {...props} />;
}
export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();
  return <button className={cn("inline-flex items-center justify-center", className)} onClick={toggleSidebar} {...props} />;
}
