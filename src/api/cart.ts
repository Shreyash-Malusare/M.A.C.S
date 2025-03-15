import axios from 'axios';
const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;
const API_URL = `${VITE_FRONT_END_IP}/api/cart`;

export const cartApi = {
  getCart: async (userId: string) => {
    const response = await axios.get(API_URL, { params: { userId } });
    return response.data;
  },

  addToCart: async (productId: string, quantity: number, size: string, userId: string) => {
    const response = await axios.post(API_URL, { 
      productId,
      quantity,
      size,
      userId
    });
    return response.data;
  },

  updateCartItem: async (id: string, quantity: number, userId: string) => {
    const response = await axios.put(`${API_URL}/${id}`, { quantity, userId });
    return response.data;
  },

  removeCartItem: async (id: string, userId: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, { params: { userId } });
    return response.data;
  },
  clearCart: async (userId: string) => {
    const response = await axios.delete(API_URL, { data: { userId } });
    return response.data;
  },
};
