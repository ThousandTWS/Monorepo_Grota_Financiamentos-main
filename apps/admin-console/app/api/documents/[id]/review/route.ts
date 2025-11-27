import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

const bodySchema = z.object({
  reviewStatus: z.enum(["PENDENTE", "APROVADO", "REPROVADO"]),
  reviewComment: z.string().optional(),
});

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id: documentId } = await context.params;
    if (!documentId) {
      return NextResponse.json(
        { error: "Documento não informado." },
        { status: 400 },
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 },
      );
    }

    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos para revisão." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(
      `${API_BASE_URL}/documents/${documentId}/review`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
    );

    const responseBody = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (responseBody as { message?: string })?.message ??
        "Não foi possível revisar o documento.";
      return NextResponse.json(
        { error: message },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(responseBody, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][documents] falha ao revisar documento", error);
    return NextResponse.json(
      { error: "Erro interno ao revisar documento." },
      { status: 500 },
    );
  }
}
