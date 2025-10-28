import api from "../server/api";

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
      await fetch(
        "http://localhost:8080/api/v1/grota-financiamentos/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
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
      const { data } = await api.post("/auth/resgister", {
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Instruções enviadas para seu email!",
    };
  }
}
