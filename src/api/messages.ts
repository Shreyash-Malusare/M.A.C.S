import axios from 'axios';

const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;
const API_URL = `${VITE_FRONT_END_IP}/api/messages`;

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

/**
 * Fetch all messages (admin only)
 */
export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Submit a new message
 */
export const submitMessage = async (
  name: string,
  email: string,
  subject: string,
  message: string,
  userId?: string
): Promise<void> => {
  try {
    await axios.post(API_URL, {
      name,
      email,
      subject,
      message,
      userId: userId || null, // Include userId if the user is logged in
    });
  } catch (error) {
    console.error('Error submitting message:', error);
    throw error;
  }
};

/**
 * Mark a message as resolved (admin only)
 */
export const markMessageResolved = async (messageId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/${messageId}/resolve`);
  } catch (error) {
    console.error('Error marking message as resolved:', error);
    throw error;
  }
};
