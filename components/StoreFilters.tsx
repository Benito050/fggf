import React from 'react';
import { SearchIcon } from './icons';

type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

interface StoreFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  productCount: number;
  priceRanges: { label: string; min: number; max: number }[];
  selectedPrice: string;
  onPriceChange: (value: string) => void;
  materials: string[];
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;
  onClearFilters: () => void;
}

export const StoreFilters: React.FC<StoreFiltersProps> = ({ 
  searchTerm, 
  onSearchChange, 
  sortOption, 
  onSortChange,
  productCount,
  priceRanges,
  selectedPrice,
  onPriceChange,
  materials,
  selectedMaterial,
  onMaterialChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchTerm || selectedPrice || selectedMaterial;

  return (
    <div className="bg-plasma-surface p-4 rounded-lg shadow-sm border border-plasma-border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:col-span-2">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 text-plasma-text-subtle"><SearchIcon /></div>
          </div>
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none"
          />
        </div>
        
        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full pl-3 pr-8 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none appearance-none"
        >
          <option value="title-asc">Sort by Name (A-Z)</option>
          <option value="title-desc">Sort by Name (Z-A)</option>
          <option value="price-asc">Sort by Price (Low to High)</option>
          <option value="price-desc">Sort by Price (High to Low)</option>
        </select>

        <p className="text-sm text-plasma-text-subtle text-center md:text-right flex items-center justify-center lg:justify-end">
          {productCount} {productCount === 1 ? 'product' : 'products'} found
        </p>

        {/* Price Filter */}
        <select
          value={selectedPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full pl-3 pr-8 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none appearance-none"
        >
          <option value="">Filter by Price</option>
          {priceRanges.map(range => <option key={range.label} value={JSON.stringify(range)}>{range.label}</option>)}
        </select>
        
        {/* Material Filter */}
        <select
          value={selectedMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="w-full pl-3 pr-8 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none appearance-none"
          disabled={materials.length === 0}
        >
          <option value="">Filter by Material</option>
          {materials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
        </select>

        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="w-full md:col-start-4 bg-plasma-bg hover:bg-plasma-border text-plasma-text font-semibold py-2 px-4 border border-plasma-border rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
