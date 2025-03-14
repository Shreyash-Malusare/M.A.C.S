import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // Adjust import path

interface NavigationItem {
  label: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
}

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const { isDarkMode } = useTheme(); // Get theme from context

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
      <div className={`fixed inset-y-0 right-0 max-w-xs w-full shadow-xl
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <div className={`flex justify-between items-center p-4 border-b
          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button
            onClick={onClose} // Close the mobile menu
            className={`p-2 ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="h-[calc(100vh-100px)] overflow-y-auto p-4">
          <ul className="space-y-4">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block w-full py-2 hover:opacity-75 transition-opacity
                    ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                  onClick={() => setTimeout(onClose, 100)} // Delay onClose
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}