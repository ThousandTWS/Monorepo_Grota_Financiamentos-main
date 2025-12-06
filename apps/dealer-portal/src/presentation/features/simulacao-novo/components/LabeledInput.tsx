import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { cn } from "@/lib/utils";
import { formatName } from "@/lib/formatters";

export type LabeledInputProps = {
  id?: string;
  label: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  containerClassName?: string;
  inputClassName?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  warning?: string;
  loading?: boolean;
};

export function LabeledInput({
  id,
  label,
  placeholder,
  type = "text",
  maxLength,
  containerClassName,
  inputClassName,
  autoComplete,
  disabled,
  readOnly,
  warning,
  loading,
  ...props
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
        maxLength={maxLength}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
      {loading && <p className="text-xs text-gray-500">Buscando informações...</p>}
      {warning && <p className="text-xs">Situação do CPF: <span className="text-blue-700 font-medium">{formatName(warning)}</span></p>}
    </div>
  );
}
