import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cartApi } from '../../api/cart';

interface ProductInfoProps {
  product: Product;
  averageRating: number;
  totalReviews: number;
}

export function ProductInfo({ product, averageRating, totalReviews }: ProductInfoProps) {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';

  const handleAddToCart = async () => {
    try {
      if (!user) {
        alert('Please login first');
        return;
      }
      if (user.role === 'admin') {
        alert('Admins cannot add products to the cart.');
        return;
      }
      if (!selectedSize) {
        alert('Please select a size');
        return;
      }
      await cartApi.addToCart(product._id, quantity, selectedSize, user._id);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        ₹{product.price}
      </p>

      {/* Description */}
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Description
        </h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {product.description}
        </p>
      </div>

      {/* Size Selector */}
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Select Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedSize === size
                  ? isDarkMode
                    ? 'border-gray-100 bg-gray-100 text-black'
                    : 'border-black bg-black text-white'
                  : isDarkMode
                  ? 'border-gray-600 hover:border-gray-100'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Quantity
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded border"
          >
            -
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 rounded border"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      {user?.role === 'admin' ? (
        <button
          disabled
          className={`w-full py-3 rounded-md transition-colors opacity-50 ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-black text-white'
          }`}
        >
          Admins cannot add to cart
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full py-3 rounded-md transition-colors disabled:opacity-50 ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}