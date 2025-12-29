import { Select, Typography } from "antd";
import { cn } from "@/lib/utils";

export type LabeledSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  disabled?: boolean;
  options: { value: string; label: string }[];
};

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  containerClassName,
  disabled,
  options,
}: LabeledSelectProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Typography.Text className="text-[#134B73]">{label}</Typography.Text>
      <Select
        value={value || undefined}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        options={options}
        className="w-full"
      />
    </div>
  );
}
