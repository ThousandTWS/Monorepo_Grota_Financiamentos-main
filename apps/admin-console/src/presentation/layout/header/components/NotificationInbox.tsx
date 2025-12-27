"use client";

import { Inbox } from "@novu/nextjs";
import { useUser } from "@/application/core/context/UserContext";

type NotificationInboxProps = {
  subscriberId?: string;
};

export default function NotificationInbox({ subscriberId }: NotificationInboxProps) {
  const { user } = useUser();
  const applicationIdentifier =
    process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER ?? "uivB3-hEHd0o";
  const resolvedSubscriberId =
    user?.email?.trim() ||
    String(user?.id ?? "").trim() ||
    subscriberId ||
    "694fd2baf9d367c59640a05c";
  const backendUrl = process.env.NEXT_PUBLIC_NOVU_BACKEND_URL;
  const socketUrl = process.env.NEXT_PUBLIC_NOVU_SOCKET_URL;

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={resolvedSubscriberId}
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
      {...(backendUrl ? { backendUrl } : {})}
      {...(socketUrl ? { socketUrl } : {})}
    />
  );
}
