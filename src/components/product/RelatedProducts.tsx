// import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
  // onAddToCart: (product: Product) => void;
}

export function RelatedProducts({ products, currentProductId}: RelatedProductsProps) {
  const relatedProducts = products
    .filter((product) => product._id !== currentProductId)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            // onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}