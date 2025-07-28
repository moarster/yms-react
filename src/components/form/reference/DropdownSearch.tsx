import React from 'react'

interface DropdownSearchProps {
    searchTerm: string
    onSearchChange: (term: string) => void
}

export const DropdownSearch: React.FC<DropdownSearchProps> = ({
                                                                  searchTerm,
                                                                  onSearchChange
                                                              }) => {
    return (
        <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
            <input
                type="text"
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}