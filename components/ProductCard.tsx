
import React, { useState } from 'react';
import { ProductData } from '../types';
import { CheckIcon } from './icons';

interface ProductCardProps {
  product: ProductData;
  onAddToCart: (product: ProductData) => void;
  onViewProduct: (product: ProductData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewProduct }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };
  
  return (
    <div className="bg-plasma-surface rounded-xl shadow-md overflow-hidden transition-all transform hover:-translate-y-1 border border-plasma-border hover:border-plasma-accent">
      <div className="cursor-pointer" onClick={() => onViewProduct(product)}>
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-plasma-text truncate" title={product.title}>
            {product.title}
        </h3>
        <p className="text-2xl font-light text-plasma-accent my-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-plasma-text-subtle h-10 overflow-hidden text-ellipsis">
          {product.description}
        </p>
        <div className="mt-4 flex flex-col gap-2">
            <button 
                onClick={handleAddToCartClick}
                disabled={isAdded}
                className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  isAdded 
                    ? 'bg-green-500' 
                    : 'bg-plasma-accent hover:bg-plasma-accent-hover'
                }`}
            >
              {isAdded ? <><div className="w-5 h-5"><CheckIcon/></div> Added!</> : 'Add to Cart'}
            </button>
            <button 
                onClick={() => onViewProduct(product)}
                className="w-full bg-plasma-bg text-plasma-text font-bold py-2 px-4 rounded-lg hover:bg-plasma-border transition-colors border border-plasma-border"
            >
                View Details
            </button>
        </div>
      </div>
    </div>
  );
};
