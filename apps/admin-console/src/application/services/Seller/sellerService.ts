export type Seller = {
  createdAt: string;
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export type CreateSellerPayload = {
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
      "Não foi possível concluir a operação.";
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

export const getAllSellers = async (): Promise<Seller[]> => {
  const payload = await request<Seller[]>("/api/sellers", {
    method: "GET",
  });
  return Array.isArray(payload) ? payload : [];
};

export const createSeller = async (
  payload: CreateSellerPayload,
): Promise<Seller> => {
  return request<Seller>("/api/sellers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
