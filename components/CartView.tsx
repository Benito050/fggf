import React from 'react';
import { CartItem } from '../types';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon } from './icons';

interface CartViewProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ items, isOpen, onClose, onUpdateQuantity, onRemove }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-plasma-text/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-plasma-surface shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex justify-between items-center p-4 border-b border-plasma-border flex-shrink-0">
            <h2 className="text-xl font-bold text-plasma-text">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-plasma-border transition-colors">
              <div className="w-6 h-6 text-plasma-text-subtle"><CloseIcon /></div>
            </button>
          </header>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-plasma-text-subtle p-4">
              <p>Your cart is empty. Add some products to see them here!</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-start">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md border border-plasma-border flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-plasma-text leading-tight">{item.title}</h3>
                    <p className="text-sm text-plasma-text-subtle">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-plasma-border rounded-md">
                        <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-plasma-text-subtle hover:bg-plasma-border rounded-l-md transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                        >
                            <div className="w-4 h-4"><MinusIcon/></div>
                        </button>
                        <span className="px-3 text-sm font-semibold text-plasma-text bg-plasma-bg">{item.quantity}</span>
                         <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-plasma-text-subtle hover:bg-plasma-border rounded-r-md transition-colors"
                            aria-label="Increase quantity"
                        >
                            <div className="w-4 h-4"><PlusIcon/></div>
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)} 
                        className="p-2 text-plasma-text-subtle rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <div className="w-5 h-5"><TrashIcon/></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <footer className="p-4 border-t border-plasma-border bg-plasma-surface flex-shrink-0">
              <div className="flex justify-between items-center font-bold text-lg text-plasma-text mb-4">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => alert('Proceeding to a mock checkout!')}
                className="w-full bg-plasma-accent text-white font-bold py-3 rounded-lg hover:bg-plasma-accent-hover transition-colors"
              >
                Proceed to Checkout
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};