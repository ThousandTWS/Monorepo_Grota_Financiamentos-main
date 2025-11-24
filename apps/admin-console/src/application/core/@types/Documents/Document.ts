export type DocumentStatus = "pending" | "approved" | "rejected" | "in_review";

export type DocumentType =
  | "rg"
  | "cpf"
  | "cnh"
  | "comprovante_residencia"
  | "comprovante_renda"
  | "crlv"
  | "contrato"
  | "outros";

export interface Document {
  id: string;
  proposalId: string;
  clientName: string;
  clientCpf: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: DocumentStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  priority: "low" | "medium" | "high";
  daysWaiting: number;
}

export interface DocumentFilters {
  status?: DocumentStatus[];
  documentType?: DocumentType[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  priority?: ("low" | "medium" | "high")[];
}
