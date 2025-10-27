
import React, { useState, useMemo, useEffect } from 'react';
import { ProductData } from './types';
import { StorefrontPage } from './components/StorefrontPage';
import { ProductPage } from './components/ProductPage';
import { editImageWithPrompt } from './services/geminiService';

type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

interface MyStorePageProps {
  products: ProductData[];
  onResetGenerator: () => void;
  onAddToCart: (product: ProductData) => void;
}

export const MyStorePage: React.FC<MyStorePageProps> = ({ products: initialProducts, onResetGenerator, onAddToCart }) => {
  const [allProducts, setAllProducts] = useState<ProductData[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('title-asc');
  const [priceFilter, setPriceFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setAllProducts(initialProducts);
    setSelectedProduct(null);
  }, [initialProducts]);

  const { priceRanges, uniqueMaterials } = useMemo(() => {
    if (allProducts.length === 0) {
        return { priceRanges: [], uniqueMaterials: [] };
    }
    const priceRanges = [
        { label: "Under ₹1000", min: 0, max: 1000 },
        { label: "₹1000 to ₹5000", min: 1000, max: 5000 },
        { label: "₹5000 to ₹10000", min: 5000, max: 10000 },
        { label: "Over ₹10000", min: 10000, max: Infinity },
    ];
    const materials = [...new Set(allProducts.map(p => p.material).filter(Boolean) as string[])];
    materials.sort();
    return { priceRanges, uniqueMaterials: materials };
  }, [allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let priceRange = null;
    if (priceFilter) {
      try {
        priceRange = JSON.parse(priceFilter);
      } catch (e) {
        // ignore invalid json
      }
    }
    
    return allProducts
      .filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = !priceRange || (product.price >= priceRange.min && product.price < priceRange.max);
        
        const matchesMaterial = !materialFilter || product.material === materialFilter;

        return matchesSearch && matchesPrice && matchesMaterial;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'title-asc': return a.title.localeCompare(b.title);
          case 'title-desc': return b.title.localeCompare(a.title);
          default: return 0;
        }
      });
  }, [allProducts, searchTerm, sortOption, priceFilter, materialFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceFilter('');
    setMaterialFilter('');
    setSortOption('title-asc');
  };

  const handleImageEdit = async (prompt: string) => {
    if (!selectedProduct) return;
    setIsEditing(true);
    setEditError('');
    try {
      const newImage = await editImageWithPrompt(selectedProduct.image, prompt);
      const updatedProduct = { ...selectedProduct, image: newImage };
      setSelectedProduct(updatedProduct);
      setAllProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
    } catch (e: any) {
      setEditError(e.message || 'An error occurred during image editing.');
    } finally {
      setIsEditing(false);
    }
  };

  if (selectedProduct) {
    return (
      <ProductPage
        product={selectedProduct}
        onReset={() => setSelectedProduct(null)}
        onImageEdit={handleImageEdit}
        isEditing={isEditing}
        editError={editError}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <StorefrontPage
      products={filteredAndSortedProducts}
      onAddToCart={onAddToCart}
      onViewProduct={setSelectedProduct}
      onResetGenerator={onResetGenerator}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      sortOption={sortOption}
      onSortChange={setSortOption}
      priceRanges={priceRanges}
      selectedPrice={priceFilter}
      onPriceChange={setPriceFilter}
      materials={uniqueMaterials}
      selectedMaterial={materialFilter}
      onMaterialChange={setMaterialFilter}
      onClearFilters={handleClearFilters}
    />
  );
};
