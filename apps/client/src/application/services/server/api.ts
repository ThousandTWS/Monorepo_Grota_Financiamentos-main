import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API as string;

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
