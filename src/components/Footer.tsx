import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logow1 from './navigation/macslogo2.png';
import logow2 from './navigation/macs-removebg-preview.png';
import logob1 from './navigation/macslogo.png';
import logob2 from './navigation/macs2-removebg-preview.png';
export function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            {/* Logo Section */}
            <div className="flex items-center space-x-2 mb-4">
              {/* Logo for Light Mode */}
              {isDarkMode === false && (
                <>
                  <img
                    src={logow1} // Replace with the actual path to your light mode logo1
                    alt="Logo 1"
                    className="h-10" // Adjust height as needed
                  />
                  <img
                    src={logow2} // Replace with the actual path to your light mode logo2
                    alt="Logo 2"
                    className="h-10" // Adjust height as needed
                  />
                </>
              )}
              {/* Logo for Dark Mode */}
              {isDarkMode === true && (
                <>
                  <img
                    src={logob1} // Replace with the actual path to your dark mode logo1
                    alt="Logo 1"
                    className="h-10" // Adjust height as needed
                  />
                  <img
                    src={logob2} // Replace with the actual path to your dark mode logo2
                    alt="Logo 2"
                    className="h-10" // Adjust height as needed
                  />
                </>
              )}
            </div>
            <p className="text-sm">
              Your one-stop destination for trendy fashion and accessories.
              We bring you the latest styles at affordable prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className=""><Facebook size={20} /></a>
              <a href="#" className=""><Twitter size={20} /></a>
              <a href="#" className=""><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="">Home</Link></li>
              <li><Link to="/about" className="">About Us</Link></li>
              <li><Link to="/contact" className="">Contact Us</Link></li>
              <li><a href="/category/all" className="">All Products</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/men" className="">Men's Fashion</Link></li>
              <li><Link to="/category/women" className="">Women's Fashion</Link></li>
              <li><Link to="/category/accessories" className="">Accessories</Link></li>
              <li><Link to="/category/unisex" className="">Unisex Collection</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Mumbai
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +91 9076452426
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                malusareshreyash01@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} mt-8 pt-8 text-sm text-center`}>
          <p>&copy; {new Date().getFullYear()} M.A.C.S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
