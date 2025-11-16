import api from "../server/api";

export type Seller = {
  createdAt: string;
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export const getAllSellers = async (): Promise<Seller[]> => {
  const { data } = await api.get<Seller[]>("/sellers");
  return data;
};
