export type Operator = {
  createdAt: string;
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
  canView?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

export type CreateOperatorPayload = {
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

export const getAllOperators = async (): Promise<Operator[]> => {
  const payload = await request<Operator[]>("/api/operators", {
    method: "GET",
  });
  return Array.isArray(payload) ? payload : [];
};

export const createOperator = async (
  payload: CreateOperatorPayload,
): Promise<Operator> => {
  return request<Operator>("/api/operators", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
