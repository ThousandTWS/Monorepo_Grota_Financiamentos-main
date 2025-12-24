"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import userServices, {
  type AuthenticatedUser,
} from "@/application/services/UserServices/UserServices";
import type { UserContextType } from "../@types/user/UserContextType";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userServices.me();
      setUser(data);
    } catch (err) {
      console.warn("[UserProvider] Falha ao carregar usuario", err);
      setUser(null);
      setError("Falha ao carregar usuario.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      refreshUser: loadUser,
    }),
    [user, isLoading, error, loadUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
