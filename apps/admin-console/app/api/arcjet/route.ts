import arcjet, {
  detectBot,
  filter,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  validateEmail,
} from "@arcjet/next";
import type {
  ArcjetBotCategory,
  ArcjetEmailType,
  ArcjetSensitiveInfoType,
  BotOptionsAllow,
  FilterOptions,
} from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextResponse } from "next/server";

const ARCJET_KEY = process.env.ARCJET_KEY;
const FORM_PATH = "/api/arcjet";
const BASE_BOT_OPTIONS: BotOptionsAllow = {
  mode: "LIVE",
  allow: ["CATEGORY:SEARCH_ENGINE"] as ArcjetBotCategory[],
};

const formAj = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      rules: [
        detectBot(BASE_BOT_OPTIONS),
        fixedWindow({
          mode: "LIVE",
          window: "60s",
          max: 60,
        }),
        shield({
          mode: "LIVE",
        }),
        validateEmail({
          mode: "LIVE",
          deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] as ArcjetEmailType[],
        }),
        protectSignup({
          rateLimit: {
            mode: "LIVE",
            interval: "60s",
            max: 10,
          },
          bots: BASE_BOT_OPTIONS,
          email: {
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] as ArcjetEmailType[],
          },
        }),
        sensitiveInfo({
          mode: "LIVE",
          deny: ["EMAIL", "CREDIT_CARD_NUMBER"] as ArcjetSensitiveInfoType[],
        }),
        filter({
          mode: "LIVE",
          allow: [`http.request.method eq "POST" and http.request.path eq "${FORM_PATH}"`],
        } satisfies FilterOptions),
      ],
    })
  : null;

function formatReason(reason: unknown) {
  if (typeof reason === "string") {
    return reason;
  }
  if (reason && typeof reason === "object") {
    try {
      return JSON.parse(JSON.stringify(reason));
    } catch {
      return reason;
    }
  }
  return "unknown";
}

export function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Arcjet form protection endpoint. POST email payloads to trigger validations.",
  });
}

export async function POST(request: Request) {
  if (!formAj) {
    return NextResponse.json(
      { error: "Arcjet site key is not configured" },
      { status: 500 },
    );
  }

  const payload = await request
    .clone()
    .json()
    .catch(() => ({ email: undefined }));
  const email = typeof payload?.email === "string" ? payload.email : undefined;

  if (!email) {
    return NextResponse.json(
      { error: "Email is required to evaluate Arcjet rules" },
      { status: 400 },
    );
  }

  const decision = await formAj.protect(request, { email });

  if (decision.isDenied()) {
    const payload = {
      error: "Forbidden",
      reason: formatReason(decision.reason),
      rules: decision.results.map((result) => result.ruleId),
    };

    return NextResponse.json(payload, { status: 403 });
  }

  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      {
        error: "Forbidden",
        reason: "Spoofed bot detected",
        rules: decision.results.map((result) => result.ruleId),
      },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      message: "Form submission cleared by Arcjet",
      decision: {
        conclusion: decision.conclusion,
        rules: decision.results.map((result) => ({
          ruleId: result.ruleId,
          conclusion: result.conclusion,
        })),
      },
    },
    { status: 200 },
  );
}
