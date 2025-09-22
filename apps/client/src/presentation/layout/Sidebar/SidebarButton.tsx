import { motion } from "framer-motion";

export const SidebarButton = ({
  icon: Icon,
  text,
  sidebarOpen,
  onClick,
  variant = "default",
}: {
  icon: React.ComponentType<{ size: number; className: string }>;
  text: string;
  sidebarOpen: boolean;
  onClick: () => void;
  variant?: "default" | "danger";
}) => {
  const hoverClass =
    variant === "danger" ? "hover:bg-red-500" : "hover:bg-orange-600";

  return (
    <div className="flex flex-col items-center mb-2 mt-2">
      <button
        className={`flex items-center transition text-base font-montserrat tracking-tight text-white font-normal ${hoverClass} rounded-xl ${
          sidebarOpen
            ? "gap-3 px-5 py-3 w-[90%] justify-start"
            : "gap-0 px-4 py-4 w-[85%] justify-center"
        } ${variant === "danger" ? "shadow-sm" : ""}`}
        onClick={onClick}
        type="button"
      >
        <Icon size={24} className="text-white flex-shrink-0" />
        <motion.span
          initial={false}
          animate={{
            opacity: sidebarOpen ? 1 : 0,
            width: sidebarOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.2, delay: sidebarOpen ? 0.3 : 0 }}
          className="overflow-hidden whitespace-nowrap flex items-center text-base font-normal font-montserrat"
        >
          {text}
        </motion.span>
      </button>
    </div>
  );
};
