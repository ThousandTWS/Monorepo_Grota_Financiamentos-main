export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

const userServices = {
  async me(): Promise<AuthenticatedUser> {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Não autenticado");
    }

    const { user } = (await response.json()) as { user: AuthenticatedUser };
    return user;
  },
};

export default userServices;
