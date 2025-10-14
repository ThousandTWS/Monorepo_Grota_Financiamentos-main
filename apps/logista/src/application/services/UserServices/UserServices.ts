import api from "@/application/services/server/api";

export const AuthService = {
  async me() {
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (error) {
      console.error("Erro ao buscar usuário autenticado:", error);
      throw error;
    }
  },
};
