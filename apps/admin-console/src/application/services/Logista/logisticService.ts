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

function extractArrayPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = ["content", "data", "items", "results"];
    for (const key of candidates) {
      if (Array.isArray(record[key])) return record[key] as unknown[];
    }
  }

  return [];
}

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
    const errors = Array.isArray((payload as { errors?: unknown })?.errors)
      ? (payload as { errors: unknown[] }).errors.filter(
          (item): item is string => typeof item === "string",
        )
      : [];

    const baseMessage =
      (payload as { error?: string; message?: string })?.error ??
      (payload as { message?: string })?.message ??
      "Não foi possível concluir a operação.";

    const detailedMessage =
      errors.length > 0 ? `${baseMessage} - ${errors.join("; ")}` : baseMessage;

    throw new Error(detailedMessage);
  }

  return (payload ?? {}) as T;
}

export const getAllLogistics = async (): Promise<Dealer[]> => {
  const payload = await request<unknown>("/api/dealers", {
    method: "GET",
  });
  const listPayload = extractArrayPayload(payload);
  return (listPayload as Dealer[]).map((dealer) => dealer as Dealer);
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
  await request(`/api/dealers/${id}`, {
    method: "DELETE",
  });
};
