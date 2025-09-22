import { motion } from "framer-motion";
import { useSystemStatus } from "./useSystemStatus";

export const SystemStatus = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const { systemStatus, getStatusColor, getStatusText, getDuration } =
    useSystemStatus();

  return (
    <div className="flex flex-col items-center mb-4 border-t border-white/30 pt-3">
      <div
        className={`flex items-center transition text-xs font-montserrat tracking-tight text-white/80 font-normal rounded-lg ${
          sidebarOpen
            ? "gap-2 px-3 py-2 w-[90%] justify-between"
            : "gap-0 px-2 py-2 w-[85%] justify-center"
        }`}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: sidebarOpen ? 1 : 0,
            width: sidebarOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap flex items-center text-xs font-normal font-montserrat"
        >
          Versão {systemStatus.type} {systemStatus.version}
        </motion.span>

        <div className="flex items-center gap-1">
          <motion.span
            initial={false}
            animate={{
              opacity: sidebarOpen ? 1 : 0,
              width: sidebarOpen ? "auto" : 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap flex items-center text-xs font-normal font-montserrat"
          >
            {getStatusText(systemStatus.status)}
          </motion.span>
          <motion.div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(
              systemStatus.status
            )}`}
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: getDuration(),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};
