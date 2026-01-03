import {
  BillingContractCreatePayload,
  BillingContractDetails,
  BillingContractFilters,
  BillingContractSummary,
  BillingInstallment,
  BillingInstallmentUpdatePayload,
  BillingOccurrence,
  BillingOccurrencePayload,
} from "@/application/core/@types/Billing/Billing";

const BILLING_ENDPOINT = "/api/billing/contracts";

const digitsOnly = (value?: string | null) => (value ?? "").replace(/\D/g, "");

function buildQueryString(filters: BillingContractFilters) {
  const params = new URLSearchParams();
  if (filters.name?.trim()) {
    params.set("name", filters.name.trim());
  }
  const document = digitsOnly(filters.document);
  if (document) {
    params.set("document", document);
  }
  if (filters.contractNumber?.trim()) {
    params.set("contractNumber", filters.contractNumber.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    cache: "no-store",
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
      (payload as { message?: string; error?: string })?.message ??
      "Não foi possível completar a requisição.";

    const detailed = errors.length ? `${baseMessage} - ${errors.join("; ")}` : baseMessage;
    throw new Error(detailed);
  }

  return (payload ?? {}) as T;
}

export const fetchBillingContracts = async (
  filters: BillingContractFilters = {},
): Promise<BillingContractSummary[]> => {
  const query = buildQueryString(filters);
  const payload = await request<BillingContractSummary[]>(
    `${BILLING_ENDPOINT}${query}`,
    { method: "GET" },
  );
  return Array.isArray(payload) ? payload : [];
};

export const createBillingContract = async (
  payload: BillingContractCreatePayload,
): Promise<BillingContractDetails> => {
  return request<BillingContractDetails>(BILLING_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getBillingContractDetails = async (
  contractNumber: string,
): Promise<BillingContractDetails> => {
  return request<BillingContractDetails>(
    `${BILLING_ENDPOINT}/${encodeURIComponent(contractNumber)}`,
    { method: "GET" },
  );
};

export const updateBillingInstallment = async (
  contractNumber: string,
  installmentNumber: number,
  payload: BillingInstallmentUpdatePayload,
): Promise<BillingInstallment> => {
  return request<BillingInstallment>(
    `${BILLING_ENDPOINT}/${encodeURIComponent(contractNumber)}/installments/${installmentNumber}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
};

export const createBillingOccurrence = async (
  contractNumber: string,
  payload: BillingOccurrencePayload,
): Promise<BillingOccurrence> => {
  return request<BillingOccurrence>(
    `${BILLING_ENDPOINT}/${encodeURIComponent(contractNumber)}/occurrences`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};

export const deleteBillingContract = async (
  contractNumber: string,
): Promise<void> => {
  await request<Record<string, never>>(
    `${BILLING_ENDPOINT}/${encodeURIComponent(contractNumber)}`,
    { method: "DELETE" },
  );
};
