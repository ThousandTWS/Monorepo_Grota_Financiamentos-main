import { Document } from "@/application/core/@types/Documents/Document";

export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    proposalId: "PROP-12453",
    clientName: "Carlos Alberto Silva",
    clientCpf: "123.456.789-00",
    documentType: "rg",
    fileName: "rg_frente_verso.pdf",
    fileSize: 2048576,
    uploadDate: "2024-01-15T10:30:00",
    status: "pending",
    priority: "high",
    daysWaiting: 2,
  },

];
