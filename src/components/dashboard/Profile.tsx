import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required.');
      }

      // Password validation (only for users and if editing password)
      if (user?.role === 'user' && isEditingPassword) {
        if (!formData.oldPassword) {
          throw new Error('Please enter your current password.');
        }
        if (!formData.newPassword || !formData.confirmPassword) {
          throw new Error('Please fill in both new password fields.');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match.');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
      }

      // Profile.tsx
    const updateData = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        ...(user?.role === 'user' && {
        phone: formData.phone,
        address: formData.address,
        }),
        ...(isEditingPassword && {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        }),
    };

      console.log('Update Data:', updateData); // Debugging

      // Update profile
      await updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setIsEditingPassword(false); // Reset password edit mode
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm max-w-2xl`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Profile Settings
      </h2>

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
            }`}
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
            }`}
            required
          />
        </div>

        {/* Phone Field (for users only) */}
        {user?.role === 'user' && (
          <div>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
              }`}
            />
          </div>
        )}

        {/* Address Field (for users only) */}
        {user?.role === 'user' && (
          <div>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
              }`}
              rows={3}
            />
          </div>
        )}

        {/* Avatar URL Field */}
        <div>
          <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avatar URL</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className={`w-full p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
            }`}
          />
        </div>

        {/* Password Section (for users only) */}
        {(user?.role === 'user' || user?.role === 'admin') && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className={`text-sm ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              } hover:underline`}
            >
              {isEditingPassword ? 'Cancel Password Change' : 'Change Password'}
            </button>

            {isEditingPassword && (
              <>
                {/* Current Password */}
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};