import type { HTMLAttributes } from "react";
import { cn } from "../utils";

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-center rounded-full bg-muted", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm", className)} {...props} />;
}
