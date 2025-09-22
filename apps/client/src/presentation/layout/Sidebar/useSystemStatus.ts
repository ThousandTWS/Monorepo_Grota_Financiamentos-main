import { useState } from "react";

export const useSystemStatus = () => {
  const [systemStatus] = useState({
    version: "1.0.0",
    status: "online" as "online" | "offline" | "maintenance",
    type: "Alpha",
  });

  const getDuration = () => {
    if (systemStatus.status === "online") return 2;
    if (systemStatus.status === "maintenance") return 1;
    return 3;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: "bg-green-500",
      offline: "bg-red-500",
      maintenance: "bg-yellow-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusText = (status: string) => {
    const texts = {
      online: "Online",
      offline: "Offline",
      maintenance: "Manutenção",
    };
    return texts[status as keyof typeof texts] || "Desconhecido";
  };

  return { systemStatus, getStatusColor, getStatusText, getDuration };
};
