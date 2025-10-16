"use client";

import React, { useState, useMemo } from "react";
import {
  Document,
  DocumentStatus,
  DocumentType,
} from "@/application/core/@types/Documents/Document";
import { toast } from "sonner";
import { mockDocuments } from "@/presentation/features/gestao-documentos/data/mockDocuments";
import { DocumentStats } from "@/presentation/features/gestao-documentos/components/DocumentStats";
import { DocumentFilters } from "@/presentation/features/gestao-documentos/components/DocumentFilters";
import { DocumentsTable } from "@/presentation/features/gestao-documentos/components/DocumentsTable";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<DocumentStatus[]>(
    [],
  );
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<
    ("low" | "medium" | "high")[]
  >([]);


  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          doc.clientName.toLowerCase().includes(query) ||
          doc.clientCpf.includes(query) ||
          doc.proposalId.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }


      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(doc.status)
      ) {
        return false;
      }


      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(doc.documentType)
      ) {
        return false;
      }


      if (
        selectedPriorities.length > 0 &&
        !selectedPriorities.includes(doc.priority)
      ) {
        return false;
      }

      return true;
    });
  }, [
    documents,
    searchQuery,
    selectedStatuses,
    selectedTypes,
    selectedPriorities,
  ]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: documents.length,
      pending: documents.filter((d) => d.status === "pending").length,
      inReview: documents.filter((d) => d.status === "in_review").length,
      approved: documents.filter((d) => d.status === "approved").length,
      rejected: documents.filter((d) => d.status === "rejected").length,
    };
  }, [documents]);

  const handleStatusChange = (
    documentId: string,
    status: DocumentStatus,
    comments?: string,
  ) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
            ...doc,
            status,
            reviewedBy: "Você",
            reviewedAt: new Date().toISOString(),
            comments,
          }
          : doc,
      ),
    );

    if (status === "approved") {
      toast.success("Documento aprovado com sucesso!", {
        description: `O documento ${documentId} foi aprovado.`,
      });
    } else if (status === "rejected") {
      toast.error("Documento reprovado", {
        description: `O documento ${documentId} foi reprovado.`,
      });
    }
  };

  const handleRefresh = () => {
    toast.info("Atualizando documentos...");
  };

  const handleExport = () => {
    toast.success("Exportando documentos...", {
      description: "O download será iniciado em breve.",
    });

  };

  return (
    <div className="space-y-6" data-oid="1my927q">
      <div className="space-y-2" data-oid="yflaj0i">
        <h1
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
          data-oid="j.9flu7"
        >
          Gestão de Documentos
        </h1>
        <p className="text-muted-foreground" data-oid="50a60yf">
          Analise, aprove ou reprove documentos enviados pelos clientes
        </p>
      </div>

      <DocumentStats
        totalDocuments={stats.total}
        pendingCount={stats.pending}
        inReviewCount={stats.inReview}
        approvedCount={stats.approved}
        rejectedCount={stats.rejected}
        data-oid=".mse9f4"
      />

      <DocumentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
        selectedPriorities={selectedPriorities}
        onPrioritiesChange={setSelectedPriorities}
        onRefresh={handleRefresh}
        onExport={handleExport}
        data-oid="sgmfv72"
      />

      <div className="flex items-center justify-between" data-oid="ayzqcnl">
        <p className="text-sm text-muted-foreground" data-oid="v21l3l3">
          Exibindo{" "}
          <span className="font-semibold" data-oid="8_wvwva">
            {filteredDocuments.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold" data-oid="lxun_h_">
            {documents.length}
          </span>{" "}
          documentos
        </p>
      </div>

      <DocumentsTable
        documents={filteredDocuments}
        onStatusChange={handleStatusChange}
        data-oid="75uaxrg"
      />
    </div>
  );
}