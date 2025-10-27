
import React from 'react';
import { ProductData } from '../types';
import { ProductCard } from './ProductCard';
import { SparklesIcon } from './icons';

interface StorefrontPageProps {
  products: ProductData[];
  onReset: () => void;
  onAddToCart: (product: ProductData) => void;
  onViewProduct: (product: ProductData) => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = ({ products, onReset, onAddToCart, onViewProduct }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in p-4">
      <div className="bg-blue-100 border-l-4 border-plasma-accent text-plasma-text p-4 rounded-md mb-8 shadow-sm text-center">
        <h2 className="font-bold text-lg">Success! Your E-Commerce Page is Ready.</h2>
        <p>Here is a preview of your AI-generated storefront with {products.length} product(s) detected.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={onAddToCart}
            onViewProduct={onViewProduct}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <button 
            onClick={onReset}
            className="bg-plasma-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-plasma-accent-hover transition-colors inline-flex items-center gap-2"
        >
            <div className="w-5 h-5"><SparklesIcon/></div>
            Create Another Storefront
        </button>
      </div>
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

// Fix: To avoid creating multiple style tags, check if it exists first.
if (!document.querySelector('#storefront-page-animation')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'storefront-page-animation';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}
