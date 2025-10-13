import axios from "axios";

const api = axios.create({
    baseURL: "http://api.meusite.local:8080/api/v1/grota-financiamentos",
    headers:{
        "Content-Type":'application/json'
    },
    withCredentials: true,
});

export default api;