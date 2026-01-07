import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  if (!session.accessToken) {
    return NextResponse.json(
      { error: "Token de acesso não encontrado. Por favor, faça login novamente." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(
    `${API_BASE_URL}/proposals/${id}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  let payload: unknown = null;
  try {
    payload = await upstreamResponse.json();
  } catch {
    // Se não conseguir fazer parse do JSON, pode ser uma resposta vazia ou HTML
    payload = null;
  }

  if (!upstreamResponse.ok) {
    // Extrai a mensagem de erro de diferentes formatos possíveis
    let errorMessage = "Não foi possível atualizar a proposta.";
    
    if (payload && typeof payload === "object") {
      const errorPayload = payload as { 
        error?: string; 
        message?: string; 
        errors?: string | string[];
        status?: number;
      };
      
      // Prioridade: message > error > errors
      if (errorPayload.message) {
        errorMessage = errorPayload.message;
      } else if (errorPayload.error) {
        errorMessage = errorPayload.error;
      } else if (errorPayload.errors) {
        if (Array.isArray(errorPayload.errors) && errorPayload.errors.length > 0) {
          errorMessage = errorPayload.errors.join(", ");
        } else if (typeof errorPayload.errors === "string") {
          errorMessage = errorPayload.errors;
        }
      }
    }
    
    // Tratamento especial para erros de autenticação/autorização
    if (upstreamResponse.status === 401) {
      errorMessage = "Sessão expirada. Por favor, faça login novamente.";
    } else if (upstreamResponse.status === 403) {
      if (!errorMessage || errorMessage === "Não foi possível atualizar a proposta.") {
        errorMessage = "Você não tem permissão para realizar esta ação.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(payload ?? {}, { status: upstreamResponse.status });
}
