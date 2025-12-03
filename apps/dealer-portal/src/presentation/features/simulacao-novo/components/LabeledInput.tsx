import type { ChangeEvent } from "react";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { cn } from "@/lib/utils";

export type LabeledInputProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  containerClassName?: string;
  inputClassName?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export function LabeledInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  maxLength,
  containerClassName,
  inputClassName,
  autoComplete,
  disabled,
  readOnly,
}: LabeledInputProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className="text-[#134B73]">
        {label}
      </Label>
      <Input
        id={id}
        className={cn("w-full", inputClassName)}
        placeholder={placeholder}
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        onBlur={onBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
}
