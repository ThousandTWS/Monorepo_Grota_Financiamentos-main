export type Seller = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export async function fetchAllSellers(): Promise<Seller[]> {
  const response = await fetch("/api/sellers", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string })?.error ??
      "Não foi possível carregar os vendedores.";
    throw new Error(message);
  }

  if (Array.isArray(payload)) {
    return payload as Seller[];
  }
  if (Array.isArray((payload as { content?: unknown[] })?.content)) {
    return (payload as { content: Seller[] }).content;
  }
  return [];
}
