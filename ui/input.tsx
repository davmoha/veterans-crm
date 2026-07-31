import * as React from "react";
import { cn } from "../utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={cn("flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", className)} {...props} />;
});
