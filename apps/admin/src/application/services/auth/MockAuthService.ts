import api from "../server/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  fullName: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
}

export class MockAuthService {
  async signIn({ email, password }: AuthCredentials): Promise<AuthResult> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        return {
          success: false,
          message: error?.error ?? "Credenciais inválidas.",
        };
      }

      const payload = await response.json();
      return {
        success: true,
        message: "Login realizado com sucesso!",
        user: payload?.user,
      };
    } catch (error: any) {
      console.error("Erro no login:", error.message);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro no servidor. Tente novamente.",
      };
    }
  }

  async signUp({
    email,
    password,
    fullName,
  }: RegisterData): Promise<AuthResult> {
    try {
      const { data } = await api.post("/users", {
        email,
        password,
        fullName,
      });

      return {
        success: true,
        message: "Cadastro realizado com sucesso!",
        user: { id: data.id, email, name: fullName },
      };
    } catch (error: any) {
      console.log("Deu erro", error.response.data);

      if (error.response) {
        const { status, data } = error.response;

        if (status == 400) {
          return {
            success: false,
            message: data.message,
          };
        }
      }
      return {
        success: false,
        message: "Erro inesperado ao cadastrar. Tente novamente mais tarde.",
      };
    }
  }

  async forgotPassword(email: string): Promise<AuthResult> {
    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      return {
        success: true,
        message: "Instruções enviadas para seu email!",
      };
    } catch (error: any) {
      console.log("Deu erro", error.response.data);

      return {
        success: false,
        message: "Erro ao enviar instruções para email",
      };
    }
  }
}
