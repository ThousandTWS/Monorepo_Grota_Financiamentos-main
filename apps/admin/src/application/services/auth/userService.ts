import api from "../server/api";

export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export async function fetchAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { data } = await api.get<AuthenticatedUser>("/auth/me", {
    withCredentials: true,
  });
  return data;
}

export async function login(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials, {
    withCredentials: true,
  });
  return data;
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/refresh", null, {
    withCredentials: true,
  });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout", null, {
    withCredentials: true,
  });
  if (typeof window !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0";
    window.localStorage.removeItem("grota:admin:access_token");
  }
}
