"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number | string;
};

export function SimpleField({
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

      if (required && val === "") return;

      onChange(val);
      return;
    }
    onChange(val);
  }

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        min={min}
        onChange={handleChange}
      />
    </div>
  );
}
