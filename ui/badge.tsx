import type { HTMLAttributes } from "react";
import { cn } from "../utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" }) {
  return <span className={cn("inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs", className)} {...props} />;
}
