import { DocumentType } from "@/application/core/@types/Documents/Document";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  RG_FRENTE: "RG (frente)",
  RG_VERSO: "RG (verso)",
  CPF: "CPF",
  CNH: "CNH",
  EXTRATO_BANCARIO: "Extrato bancário",
  HOLERITE: "Holerite",
  CONTRATO_SOCIAL: "Contrato social",
  ULTIMA_ALTERACAO_CONTRATUAL: "Última alteração contratual",
  COMPROVANTE_DE_ENDERECO: "Comp. endereço",
  DADOS_BANCARIOS: "Dados bancários",
};
