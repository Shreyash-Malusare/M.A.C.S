import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function SpecialOffer() {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80"
            alt="Special Offer"
            className="w-full h-[600px] object-cover"
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-40'}`} />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-white'}`}> 
                Summer Collection 2024
              </h2>
              <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-white'}`}>
                Get up to 50% off on selected items
              </p>
              <Link
                to="/category/all"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Collection <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}