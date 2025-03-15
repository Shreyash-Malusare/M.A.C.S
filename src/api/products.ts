import axios from 'axios';
const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;

const API_URL = `${VITE_FRONT_END_IP}/api/products`;

export const fetchProducts = async (
  category: string,
  searchQuery: string,
  priceRange: [number, number],
  sortBy: string,
  page: number,
  limit: number
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        category,
        search: searchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy,
        page,
        limit,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
