import axios from 'axios';

const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;
const API_URL = `${VITE_FRONT_END_IP}/api/reviews`;

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

export const fetchProductReviews = async (productId: string): Promise<Review[]> => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const submitReview = async (
  productId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/${productId}/reviews`, { userId, rating, comment });
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// export const markReviewHelpful = async (reviewId: string): Promise<void> => {
//   try {
//     await axios.post(`${VITE_FRONT_END_IP}/${reviewId}/helpful`);
//   } catch (error) {
//     console.error('Error marking review as helpful:', error);
//     throw error;
//   }
// };
