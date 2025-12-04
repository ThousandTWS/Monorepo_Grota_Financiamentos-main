"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  KeyRound,
  Loader2,
  MapPin,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/presentation/ui/badge";
import { Button } from "@/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Separator } from "@/presentation/ui/separator";
import { Skeleton } from "@/presentation/ui/skeleton";

type Address = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

type DealerProfile = {
  fullNameEnterprise: string;
  birthData: string;
  cnpj: string;
  address: Address;
};

type DealerDetails = DealerProfile & {
  email?: string;
  phone?: string;
  enterprise?: string;
  status?: string;
  createdAt?: string;
  logoUrl?: string;
};

const emptyAddress: Address = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

const defaultProfile: DealerProfile = {
  fullNameEnterprise: "",
  birthData: "",
  cnpj: "",
  address: emptyAddress,
};

function ConfiguracoesPage() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [dealer, setDealer] = useState<DealerDetails>({
    ...defaultProfile,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const statusTone = useMemo(() => {
    const status = (dealer.status ?? "").toUpperCase();
    if (status === "ATIVO" || status === "ACTIVE") return "bg-emerald-500/15 text-emerald-900 border border-emerald-100";
    if (status === "PENDENTE") return "bg-amber-500/15 text-amber-900 border border-amber-100";
    return "bg-slate-500/15 text-slate-900 border border-slate-200";
  }, [dealer.status]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/dealers/details", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Falha ao carregar dados.");
        }

        const address: Address = {
          street: data.address?.street ?? "",
          number: data.address?.number ?? "",
          complement: data.address?.complement ?? "",
          neighborhood: data.address?.neighborhood ?? "",
          city: data.address?.city ?? "",
          state: data.address?.state ?? "",
          zipCode: data.address?.zipCode ?? "",
        };

        const details: DealerDetails = {
          fullNameEnterprise: data.fullNameEnterprise ?? data.enterprise ?? "",
          birthData: data.birthData ?? "",
          cnpj: data.cnpj ?? "",
          address,
          email: data.email ?? "",
          phone: data.phone ?? "",
          enterprise: data.enterprise ?? "",
          status: data.status ?? "",
          createdAt: data.createdAt ?? "",
          logoUrl: data.logoUrl ?? "",
        };

        setDealer(details);
        setLogoPreview(details.logoUrl || null);
      } catch (error) {
        console.error("[config] loadProfile", error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar dados do lojista",
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const digitsOnly = (value: string) => value.replace(/\D/g, "");

  const handleProfileChange = (
    field: keyof DealerProfile | keyof Address,
    value: string,
    isAddress = false,
  ) => {
    if (isAddress) {
      setDealer((prev) => ({
        ...prev,
        address: { ...(prev.address ?? emptyAddress), [field]: value },
      }));
    } else {
      setDealer((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateProfile = (profile: DealerProfile) => {
    if (!profile.fullNameEnterprise.trim()) {
      toast.error("Informe a razão social da empresa.");
      return false;
    }
    if (!profile.cnpj || digitsOnly(profile.cnpj).length !== 14) {
      toast.error("CNPJ inválido. Use 14 dígitos.");
      return false;
    }
    if (!profile.birthData) {
      toast.error("Informe a data de fundação/nascimento no formato AAAA-MM-DD.");
      return false;
    }

    const address = profile.address ?? emptyAddress;
    const requiredFields: Array<keyof Address> = [
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "zipCode",
    ];

    for (const key of requiredFields) {
      if (!address[key]?.toString().trim()) {
        toast.error("Preencha todos os campos de endereço.");
        return false;
      }
    }

    if (address.state.length !== 2) {
      toast.error("UF deve ter 2 letras.");
      return false;
    }

    if (digitsOnly(address.zipCode).length !== 8) {
      toast.error("CEP deve ter 8 dígitos.");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    const payload: DealerProfile = {
      fullNameEnterprise: dealer.fullNameEnterprise ?? "",
      birthData: dealer.birthData ?? "",
      cnpj: digitsOnly(dealer.cnpj ?? ""),
      address: {
        street: dealer.address?.street ?? "",
        number: dealer.address?.number ?? "",
        complement: dealer.address?.complement ?? "",
        neighborhood: dealer.address?.neighborhood ?? "",
        city: dealer.address?.city ?? "",
        state: (dealer.address?.state ?? "").toUpperCase(),
        zipCode: digitsOnly(dealer.address?.zipCode ?? ""),
      },
    };

    if (!validateProfile(payload)) return;

    setSavingProfile(true);
    try {
      const res = await fetch("/api/dealers/profile/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível salvar os dados.");
      }
      toast.success("Dados do lojista atualizados!");
    } catch (error) {
      console.error("[config] saveProfile", error);
      toast.error(error instanceof Error ? error.message : "Erro ao salvar dados");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível alterar a senha.");
      }
      toast.success("Senha alterada com sucesso!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("[config] changePassword", error);
      toast.error(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSelectLogo = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview(dealer.logoUrl || null);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error("Selecione um arquivo de imagem para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", logoFile);

    setUploadingLogo(true);
    try {
      const res = await fetch("/api/dealers/logo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível enviar a logomarca.");
      }
      const newUrl = data.logoUrl ?? data.secureUrl ?? data.url ?? null;
      setDealer((prev) => {
        const nextUrl = newUrl || prev.logoUrl || null;
        setLogoPreview(nextUrl);
        return { ...prev, logoUrl: nextUrl || "" };
      });
      setLogoFile(null);
      toast.success("Logomarca atualizada com sucesso!");
    } catch (error) {
      console.error("[config] uploadLogo", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar a logomarca",
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("pt-BR");
  };

  const renderProfileForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Razão social</Label>
        <Input
          placeholder="Nome completo da empresa"
          value={dealer.fullNameEnterprise ?? ""}
          onChange={(e) => handleProfileChange("fullNameEnterprise", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">CNPJ</Label>
        <Input
          placeholder="Apenas números"
          value={dealer.cnpj ?? ""}
          onChange={(e) => handleProfileChange("cnpj", digitsOnly(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Data de fundação</Label>
        <Input
          placeholder="AAAA-MM-DD"
          value={dealer.birthData ?? ""}
          onChange={(e) => handleProfileChange("birthData", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Telefone</Label>
        <Input
          disabled
          value={dealer.phone ?? ""}
          className="bg-slate-50"
          placeholder="Telefone cadastrado"
        />
      </div>
      <Separator className="md:col-span-2" />
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Logradouro</Label>
        <Input
          placeholder="Rua / Avenida"
          value={dealer.address?.street ?? ""}
          onChange={(e) => handleProfileChange("street", e.target.value, true)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Número</Label>
        <Input
          placeholder="Número"
          value={dealer.address?.number ?? ""}
          onChange={(e) => handleProfileChange("number", e.target.value, true)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Complemento</Label>
        <Input
          placeholder="Sala / Bloco"
          value={dealer.address?.complement ?? ""}
          onChange={(e) => handleProfileChange("complement", e.target.value, true)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Bairro</Label>
        <Input
          placeholder="Bairro"
          value={dealer.address?.neighborhood ?? ""}
          onChange={(e) => handleProfileChange("neighborhood", e.target.value, true)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">Cidade</Label>
        <Input
          placeholder="Cidade"
          value={dealer.address?.city ?? ""}
          onChange={(e) => handleProfileChange("city", e.target.value, true)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">UF</Label>
        <Input
          placeholder="UF"
          maxLength={2}
          value={dealer.address?.state ?? ""}
          onChange={(e) =>
            handleProfileChange("state", e.target.value.toUpperCase(), true)
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#134B73]">CEP</Label>
        <Input
          placeholder="Apenas números"
          value={dealer.address?.zipCode ?? ""}
          onChange={(e) =>
            handleProfileChange("zipCode", digitsOnly(e.target.value), true)
          }
        />
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="md:col-span-2">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white shadow-theme-lg border border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center overflow-hidden shadow-theme-lg">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo do lojista"
                    width={90}
                    height={90}
                    className="object-contain p-2"
                    sizes="90px"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-white" />
                )}
              </div>
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-[#134B73] shadow-lg">
                Lojista
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                Painel Grota
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Configurações do painel
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <Badge className={statusTone}>
                  {dealer.status ? dealer.status : "Status não informado"}
                </Badge>
                <span className="flex items-center gap-2 text-white/80">
                  <ShieldCheck size={16} /> Ambiente seguro
                </span>
                <span className="flex items-center gap-2 text-white/80">
                  <MapPin size={16} /> Desde {formatDate(dealer.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-white/10 border border-white/20 p-4 min-w-[260px]">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>E-mail</span>
              <span className="font-semibold">{dealer.email || "--"}</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Empresa</span>
              <span className="font-semibold">{dealer.enterprise || "--"}</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Telefone</span>
              <span className="font-semibold">{dealer.phone || "--"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-200/70 shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#134B73]">
              <Building2 size={20} /> Informações do lojista
            </CardTitle>
            <CardDescription>
              Mantenha os dados fiscais e de endereço do seu painel atualizados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingProfile ? renderProfileSkeleton() : renderProfileForm()}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                className="sm:w-auto w-full bg-[#134B73] hover:bg-[#0f3c5a]"
                onClick={handleSaveProfile}
                disabled={savingProfile || loadingProfile}
              >
                {savingProfile ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check size={16} /> Salvar alterações
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Campos obrigatórios: CNPJ, endereço completo e data de fundação.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#134B73]">
              <KeyRound size={20} /> Segurança e senha
            </CardTitle>
            <CardDescription>
              Atualize a senha de acesso ao painel do lojista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Senha atual</Label>
              <Input
                placeholder="••••••••"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nova senha</Label>
              <Input
                placeholder="Mínimo 6 caracteres"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar nova senha</Label>
              <Input
                placeholder="Repita a nova senha"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              className="w-full bg-[#134B73] hover:bg-[#0f3c5a]"
              onClick={handlePasswordChange}
              disabled={changingPassword}
            >
              {changingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Alterando...
                </span>
              ) : (
                "Alterar senha"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border border-slate-200/70 shadow-theme-lg">
          <CardHeader className="bg-gradient-to-r from-[#134B73] via-[#0f3c5a] to-[#0a2c45] text-white">
            <CardTitle className="flex items-center gap-2">
              <UploadCloud size={20} /> Identidade visual do painel
            </CardTitle>
            <CardDescription className="text-white/80">
              Personalize a logomarca exibida na sidebar do lojista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-2xl border-2 border-dashed border-[#134B73]/30 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Pré-visualização da logo"
                      width={120}
                      height={120}
                      className="object-contain"
                      sizes="120px"
                    />
                  ) : (
                    <UploadCloud className="h-8 w-8 text-[#134B73]" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-[180px]">
                  PNG, JPG ou WEBP até 5MB.
                </p>
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm text-[#134B73]">Selecionar arquivo</Label>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) =>
                      handleSelectLogo(event.target.files?.[0] ?? null)
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="bg-[#134B73] hover:bg-[#0f3c5a] sm:w-auto w-full"
                    onClick={handleUploadLogo}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UploadCloud size={16} /> Enviar logomarca
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    className="sm:w-auto w-full"
                    onClick={() => handleSelectLogo(null)}
                    disabled={uploadingLogo}
                  >
                    Limpar seleção
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  O envio substitui a logo atual da sidebar. Usamos Cloudinary para
                  hospedagem segura.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 shadow-theme-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#134B73]">
              <ShieldCheck size={20} /> Dicas rápidas
            </CardTitle>
            <CardDescription>
              Boas práticas para manter sua conta segura e padronizada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Check className="text-emerald-600 mt-0.5" size={16} />
              <p>Use um e-mail corporativo válido para notificações do painel.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-emerald-600 mt-0.5" size={16} />
              <p>Mantenha CNPJ e endereço iguais aos documentos enviados.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-emerald-600 mt-0.5" size={16} />
              <p>Atualize a senha regularmente e evite reutilizar senhas antigas.</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="text-emerald-600 mt-0.5" size={16} />
              <p>Prefira logos em fundo transparente para melhor contraste na sidebar.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
