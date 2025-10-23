import api from "../server/api";

const userServices = {
  async me() {
    const { data } = await api.get("/auth/me", {
      withCredentials: true
    });

    return data;
  },
};

export default userServices;
