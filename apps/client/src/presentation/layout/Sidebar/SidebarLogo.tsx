import { motion } from "framer-motion";
import LogoMarca from "../shared/LogoMarca";

export const SidebarLogo = ({ sidebarOpen }: { sidebarOpen: boolean }) => (
  <div className="flex items-center justify-center w-full mb-6 px-3">
    <div className="p-2 rounded-full border-2 border-orange-300 bg-white shadow-lg">
      <LogoMarca
        size={24}
        withText={false}
        className="transition-all duration-300"
        iconBgColor="bg-white"
        iconTextColor="text-orange-500"
      />
    </div>
    <motion.span
      initial={false}
      animate={{
        opacity: sidebarOpen ? 1 : 0,
        width: sidebarOpen ? "auto" : 0,
      }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden whitespace-nowrap flex items-center ml-1 text-2xl font-extrabold text-white font-montserrat tracking-tight drop-shadow-sm"
      style={{ display: "inline-block" }}
    >
      Logo<span className="text-orange-200">Marca</span>
    </motion.span>
  </div>
);
