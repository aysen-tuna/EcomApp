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
    </div>
  );
}
