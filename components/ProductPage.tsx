
import React from 'react';
import { ProductData } from '../types';
import { SparklesIcon } from './icons';

interface ProductPageProps {
  product: ProductData;
  onReset: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md mb-8 shadow-sm text-center">
            <h2 className="font-bold text-lg">Success! Your E-Commerce Page is Ready.</h2>
            <p>Here is a preview of your AI-generated storefront.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden md:grid md:grid-cols-2">
            <div className="p-4 md:p-0">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover"/>
            </div>
            <div className="p-6 md:p-8 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{product.title}</h1>
                <p className="text-4xl font-light text-indigo-600 my-4">
                    ${product.price.toFixed(2)}
                </p>
                <div className="prose prose-slate mt-4 text-slate-600 flex-grow">
                  <p>{product.description}</p>
                </div>
                
                <div className="mt-8">
                    <button className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 transition-colors">
                        Add to Cart
                    </button>
                    <button className="w-full mt-2 bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>

        <div className="text-center mt-8">
            <button 
                onClick={onReset}
                className="bg-slate-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-900 transition-colors inline-flex items-center gap-2"
            >
                <div className="w-5 h-5"><SparklesIcon/></div>
                Create Another
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

const styleSheet = document.createElement("style");
styleSheet.innerText = fadeIn;
document.head.appendChild(styleSheet);
