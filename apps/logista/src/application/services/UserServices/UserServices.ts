import api from "../server/api";

const userServices = {
  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

export default userServices;
