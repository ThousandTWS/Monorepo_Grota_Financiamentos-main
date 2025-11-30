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
import { Search, Filter, ChevronLeft, ChevronRight, Plus, RefreshCcw } from "lucide-react";
import { Logista, getLogistaColumns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/presentation/layout/components/ui/select";
import { LogistaDialog } from "./logista-dialog";
import { useToast } from "@/application/core/hooks/use-toast";
import {
  CreateDealerPayload,
  createDealer,
  deleteDealer,
} from "@/application/services/Logista/logisticService";
import {
  getAllSellers,
  linkSellerToDealer,
  Seller,
  deleteSeller,
} from "@/application/services/Seller/sellerService";
import {
  getAllManagers,
  linkManagerToDealer,
  Manager,
  deleteManager,
} from "@/application/services/Manager/managerService";
import {
  getAllOperators,
  linkOperatorToDealer,
  Operator,
  deleteOperator,
} from "@/application/services/Operator/operatorService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/presentation/layout/components/ui/dialog";

interface DataTableProps {
  data: Logista[];
  onUpdate: (data: Logista[]) => void;
  onSync?: (action: "upsert" | "delete", logista?: Logista) => void;
  onRefresh?: () => void;
}

export function DataTable({ data, onUpdate, onSync, onRefresh }: DataTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLogista, setSelectedLogista] = useState<Logista | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "create">("view");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkingType, setLinkingType] = useState<"seller" | "manager" | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string>("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLinking, setIsLinking] = useState(false);

  const filteredData = data.filter((logista) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      logista.fullName?.toLowerCase().includes(normalizedSearch) ||
      (logista.razaoSocial ?? "").toLowerCase().includes(normalizedSearch) ||
      (logista.referenceCode ?? "").toLowerCase().includes(normalizedSearch) ||
      logista.enterprise?.toLowerCase().includes(normalizedSearch) ||
      logista.phone?.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "todos" ||
      (logista.status ?? "").toLowerCase() === statusFilter;

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

  const handleDelete = (logista: Logista) => {
    if (isDeleting) return;
    setIsDeleting(true);
    deleteDealer(Number(logista.id))
      .then(() => {
        const updatedData = data.filter((item) => item.id !== logista.id);
        onUpdate(updatedData);
        onSync?.("delete", logista);
        toast({
          title: "Logista excluído!",
          description: `${logista.fullName} foi removido do sistema.`,
          variant: "destructive"
        });
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível remover o logista.";
        toast({
          title: "Erro ao excluir",
          description: message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsDeleting(false);
        setSelectedLogista(null);
      });
  };

  const handleCreate = () => {
    setSelectedLogista(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const openLinkModal = async (type: "seller" | "manager" | "operator", logista: Logista) => {
    setSelectedLogista(logista);
    //@ts-ignore
    setLinkingType(type);
    setSelectedLinkId("");
    setLinkModalOpen(true);

    try {
      if (type === "seller") {
        const list = await getAllSellers();
        setSellers(Array.isArray(list) ? list : []);
      } else if (type === "manager") {
        const list = await getAllManagers();
        setManagers(Array.isArray(list) ? list : []);
      } else {
        const list = await getAllOperators();
        setOperators(Array.isArray(list) ? list : []);
      }
    } catch {
      toast({
        title: "Erro ao carregar opções",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  const handleLink = async () => {
    if (!linkingType || !selectedLogista || !selectedLinkId) return;
    setIsLinking(true);
    try {
      if (linkingType === "seller") {
        await linkSellerToDealer(Number(selectedLinkId), Number(selectedLogista.id));
        toast({ title: "Vendedor vinculado!", description: "Vendedor associado à loja." });
      } else if (linkingType === "manager") {
        await linkManagerToDealer(Number(selectedLinkId), Number(selectedLogista.id));
        toast({ title: "Gestor vinculado!", description: "Gestor associado à loja." });
      } else {
        await linkOperatorToDealer(Number(selectedLinkId), Number(selectedLogista.id));
        toast({ title: "Operador vinculado!", description: "Operador associado à loja." });
      }
      setLinkModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível vincular.";
      toast({ title: "Erro ao vincular", description: message, variant: "destructive" });
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlink = async () => {
    if (!linkingType || !selectedLogista || !selectedLinkId) return;
    setIsLinking(true);
    try {
      if (linkingType === "seller") {
        await deleteSeller(Number(selectedLinkId));
        toast({ title: "Vendedor removido!", description: "Usuário apagado do sistema." });
      } else if (linkingType === "manager") {
        await deleteManager(Number(selectedLinkId));
        toast({ title: "Gestor removido!", description: "Usuário apagado do sistema." });
      } else {
        await deleteOperator(Number(selectedLinkId));
        toast({ title: "Operador removido!", description: "Usuário apagado do sistema." });
      }
      setLinkModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível remover.";
      toast({ title: "Erro ao remover", description: message, variant: "destructive" });
    } finally {
      setIsLinking(false);
    }
  };

  const digitsOnly = (value?: string) => (value ?? "").replace(/\D/g, "");

  const handleSave = async (payload: CreateDealerPayload) => {
    setIsSaving(true);
    try {
      const created = await createDealer({
        ...payload,
        fullName: payload.fullName.trim(),
        phone: digitsOnly(payload.phone),
        enterprise: payload.enterprise.trim(),
        cnpj: digitsOnly(payload.cnpj),
        address: payload.address
          ? {
              ...payload.address,
              zipCode: digitsOnly(payload.address.zipCode),
            }
          : undefined,
      });
      const updatedData = [...data, created].sort(
        (a, b) => (new Date(b.createdAt ?? 0).getTime()) - (new Date(a.createdAt ?? 0).getTime()),
      );
      onUpdate(updatedData);
      onSync?.("upsert", created);
      toast({
        title: "Logista criado!",
        description: `${created.fullName} foi adicionado com sucesso.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o logista.";
      toast({
        title: "Erro ao criar logista",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const columns = getLogistaColumns({
    onView: handleView,
    onDelete: handleDelete,
    onLinkSeller: (logista) => openLinkModal("seller", logista),
    onLinkManager: (logista) => openLinkModal("manager", logista),
    onLinkOperator: (logista) => openLinkModal("operator", logista),
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
                placeholder="Buscar por nome, razão social, código ou CNPJ..."
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onRefresh}
              data-oid="refreshDealer"
              className="w-full sm:w-auto"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button onClick={handleCreate} data-oid="addDealer" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo logista
            </Button>
          </div>
        </div>

        {/* Formulário inline de criação */}
        {dialogMode === "create" && (
          <div className="mt-4">
            <LogistaDialog
              logista={null}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSave={handleSave}
              mode="create"
              isSubmitting={isSaving}
              renderAsModal={false}
            />
          </div>
        )}

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
      {dialogMode === "view" && (
        <LogistaDialog
          logista={selectedLogista}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          mode={dialogMode}
          isSubmitting={isSaving}
          data-oid="tiu-a96"
        />
      )}

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {linkingType === "seller" ? "Vincular vendedor" : "Vincular gestor"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selectedLogista
                ? `Selecione para associar à loja ${selectedLogista.fullName} (${selectedLogista.enterprise}).`
                : "Selecione uma loja."}
            </p>
            <Select
              value={selectedLinkId}
              onValueChange={setSelectedLinkId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(linkingType === "seller"
                  ? sellers
                  : linkingType === "manager"
                    ? managers
                    : operators
                ).map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.fullName} — {item.email ?? item.phone ?? `ID ${item.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setLinkModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnlink}
              disabled={isLinking || !selectedLinkId}
            >
              {isLinking ? "Removendo..." : "Desvincular"}
            </Button>
            <Button onClick={handleLink} disabled={isLinking || !selectedLinkId}>
              {isLinking ? "Salvando..." : "Vincular"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>);

}
