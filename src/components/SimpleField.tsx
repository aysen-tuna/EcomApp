"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number | string;
  options?: readonly string[];
};

export function SimpleField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  options,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;

    if (type === "number") {
      if (val !== "" && Number(val) < 0) return;

      onChange(val);
      return;
    }
    onChange(val);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 rounded-md border px-2 bg-neutral-200 dark:bg-neutral-800"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          min={min}
          onChange={handleChange}
          className="bg-neutral-200 dark:bg-neutral-800"
        />
      )}
    </div>
  );
}
