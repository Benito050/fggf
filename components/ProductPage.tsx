import React, { useState, useEffect } from 'react';
import { ProductData } from '../types';
import { ArrowLeftIcon, SparklesIcon, SpinnerIcon, ListIcon, CheckCircleIcon } from './icons';

interface ProductPageProps {
  product: ProductData;
  onReset: () => void;
  onImageEdit: (prompt: string) => void;
  isEditing: boolean;
  editError: string;
  onAddToCart: (product: ProductData) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onReset, onImageEdit, isEditing, editError, onAddToCart }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onImageEdit(editPrompt);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-plasma-text-subtle hover:text-plasma-accent font-semibold mb-6 transition-colors"
      >
        <div className="w-5 h-5"><ArrowLeftIcon /></div>
        Back to Storefront
      </button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Column */}
        <div className="space-y-6">
          <img src={product.image} alt={product.title} className="w-full h-auto object-cover rounded-xl shadow-lg border border-plasma-border" />
          
          {/* Magic Edit Section */}
          <div className="bg-plasma-surface p-6 rounded-xl shadow-md border border-plasma-border">
            <h3 className="text-lg font-bold text-plasma-text flex items-center gap-2">
              <div className="w-6 h-6 text-plasma-accent"><SparklesIcon /></div>
              Magic Edit
            </h3>
            <p className="text-plasma-text-subtle text-sm mt-1 mb-4">Describe a change, and the AI will edit the image for you.</p>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g., 'Make the background solid blue'"
                className="w-full px-4 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none"
                disabled={isEditing}
              />
              <button
                type="submit"
                disabled={isEditing || !editPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-plasma-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-plasma-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? <><div className="w-5 h-5"><SpinnerIcon /></div> Generating...</> : 'Apply Edit'}
              </button>
            </form>
            {editError && <p className="text-red-600 text-sm mt-3">{editError}</p>}
          </div>
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-plasma-text">{product.title}</h1>
          <p className="text-4xl font-light text-plasma-accent">${product.price.toFixed(2)}</p>
          <p className="text-plasma-text-subtle leading-relaxed">{product.description}</p>
          
          <button
            onClick={handleAddToCartClick}
            disabled={isAdded}
            className="w-full bg-plasma-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-plasma-accent-hover transition-colors flex items-center justify-center gap-2 disabled:bg-green-500"
          >
            {isAdded ? <><div className="w-6 h-6"><CheckCircleIcon /></div> Added to Cart!</> : 'Add to Cart'}
          </button>

          {/* Specifications */}
          {(product.material || product.dimensions) && (
            <div className="bg-plasma-surface p-4 rounded-xl border border-plasma-border">
              <h3 className="text-lg font-bold text-plasma-text mb-3 flex items-center gap-2">
                 <div className="w-5 h-5"><ListIcon/></div>
                 Specifications
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.material && <div className="text-plasma-text-subtle">Material</div>}
                {product.material && <div className="text-plasma-text font-medium">{product.material}</div>}
                {product.dimensions && <div className="text-plasma-text-subtle">Dimensions</div>}
                {product.dimensions && <div className="text-plasma-text font-medium">{product.dimensions}</div>}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="bg-plasma-surface p-4 rounded-xl border border-plasma-border">
               <h3 className="text-lg font-bold text-plasma-text mb-3 flex items-center gap-2">
                 <div className="w-5 h-5"><CheckCircleIcon/></div>
                 Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-plasma-text">
                    <span className="text-green-500 mt-1 flex-shrink-0"><div className="w-4 h-4"><CheckCircleIcon /></div></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

if (!document.querySelector('#product-page-animation')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'product-page-animation';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}
