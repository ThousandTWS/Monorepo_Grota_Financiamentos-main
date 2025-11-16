"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthenticatedUser,
  fetchAuthenticatedUser,
} from "@/application/services/auth/userService";

export function useAuthenticatedUser() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAuthenticatedUser();
      setUser(data);
      setError(null);
    } catch (_error) {
      setUser(null);
      setError("Não foi possível sincronizar o usuário.");
      throw _error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser().catch(() => {
      // erro já tratado no estado
    });
  }, [loadUser]);

  return { user, isLoading, error, refetch: loadUser };
}
