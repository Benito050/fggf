
import React from 'react';
import { StoreIcon, ShoppingCartIcon } from './icons';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, cartItemCount, onCartClick }) => {
  return (
    <header className="bg-plasma-surface border-b border-plasma-border p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-plasma-accent">
            <StoreIcon />
          </div>
          <h1 className="text-xl font-bold text-plasma-text">AI Storefront Generator</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-plasma-text-subtle hidden sm:inline">{user.email}</span>
              <button
                onClick={onCartClick}
                className="relative p-2 rounded-full hover:bg-plasma-border transition-colors"
                aria-label="View Shopping Cart"
              >
                <div className="w-6 h-6 text-plasma-text">
                  <ShoppingCartIcon />
                </div>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="bg-plasma-bg hover:bg-plasma-border text-plasma-text font-semibold py-2 px-4 border border-plasma-border rounded-lg transition-colors"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
