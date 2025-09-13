'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  categories = [],
  showFilters = false,
  onToggleFilters
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearchChange(value);
  };
  
  const clearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };
  
  const clearFilters = () => {
    onCategoryChange('all');
    onDurationChange('all');
  };
  
  const hasActiveFilters = selectedCategory !== 'all' || selectedDuration !== 'all';
  
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search activities..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {localSearchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center space-x-2"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-coral-500 rounded-full"></span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </Button>
        )}
      </div>
      
      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onCategoryChange('all')}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onCategoryChange(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'quick', label: 'Quick (≤1h)' },
                    { value: 'medium', label: 'Medium (1-2h)' },
                    { value: 'long', label: 'Long (>2h)' }
                  ].map(filter => (
                    <Button
                      key={filter.value}
                      variant={selectedDuration === filter.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onDurationChange(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilter;
