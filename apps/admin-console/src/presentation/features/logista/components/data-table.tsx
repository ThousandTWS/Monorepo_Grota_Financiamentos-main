"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"@/presentation/layout/components/ui/table";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button } from "@/presentation/layout/components/ui/button";
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Logista, getLogistaColumns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/presentation/layout/components/ui/select";
import { LogistaDialog } from "./logista-dialog";
import { DeleteDialog } from "./delete-dialog";
import { useToast } from "@/application/core/hooks/use-toast";

interface DataTableProps {
  data: Logista[];
  onUpdate: (data: Logista[]) => void;
  onSync?: (action: "upsert" | "delete", logista?: Logista) => void;
}

export function DataTable({ data, onUpdate, onSync }: DataTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLogista, setSelectedLogista] = useState<Logista | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">(
    "view"
  );

  const filteredData = data.filter((logista) => {
    const matchesSearch =
    logista.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logista.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logista.cpf.includes(searchTerm);

    const matchesStatus =
    statusFilter === "todos" || logista.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Ações
  const handleView = (logista: Logista) => {
    setSelectedLogista(logista);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (logista: Logista) => {
    setSelectedLogista(logista);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = (logista: Logista) => {
    setSelectedLogista(logista);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedLogista(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleSave = (logista: Logista) => {
    if (dialogMode === "create") {
      // Criar novo logista
      const newLogista = {
        ...logista,
        id: Date.now().toString(),
        comissaoTotal: 0
      };
      onUpdate([...data, newLogista]);
      onSync?.("upsert", newLogista);
      toast({
        title: "Logista criado!",
        description: `${logista.fullName} foi adicionado com sucesso.`
      });
    } else if (dialogMode === "edit") {
      // Atualizar logista existente
      const updatedData = data.map((item) =>
      item.id === logista.id ? logista : item
      );
      onUpdate(updatedData);
      onSync?.("upsert", logista);
      toast({
        title: "Logista atualizado!",
        description: `As informações de ${logista.fullName} foram atualizadas.`
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedLogista) {
      const updatedData = data.filter((item) => item.id !== selectedLogista.id);
      onUpdate(updatedData);
      onSync?.("delete", selectedLogista);
      toast({
        title: "Logista excluído!",
        description: `${selectedLogista.fullName} foi removido do sistema.`,
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setSelectedLogista(null);
    }
  };

  const columns = getLogistaColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete
  });

  return (
    <>
      <div className="space-y-4" data-oid="53n7jzk">
        {/* Barra de ferramentas */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          data-oid="xl:hg:d">

          <div
            className="flex flex-1 gap-2 w-full sm:w-auto"
            data-oid="mcznbit">

            <div className="relative flex-1 max-w-sm" data-oid="d.zegf3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                data-oid="3m7dtc4" />

              <Input
                placeholder="Buscar por nome, e-mail ou CPF..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
                data-oid="g2y08.g" />

            </div>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
              data-oid="-qv_bn6">

              <SelectTrigger className="w-[160px]" data-oid="qo2h8h:">
                <Filter className="size-4 mr-2" data-oid="8q9uxkr" />
                <SelectValue placeholder="Status" data-oid="ax4bl3v" />
              </SelectTrigger>
              <SelectContent data-oid="omcin5j">
                <SelectItem value="todos" data-oid="9cl:36:">
                  Todos
                </SelectItem>
                <SelectItem value="ativo" data-oid="7eheou-">
                  Ativo
                </SelectItem>
                <SelectItem value="inativo" data-oid="5rko86y">
                  Inativo
                </SelectItem>
                <SelectItem value="pendente" data-oid="o8389x8">
                  Pendente
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate} data-oid="5hrtjys">
            <Plus className="size-4" data-oid="5-c5wp5" />
            Novo Logista
          </Button>
        </div>

        {/* Tabela */}
        <div className="rounded-lg border" data-oid="zu73duo">
          <Table data-oid="xc.amp3">
            <TableHeader data-oid="8zjtqij">
              <TableRow data-oid="nky:coh">
                {columns.map((column) =>
                <TableHead key={column.key} data-oid="shaikwn">
                    {column.header}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody data-oid="in:jlr8">
              {paginatedData.length > 0 ?
              paginatedData.map((logista) =>
              <TableRow key={logista.id} data-oid="u1s8tcn">
                    {columns.map((column) =>
                <TableCell key={column.key} data-oid="4jlxlw7">
                        {column.cell(logista)}
                      </TableCell>
                )}
                  </TableRow>
              ) :

              <TableRow data-oid=".qn5dod">
                  <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  data-oid="07-f9:p">

                    Nenhum logista encontrado.
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          data-oid="ob-cfcs">

          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-oid="r9v.fm-">

            <span data-oid="--ydndr">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, filteredData.length)} de {filteredData.length}{" "}
              logista(s)
            </span>
          </div>

          <div className="flex items-center gap-2" data-oid="_mkzj.0">
            <div className="flex items-center gap-2" data-oid="cf0aoe7">
              <span
                className="text-sm text-muted-foreground"
                data-oid=".kpv.2f">

                Itens por página:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
                data-oid="io6asxb">

                <SelectTrigger className="w-[70px]" data-oid="1sxg.fq">
                  <SelectValue data-oid="v6cxqf7" />
                </SelectTrigger>
                <SelectContent data-oid="jttd4-3">
                  <SelectItem value="5" data-oid="x0gc1f4">
                    5
                  </SelectItem>
                  <SelectItem value="10" data-oid="ieh.bk9">
                    10
                  </SelectItem>
                  <SelectItem value="20" data-oid="26udhti">
                    20
                  </SelectItem>
                  <SelectItem value="50" data-oid="ioksbsz">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1" data-oid="w:3accq">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                data-oid="bjx9:cs">

                <ChevronLeft className="size-4" data-oid="8185hy9" />
              </Button>

              <div className="flex items-center gap-1 px-2" data-oid="p3ojrgk">
                <span className="text-sm font-medium" data-oid=".lq77rl">
                  {currentPage}
                </span>
                <span
                  className="text-sm text-muted-foreground"
                  data-oid="ey_l74h">

                  de
                </span>
                <span className="text-sm font-medium" data-oid="uov9y38">
                  {totalPages || 1}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                data-oid="lqfq0l:">

                <ChevronRight className="size-4" data-oid="nw09_io" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <LogistaDialog
        logista={selectedLogista}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        mode={dialogMode}
        data-oid="tiu-a96" />


      <DeleteDialog
        logista={selectedLogista}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        data-oid="vdsjxi4" />

    </>);

}
