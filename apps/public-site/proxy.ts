import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ARCJET_KEY = process.env.ARCJET_KEY;
const aj = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      rules: [
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        fixedWindow({
          mode: "LIVE",
          window: "60s",
          max: 60,
        }),
        shield({
          mode: "LIVE",
        }),
      ],
    })
  : null;

type ArcjetDecision = Awaited<
  ReturnType<ReturnType<typeof arcjet>["protect"]>
>;

async function handleDecision(decision: ArcjetDecision) {
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Forbidden", reason: decision.reason },
      { status: 403 },
    );
  }

  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "Forbidden", reason: "Spoofed bot detected" },
      { status: 403 },
    );
  }

  return null;
}

export async function proxy(request: NextRequest) {
  if (!aj) {
    return NextResponse.next();
  }

  const decision = await aj.protect(request);
  const failure = await handleDecision(decision);
  if (failure) {
    return failure;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
