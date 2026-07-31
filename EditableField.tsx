import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditableFieldProps {
  label: string;
  value: string | number | boolean | null | undefined;
  onSave: (newValue: string | number | boolean) => Promise<void>;
  type?: "text" | "email" | "phone" | "number" | "textarea" | "select" | "checkbox";
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function EditableField({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  required = false,
  disabled = false,
  placeholder,
  className,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value ?? ""));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setError(null);
      if (required && !editValue.trim()) {
        setError("This field is required");
        return;
      }
      // Validate date format (YYYY-MM-DD)
      if (type === "text" && label.toLowerCase().includes("date") && editValue.trim()) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(editValue.trim())) {
          setError("Date must be in YYYY-MM-DD format");
          return;
        }
      }
      // Validate email format
      if (type === "email" && editValue.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editValue.trim())) {
          setError("Invalid email format");
          return;
        }
      }
      setIsSaving(true);
      let finalValue: string | number | boolean = editValue;
      if (type === "number") finalValue = Number(editValue);
      if (type === "checkbox") finalValue = editValue === "true";
      await onSave(finalValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(value ?? ""));
    setIsEditing(false);
    setError(null);
  };

  const displayValue = value === null || value === undefined ? "—" : String(value);

  if (!isEditing) {
    return (
      <div className={cn("flex items-center justify-between gap-3 py-2", className)}>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm text-foreground break-words">{displayValue}</p>
        </div>
        {!disabled && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
            title={`Edit ${label}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("py-3 space-y-2", className)}>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
      
      {type === "textarea" ? (
        <Textarea
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          placeholder={placeholder}
          disabled={isSaving}
          className="text-sm"
          rows={3}
        />
      ) : type === "select" ? (
        <select
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          disabled={isSaving}
          className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editValue === "true"}
            onChange={e => setEditValue(e.target.checked ? "true" : "false")}
            disabled={isSaving}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm text-foreground">{placeholder || label}</span>
        </label>
      ) : (
        <Input
          type={type}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          placeholder={placeholder}
          disabled={isSaving}
          className="text-sm"
        />
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/15 text-primary hover:bg-primary/25 disabled:opacity-50 transition-colors text-xs font-medium"
        >
          <Check className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors text-xs font-medium"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
