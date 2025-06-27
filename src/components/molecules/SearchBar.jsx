import React, { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  placeholder = 'Search zaps...', 
  onSearch, 
  onClear,
  value = '',
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSearch = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear?.();
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        icon="Search"
        className="pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto min-h-0"
          icon="X"
        />
      )}
    </div>
  );
};

export default SearchBar;