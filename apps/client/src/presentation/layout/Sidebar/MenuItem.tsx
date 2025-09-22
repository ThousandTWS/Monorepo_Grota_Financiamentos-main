import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "./sidebarMenu";

export const MenuItem = ({
  group,
  sidebarOpen,
  openMenu,
  setOpenMenu,
  pathname,
}: {
  group: (typeof sidebarMenu)[0];
  sidebarOpen: boolean;
  openMenu: string | null;
  setOpenMenu: (menu: string | null) => void;
  pathname: string;
}) => {
  const Icon = group.icon;
  const isOpen = sidebarOpen && openMenu === group.title;

  return (
    <div
      key={group.title}
      className="mb-1 flex flex-col justify-center items-center"
    >
      <button
        className={`transition text-base font-montserrat tracking-tight text-white font-normal hover:bg-orange-600 rounded-xl relative ${
          sidebarOpen
            ? "flex items-center gap-3 px-5 py-3 w-[90%] justify-start"
            : "w-[85%] h-14 flex items-center justify-center"
        }`}
        onClick={() =>
          setOpenMenu(openMenu === group.title ? null : group.title)
        }
        tabIndex={-1}
        type="button"
      >
        <Icon
          size={24}
          className={`text-white flex-shrink-0 ${
            !sidebarOpen ? "absolute" : ""
          }`}
        />
        <motion.span
          initial={false}
          animate={{
            opacity: sidebarOpen ? 1 : 0,
            width: sidebarOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.2, delay: sidebarOpen ? 0.3 : 0 }}
          className="overflow-hidden whitespace-nowrap flex items-center text-base font-normal font-montserrat flex-1"
        >
          {group.title}
        </motion.span>
        <motion.div
          initial={false}
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2, delay: sidebarOpen ? 0.3 : 0 }}
        >
          <ChevronDown
            size={18}
            className={`transition-transform flex-shrink-0 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden w-[92%]"
      >
        <div className="flex flex-col">
          {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.text} className="block">
                <motion.div
                  className={`flex items-center gap-x-4 p-3 w-full pl-10 cursor-pointer rounded-lg transition-colors text-[15px] font-normal font-montserrat tracking-tight ${
                    isActive
                      ? "bg-white text-orange-600 font-normal shadow-md hover:bg-white hover:text-orange-700"
                      : "text-white hover:bg-orange-600 hover:text-white"
                  }`}
                  initial={false}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <span className="font-normal whitespace-nowrap overflow-hidden">
                    {item.text}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
