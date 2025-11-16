"use client";
"use strict";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_HISTORY_LIMIT = 50;
const DEFAULT_RECONNECT_DELAY = 2500;

const globalObject =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof self !== "undefined"
        ? self
        : {};

const clampHistory = (list, limit) => {
  if (!limit || list.length <= limit) {
    return list;
  }
  return list.slice(-limit);
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
};

const getDefaultUrl = () => {
  if (typeof window === "undefined") {
    return "ws://localhost:4545";
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.hostname}:4545`;
};

const buildSocketUrl = (base, channel, sender) => {
  try {
    const url = new URL(base);
    if (channel) url.searchParams.set("channel", channel);
    if (sender) url.searchParams.set("sender", sender);
    return url.toString();
  } catch (_error) {
    return base;
  }
};

const generateRealtimeId = () =>
  typeof globalObject.crypto?.randomUUID === "function"
    ? globalObject.crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const normalizeMessage = (message, fallbackChannel) => ({
  id: message?.id ?? generateRealtimeId(),
  body: message?.body ?? "",
  sender: message?.sender ?? "desconhecido",
  channel: message?.channel ?? fallbackChannel,
  timestamp: message?.timestamp ?? new Date().toISOString(),
  meta: message?.meta ?? {},
});

const normalizeParticipant = (payload, fallbackChannel) => ({
  clientId: payload?.clientId ?? payload?.sender ?? "",
  sender: payload?.sender ?? "desconhecido",
  channel: payload?.channel ?? fallbackChannel,
  connectedAt: payload?.connectedAt ?? new Date().toISOString(),
});

export function useRealtimeChannel(options = {}) {
  const {
    identity = "anonymous",
    channel = "admin-logista",
    url,
    historyLimit = DEFAULT_HISTORY_LIMIT,
    autoReconnectDelay = DEFAULT_RECONNECT_DELAY,
    metadata = {},
  } = options;

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [participants, setParticipants] = useState([]);

  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const socketUrl = useMemo(() => {
    const base = url ?? getDefaultUrl();
    return buildSocketUrl(base, channel, identity);
  }, [url, channel, identity]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let disposed = false;

    const cleanup = () => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (_error) {
          // ignore
        }
        wsRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      if (disposed) return;
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
      reconnectRef.current = setTimeout(() => {
        connect();
      }, autoReconnectDelay);
    };

    const connect = () => {
      if (disposed) return;
      try {
        const socket = new window.WebSocket(socketUrl);
        wsRef.current = socket;
        setStatus("connecting");
        setError(null);

        socket.onopen = () => {
          if (disposed) return;
          setStatus("connected");
        };

        socket.onmessage = (event) => {
          if (disposed) return;
          const data = safeParse(event.data);
          if (!data) return;

          switch (data.type) {
            case "SYSTEM_INFO": {
              setClientId(data.payload?.clientId ?? null);
              if (Array.isArray(data.payload?.history)) {
                setMessages(
                  clampHistory(
                    data.payload.history.map((item) =>
                      normalizeMessage(item, channel)
                    ),
                    historyLimit
                  )
                );
              }

              if (Array.isArray(data.payload?.participants)) {
                setParticipants(
                  data.payload.participants.map((participant) =>
                    normalizeParticipant(participant, channel)
                  )
                );
              }
              break;
            }
            case "MESSAGE": {
              const formatted = normalizeMessage(data.payload, channel);
              setMessages((current) =>
                clampHistory([...current, formatted], historyLimit)
              );
              break;
            }
            case "USER_JOINED": {
              const participant = normalizeParticipant(
                data.payload,
                channel
              );
              setParticipants((current) => {
                const filtered = current.filter(
                  (item) => item.clientId !== participant.clientId
                );
                return [...filtered, participant];
              });
              break;
            }
            case "USER_LEFT": {
              const leftId =
                data.payload?.clientId ?? data.payload?.sender ?? "";
              setParticipants((current) =>
                current.filter((item) => item.clientId !== leftId)
              );
              break;
            }
            default:
              break;
          }
        };

        socket.onerror = () => {
          if (disposed) return;
          setStatus("error");
          setError("connection-error");
        };

        socket.onclose = () => {
          if (disposed) return;
          setStatus("disconnected");
          scheduleReconnect();
        };
      } catch (err) {
        if (disposed) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "connection-error");
        scheduleReconnect();
      }
    };

    connect();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [socketUrl, historyLimit, autoReconnectDelay, channel]);

  const sendMessage = useCallback(
    (body, extraMeta = {}) => {
      if (!wsRef.current || wsRef.current.readyState !== 1) {
        return false;
      }
      const payload = {
        type: "MESSAGE",
        payload: {
          body,
          sender: identity,
          channel,
          timestamp: new Date().toISOString(),
          meta: { ...metadata, ...extraMeta },
        },
      };

      try {
        wsRef.current.send(JSON.stringify(payload));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "send-error");
        return false;
      }
    },
    [channel, identity, metadata]
  );

  return {
    messages,
    sendMessage,
    status,
    clientId,
    participants,
    error,
  };
}

export const REALTIME_CHANNELS = {
  CHAT: "admin-logista",
  PROPOSALS: "proposals-bridge",
  DEALERS: "dealers-bridge",
  NOTIFICATIONS: "notifications-bridge",
};

export const REALTIME_EVENT_TYPES = {
  PROPOSALS_REFRESH_REQUEST: "PROPOSALS_REFRESH_REQUEST",
  PROPOSAL_CREATED: "PROPOSAL_CREATED",
  PROPOSAL_STATUS_UPDATED: "PROPOSAL_STATUS_UPDATED",
  DEALER_REFRESH_REQUEST: "DEALER_REFRESH_REQUEST",
  DEALER_UPSERTED: "DEALER_UPSERTED",
  DEALER_DELETED: "DEALER_DELETED",
  NOTIFICATION_PUBLISHED: "NOTIFICATION_PUBLISHED",
  NOTIFICATION_DISMISS: "NOTIFICATION_DISMISS",
  SELLER_ACTIVITY_SENT: "SELLER_ACTIVITY_SENT",
};

export const parseBridgeEvent = (message) => {
  if (!message) {
    return null;
  }
  const bodyData =
    typeof message.body === "string" ? safeParse(message.body) : null;
  const eventType =
    (message.meta &&
      typeof message.meta.eventType === "string" &&
      message.meta.eventType) ||
    (bodyData && typeof bodyData.event === "string" ? bodyData.event : null);

  if (!eventType) {
    return null;
  }

  return {
    event: eventType,
    payload:
      bodyData && typeof bodyData === "object" ? bodyData.payload ?? null : null,
    message,
  };
};

export const dispatchBridgeEvent = (
  sender,
  event,
  payload = {}
) => {
  if (typeof sender !== "function" || !event) {
    return false;
  }

  const envelope = {
    event,
    payload,
  };

  return sender(JSON.stringify(envelope), {
    eventType: event,
  });
};

const currentYear = new Date().getFullYear();

export const createProposalDraftSnapshot = (payload = {}) => {
  const timestamp = new Date().toISOString();
  const safePayload =
    typeof payload === "object" && payload !== null ? payload : {};

  return {
    id: generateRealtimeId(),
    contract: `GF-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: safePayload.clientName ?? "Cliente não informado",
    clientDocument: safePayload.clientDocument ?? "000.000.000-00",
    dealerName: safePayload.dealerCode
      ? `Lojista ${safePayload.dealerCode}`
      : "Lojista parceiro",
    dealerCode: safePayload.dealerCode ?? "",
    operatorName: "Operador remoto",
    operatorSentAt: timestamp,
    asset: {
      brand: "Veículo não informado",
      model: "Modelo em cadastro",
      version: null,
      year: currentYear,
      entryValue: 0,
      financedValue: 0,
      installmentValue: 0,
      termMonths: 48,
    },
    productInfo: {
      bank: "Banco parceiro",
      product: "Produto padrão",
      modality: "Pré-fixado",
    },
    currentStatus: {
      status: "triage",
      label: "Triagem inicial",
      analyst: "Time administrativo",
      updatedAt: timestamp,
      description: safePayload.operatorNote ?? undefined,
    },
  };
};

export default useRealtimeChannel;

const buildNotificationPayloadInternal = (payload = {}) => ({
  id: payload.id ?? generateRealtimeId(),
  title: payload.title ?? "Atualização",
  description: payload.description ?? "",
  actor: payload.actor ?? payload.sender ?? "sistema",
  href: payload.href ?? payload.link ?? "#",
  channel: payload.channel ?? payload.scope ?? "",
  timestamp: payload.timestamp ?? new Date().toISOString(),
  meta: payload.meta ?? {},
});

export const buildNotificationPayload = (payload = {}) =>
  buildNotificationPayloadInternal(payload);

const NotificationBusContext = createContext({
  notifications: [],
  unreadCount: 0,
  publishNotification: () => false,
  markAllRead: () => {},
});

export function NotificationProvider({
  identity = "anonymous",
  children,
  historyLimit = 40,
}) {
  const { messages, sendMessage } = useRealtimeChannel({
    channel: REALTIME_CHANNELS.NOTIFICATIONS,
    identity,
    historyLimit,
    metadata: { source: identity },
  });
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(new Set());

  useEffect(() => {
    if (!messages.length) return;
    const latest = messages[messages.length - 1];
    const parsed = parseBridgeEvent(latest);
    if (parsed?.event === REALTIME_EVENT_TYPES.NOTIFICATION_PUBLISHED) {
      const payload = buildNotificationPayloadInternal(
        parsed.payload?.notification ?? parsed.payload,
      );
      setNotifications((current) => {
        const next = [payload, ...current];
        return next.slice(0, historyLimit);
      });
      setUnread((current) => {
        const next = new Set(current);
        next.add(payload.id);
        return next;
      });
    }
  }, [messages, historyLimit]);

  const publishNotification = useCallback(
    (payload) => {
      const prepared = buildNotificationPayloadInternal({
        ...payload,
        actor: payload?.actor ?? identity,
      });
      const success = dispatchBridgeEvent(
        sendMessage,
        REALTIME_EVENT_TYPES.NOTIFICATION_PUBLISHED,
        {
          notification: prepared,
        },
      );
      if (success) {
        setNotifications((current) => {
          const next = [prepared, ...current];
          return next.slice(0, historyLimit);
        });
      }
      return success;
    },
    [historyLimit, identity, sendMessage],
  );

  const markAllRead = useCallback(() => {
    setUnread(new Set());
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: unread.size,
      publishNotification,
      markAllRead,
    }),
    [notifications, unread, publishNotification, markAllRead],
  );

  return (
    <NotificationBusContext.Provider value={value}>
      {children}
    </NotificationBusContext.Provider>
  );
}

export const useNotificationBus = () => useContext(NotificationBusContext);
