/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../server/api";

const LOGISTA_PANEL_ORIGIN = (
  process.env.NEXT_PUBLIC_LOGISTA_PANEL_URL ?? "http://localhost:3002"
).replace(/\/$/, "");

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  fullName: string;
  phone: string;
  enterprise: string;
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
      const response = await fetch(`${LOGISTA_PANEL_ORIGIN}/api/auth/login`, {
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

      return {
        success: true,
        message: "Login realizado com sucesso!",
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
    phone,
    enterprise,
  }: RegisterData): Promise<AuthResult> {
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        fullName,
        phone,
        enterprise,
      });

      return {
        success: true,
        message: "Cadastro realizado com sucesso!",
        user: { id: data.id, email, name: fullName, phone, enterprise },
      };
    } catch (error: any) {
      const apiResponse = error?.response;
      console.log("Deu erro", apiResponse?.data);

      if (apiResponse) {
        const { status, data } = apiResponse;
        const apiMessage =
          data?.message ||
          data?.error ||
          "Não foi possível concluir seu cadastro.";

        if (status === 400 || status === 409 || status === 422) {
          return {
            success: false,
            message: apiMessage,
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
