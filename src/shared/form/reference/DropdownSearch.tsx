import React from 'react';

interface DropdownSearchProps {
  onSearchChange: (term: string) => void;
  searchTerm: string;
}

export const DropdownSearch: React.FC<DropdownSearchProps> = ({ onSearchChange, searchTerm }) => {
  return (
    <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
      <input
        type="text"
        value={searchTerm}
        placeholder="Search options..."
        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
