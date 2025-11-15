import api from "../server/api";

export type Seller = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export const getAllSellers = async (): Promise<Seller[]> => {
  const { data } = await api.get<Seller[]>("/sellers");
  return data;
};
