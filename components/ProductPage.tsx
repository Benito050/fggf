import React, { useState } from 'react';
import { ProductData } from '../types';
import { ArrowLeftIcon, CheckIcon, SparklesIcon, SpinnerIcon, CheckCircleIcon, ListIcon, TagIcon } from './icons';

interface ProductPageProps {
  product: ProductData;
  onReset: () => void;
  onImageEdit: (prompt: string) => void;
  isEditing: boolean;
  editError: string;
  onAddToCart: (product: ProductData) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onReset,
  onImageEdit,
  isEditing,
  editError,
  onAddToCart,
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onImageEdit(editPrompt);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <button onClick={onReset} className="flex items-center gap-2 text-plasma-text-subtle hover:text-plasma-text mb-6">
        <div className="w-5 h-5"><ArrowLeftIcon/></div>
        Back to Store
      </button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image and Edit Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-plasma-surface rounded-lg border border-plasma-border overflow-hidden">
             <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
             {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 text-white"><SpinnerIcon /></div>
                </div>
             )}
          </div>
          <form onSubmit={handleEditSubmit} className="bg-plasma-surface p-4 rounded-lg border border-plasma-border">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-plasma-text">
              <div className="w-6 h-6 text-plasma-accent"><SparklesIcon/></div>
              Edit with AI
            </h3>
            <p className="text-sm text-plasma-text-subtle mt-1 mb-3">Describe a change, and the AI will edit the image.</p>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., 'change the background to a beach'"
                    className="flex-grow bg-plasma-bg border border-plasma-border rounded-md px-3 py-2 focus:ring-2 focus:ring-plasma-accent focus:outline-none"
                    disabled={isEditing}
                />
                <button 
                    type="submit"
                    className="bg-plasma-accent text-white font-bold px-4 py-2 rounded-lg hover:bg-plasma-accent-hover transition-colors disabled:opacity-50"
                    disabled={isEditing || !editPrompt.trim()}
                >
                    {isEditing ? 'Editing...' : 'Apply'}
                </button>
            </div>
            {editError && <p className="text-red-500 text-sm mt-2">{editError}</p>}
          </form>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-plasma-text">{product.title}</h1>
            <p className="text-4xl font-light text-plasma-accent mt-2">₹{product.price.toFixed(2)}</p>
          </div>
          <div className="prose prose-invert max-w-none text-plasma-text-subtle">
            <p>{product.description}</p>
          </div>
          
          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-plasma-text">
                <div className="w-5 h-5 text-plasma-accent"><CheckCircleIcon /></div>
                Key Features
              </h3>
              <ul className="space-y-1 text-plasma-text-subtle pl-7">
                {product.features.map((feature, index) => <li key={index} className="list-disc">{feature}</li>)}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {(product.material || product.dimensions) && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-plasma-text">
                <div className="w-5 h-5 text-plasma-accent"><ListIcon /></div>
                Specifications
              </h3>
              <div className="text-sm text-plasma-text-subtle space-y-1 pl-7">
                {product.material && <p><strong>Material:</strong> {product.material}</p>}
                {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
              </div>
            </div>
          )}

          <div className="pt-4">
            <button 
                onClick={handleAddToCartClick}
                disabled={isAdded}
                className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg ${
                  isAdded 
                    ? 'bg-green-500' 
                    : 'bg-plasma-accent hover:bg-plasma-accent-hover'
                }`}
            >
              {isAdded ? <><div className="w-6 h-6"><CheckIcon/></div> Added to Cart!</> : 'Add to Cart'}
            </button>
          </div>

           {/* Price Comparisons */}
          {product.priceComparisons && product.priceComparisons.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-plasma-text">
                <div className="w-5 h-5 text-plasma-accent"><TagIcon /></div>
                Price Comparison
              </h3>
              <div className="space-y-2 text-sm">
                {product.priceComparisons.map((comp, index) => (
                    <div key={index} className="flex justify-between items-center bg-plasma-bg p-3 rounded-md border border-plasma-border">
                        <span className="text-plasma-text-subtle">{comp.store}</span>
                        <span className="font-semibold text-plasma-text">₹{comp.price.toFixed(2)}</span>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation styles
const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

if (!document.querySelector('#product-page-animation')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'product-page-animation';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}
