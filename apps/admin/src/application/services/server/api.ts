import axios, { AxiosInstance } from "axios";

const BASE_URL = "https://servidor-grotafinanciamentos.up.railway.app/api/v1/grota-financiamentos";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export default api;
