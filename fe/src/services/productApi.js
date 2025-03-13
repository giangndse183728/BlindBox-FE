import api from './baseURL';

// Fetch all blindboxes
export const fetchBlindboxData = async () => {
    try {
        const blindboxResponse = await api.get('/products/blind-boxes');
        return blindboxResponse.data;
    } catch (error) {
        console.error('Error fetching blindbox data:', error);
        throw new Error('Failed to fetch blindbox data');
    }
};

// Fetch blindbox detail
export const fetchBlindboxDetails = async (slug, id) => {
    try {
        const response = await api.get(`/products/blind-boxes/${slug}`, {
            params: { id } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blindbox details:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch blindbox details');
    }
};

export const fetchSellerBlindboxData = async () => {
    try {
        const blindboxResponse = await api.get('/products/seller/blind-boxes');
        return blindboxResponse.data.result;
    } catch (error) {
        console.error('Error fetching blindbox data:', error);
        throw new Error('Failed to fetch blindbox data');
    }
};

export const createBlindbox = async (blindboxData) => {
    try {
      const response = await api.post("/products/seller/blind-boxes", blindboxData, {
    
      });
      return response.data;
    } catch (error) {
      console.error("Error creating blindbox:", error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || "Failed to create blindbox");
    }
  };

  export const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      const response = await api.post("/medias/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to upload image");
    }
  };
  