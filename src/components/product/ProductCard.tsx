import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden group ${
        isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 ${
            isDarkMode ? 'bg-gray-900/50' : 'bg-black/20'
          }`}
        >
          <div className="flex gap-2">
            <Link
              to={`/product/${product._id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Eye size={20} />
              Explore
            </Link>
            
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span
            className={`text-sm uppercase ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {product.category}
          </span>
        </div>
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {product.name}
        </h3>
        <p
          className={`text-sm mb-4 line-clamp-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`text-xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            ₹{product.price}
          </span>
          {product.isNew && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-black text-white'
              }`}
            >
              New
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
