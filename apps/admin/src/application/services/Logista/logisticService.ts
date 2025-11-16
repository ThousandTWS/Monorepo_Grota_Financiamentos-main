import api from "../server/api";

const getAllLogistics = async () => {
  try {
    const response = await api.get("/dealers", {
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar logistas:", error);
    throw error;
  }
};

export { getAllLogistics };
