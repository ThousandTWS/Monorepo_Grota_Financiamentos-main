const REALTIME_FALLBACK = "wss://websocket-production-6330.up.railway.app";

export function getRealtimeUrl(): string {
  return (
    process.env.NEXT_PUBLIC_REALTIME_WS_URL?.trim() ||
    process.env.NEXT_PUBLIC_REALTIME_URL?.trim() ||
    REALTIME_FALLBACK
  );
}
