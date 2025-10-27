
import React from 'react';
import { StoreIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto max-w-6xl flex items-center gap-4">
        <div className="w-12 h-12 text-indigo-600">
            <StoreIcon />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Storefront Generator</h1>
            <p className="text-slate-500">Turn a product video into an e-commerce page in seconds.</p>
        </div>
      </div>
    </header>
  );
};
