import api from "../server/api";

export type CreateVehiclePayload = {
  name: string;
  color: string;
  plate: string;
  modelYear: string; // ISO date string e.g. "2025-10-21"
  km: number;
  condition: string; // e.g. "NOVO" | "USADO"
  transmission: string; // e.g. "MANUAL" | "AUTOMATICO"
  price: number;
};

export type VehicleResponse = {
  id: number;
  name: string;
  color: string;
  plate: string;
  modelYear: string;
  km: number;
  condition: string;
  transmission: string;
  price: number;
  logistic?: number;
};

const veiculosServices = {
  async me() {
    const { data } = await api.get("/vehicle");
    return data as VehicleResponse[];
  },

  async create(payload: CreateVehiclePayload) {
    const { data } = await api.post<VehicleResponse>("/vehicle", payload, {
      headers: { Accept: "*/*" },
    });
    return data;
  },
};

export default veiculosServices;
