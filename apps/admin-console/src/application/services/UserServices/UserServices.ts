export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export type AdminUser = {
  phone: string | undefined;
  id: number;
  email?: string;
  fullName?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (payload as { error?: string; message?: string })?.error ??
      (payload as { error?: string; message?: string })?.message ??
      "Falha ao comunicar com o servidor.";
    throw new Error(message);
  }
  return (payload ?? {}) as T;
}

const userServices = {
  async me(): Promise<AuthenticatedUser> {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    const payload = await handleResponse<{ user: AuthenticatedUser }>(response);
    return payload.user;
  },

  async getAllAdmins(): Promise<AdminUser[]> {
    const response = await fetch("/api/users?role=ADMIN", {
      credentials: "include",
      cache: "no-store",
    });
    const payload = await handleResponse<AdminUser[]>(response);
    return Array.isArray(payload) ? payload : [];
  },

  async linkAdminToDealer(adminId: number, dealerId: number | null): Promise<AdminUser> {
    const response = await fetch("/api/users", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: adminId,
        dealerId,
      }),
      cache: "no-store",
    });
    return handleResponse<AdminUser>(response);
  },
};

export default userServices;
