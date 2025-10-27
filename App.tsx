import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { VideoUploader } from './components/VideoUploader';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { FrameSelector } from './components/FrameSelector';
import { StorefrontPage } from './components/StorefrontPage';
import { ProductPage } from './components/ProductPage';
import { CartView } from './components/CartView';
import { Chatbot } from './components/Chatbot';
import { User, ProductData, CartItem } from './types';
import { extractFramesFromVideo, generateProductDetails, editImageWithPrompt } from './services/geminiService';

type AppState = 'login' | 'upload' | 'extracting' | 'frame_selection' | 'generating' | 'storefront' | 'product_page';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [error, setError] = useState<string>('');
  
  // State for the generation flow
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  
  // State for image editing
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editImageError, setEditImageError] = useState('');

  // State for cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for chatbot proactive messages
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAppState('login');
      // Reset everything on logout
      setVideoFile(null);
      setExtractedFrames([]);
      setProducts([]);
      setSelectedProduct(null);
      setCart([]);
      setIsCartOpen(false);
      setError('');
    } else {
      setAppState('upload');
    }
  }, [user]);

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleReset = () => {
    setVideoFile(null);
    setExtractedFrames([]);
    setProducts([]);
    setSelectedProduct(null);
    setError('');
    setAppState('upload');
  };

  const handleVideoSelect = async (file: File) => {
    setVideoFile(file);
    setAppState('extracting');
    setError('');
    try {
      const frames = await extractFramesFromVideo(file);
      if (frames.length === 0) {
        throw new Error("Could not extract any frames from the video. Please try a different video.");
      }
      setExtractedFrames(frames);
      setAppState('frame_selection');
    } catch (e: any) {
      setError(`Frame Extraction Failed: ${e.message}`);
      setAppState('upload');
    }
  };

  const handleFrameSelect = async (frame: string) => {
    setAppState('generating');
    setError('');
    try {
      const generatedProducts = await generateProductDetails(frame);
      if (generatedProducts.length === 0) {
        throw new Error("The AI could not identify any products in the selected frame. Please try a different frame or video.");
      }
      setProducts(generatedProducts);
      setAppState('storefront');
      // Trigger a proactive message in the chatbot
      setProactiveMessage("Your storefront is ready! A good next step is to think about marketing. Have you considered using social media to promote your products?");

    } catch (e: any) {
      setError(`Storefront Generation Failed: ${e.message}`);
      setAppState('frame_selection'); // Go back to frame selection on error
    }
  };

  const handleViewProduct = (product: ProductData) => {
    setSelectedProduct(product);
    setAppState('product_page');
  };

  const handleImageEdit = async (prompt: string) => {
    if (!selectedProduct) return;

    setIsEditingImage(true);
    setEditImageError('');
    try {
      const newImage = await editImageWithPrompt(selectedProduct.image, prompt);
      
      // Update the selected product's image
      const updatedProduct = { ...selectedProduct, image: newImage };
      setSelectedProduct(updatedProduct);

      // Also update the image in the main products list
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );

    } catch (e: any) {
      setEditImageError(`Image Editing Failed: ${e.message}`);
    } finally {
      setIsEditingImage(false);
    }
  };

  // --- Cart Functions ---
  const handleAddToCart = (productToAdd: ProductData) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item does not exist, add it with quantity 1
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Open cart when an item is added
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);


  const renderContent = () => {
    if (appState === 'login' || !user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    // Main content area for logged-in users
    return (
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm" role="alert">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        )}

        {appState === 'upload' && <VideoUploader onVideoSelect={handleVideoSelect} existingFile={videoFile} />}
        {appState === 'extracting' && <ProcessingIndicator isExtracting={true} />}
        {appState === 'frame_selection' && <FrameSelector frames={extractedFrames} onSelect={handleFrameSelect} onCancel={handleReset} />}
        {appState === 'generating' && <ProcessingIndicator isExtracting={false} />}
        {appState === 'storefront' && <StorefrontPage products={products} onReset={handleReset} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />}
        {appState === 'product_page' && selectedProduct && <ProductPage product={selectedProduct} onReset={() => setAppState('storefront')} onImageEdit={handleImageEdit} isEditing={isEditingImage} editError={editImageError} onAddToCart={handleAddToCart} />}
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-plasma-bg flex flex-col font-sans">
      {user && (
        <Header 
          user={user} 
          onLogout={handleLogout} 
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}
      {renderContent()}
      {user && (
        <>
          <CartView 
            items={cart} 
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
