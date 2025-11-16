import axios, { AxiosInstance } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ??
  "http://localhost:8080/api/v1/grota-financiamentos";


const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};


const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: defaultHeaders,
  withCredentials: true,
});

export default api;
