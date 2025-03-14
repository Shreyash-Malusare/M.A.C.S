import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function Newsletter() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl py-12 sm:py-16 px-6 sm:px-8 lg:px-12 text-center ${isDarkMode ?  'bg-white text-black'  : 'bg-gray-900 text-white'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className={`mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg ${isDarkMode ? 'text-black' : 'text-gray-300'}`}>
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 sm:py-4 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 text-white focus:ring-gray-500' : 'bg-white text-black focus:ring-gray-300'}`}
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 sm:py-4 ${isDarkMode ? 'bg-gray-800 text-white focus:ring-gray-500' : 'bg-white text-black focus:ring-gray-300'} rounded-full transition-colors flex items-center justify-center gap-2 text-sm sm:text-base`}
              >
                Subscribe <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
