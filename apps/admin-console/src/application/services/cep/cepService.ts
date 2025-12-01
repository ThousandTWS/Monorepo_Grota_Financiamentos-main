export type CepAddress = {
  zipCode: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export async function fetchAddressByCep(cep: string): Promise<CepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = (await response.json().catch(() => null)) as
    | { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string; cep?: string }
    | null;

  if (!payload || (payload as { erro?: boolean }).erro) {
    return null;
  }

  return {
    zipCode: payload.cep ?? digits,
    street: payload.logradouro ?? "",
    neighborhood: payload.bairro ?? "",
    city: payload.localidade ?? "",
    state: payload.uf ?? "",
  };
}
