import { z } from "zod";
import {
  DOCUMENT_TYPES,
  REVIEW_STATUSES,
  DocumentRecord,
} from "@/application/core/@types/Documents/Document";

const DOCUMENTS_ENDPOINT = "/api/documents";

const DocumentTypeSchema = z.enum(DOCUMENT_TYPES);
const ReviewStatusSchema = z.enum(REVIEW_STATUSES);

const DocumentSchema = z.object({
  id: z.coerce.number(),
  documentType: DocumentTypeSchema,
  contentType: z.string().nullable().optional(),
  sizeBytes: z.coerce.number(),
  reviewStatus: ReviewStatusSchema,
  reviewComment: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const DocumentListSchema = z.array(DocumentSchema);

export async function fetchDocuments(): Promise<DocumentRecord[]> {
  const response = await fetch(DOCUMENTS_ENDPOINT, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível carregar os documentos.";
    throw new Error(message);
  }

  const normalized = Array.isArray(payload) ? payload : [];
  return DocumentListSchema.parse(normalized);
}

export async function reviewDocument(
  documentId: number,
  reviewStatus: DocumentRecord["reviewStatus"],
  reviewComment?: string,
): Promise<DocumentRecord> {
  const response = await fetch(`${DOCUMENTS_ENDPOINT}/${documentId}/review`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reviewStatus,
      reviewComment,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível revisar o documento.";
    throw new Error(message);
  }

  return DocumentSchema.parse(payload);
}

export async function getDocumentDownloadUrl(
  documentId: number,
): Promise<string> {
  const response = await fetch(`${DOCUMENTS_ENDPOINT}/${documentId}/url`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível gerar o link do documento.";
    throw new Error(message);
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object" && "url" in payload) {
    return String(payload.url);
  }

  throw new Error("Resposta inválida ao obter link do documento.");
}
