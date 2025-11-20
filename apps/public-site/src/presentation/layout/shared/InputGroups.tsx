import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface InputGroupProps {
  label?: string;
  id: string;
  icon?: ReactNode;
  children: ReactNode;
  error?: FieldError;
}

export function InputGroup({
  label,
  id,
  icon,
  children,
  error,
}: InputGroupProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>

        {children}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle size={14} />
          {error.message}
        </p>
      )}
    </div>
  );
}
