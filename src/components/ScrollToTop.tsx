import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust the import path as needed

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors z-40 ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}
