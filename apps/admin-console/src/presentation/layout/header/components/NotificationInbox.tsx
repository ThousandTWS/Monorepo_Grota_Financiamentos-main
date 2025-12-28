"use client";

import { Inbox } from "@novu/nextjs";

export default function NotificationInbox() {
  return (
    <Inbox
      key="e4e2b396ea937a5f01b34c8b0ad4f11e"
      subscriberId="694fd2baf9d367c59640a05c"
      applicationIdentifier="zVX1y_TANqne"
      backendUrl="https://api.novu.co"
      socketUrl="wss://ws.novu.co"
      appearance={{
        variables: {
          colorPrimary: "#344054",
          colorPrimaryForeground: "#ffffff",
          colorSecondary: "#f9fafb",
          colorSecondaryForeground: "#1d2939",
          colorCounter: "#344054",
          colorCounterForeground: "#ffffff",
          colorBackground: "#ffffff",
          colorRing: "rgba(52, 64, 84, 0.3)",
          colorForeground: "#101828",
          colorNeutral: "#e4e7ec",
          colorShadow: "0px 4px 8px -2px rgba(16, 24, 40, 0.1)",
          fontSize: "14px",
        },
        elements: {
        
         
          bellIcon: {
            color: "#ffffff",
          },
        },
      }}
    />
  );
}
