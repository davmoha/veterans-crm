import type { HTMLAttributes } from "react";
import { cn } from "../utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-border/50 bg-card p-6", className)} {...props} />;
}
