export const DOCUMENT_TYPES = [
  "RG_FRENTE",
  "RG_VERSO",
  "CPF",
  "CNH",
  "EXTRATO_BANCARIO",
  "HOLERITE",
  "CONTRATO_SOCIAL",
  "ULTIMA_ALTERACAO_CONTRATUAL",
  "COMPROVANTE_DE_ENDERECO",
  "DADOS_BANCARIOS",
] as const;

export const REVIEW_STATUSES = ["PENDENTE", "APROVADO", "REPROVADO"] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface DocumentRecord {
  id: number;
  documentType: DocumentType;
  contentType?: string | null;
  sizeBytes: number;
  reviewStatus: ReviewStatus;
  reviewComment?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
