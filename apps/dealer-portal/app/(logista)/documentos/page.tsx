import type { Metadata } from "next";
import DocumentosFeature from "@/presentation/features/documentos";

export const metadata: Metadata = {
  title: "Upload de documentos - Grota",
  description:
    "Envie e acompanhe os documentos obrigatórios direto do painel do logista.",
};

export default function DocumentosPage() {
  return <DocumentosFeature />;
}
