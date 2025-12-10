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
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCcw,
  Eye,
  Users,
  UserPlus,
  UserCog,
  UserPlus2,
  Shield,
  ShieldClose,
  Trash2,
  Unlink,
} from "lucide-react";
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
import userServices, { AdminUser } from "@/application/services/UserServices/UserServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/presentation/layout/components/ui/dialog";
import { Badge } from "@/presentation/layout/components/ui/badge";
import { Separator } from "@/presentation/layout/components/ui/separator";
import { Card, CardContent } from "@/presentation/layout/components/ui/card";

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
  const [linkingType, setLinkingType] = useState<"seller" | "manager" | "operator" | "admin" | null>(null);
  const [linkAction, setLinkAction] = useState<"link" | "unlink">("link");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string>("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLinking, setIsLinking] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSellers, setTeamSellers] = useState<Seller[]>([]);
  const [teamManagers, setTeamManagers] = useState<Manager[]>([]);
  const [teamOperators, setTeamOperators] = useState<Operator[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

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
    setViewModalOpen(true);
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

  const openTeamModal = async (logista: Logista) => {
    setSelectedLogista(logista);
    setTeamModalOpen(true);
    setTeamLoading(true);
    try {
      const [s, m, o] = await Promise.all([
        getAllSellers(Number(logista.id)),
        getAllManagers(Number(logista.id)),
        getAllOperators(Number(logista.id)),
      ]);
      setTeamSellers(Array.isArray(s) ? s : []);
      setTeamManagers(Array.isArray(m) ? m : []);
      setTeamOperators(Array.isArray(o) ? o : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar a equipe.";
      toast({ title: "Erro ao buscar equipe", description: message, variant: "destructive" });
    } finally {
      setTeamLoading(false);
    }
  };

  const openLinkModal = async (
    type: "seller" | "manager" | "operator",
    logista: Logista,
    action: "link" | "unlink" = "link",
  ) => {
    setSelectedLogista(logista);
    setLinkingType(type);
    setLinkAction(action);
    setSelectedLinkId("");
    setLinkModalOpen(true);

    try {
      if (type === "admin") {
        const list = await userServices.getAllAdmins();
        setAdmins(Array.isArray(list) ? list : []);
      } else if (type === "seller") {
        const list = await getAllSellers(action === "unlink" ? Number(logista.id) : undefined);
        setSellers(Array.isArray(list) ? list : []);
      } else if (type === "manager") {
        const list = await getAllManagers(action === "unlink" ? Number(logista.id) : undefined);
        setManagers(Array.isArray(list) ? list : []);
      } else {
        const list = await getAllOperators(action === "unlink" ? Number(logista.id) : undefined);
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
      const targetDealerId = linkAction === "unlink" ? null : Number(selectedLogista.id);
      if (linkingType === "admin") {
        await userServices.linkAdminToDealer(Number(selectedLinkId), targetDealerId);
        toast({
          title: linkAction === "unlink" ? "Admin desvinculado!" : "Admin vinculado!",
          description:
            linkAction === "unlink"
              ? "O admin foi desvinculado da loja."
              : "Admin associado à loja.",
        });
      } else if (linkingType === "seller") {
        await linkSellerToDealer(Number(selectedLinkId), targetDealerId);
        toast({
          title: linkAction === "unlink" ? "Vendedor desvinculado!" : "Vendedor vinculado!",
          description:
            linkAction === "unlink"
              ? "O vendedor foi desvinculado da loja."
              : "Vendedor associado à loja.",
        });
      } else if (linkingType === "manager") {
        await linkManagerToDealer(Number(selectedLinkId), targetDealerId);
        toast({
          title: linkAction === "unlink" ? "Gestor desvinculado!" : "Gestor vinculado!",
          description:
            linkAction === "unlink"
              ? "O gestor foi desvinculado da loja."
              : "Gestor associado à loja.",
        });
      } else {
        await linkOperatorToDealer(Number(selectedLinkId), targetDealerId);
        toast({
          title: linkAction === "unlink" ? "Operador desvinculado!" : "Operador vinculado!",
          description:
            linkAction === "unlink"
              ? "O operador foi desvinculado da loja."
              : "Operador associado à loja.",
        });
      }
      setLinkModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : linkAction === "unlink"
            ? "Não foi possível desvincular."
            : "Não foi possível vincular.";
      toast({
        title: linkAction === "unlink" ? "Erro ao desvincular" : "Erro ao vincular",
        description: message,
        variant: "destructive",
      });
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
    onOpenActions: (logista) => {
      setSelectedLogista(logista);
      setActionsModalOpen(true);
    },
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
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="sr-only">Visualizar lojista</DialogTitle>
            </DialogHeader>
            <Card className="border-none shadow-none">
              <div className="rounded-2xl bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white p-5 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                      Loja • {selectedLogista?.referenceCode || "--"}
                    </p>
                    <h2 className="text-2xl font-bold leading-tight">
                      {selectedLogista?.enterprise || selectedLogista?.fullName || "Lojista"}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-sm text-white/85">
                      <Badge className="bg-white/15 text-white border border-white/30">
                        Resp.: {selectedLogista?.fullName || "--"}
                      </Badge>
                      <Badge className="bg-white/15 text-white border border-white/30">
                        CNPJ: {selectedLogista?.cnpj || "--"}
                      </Badge>
                      {selectedLogista?.status && (
                        <Badge className="bg-[#0f3c5a] text-white border border-white/20">
                          {selectedLogista.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-white/80 space-y-1">
                    <div>Código Ref.</div>
                    <div className="text-lg font-semibold">
                      {selectedLogista?.referenceCode || "--"}
                    </div>
                    <div className="text-xs">
                      Criado em{" "}
                      {selectedLogista?.createdAt
                        ? new Date(selectedLogista.createdAt).toLocaleDateString("pt-BR")
                        : "--"}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Telefone" value={selectedLogista?.phone} />
                  <InfoItem label="Razão social" value={selectedLogista?.razaoSocial} />
                  <InfoItem label="Empresa" value={selectedLogista?.enterprise} />
                  <InfoItem label="Responsável" value={selectedLogista?.fullName} />
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-[#134B73]">Equipe associada</p>
                  <p className="text-xs text-muted-foreground">
                    Use o menu de ações para vincular operadores, gestores e vendedores.
                  </p>
                </div>
              </CardContent>
            </Card>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {linkAction === "unlink" ? "Desvincular usuário" : "Vincular usuário"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selectedLogista
                ? linkAction === "unlink"
                  ? `Selecione quem deseja remover da loja ${selectedLogista.fullName} (${selectedLogista.enterprise}).`
                  : `Selecione para associar à loja ${selectedLogista.fullName} (${selectedLogista.enterprise}).`
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
                {(
                  linkingType === "admin"
                    ? admins
                    : linkingType === "seller"
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
            {linkAction === "unlink" && (
              <Button
                variant="destructive"
                onClick={handleLink}
                disabled={isLinking || !selectedLinkId}
              >
                {isLinking ? "Removendo..." : "Desvincular"}
              </Button>
            )}
            {linkAction === "link" && (
              <Button onClick={handleLink} disabled={isLinking || !selectedLinkId}>
                {isLinking ? "Salvando..." : "Vincular"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Equipe vinculada</DialogTitle>
            <DialogDescription>
              Usuários associados à loja{" "}
              <span className="font-semibold">{selectedLogista?.enterprise ?? selectedLogista?.fullName}</span>
            </DialogDescription>
          </DialogHeader>
          {teamLoading ? (
            <div className="py-6 text-sm text-muted-foreground">Carregando equipe...</div>
          ) : (
            <div className="space-y-4">
              <TeamList title="Operadores" items={teamOperators} emptyLabel="Nenhum operador vinculado" />
              <Separator />
              <TeamList title="Gestores" items={teamManagers} emptyLabel="Nenhum gestor vinculado" />
              <Separator />
              <TeamList title="Vendedores" items={teamSellers} emptyLabel="Nenhum vendedor vinculado" />
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setTeamModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        <Dialog open={actionsModalOpen} onOpenChange={setActionsModalOpen}>
          <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Acoes do lojista</DialogTitle>
            <DialogDescription>
              Escolha uma acao rapida para {" "}
              <span className="font-semibold">
                {selectedLogista?.enterprise ?? selectedLogista?.fullName ?? "a loja"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Operacoes principais
              </p>
              <p className="text-sm text-muted-foreground">
                As acoes mais utilizadas em um unico bloco.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openTeamModal(selectedLogista);
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Equipe vinculada</span>
                  <Users className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) handleView(selectedLogista);
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Visualizar</span>
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) {
                      setInfoModalOpen(true);
                      toast({
                        title: "Remova os vínculos primeiro",
                        description:
                          "Desvincule vendedores, gestores e operadores antes de excluir a loja.",
                        variant: "warning",
                      });
                    }
                  }}
                >
                  <span>Excluir lojista</span>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Gerenciar vinculos
                </p>
                <span className="text-xs text-muted-foreground">Adicionar ou remover</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button
                  variant="secondary"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("seller", selectedLogista, "link");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Adicionar vendedor</span>
                  <UserPlus className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("seller", selectedLogista, "unlink");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Desvincular vendedor</span>
                  <Unlink className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("manager", selectedLogista, "link");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Adicionar gestor</span>
                  <UserCog className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("manager", selectedLogista, "unlink");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Desvincular gestor</span>
                  <Unlink className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("operator", selectedLogista, "link");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Adicionar operador</span>
                  <UserPlus2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="justify-between px-3"
                  onClick={() => {
                    if (selectedLogista) openLinkModal("operator", selectedLogista, "unlink");
                    setActionsModalOpen(false);
                  }}
                >
                  <span>Desvincular operador</span>
                  <Unlink className="size-4" />
                </Button>
              </div>
            </section>
          </div>
        </DialogContent>
        </Dialog>

        <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Desvincule antes de excluir</DialogTitle>
              <DialogDescription>
                Para remover esta loja, é necessário desvincular todos os vendedores, gestores e operadores
                vinculados. Caso contrário, os vínculos impedirão a exclusão.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Uma vez que todos os usuários forem desvinculados, você poderá confirmar a exclusão no diálogo
                seguinte.
              </p>
              <p>Deseja abrir o modal de confirmação agora?</p>
            </div>
            <DialogFooter className="justify-end gap-2">
              <Button variant="outline" onClick={() => setInfoModalOpen(false)}>
                Voltar
              </Button>
              <Button
                onClick={() => {
                  setInfoModalOpen(false);
                  setDeleteModalOpen(true);
                }}
              >
                Abrir confirmação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir lojista</DialogTitle>
            <DialogDescription>
              Esta ação removerá a loja{" "}
              <span className="font-semibold">{selectedLogista?.enterprise ?? selectedLogista?.fullName}</span>{" "}
              e os vínculos de equipe associados. Confirme para continuar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedLogista) {
                  handleDelete(selectedLogista);
                }
                setDeleteModalOpen(false);
                setActionsModalOpen(false);
              }}
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>);

}

type TeamMember = {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

function TeamList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: TeamMember[];
  emptyLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#134B73]">{title}</h4>
        <Badge variant="secondary" className="bg-[#134B73]/10 text-[#134B73] border-[#134B73]/20">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </Badge>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((member) => (
            <div
              key={member.id ?? member.email ?? member.fullName}
              className="rounded-xl border border-slate-200 p-3 shadow-sm bg-white"
            >
              <div className="font-medium text-[#134B73]">{member.fullName || "--"}</div>
              <div className="text-xs text-muted-foreground">{member.email || "sem e-mail"}</div>
              <div className="text-xs text-muted-foreground">{member.phone || "sem telefone"}</div>
              {member.status && (
                <Badge className="mt-2 bg-[#0f3c5a] text-white border border-white/20 w-fit">
                  {member.status}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#134B73]">{value || "--"}</p>
    </div>
  );
}
