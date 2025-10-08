"use client";

import { CookieManager } from "react-cookie-manager";

export default function CookieProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookieManager enableFloatingButton >{children}</CookieManager>;
}
