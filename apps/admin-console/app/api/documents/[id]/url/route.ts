import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

type Params = {
  params: {
    id?: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const documentId = params.id;
    if (!documentId) {
      return NextResponse.json(
        { error: "Documento não informado." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(
      `${API_BASE_URL}/documents/${documentId}/url`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      },
    );

    const rawPayload = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(rawPayload);
      } catch {
        parsed = null;
      }
      const message =
        (parsed as { message?: string } | null)?.message ??
        rawPayload ??
        "Não foi possível gerar a URL do documento.";
      return NextResponse.json(
        { error: message },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json({ url: rawPayload });
  } catch (error) {
    console.error("[admin][documents] falha ao gerar URL", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar link do documento." },
      { status: 500 },
    );
  }
}
