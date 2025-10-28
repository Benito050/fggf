import React from 'react';
import { ProductData } from '../types';
import { ProductCard } from './ProductCard';
import { StoreFilters } from './StoreFilters';

type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

interface StorefrontPageProps {
  products: ProductData[];
  onAddToCart: (product: ProductData) => void;
  onViewProduct: (product: ProductData) => void;
  onResetGenerator: () => void;
  // Search and Sort
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  // New Filters
  priceRanges: { label: string; min: number; max: number }[];
  selectedPrice: string;
  onPriceChange: (value: string) => void;
  materials: string[];
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;
  onClearFilters: () => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = (props) => {
  const { products, onAddToCart, onViewProduct, onResetGenerator, searchTerm } = props;

  return (
    <div className="max-w-7xl mx-auto p-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-plasma-text">Your AI-Generated Store</h1>
          <p className="text-plasma-text-subtle mt-1">
            Explore the products created from your video.
          </p>
        </div>
        <button
          onClick={onResetGenerator}
          className="bg-plasma-bg hover:bg-plasma-border text-plasma-text font-semibold py-2 px-4 border border-plasma-border rounded-lg transition-colors w-full md:w-auto"
        >
          Generate a New Store
        </button>
      </div>

      <StoreFilters {...props} productCount={products.length} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-plasma-surface rounded-lg border border-plasma-border">
          <h3 className="text-xl font-semibold text-plasma-text">No Products Found</h3>
          <p className="text-plasma-text-subtle mt-2">
            Your search and filter criteria did not match any products. Try clearing the filters.
          </p>
        </div>
      )}
    </div>
  );
};

const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

if (!document.querySelector('#storefront-page-animation')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'storefront-page-animation';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}