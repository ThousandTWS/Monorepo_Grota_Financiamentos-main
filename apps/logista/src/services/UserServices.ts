import api from "./api";

const me = async () => {
  return await api.get("/auth/me").then((res) => res.data);
};

export default{
    me
}