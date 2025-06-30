import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // FastAPI default port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadCargo = async (formData) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDamageInfo = async (cargoId) => {
  try {
    const response = await api.get(`/damage_info/${cargoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api; 