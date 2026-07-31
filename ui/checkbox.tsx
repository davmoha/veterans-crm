import type { InputHTMLAttributes } from "react";

export function Checkbox({ checked, onCheckedChange, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & { onCheckedChange?: (checked: boolean) => void }) {
  return (
    <input
      type="checkbox"
      checked={Boolean(checked)}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className="h-4 w-4 rounded border-border"
      {...props}
    />
  );
}
