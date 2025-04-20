import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from   '../context/ThemeContext'; // Adjust import path

interface FiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Filters({ 
  priceRange, 
  onPriceRangeChange, 
  sortBy, 
  onSortChange,
  selectedCategory,
  onCategoryChange 
}: FiltersProps) {
  const { isDarkMode } = useTheme();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'beauty', label: 'Beauty & Care' },
  ];

  return (
    <div className={`p-4 rounded-lg shadow-md mb-6 ${
      isDarkMode 
        ? 'bg-gray-800 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`w-full p-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-100 border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Price Range
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="20000"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
              className={`w-full range ${
                isDarkMode ? 'range-dark' : 'range-light'
              }`}
            />
            <input
              type="range"
              min="0"
              max="20000"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              className={`w-full range ${
                isDarkMode ? 'range-dark' : 'range-light'
              }`}
            />
          </div>
          <div className={`flex justify-between mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`w-full p-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-100 border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
