import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductGrid } from '../components/product/ProductGrid';
import { Pagination } from '../components/pagination/Pagination';
import { Filters } from '../components/Filters';
import { fetchProducts } from '../api/products';
import { Product } from '../types';
import Spinner from '../components/Spiinner';

interface CategoryPageProps {
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export function CategoryPage({ searchQuery, onAddToCart }: CategoryPageProps) {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Define a limit for items per page
  const limit = 12;
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch products without applying the searchQuery on the server
        const { products: fetchedProducts, totalPages } = await fetchProducts(
          selectedCategory,
          '', // Pass an empty string to skip server-side search
          priceRange,
          sortBy,
          currentPage,
          limit
        );

        // Apply client-side search filter (only for product name)
        const filteredProducts = fetchedProducts.filter((product: Product) => {
          const searchLower = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
          ); // Only search by name
        });

        setProducts(filteredProducts);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery, priceRange, sortBy, currentPage, limit]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    navigate(`/category/${newCategory}`);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Filters
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-6 capitalize">
            {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Collection`}
          </h1>

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} onAddToCart={onAddToCart} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
