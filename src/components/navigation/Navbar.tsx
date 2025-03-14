import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, ChevronDown, Sun, Moon, LogOut } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { NavDropdown } from './NavDropdown';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logow1 from './macslogo2.png';
import logow2 from './macs-removebg-preview.png';
import logob1 from './macslogo.png';
import logob2 from './macs2-removebg-preview.png';
interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  onProfileClick: () => void;
  searchQuery: string;
  isLoggedIn: boolean;
}

export function Navbar({
  cartItemsCount,
  onCartClick,
  onSearch,
  onProfileClick,
  searchQuery,
  isLoggedIn
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const categoryItems = [
    { label: 'All Products', path: '/category/all' },
    { label: 'Men', path: '/category/men' },
    { label: 'Women', path: '/category/women' },
    { label: 'Kids', path: '/category/kids' },
    { label: 'Unisex', path: '/category/unisex' },
    { label: 'Accessories', path: '/category/accessories' },
    { label: 'Sports & Fitness', path: '/category/sports' },
    { label: 'Beauty & Care', path: '/category/beauty' },
  ];

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleSearch = (value: string) => {
    onSearch(value);
    navigate('/category/all');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                {/* Logo for Light Mode */}
                {theme === 'light' && (
                  <>
                    <img
                      src={logow1}
                      alt="Logo 1"
                      className="h-12"
                    />
                    <img
                      src={logow2}
                      alt="Logo 2"
                      className="h-12"
                    />
                  </>
                )}
                {/* Logo for Dark Mode */}
                {theme === 'dark' && (
                  <>
                    <img
                      src={logob1}
                      alt="Logo 1"
                      className="h-12"
                    />
                    <img
                      src={logob2}
                      alt="Logo 2"
                      className="h-12"
                    />
                  </>
                )}
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown size={16} />
                </button>
                <NavDropdown
                  items={categoryItems}
                  isOpen={isCategoryDropdownOpen}
                  onClose={() => setIsCategoryDropdownOpen(false)}
                />
              </div>

              {/* Other Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon size={24} className="text-gray-800 dark:text-white" />
                ) : (
                  <Sun size={24} className="text-gray-800 dark:text-white" />
                )}
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:hidden transition-colors"
              >
                <Search size={24} className="text-gray-800 dark:text-white" />
              </button>

              {/* Desktop Search */}
              <div className="hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ShoppingBag size={24} className="text-gray-800 dark:text-white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => isLoggedIn ? setIsProfileDropdownOpen(!isProfileDropdownOpen) : onProfileClick()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <User size={24} className="text-gray-800 dark:text-white" />
                </button>

                {isLoggedIn && isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggle mobile menu
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:hidden transition-colors"
              >
                <Menu size={24} className="text-gray-800 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="py-4 lg:hidden">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>
          )}
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={[...categoryItems, ...navigationItems]}
      />
    </>
  );
}