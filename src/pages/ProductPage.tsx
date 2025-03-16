import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductImages } from '../components/product/ProductImages';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductReviews } from '../components/product/ProductReviews';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { fetchProductById, fetchProducts } from '../api/products';
import { fetchProductReviews } from '../api/reviews';
import { Product, Review } from '../types';
import Spinner from '../components/Spiinner';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) throw new Error('Product ID is undefined');

        // Fetch product data
        const productData = await fetchProductById(id);
        setProduct(productData);

        // Fetch related products
        const { products } = await fetchProducts(
          productData.category,
          '',
          [0, 50000],
          'price-asc',
          1,
          12
        );
        setRelatedProducts(products.filter((p: Product) => p._id !== id).slice(0, 4));

        // Fetch reviews
        const reviewsData = await fetchProductReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner message="Loading Product..." /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  // Calculate average rating and total reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const totalReviews = reviews.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductImages images={[product.image]} name={product.name} />
        <ProductInfo product={product} averageRating={averageRating} totalReviews={totalReviews} />
      </div>

      <div className="space-y-16">
        <ProductReviews
          productId={id!}
          reviews={reviews}
          onReviewSubmitted={() => fetchProductReviews(id!).then(setReviews)}
        />
        <RelatedProducts products={relatedProducts} currentProductId={product._id} />
      </div>
    </div>
  );
}
