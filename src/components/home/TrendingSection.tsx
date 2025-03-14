import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { fetchProducts } from '../../api/products';
import { Product } from '../../types';

// interface TrendingSectionProps {
//   onAddToCart: (product: Product) => void;
// }

export function TrendingSection() {
  const { isDarkMode } = useTheme();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        const { products } = await fetchProducts('all', '', [0, 300], 'price-asc', 1);
        setTrendingProducts(products.filter((p: Product) => p.isNew).slice(0, 3));
      } catch (error) {
        console.error('Error loading trending products:', error);
      }
    };

    loadTrendingProducts();
  }, []);

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
          <Link
            to="/category/all"
            className={`inline-flex items-center gap-2 text-lg font-semibold ${
              isDarkMode ? 'hover:text-gray-400' : 'hover:text-gray-600'
            }`}
          >
            View All <ArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              />
          ))}
        </div>
      </div>
    </section>
  );
}