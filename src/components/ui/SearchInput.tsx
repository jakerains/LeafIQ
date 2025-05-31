import React, { useState, FormEvent } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './button';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
}

const SearchInput = ({
  onSearch,
  placeholder = 'How do you want to feel?',
  suggestions = ['relaxed', 'energized', 'creative', 'sleepy'],
  isLoading = false
}: SearchInputProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-5 py-4 pl-12 text-xl bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            variant="primary"
            isLoading={isLoading}
            disabled={!query.trim() || isLoading}
          >
            Search
          </Button>
        </div>
      </form>

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion) => (
            <motion.button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-white bg-opacity-60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-opacity-80 transition-all duration-200"
              whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              {suggestion}
            </motion.button>
          ))}
          <motion.button
            className="px-4 py-2 bg-white bg-opacity-60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-opacity-80 transition-all duration-200 flex items-center gap-1"
            whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            <Mic size={16} /> Voice
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;