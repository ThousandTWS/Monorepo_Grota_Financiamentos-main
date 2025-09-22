import React from "react";
import { LucideIcon } from "lucide-react";

interface CTAButtonProps {
  label: string;
  Icon: LucideIcon;
  iconSize?: number;
  onClick?: () => void;
  className?: string;
  bgColor?: string;
  hoverBgColor?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  label,
  Icon,
  iconSize = 24,
  onClick,
  className = "",
  bgColor = "bg-orange-500",
  hoverBgColor = "hover:bg-orange-600",
}) => {
  return (
    <button
      className={`flex items-center justify-center min-h-10 max-w-64 text-white md:text-sm rounded-[5px] cursor-pointer px-3 gap-x-1 shadow-lg ${bgColor} ${hoverBgColor} ${className}`}
      onClick={onClick}
    >
      <Icon size={iconSize} />
      {label}
    </button>
  );
};

export default CTAButton;
