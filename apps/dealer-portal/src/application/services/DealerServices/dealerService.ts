import api from "../server/api";

export type DealerSummary = {
  id: number;
  fullName?: string;
  fullNameEnterprise?: string;
  enterprise?: string;
  status?: string;
};

export async function fetchAllDealers(): Promise<DealerSummary[]> {
  const { data } = await api.get("/dealers");
  if (Array.isArray(data)) {
    return data as DealerSummary[];
  }
  if (Array.isArray(data?.content)) {
    return data.content as DealerSummary[];
  }
  return [];
}
