const IV_LENGTH = 12;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const keyCache = new Map<string, Promise<CryptoKey>>();

export type SessionScope = "client" | "logista" | "admin";

export interface SessionPayload {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  scope: SessionScope;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

function getCrypto(): Crypto {
  if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.subtle) {
    throw new Error("Web Crypto API is not available in this runtime.");
  }

  return globalThis.crypto;
}

function base64UrlEncode(bytes: Uint8Array): string {
  if (typeof btoa !== "undefined") {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  //@ts-ignore
  if (typeof Buffer !== "undefined") {
    //@ts-ignore
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  throw new Error("Base64 helpers are not available in this runtime.");
}

function base64UrlDecode(value: string): Uint8Array {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }

  if (typeof atob !== "undefined") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  //@ts-ignore
  if (typeof Buffer !== "undefined") {
    //@ts-ignore
    return new Uint8Array(Buffer.from(base64, "base64"));
  }

  throw new Error("Base64 helpers are not available in this runtime.");
}

async function getKey(secret: string): Promise<CryptoKey> {
  if (!secret) {
    throw new Error("Session secret is missing");
  }

  if (!keyCache.has(secret)) {
    const crypto = getCrypto();
    const subtle = crypto.subtle;
    const keyPromise = subtle
      .digest("SHA-256", encoder.encode(secret))
      .then((hash) =>
        subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"]),
      );
    keyCache.set(secret, keyPromise);
  }

  return keyCache.get(secret)!;
}

export async function encryptSession(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  const crypto = getCrypto();
  const subtle = crypto.subtle;
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = encoder.encode(JSON.stringify(payload));

  const cipherBuffer = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded,
  );

  const encryptedBytes = new Uint8Array(cipherBuffer);
  const combined = new Uint8Array(IV_LENGTH + encryptedBytes.length);
  combined.set(iv, 0);
  combined.set(encryptedBytes, IV_LENGTH);

  return base64UrlEncode(combined);
}

export async function decryptSession(
  value: string | undefined | null,
  secret: string,
): Promise<SessionPayload | null> {
  if (!value) {
    return null;
  }

  try {
    const crypto = getCrypto();
    const subtle = crypto.subtle;
    const key = await getKey(secret);
    const combined = base64UrlDecode(value);
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const decrypted = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext,
    );

    return JSON.parse(decoder.decode(decrypted)) as SessionPayload;
  } catch (error) {
    console.warn("[auth] Failed to decrypt session:", error);
    return null;
  }
}

export function isSessionNearExpiry(
  session: SessionPayload,
  skewMs = 60_000,
): boolean {
  const expiresAt = new Date(session.expiresAt).getTime();
  return Number.isFinite(expiresAt) && expiresAt - Date.now() <= skewMs;
}
