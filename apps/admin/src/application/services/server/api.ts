import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API as string;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export default api;
