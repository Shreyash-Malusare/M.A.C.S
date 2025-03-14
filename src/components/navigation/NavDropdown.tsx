import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // Adjust import path

interface NavItem {
  label: string;
  path: string;
}

interface NavDropdownProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function NavDropdown({ items, isOpen, onClose }: NavDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-100 shadow-gray-900/50' 
          : 'bg-white text-gray-700'
      }`}
    >
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path); // Programmatic navigation
            onClose(); // Close dropdown after navigation
          }}
          className={`block w-full px-4 py-2 text-sm text-left hover:bg-opacity-10 transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}