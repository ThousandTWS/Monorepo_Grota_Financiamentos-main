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

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error("[CEP] HTTP error:", response.status, response.statusText);
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string; cep?: string }
      | null;

    if (!payload) {
      console.error("[CEP] Invalid response payload");
      return null;
    }

    // ViaCEP retorna { erro: true } quando o CEP não é encontrado
    if (payload.erro === true) {
      console.warn("[CEP] CEP not found:", digits);
      return null;
    }

    // Verifica se pelo menos alguns campos essenciais estão presentes
    if (!payload.localidade || !payload.uf) {
      console.warn("[CEP] Incomplete address data:", payload);
      return null;
    }

    return {
      zipCode: payload.cep?.replace(/\D/g, "") ?? digits,
      street: payload.logradouro ?? "",
      neighborhood: payload.bairro ?? "",
      city: payload.localidade ?? "",
      state: payload.uf ?? "",
    };
  } catch (error) {
    console.error("[CEP] Fetch error:", error);
    return null;
  }
}
