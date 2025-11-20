import api from "../server/api";

export type DealerAddressPayload = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  state: string;
  zipCode: string;
};

export type DealerAddressResponse = {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  state?: string;
  zipCode?: string;
};

export type CompleteDealerProfilePayload = {
  fullNameEnterprise: string;
  birthData: string; // ISO date (YYYY-MM-DD)
  cnpj: string;
  address: DealerAddressPayload;
};

export type DealerProfileDetailsResponse = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  enterprise?: string;
  status?: string;
  fullNameEnterprise?: string;
  birthData?: string;
  cnpj?: string;
  address?: DealerAddressResponse;
  createdAt?: string;
};

const dealerProfileService = {
  async completeProfile(payload: CompleteDealerProfilePayload) {
    const { data } = await api.put(
      "/dealers/profile/complete",
      payload,
    );

    return data;
  },

  async fetchDetails(dealerId: number): Promise<DealerProfileDetailsResponse> {
    const { data } = await api.get<DealerProfileDetailsResponse>(
      `/dealers/${dealerId}/details`,
    );
    return data;
  },
};

export default dealerProfileService;
