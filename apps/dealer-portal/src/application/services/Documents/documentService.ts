import { z } from "zod";
import {
  DOCUMENT_TYPES,
  REVIEW_STATUSES,
  DocumentRecord,
  DocumentUploadPayload,
} from "@/application/core/@types/Documents/Document";

const DOCUMENTS_ENDPOINT = "/api/documents";
const DOCUMENT_UPLOAD_ENDPOINT = "/api/documents/upload";

const ReviewStatusSchema = z.enum(REVIEW_STATUSES);
const DocumentTypeSchema = z.enum(DOCUMENT_TYPES);

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
      "Não foi possível carregar seus documentos.";
    throw new Error(message);
  }

  const normalized = Array.isArray(payload) ? payload : [];
  return DocumentListSchema.parse(normalized);
}

export async function uploadDocument(
  payload: DocumentUploadPayload,
): Promise<DocumentRecord> {
  const body = new FormData();
  body.set("documentType", payload.documentType);
  body.set("file", payload.file);

  const response = await fetch(DOCUMENT_UPLOAD_ENDPOINT, {
    method: "POST",
    credentials: "include",
    body,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data as { error?: string })?.error ??
      "Não foi possível enviar o documento.";
    throw new Error(message);
  }

  return DocumentSchema.parse(data);
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
