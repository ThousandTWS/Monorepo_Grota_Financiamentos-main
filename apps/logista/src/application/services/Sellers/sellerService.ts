import api from "../server/api";

export type Seller = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export async function fetchAllSellers(): Promise<Seller[]> {
  const { data } = await api.get("/sellers");
  if (Array.isArray(data)) {
    return data as Seller[];
  }
  if (Array.isArray(data?.content)) {
    return data.content as Seller[];
  }
  return [];
}
