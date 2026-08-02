import * as React from "react";
import { cn } from "../utils";

const TabsContext = React.createContext<{ value: string; setValue: (value: string) => void } | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex gap-2 rounded-lg bg-muted p-1", className)} {...props} />;
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext)!;
  const active = context.value === value;
  return <button className={cn("rounded-md px-3 py-1.5 text-sm", active ? "bg-background text-foreground" : "text-muted-foreground", className)} onClick={() => context.setValue(value)}>{children}</button>;
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext)!;
  if (context.value !== value) return null;
  return <div className={className}>{children}</div>;
}
