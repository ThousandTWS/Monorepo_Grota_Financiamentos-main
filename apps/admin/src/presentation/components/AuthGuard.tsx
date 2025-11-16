"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthenticatedUser } from "@/presentation/hooks/useAuthenticatedUser";
import { toast } from "sonner";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export function AuthGuard({
  children,
  allowedRoles = ["ADMIN"],
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, error } = useAuthenticatedUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user || error) {
      toast.error("Faça login para acessar essa página.");
      router.replace(`/?redirect=${pathname}`);
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      toast.error("Você não tem permissão para acessar esta área.");
      router.replace("/signin");
    }
  }, [user, error, isLoading, router, pathname, allowedRoles]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Verificando permissões...
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
