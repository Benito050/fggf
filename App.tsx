import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { CartView } from './components/CartView';
import { Chatbot } from './components/Chatbot';
import { User, ProductData, CartItem } from './types';
// Fix: Import GeneratorPage and MyStorePage from root to structure the application flow.
import { GeneratorPage } from './GeneratorPage';
import { MyStorePage } from './MyStorePage';

type AppState = 'login' | 'generate' | 'store';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('login');
  const [generatedProducts, setGeneratedProducts] = useState<ProductData[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);

  const handleLogin = (email: string) => {
    setUser({ email });
    setAppState('generate');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
    setGeneratedProducts([]);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleStorefrontReady = (products: ProductData[]) => {
    setGeneratedProducts(products);
    setAppState('store');
  };

  const handleResetGenerator = () => {
    setAppState('generate');
    setGeneratedProducts([]);
  };

  const handleGenerationStart = () => {
    setProactiveMessage(`I've started creating your product listings. A helpful tip for e-commerce is to use unique, high-quality images for each item to increase sales. I'm generating those for you now. Have you thought about how you'll market these products once your store is live?`);
  };

  const handleAddToCart = (productToAdd: ProductData) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'generate':
        return <GeneratorPage onStorefrontReady={handleStorefrontReady} onGenerationStart={handleGenerationStart} />;
      case 'store':
        return <MyStorePage products={generatedProducts} onResetGenerator={handleResetGenerator} onAddToCart={handleAddToCart} />;
      default:
        return <div>Unknown state</div>;
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-plasma-bg text-plasma-text font-sans flex flex-col">
      {user && (
        <Header 
          user={user} 
          onLogout={handleLogout} 
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}
      <main className="flex-grow container mx-auto p-4">
        {renderContent()}
      </main>
      
      {user && (
        <>
          <CartView
            items={cartItems}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
          />
          <Chatbot
            user={user}
            proactiveMessageTrigger={proactiveMessage}
            onProactiveMessageSent={() => setProactiveMessage(null)}
          />
        </>
      )}
    </div>
  );
}

export default App;