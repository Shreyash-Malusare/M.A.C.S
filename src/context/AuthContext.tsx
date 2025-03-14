import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  phone?: string;
  address?: string;
  password:string;
}

// Update the interface in your AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${VITE_FRONT_END_IP}:3001/api/users/login`, { email, password });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${VITE_FRONT_END_IP}:3001/api/users/register`, { name, email, password });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

// AuthContext.tsx
const updateProfile = async (data: Partial<User>) => {
  if (!user) throw new Error('Not authenticated');
  
  try {
    console.log('Sending update data:', data); // Debugging

    const response = await axios.patch(
      `${VITE_FRONT_END_IP}:3001/api/users/${user._id}`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('Update response:', response.data); // Debugging

    const updatedUser = { ...user, ...response.data };
    delete updatedUser.password; // Remove password before storage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error: any) {
    console.error('Update failed:', error); // Debugging
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};

// Update the provider value to include updateProfile     
return (
  <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
    {children}
  </AuthContext.Provider>
);

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}