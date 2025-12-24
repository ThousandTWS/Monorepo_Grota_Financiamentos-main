import type { AuthenticatedUser } from "@/application/services/UserServices/UserServices";

export type UserContextType = {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};
