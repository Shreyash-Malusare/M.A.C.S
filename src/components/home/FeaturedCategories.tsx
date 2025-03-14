import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // Adjust import path

const categories = [
  {
    id: 'women',
    title: 'Women',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 'men',
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 'unisex',
    title: 'Unisex',
    image: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 'sports',
    title: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1920',
  },
  {
    id: 'beauty',
    title: 'Beauty & Care',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1920',
  },
];

export function FeaturedCategories() {
  const { isDarkMode } = useTheme();

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/4]"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-opacity ${
                isDarkMode 
                  ? 'bg-gray-900 bg-opacity-40 group-hover:bg-opacity-50' 
                  : 'bg-black bg-opacity-30 group-hover:bg-opacity-40'
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}