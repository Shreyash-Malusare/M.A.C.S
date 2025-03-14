import axios from 'axios';
const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;

const API_URL = `${VITE_FRONT_END_IP}:3001/api/orders`;

export const orderApi = {
  createOrder: async (orderData: any) => {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }
};