import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession } from "../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; message?: unknown };
    const message = record.error ?? record.message;
    if (message && typeof message === "string") return message;
  }
  return fallback;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ contractNumber: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  let contractNumber = resolvedParams.contractNumber;
  // Se o contractNumber não veio ou pode estar incompleto (pode ter barras no número)
  // sempre extrair do pathname para garantir que pegamos o número completo
  if (!contractNumber || request.nextUrl.pathname.split('/').length > 4) {
    // Extrai o número do contrato completo do pathname
    // Rotas conhecidas que indicam fim do número do contrato
    const knownRoutes = ['installments', 'occurrences', 'vehicle', 'contract-number'];
    const pathname = request.nextUrl.pathname;
    // Remove /api/billing/contracts/ e pega tudo até o próximo segmento de rota conhecido
    const pathAfterBase = pathname.replace(/^\/api\/billing\/contracts\//, '');
    const segments = pathAfterBase.split('/');
    
    // Encontra o primeiro segmento que é uma rota conhecida
    let contractSegments: string[] = [];
    for (const segment of segments) {
      if (knownRoutes.includes(segment)) {
        break;
      }
      contractSegments.push(segment);
    }
    
    // Junta todos os segmentos do número do contrato
    contractNumber = contractSegments.length > 0 
      ? contractSegments.map(s => decodeURIComponent(s)).join('/')
      : "";
  } else {
    // Decodifica se veio como parâmetro
    contractNumber = decodeURIComponent(contractNumber);
  }
  if (!contractNumber) {
    return NextResponse.json({ error: "contractNumber é obrigatório." }, { status: 400 });
  }

  const headers: HeadersInit = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}`,
    {
      headers,
      cache: "no-store",
    },
  );

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Falha ao carregar contrato de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ contractNumber: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  let contractNumber = resolvedParams.contractNumber;
  // Se o contractNumber não veio ou pode estar incompleto (pode ter barras no número)
  // sempre extrair do pathname para garantir que pegamos o número completo
  if (!contractNumber || request.nextUrl.pathname.split('/').length > 4) {
    // Extrai o número do contrato completo do pathname
    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/\/api\/billing\/contracts\/(.+?)(?:\/|$)/);
    contractNumber = match?.[1] ? decodeURIComponent(match[1]) : "";
  } else {
    contractNumber = decodeURIComponent(contractNumber);
  }
  if (!contractNumber) {
    return NextResponse.json({ error: "contractNumber é obrigatório." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Falha ao atualizar contrato de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ contractNumber: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  let contractNumber = resolvedParams.contractNumber;
  // Se o contractNumber não veio ou pode estar incompleto (pode ter barras no número)
  // sempre extrair do pathname para garantir que pegamos o número completo
  if (!contractNumber || request.nextUrl.pathname.split('/').length > 4) {
    // Extrai o número do contrato completo do pathname
    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/\/api\/billing\/contracts\/(.+?)(?:\/|$)/);
    contractNumber = match?.[1] ? decodeURIComponent(match[1]) : "";
  } else {
    contractNumber = decodeURIComponent(contractNumber);
  }
  if (!contractNumber) {
    return NextResponse.json({ error: "contractNumber é obrigatório." }, { status: 400 });
  }

  const headers: HeadersInit = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}`,
    {
      method: "DELETE",
      headers,
      cache: "no-store",
    },
  );

  if (!upstream.ok) {
    const payload = await upstream.json().catch(() => null);
    const message = extractErrorMessage(
      payload,
      "Falha ao remover contrato de cobranca.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json({}, { status: upstream.status });
}
