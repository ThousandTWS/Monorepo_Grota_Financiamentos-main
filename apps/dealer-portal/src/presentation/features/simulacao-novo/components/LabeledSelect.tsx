import { Select, SelectContent, SelectTrigger, SelectValue } from "@/presentation/ui/select";
import { Label } from "@/presentation/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type LabeledSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  disabled?: boolean;
  children: ReactNode;
};

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  containerClassName,
  disabled,
  children,
}: LabeledSelectProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className="text-[#134B73]">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full" id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
