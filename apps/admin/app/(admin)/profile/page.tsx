"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/layout/components/ui/card";
import { Button } from "@/presentation/layout/components/ui/button";
import { logout } from "@/application/services/auth/userService";
import { useRouter } from "next/navigation";
import { useAuthenticatedUser } from "@/presentation/hooks/useAuthenticatedUser";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, error, refetch } = useAuthenticatedUser();
  const router = useRouter();

  const initials = useMemo(() => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "US";
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão encerrada.");
      router.push("/signin");
    } catch (_error) {
      toast.error("Não foi possível encerrar a sessão.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-500">Perfil</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Seus dados de acesso
        </h1>
        <p className="text-sm text-muted-foreground">
          Revise as informações da sua conta e mantenha seus dados atualizados.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {initials}
          </div>
          <div>
            <CardTitle className="text-xl">
              {isLoading ? "Carregando..." : user?.fullName ?? "Usuário"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Sincronizando..." : user?.email ?? "E-mail não informado"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
              <button
                type="button"
                onClick={() => refetch().catch(() => undefined)}
                className="ml-2 text-rose-700 underline dark:text-rose-200"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Nome</p>
              <p className="text-sm font-medium">
                {user?.fullName ?? (isLoading ? "—" : "Não disponível")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium break-words">
                {user?.email ?? (isLoading ? "—" : "Não disponível")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="secondary" disabled>
              Editar dados (em breve)
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
