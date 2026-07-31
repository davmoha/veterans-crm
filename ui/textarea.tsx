import * as React from "react";
import { cn } from "../utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return <textarea ref={ref} className={cn("min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", className)} {...props} />;
});
