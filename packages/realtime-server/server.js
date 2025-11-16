const { WebSocketServer, WebSocket } = require("ws");
const { randomUUID } = require("crypto");

const PORT = Number(process.env.WS_PORT ?? 4545);
const HISTORY_LIMIT = Number(process.env.WS_HISTORY_LIMIT ?? 50);
const HEARTBEAT_INTERVAL = Number(process.env.WS_HEARTBEAT ?? 30000);
const DEFAULT_CHANNEL = process.env.WS_DEFAULT_CHANNEL ?? "admin-logista";

/**
 * @typedef {Object} BridgeMessage
 * @property {string} id
 * @property {string} body
 * @property {string} sender
 * @property {string} channel
 * @property {string} timestamp
 * @property {Record<string, unknown>} [meta]
 */

/** @type {Map<string, { history: BridgeMessage[]; clients: Set<ClientRecord>; }>} */
const rooms = new Map();

/**
 * @typedef {Object} ClientRecord
 * @property {import("ws").WebSocket} socket
 * @property {string} clientId
 * @property {string} sender
 * @property {string} channel
 * @property {string} connectedAt
 */

const wss = new WebSocketServer({ port: PORT });

const getRoom = (channel) => {
  if (!rooms.has(channel)) {
    rooms.set(channel, { history: [], clients: new Set() });
  }
  return rooms.get(channel);
};

const broadcast = (room, message, exclude) => {
  const payload = JSON.stringify(message);
  room.clients.forEach((client) => {
    if (exclude && client.socket === exclude) return;
    safeSend(client.socket, payload);
  });
};

const safeSend = (socket, payload) => {
  if (socket.readyState !== WebSocket.OPEN) return;
  try {
    socket.send(payload);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

const removeClient = (room, record) => {
  if (!room) return;
  room.clients.delete(record);
  if (record.clientId) {
    broadcast(
      room,
      {
        type: "USER_LEFT",
        payload: {
          clientId: record.clientId,
          sender: record.sender,
          channel: record.channel,
          leftAt: new Date().toISOString(),
        },
      },
      record.socket
    );
  }
};

const normalizeMessage = (payload, defaults) => ({
  id: payload?.id ?? randomUUID(),
  body: payload?.body ?? "",
  sender: payload?.sender ?? defaults.sender,
  channel: payload?.channel ?? defaults.channel,
  timestamp: payload?.timestamp ?? new Date().toISOString(),
  meta: payload?.meta ?? {},
});

const parseIncoming = (raw) => {
  try {
    return JSON.parse(raw.toString("utf-8"));
  } catch (_error) {
    return null;
  }
};

wss.on("connection", (socket, request) => {
  const { searchParams } = new URL(
    request.url ?? "/",
    `http://${request.headers.host}`
  );

  const sender = searchParams.get("sender") ?? "anonymous";
  const channel = searchParams.get("channel") ?? DEFAULT_CHANNEL;
  const room = getRoom(channel);
  const clientId = randomUUID();
  const connectedAt = new Date().toISOString();

  /** @type {ClientRecord} */
  const record = {
    socket,
    sender,
    channel,
    clientId,
    connectedAt,
  };

  room.clients.add(record);
  socket.isAlive = true;

  socket.on("pong", () => {
    socket.isAlive = true;
  });

  safeSend(
    socket,
    JSON.stringify({
      type: "SYSTEM_INFO",
      payload: {
        clientId,
        channel,
        history: room.history,
        participants: Array.from(room.clients).map((client) => ({
          clientId: client.clientId,
          sender: client.sender,
          channel: client.channel,
          connectedAt: client.connectedAt,
        })),
      },
    })
  );

  broadcast(
    room,
    {
      type: "USER_JOINED",
      payload: {
        clientId,
        sender,
        channel,
        connectedAt,
      },
    },
    socket
  );

  socket.on("message", (raw) => {
    const data = parseIncoming(raw);
    if (!data) return;

    if (data.type === "PING") {
      safeSend(
        socket,
        JSON.stringify({
          type: "PONG",
          payload: { timestamp: Date.now() },
        })
      );
      return;
    }

    if (data.type === "MESSAGE") {
      const prepared = normalizeMessage(data.payload, { sender, channel });
      room.history.push(prepared);
      room.history = room.history.slice(-HISTORY_LIMIT);
      broadcast(room, { type: "MESSAGE", payload: prepared });
      return;
    }
  });

  socket.on("close", () => {
    removeClient(room, record);
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
    removeClient(room, record);
  });
});

const heartbeat = () => {
  wss.clients.forEach((socket) => {
    if (socket.isAlive === false) {
      return socket.terminate();
    }

    socket.isAlive = false;
    socket.ping();
  });
};

const heartbeatInterval = setInterval(heartbeat, HEARTBEAT_INTERVAL);
heartbeatInterval.unref?.();

console.log(
  `[Realtime] Servidor WebSocket iniciado na porta ${PORT} (canal padrão: ${DEFAULT_CHANNEL})`
);
