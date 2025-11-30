"use client";

import { useEffect, useState } from "react";
import { Button } from "@/presentation/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { toast } from "sonner";

type Address = {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  state?: string;
  zipCode?: string;
};

type DealerProfile = {
  fullNameEnterprise?: string;
  birthData?: string;
  cnpj?: string;
  address?: Address;
};

function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<DealerProfile>({
    fullNameEnterprise: "",
    birthData: "",
    cnpj: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      state: "",
      zipCode: "",
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/dealers/details", { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || "Falha ao carregar dados.");
        }
        const data = await res.json();
        setProfile({
          fullNameEnterprise: data.fullNameEnterprise ?? "",
          birthData: data.birthData ?? "",
          cnpj: data.cnpj ?? "",
          address: {
            street: data.address?.street ?? "",
            number: data.address?.number ?? "",
            complement: data.address?.complement ?? "",
            neighborhood: data.address?.neighborhood ?? "",
            state: data.address?.state ?? "",
            zipCode: data.address?.zipCode ?? "",
          },
        });
      } catch (error) {
        console.error("[config] loadProfile", error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar dados do lojista",
        );
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (
    field: keyof DealerProfile | keyof Address,
    value: string,
    isAddress = false,
  ) => {
    if (isAddress) {
      setProfile((prev) => ({
        ...prev,
        address: { ...(prev.address ?? {}), [field]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dealers/profile/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Não foi possível salvar os dados.");
      }
      toast.success("Dados do lojista atualizados!");
    } catch (error) {
      console.error("[config] saveProfile", error);
      toast.error(error instanceof Error ? error.message : "Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Não foi possível alterar a senha.");
      }
      toast.success("Senha alterada com sucesso!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("[config] changePassword", error);
      toast.error(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Título Principal */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Configurações da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações, usuários e segurança
        </p>
      </div>

      {/* Dados do lojista */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Lojista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Razão Social"
              value={profile.fullNameEnterprise ?? ""}
              onChange={(e) => handleProfileChange("fullNameEnterprise", e.target.value)}
            />
            <Input
              placeholder="CNPJ"
              value={profile.cnpj ?? ""}
              onChange={(e) => handleProfileChange("cnpj", e.target.value)}
            />
            <Input
              placeholder="Data de nascimento/fundação (AAAA-MM-DD)"
              value={profile.birthData ?? ""}
              onChange={(e) => handleProfileChange("birthData", e.target.value)}
            />
            <Input
              placeholder="Logradouro"
              value={profile.address?.street ?? ""}
              onChange={(e) => handleProfileChange("street", e.target.value, true)}
            />
            <Input
              placeholder="Número"
              value={profile.address?.number ?? ""}
              onChange={(e) => handleProfileChange("number", e.target.value, true)}
            />
            <Input
              placeholder="Complemento"
              value={profile.address?.complement ?? ""}
              onChange={(e) => handleProfileChange("complement", e.target.value, true)}
            />
            <Input
              placeholder="Bairro"
              value={profile.address?.neighborhood ?? ""}
              onChange={(e) => handleProfileChange("neighborhood", e.target.value, true)}
            />
            <Input
              placeholder="UF"
              value={profile.address?.state ?? ""}
              maxLength={2}
              onChange={(e) => handleProfileChange("state", e.target.value.toUpperCase(), true)}
            />
            <Input
              placeholder="CEP"
              value={profile.address?.zipCode ?? ""}
              onChange={(e) => handleProfileChange("zipCode", e.target.value, true)}
            />
            <div className="col-span-1 md:col-span-3">
              <Button className="w-full md:w-auto" onClick={handleSaveProfile} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alterar senha */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 max-w-md">
            <Input
              placeholder="Senha atual"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
              }
            />
            <Input
              placeholder="Nova senha"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
            <Input
              placeholder="Confirmar nova senha"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
            <Button onClick={handlePasswordChange} disabled={loading}>
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfiguracoesPage;
