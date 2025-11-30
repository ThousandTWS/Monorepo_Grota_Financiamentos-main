export type Dealer = {
  id: number;
  fullName: string;
  razaoSocial?: string | null;
  cnpj?: string | null;
  referenceCode?: string | null;
  phone: string;
  enterprise: string;
  status?: string;
  createdAt?: string;
};

export type PartnerPayload = {
  cpf?: string;
  name?: string;
  type?: "SOCIO" | "PROCURADOR";
  signatory?: boolean;
};

export type AddressPayload = {
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export type CreateDealerPayload = {
  fullName: string;
  phone: string;
  enterprise: string;
  password: string;
  razaoSocial?: string;
  cnpj?: string;
  address?: AddressPayload;
  partners?: PartnerPayload[];
  observation?: string;
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

export const getAllLogistics = async (): Promise<Dealer[]> => {
  const payload = await request<Dealer[]>("/api/dealers", {
    method: "GET",
  });
  return Array.isArray(payload) ? payload : [];
};

export const createDealer = async (
  payload: CreateDealerPayload,
): Promise<Dealer> => {
  return request<Dealer>("/api/dealers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const deleteDealer = async (id: number): Promise<void> => {
  await request(`/api/dealers?id=${id}`, {
    method: "DELETE",
  });
};
