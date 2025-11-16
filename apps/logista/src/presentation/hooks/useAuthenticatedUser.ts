"use client";

import { useCallback, useEffect, useState } from "react";
import userServices, {
  AuthenticatedUser,
} from "@/application/services/UserServices/UserServices";

export function useAuthenticatedUser() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userServices.me();
      setUser(data);
      setError(null);
    } catch (_error) {
      setUser(null);
      setError("Sessão expirada ou inválida.");
      throw _error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser().catch(() => undefined);
  }, [loadUser]);

  return { user, isLoading, error, refetch: loadUser };
}
