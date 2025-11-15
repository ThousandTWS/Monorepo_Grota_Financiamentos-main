import api from "../server/api";

export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
}

const userServices = {
  async me(): Promise<AuthenticatedUser> {
    const { data } = await api.get<AuthenticatedUser>("/auth/me", {
      withCredentials: true,
    });

    return data;
  },
};

export default userServices;
