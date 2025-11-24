"use client";

import { CookieManager } from "react-cookie-manager";

export default function CookieProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookieManager cookieKitId="68f3b1a49098e2613ffd79b3">{children}</CookieManager>;
}
