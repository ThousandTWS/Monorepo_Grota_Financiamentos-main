import axios, { AxiosInstance } from "axios";

const BASE_URL =
    typeof window === "undefined"
        ? process.env.API_URL || "http://localhost:8080/api/v1/grota-financiamentos/"
        : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/grota-financiamentos/";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


export default api;
