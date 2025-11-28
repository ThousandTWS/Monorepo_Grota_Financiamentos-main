import axios, { AxiosInstance } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_LOGISTA_PANEL_URL ??
  "http://localhost:8080/api/v1/grota-financiamentos";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: defaultHeaders,
  withCredentials: true,
});

export default api;
