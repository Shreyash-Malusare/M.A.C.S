import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;    // Added phone field
  address: string;  // Added address field
  createdAt: string;
}

export const Users = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (user?.role !== 'admin') return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div 
            key={user._id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {user.email}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Phone: {user.phone}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Address: {user.address}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className={`hidden md:block rounded-lg shadow-sm overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.phone}</td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.address}</td>
                <td className={`p-4 capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.role}</td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
