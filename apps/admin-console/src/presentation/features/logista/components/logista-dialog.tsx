"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import { Logista } from "./columns";
import {
  AddressPayload,
  CreateDealerPayload,
  PartnerPayload,
} from "@/application/services/Logista/logisticService";
import { StatusBadge } from "./status-badge";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const digitsOnly = (value?: string) => (value ?? "").replace(/\D/g, "");

const CNPJ_STATUS_LABELS: Record<string, string> = {
  "01": "Nula",
  "02": "Ativa",
  "03": "Suspensa",
  "04": "Inapta",
  "08": "Baixada",
};

const normalizeCnpjStatusTone = (status?: string | null) => {
  const raw = (status ?? "").toString().trim().toLowerCase();
  if (!raw) return "pendente";

  const digits = raw.replace(/\D/g, "");
  if (digits) {
    if (digits === "02") return "aprovada";
    if (["01", "03", "04", "08"].includes(digits)) return "recusada";
  }

  const normalized = raw.replace(/[^a-z]+/g, " ");

  const isActive = ["ativa", "ativo", "active", "regular", "regularizada"].some(
    (value) => normalized.includes(value),
  );
  if (isActive) return "aprovada";

  const isInactive = [
    "baixada",
    "suspensa",
    "suspenso",
    "inapta",
    "inativa",
    "inativada",
    "cancelada",
    "nula",
    "irregular",
  ].some((value) => normalized.includes(value));
  if (isInactive) return "recusada";

  return "pendente";
};

const formatCnpjStatusLabel = (status?: string | null) => {
  const raw = (status ?? "").toString().trim();
  if (!raw) return "Status nao informado";

  const digits = raw.replace(/\D/g, "");
  if (digits) {
    return CNPJ_STATUS_LABELS[digits] ?? "Status nao informado";
  }

  return raw;
};

interface LogistaDialogProps {
  logista: Logista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateDealerPayload) => Promise<void>;
  mode: "view" | "create";
  isSubmitting?: boolean;
  renderAsModal?: boolean;
}

export function LogistaDialog({
  logista,
  open,
  onOpenChange,
  onSave,
  mode,
  isSubmitting = false,
  renderAsModal = true,
}: LogistaDialogProps) {
  const inputWidth = "w-60 md:w-full";
  const [formData, setFormData] = useState<CreateDealerPayload>({
    fullName: "",
    phone: "",
    enterprise: "",
    password: "",
    razaoSocial: "",
    cnpj: "",
    address: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    partners: [],
    observation: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isCnpjLoading, setIsCnpjLoading] = useState(false);
  const [cnpjStatus, setCnpjStatus] = useState<string | null>(null);
  const [cnpjVerified, setCnpjVerified] = useState(false);
  const [lastCnpjLookup, setLastCnpjLookup] = useState("");

  useEffect(() => {
    if (logista) {
      setFormData({
        fullName: logista.fullName ?? "",
        phone: logista.phone ?? "",
        enterprise: logista.enterprise ?? "",
        password: "",
        razaoSocial: logista.razaoSocial ?? "",
        cnpj: logista.cnpj ?? "",
        address: {
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        },
        partners: [],
        observation: "",
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        enterprise: "",
        password: "",
        razaoSocial: "",
        cnpj: "",
        address: {
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        },
        partners: [],
        observation: "",
      });
    }
    setFormError(null);
    setIsCnpjLoading(false);
    setCnpjStatus(null);
    setCnpjVerified(false);
    setLastCnpjLookup("");
  }, [logista, open]);

  const handleCnpjLookup = async (cnpjDigits: string) => {
    if (isReadOnly) return;
    setIsCnpjLoading(true);
    setCnpjVerified(false);
    setFormError(null);
    try {
      const res = await fetch("/api/searchCNPJ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: cnpjDigits }),
      });
      const response = await res.json().catch(() => null);
      if (!res.ok || !response?.success) {
        throw new Error(response?.error || "Nao foi possivel verificar o CNPJ.");
      }

      const cnpjData =
        response?.data?.data?.cnpj ??
        response?.data?.cnpj ??
        response?.data?.response?.content?.cnpj ??
        response?.data?.response?.content ??
        null;

      const razaoSocial =
        cnpjData?.empresa?.razao_social ??
        cnpjData?.razao_social ??
        cnpjData?.empresa?.nome_empresarial ??
        cnpjData?.nome_empresarial ??
        "";

      const ufRaw =
        cnpjData?.endereco?.uf ??
        cnpjData?.estabelecimento?.uf ??
        cnpjData?.estabelecimento?.estado ??
        cnpjData?.empresa?.estado ??
        "";
      const uf = typeof ufRaw === "string" ? ufRaw.toUpperCase() : "";

      const statusValue =
        cnpjData?.empresa?.situacao_cadastral ??
        cnpjData?.situacao_cadastral ??
        cnpjData?.situacao ??
        cnpjData?.status ??
        cnpjData?.estabelecimento?.situacao_cadastral ??
        null;

      const statusText =
        typeof statusValue === "string"
          ? statusValue
          : typeof statusValue === "number"
            ? String(statusValue)
            : statusValue && typeof statusValue === "object"
              ? String(
                  (statusValue as Record<string, unknown>).descricao ??
                    (statusValue as Record<string, unknown>).description ??
                    (statusValue as Record<string, unknown>).nome ??
                    (statusValue as Record<string, unknown>).codigo ??
                    "",
                )
              : "";

      setFormData((prev) => ({
        ...prev,
        razaoSocial: razaoSocial || prev.razaoSocial,
        address: {
          ...(prev.address ?? {}),
          state: uf || prev.address?.state || "",
        },
      }));
      setCnpjStatus(statusText || null);
      setCnpjVerified(true);
    } catch (error) {
      console.error("[logista-dialog] Falha ao buscar CNPJ", error);
      setFormError(
        error instanceof Error ? error.message : "Erro ao consultar CNPJ.",
      );
      setCnpjVerified(false);
    } finally {
      setIsCnpjLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") {
      onOpenChange(false);
      return;
    }

    const validationErrors: string[] = [];

    const fullName = formData.fullName.trim();
    const enterprise = formData.enterprise.trim();
    const phoneDigits = digitsOnly(formData.phone);
    const password = formData.password.trim();

    if (!fullName) {
      validationErrors.push("O nome completo e obrigatorio.");
    } else if (fullName.length < 2 || fullName.length > 100) {
      validationErrors.push("O nome completo deve ter entre 2 e 100 caracteres.");
    }

    if (!enterprise) {
      validationErrors.push("A empresa e obrigatoria.");
    } else if (enterprise.length < 2 || enterprise.length > 100) {
      validationErrors.push("O nome da empresa deve ter entre 2 e 100 caracteres.");
    }

    if (!phoneDigits) {
      validationErrors.push("O telefone e obrigatorio.");
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      validationErrors.push("Informe um telefone valido com 10 ou 11 digitos.");
    }

    if (!password) {
      validationErrors.push("A senha e obrigatoria.");
    } else if (password.length < 6 || password.length > 8) {
      validationErrors.push("Defina uma senha de 6 a 8 caracteres.");
    }

    const address = formData.address;
    if (address) {
      const zipDigits = digitsOnly(address.zipCode);
      const street = address.street?.trim() ?? "";
      const number = address.number?.trim() ?? "";
      const complement = address.complement?.trim() ?? "";
      const neighborhood = address.neighborhood?.trim() ?? "";
      const city = address.city?.trim() ?? "";
      const state = address.state?.trim() ?? "";

      if (zipDigits && zipDigits.length !== 8) {
        validationErrors.push("CEP deve conter 8 digitos.");
      }
      if (street && (street.length < 2 || street.length > 255)) {
        validationErrors.push("Logradouro deve ter entre 2 e 255 caracteres.");
      }
      if (number && number.length > 20) {
        validationErrors.push("Numero deve ter no maximo 20 caracteres.");
      }
      if (complement && complement.length > 255) {
        validationErrors.push("Complemento deve ter no maximo 255 caracteres.");
      }
      if (neighborhood && (neighborhood.length < 2 || neighborhood.length > 100)) {
        validationErrors.push("Bairro deve ter entre 2 e 100 caracteres.");
      }
      if (city && (city.length < 2 || city.length > 100)) {
        validationErrors.push("Cidade deve ter entre 2 e 100 caracteres.");
      }
      if (state && state.length !== 2) {
        validationErrors.push("Estado deve ser a sigla com 2 caracteres.");
      }
    }

    (formData.partners ?? []).forEach((partner, index) => {
      const cpfDigits = digitsOnly(partner.cpf);
      const name = partner.name?.trim() ?? "";
      const hasData = cpfDigits || name || partner.type;
      if (!hasData) return;

      if (!cpfDigits) {
        validationErrors.push(`Socio ${index + 1}: CPF e obrigatorio.`);
      } else if (cpfDigits.length !== 11) {
        validationErrors.push(`Socio ${index + 1}: CPF deve ter 11 digitos.`);
      }

      if (!name) {
        validationErrors.push(`Socio ${index + 1}: nome e obrigatorio.`);
      } else if (name.length < 2 || name.length > 150) {
        validationErrors.push(`Socio ${index + 1}: nome deve ter entre 2 e 150 caracteres.`);
      }

      if (!partner.type) {
        validationErrors.push(`Socio ${index + 1}: selecione o tipo.`);
      }
    });

    if (validationErrors.length > 0) {
      setFormError(validationErrors.join(" "));
      return;
    }

    setFormError(null);
    const normalizedAddress: AddressPayload | undefined =
      formData.address &&
      Object.values(formData.address).some(
        (value) => value && value.toString().trim().length > 0,
      )
        ? {
            zipCode: formData.address.zipCode?.replace(/\D/g, ""),
            street: formData.address.street?.trim(),
            number: formData.address.number?.trim(),
            complement: formData.address.complement?.trim(),
            neighborhood: formData.address.neighborhood?.trim(),
            city: formData.address.city?.trim(),
            state: formData.address.state?.trim(),
          }
        : undefined;

    const normalizedPartners: PartnerPayload[] | undefined = formData.partners
      ?.map((partner) => ({
        cpf: partner.cpf?.replace(/\D/g, ""),
        name: partner.name?.trim(),
        type: partner.type,
        signatory: partner.signatory,
      }))
      .filter(
        (partner) =>
          (partner.cpf && partner.cpf.length > 0) ||
          (partner.name && partner.name.length > 0) ||
          partner.type,
      );

    const normalizedPayload: CreateDealerPayload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      enterprise: formData.enterprise.trim(),
      password: formData.password.trim(),
      razaoSocial: formData.razaoSocial?.trim() || undefined,
      cnpj: formData.cnpj?.replace(/\D/g, "") || undefined,
      address: normalizedAddress,
      partners: normalizedPartners,
      observation: formData.observation?.trim() || undefined,
    };
    try {
      await onSave(normalizedPayload);
      onOpenChange(false);
    } catch (err) {
      console.error("[logista-dialog] Falha ao salvar logista", err);
    }
  };

  const handleCepLookup = async () => {
    const cep = formData.address?.zipCode?.replace(/\D/g, "");
    if (!cep || cep.length !== 8) {
      setFormError("Informe um CEP valido com 8 digitos.");
      return;
    }
    setFormError(null);
    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data?.erro) {
        setFormError("CEP nao encontrado.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        address: {
          ...(prev.address ?? {}),
          zipCode: cep,
          street: data.logradouro ?? prev.address?.street ?? "",
          neighborhood: data.bairro ?? prev.address?.neighborhood ?? "",
          city: data.localidade ?? prev.address?.city ?? "",
          state: data.uf ?? prev.address?.state ?? "",
        },
      }));
    } catch (error) {
      console.error("[logista-dialog] Falha ao buscar CEP", error);
      setFormError("Nao foi possivel buscar o CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };

  const isReadOnly = mode === "view";
  const cnpjStatusLabel = formatCnpjStatusLabel(cnpjStatus);
  const cnpjStatusTone = normalizeCnpjStatusTone(cnpjStatus);
  const cnpjVerificationLabel = cnpjVerified ? "Verificado" : "Nao verificado";
  const cnpjVerificationTone = cnpjVerified ? "aprovada" : "pendente";
  const shouldShowCnpjStatus = cnpjStatusLabel !== "Status nao informado";

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Visualizar Logista";
      case "create":
        return "Novo Logista";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "view":
        return "Informacoes detalhadas do logista";
      case "create":
        return "Preencha os dados para criar um novo logista";
    }
  };

  const states = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const formContent = (
    <form onSubmit={handleSubmit} data-oid="mt:b5u-">
      <div className="space-y-4 py-3" data-oid="j2804_h">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Dados da Loja</h3>
          <p className="text-xs text-muted-foreground">
            Preencha as informacoes principais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Text>Responsavel</Text>
            <Input
              id="fullName"
              className={inputWidth}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nome completo"
              disabled={isReadOnly}
              data-oid="full-name"
            />
          </div>
          <div className="space-y-2">
            <Text>Nome da empresa</Text>
            <Input
              id="enterprise"
              className={inputWidth}
              value={formData.enterprise}
              onChange={(e) => setFormData({ ...formData, enterprise: e.target.value })}
              placeholder="Nome fantasia / login"
              disabled={isReadOnly}
              data-oid="enterprise"
            />
          </div>
          <div className="space-y-2">
            <Text>Telefone</Text>
            <Input
              id="phone"
              className={inputWidth}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              disabled={isReadOnly}
              data-oid="phone"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Text>CNPJ</Text>
            <Input
              id="cnpj"
              className={inputWidth}
              value={formData.cnpj ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, cnpj: value });
                if (isReadOnly) return;
                const digits = digitsOnly(value);
                if (digits.length === 14 && digits !== lastCnpjLookup) {
                  setLastCnpjLookup(digits);
                  void handleCnpjLookup(digits);
                } else if (digits.length < 14) {
                  setLastCnpjLookup("");
                  setCnpjVerified(false);
                  setCnpjStatus(null);
                }
              }}
              placeholder="00.000.000/0000-00"
              disabled={isReadOnly}
              data-oid="cnpj"
            />
          </div>
          <div className="space-y-2">
            <Text>Razao Social</Text>
            <Input
              id="razaoSocial"
              className={inputWidth}
              value={formData.razaoSocial ?? ""}
              onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              placeholder="RAZAO SOCIAL"
              disabled={isReadOnly}
              data-oid="razao-social"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Text>Status do CNPJ (Receita)</Text>
          <div className="flex flex-wrap items-center gap-2" data-oid="cnpj-status">
            {shouldShowCnpjStatus ? (
              <StatusBadge status={cnpjStatusTone} className="shadow-none">
                {cnpjStatusLabel}
              </StatusBadge>
            ) : null}
            <StatusBadge status={cnpjVerificationTone} className="shadow-none">
              {cnpjVerificationLabel}
            </StatusBadge>
          </div>
          {!isReadOnly && isCnpjLoading && (
            <p className="text-xs text-muted-foreground">Consultando CNPJ na Receita...</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <Text>Endereco (opcional)</Text>
              <p className="text-xs text-muted-foreground">
                Busque pelo CEP para preencher automaticamente.
              </p>
            </div>
            {!isReadOnly && (
              <Button
                type="default"
                size="small"
                onClick={handleCepLookup}
                loading={isCepLoading}
              >
                {isCepLoading ? "Buscando..." : "Buscar CEP"}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="CEP"
              className={inputWidth}
              value={formData.address?.zipCode ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), zipCode: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="cep"
            />
            <Input
              placeholder="Logradouro"
              className="md:col-span-2"
              value={formData.address?.street ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), street: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="logradouro"
            />
            <Input
              placeholder="Numero"
              className={inputWidth}
              value={formData.address?.number ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), number: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="numero"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Complemento"
              className={inputWidth}
              value={formData.address?.complement ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), complement: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="complemento"
            />
            <Input
              placeholder="Bairro"
              className="md:col-span-2"
              value={formData.address?.neighborhood ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), neighborhood: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="bairro"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Cidade"
              className={inputWidth}
              value={formData.address?.city ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), city: e.target.value },
                })
              }
              disabled={isReadOnly}
              data-oid="cidade"
            />
            <Select
              value={formData.address?.state ?? ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  address: { ...(formData.address ?? {}), state: value },
                })
              }
              disabled={isReadOnly}
              placeholder="Estado"
              options={states.map((uf) => ({ value: uf, label: uf }))}
              className={inputWidth}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Text>Observacao (opcional)</Text>
          <TextArea
            id="observation"
            value={formData.observation ?? ""}
            onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
            placeholder="Observacoes internas sobre o lojista"
            disabled={isReadOnly}
            data-oid="observacao"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Text>Socios / Procuradores (opcional)</Text>
            {!isReadOnly && (
              <Button
                type="default"
                size="small"
                onClick={() =>
                  setFormData({
                    ...formData,
                    partners: [
                      ...(formData.partners ?? []),
                      { cpf: "", name: "", type: "SOCIO", signatory: false },
                    ],
                  })
                }
                data-oid="add-partner"
              >
                Adicionar
              </Button>
            )}
          </div>
          {(formData.partners ?? []).map((partner, index) => (
            <div
              key={`partner-${index}`}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border rounded-md p-3"
            >
              <div className="space-y-1">
                <Text>CPF</Text>
                <Input
                  value={partner.cpf ?? ""}
                  onChange={(e) => {
                    const partners = [...(formData.partners ?? [])];
                    partners[index] = { ...partners[index], cpf: e.target.value };
                    setFormData({ ...formData, partners });
                  }}
                  placeholder="00000000000"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-1">
                <Text>Nome</Text>
                <Input
                  value={partner.name ?? ""}
                  onChange={(e) => {
                    const partners = [...(formData.partners ?? [])];
                    partners[index] = { ...partners[index], name: e.target.value };
                    setFormData({ ...formData, partners });
                  }}
                  placeholder="Nome completo"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-1">
                <Text>Tipo</Text>
                <Select
                  value={partner.type ?? "SOCIO"}
                  onChange={(value) => {
                    const partners = [...(formData.partners ?? [])];
                    partners[index] = {
                      ...partners[index],
                      type: value as PartnerPayload["type"],
                    };
                    setFormData({ ...formData, partners });
                  }}
                  disabled={isReadOnly}
                  placeholder="Selecione o tipo"
                  options={[
                    { value: "SOCIO", label: "Socio" },
                    { value: "PROCURADOR", label: "Procurador" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`sign-${index}`}
                  checked={partner.signatory ?? false}
                  onChange={(e) => {
                    const partners = [...(formData.partners ?? [])];
                    partners[index] = {
                      ...partners[index],
                      signatory: Boolean(e.target.checked),
                    };
                    setFormData({ ...formData, partners });
                  }}
                  disabled={isReadOnly}
                />
                <Text>Assina pela empresa</Text>
              </div>
              {!isReadOnly && (
                <Button
                  type="text"
                  danger
                  onClick={() => {
                    const partners = (formData.partners ?? []).filter((_, i) => i !== index);
                    setFormData({ ...formData, partners });
                  }}
                >
                  Remover
                </Button>
              )}
            </div>
          ))}
          {(formData.partners?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum socio ou procurador adicionado.
            </p>
          )}
        </div>

        {mode === "create" && (
          <div className="space-y-2" data-oid="c3lkwui">
            <Text>Senha inicial</Text>
            <Input.Password
              id="password"
              className={inputWidth}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Defina uma senha (6 a 8 caracteres)"
              disabled={isSubmitting}
              required
              minLength={6}
              maxLength={8}
              data-oid="9ffpl6v"
            />

            <p className="text-xs text-muted-foreground">
              Essa senha sera utilizada pelo lojista ao acessar o painel do logista.
            </p>
          </div>
        )}

        {mode === "view" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="v7qo9cd">
            <div className="space-y-2">
              <Text>Status</Text>
              <StatusBadge status={logista?.status} />
            </div>
            <div className="space-y-2">
              <Text>Data de registro</Text>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                {logista?.createdAt
                  ? new Date(logista.createdAt).toLocaleDateString("pt-BR")
                  : "--"}
              </div>
            </div>
          </div>
        )}

        {formError && (
          <p className="text-sm text-red-500" data-oid="errMsg">
            {formError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2" data-oid="gwrq6il">
        <Button type="default" onClick={() => onOpenChange(false)} data-oid="ybh:lpy">
          {mode === "view" ? "Fechar" : "Cancelar"}
        </Button>
        {mode !== "view" && (
          <Button type="primary" htmlType="submit" loading={isSubmitting} data-oid="fnyk5_2">
            {isSubmitting ? "Salvando..." : "Criar"}
          </Button>
        )}
      </div>
    </form>
  );

  if (!renderAsModal && mode === "create") {
    if (!open) return null;
    return (
      <Card className="rounded-lg border bg-card p-6 shadow-sm" data-oid="inline-logista-form">
        <div className="space-y-1 mb-2">
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
          <Paragraph className="text-sm text-muted-foreground">{getDescription()}</Paragraph>
        </div>
        {formContent}
      </Card>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      title={getTitle()}
      width={800}
      data-oid=".0zrq2c"
    >
      <Paragraph className="text-sm text-muted-foreground">{getDescription()}</Paragraph>
      {formContent}
    </Modal>
  );
}
