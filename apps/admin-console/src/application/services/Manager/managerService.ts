import { toPagedResponse } from "@/application/core/@types/pagination";

export type Manager = {
  createdAt: string;
  id: number;
  dealerId?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
  canView?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

export type CreateManagerPayload = {
  dealerId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  CPF: string;
  birthData: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    state: string;
    zipCode: string;
  };
  canView?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      (payload as { message?: string })?.message ??
      "Não foi possível concluir a operação.";
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

export const getAllManagers = async (dealerId?: number): Promise<Manager[]> => {
  const params = new URLSearchParams({ page: "0", size: "10" });
  if (dealerId) {
    params.set("dealerId", String(dealerId));
  }
  const payload = await request<unknown>(`/api/managers?${params.toString()}`, {
    method: "GET",
  });
  const page = toPagedResponse<Manager>(payload);
  return page.content;
};

export const createManager = async (
  payload: CreateManagerPayload,
): Promise<Manager> => {
  return request<Manager>("/api/managers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const linkManagerToDealer = async (managerId: number, dealerId: number | null): Promise<Manager> => {
  return request<Manager>("/api/managers", {
    method: "PATCH",
    body: JSON.stringify({ managerId, dealerId }),
  });
};

export const deleteManager = async (managerId: number): Promise<void> => {
  await request<void>(`/api/managers?id=${managerId}`, {
    method: "DELETE",
  });
};
