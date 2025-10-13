import api from "./api";

const getAllLogistics = async () => {
  try {
    const response = await api.get('/logistics');
    return response.data; 

  } catch (error) {
    console.error("Erro ao buscar logistas:", error);
    throw error; 
  }
};

export {
    getAllLogistics
};