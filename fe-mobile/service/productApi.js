import api from "./baseURL";

export const fetchBlindboxData = async () => {
  try {
    const response = await api.get("/products/blind-boxes");
    return response.data;
  } catch (error) {
    console.error("Error fetching blindbox data:", error);
    throw new Error("Failed to fetch blindbox data");
  }
};

export const fetchBlindboxDetails = async (slug, id) => {
  try {
    const response = await api.get(`/products/blind-boxes/${slug}`, {
      params: { id },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching blindbox details:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch blindbox details");
  }
};
