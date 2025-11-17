export type Seller = {
  createdAt: string;
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export const getAllSellers = async (): Promise<Seller[]> => {
  const response = await fetch("/api/sellers", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível carregar os vendedores.";
    throw new Error(message);
  }

  return Array.isArray(payload) ? (payload as Seller[]) : [];
};
