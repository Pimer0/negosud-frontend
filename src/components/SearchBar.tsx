'use client';

import React, { useState } from 'react';

interface SearchBarProps {
onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false); // état pour gérer l'affichage ou non de l'input

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    const handleToggleSearch = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
        setQuery('');
        onSearch('');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8">
        <div className="relative flex items-center">
            {/* bouton de la loupe (visible uniquement lorsque l'input est réduit) */}
            {!isExpanded && (
            <button
                onClick={handleToggleSearch}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
                <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/s"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                </svg>
            </button>
            )}

            {/* input de recherche uniquement visible lorsqu'on clique sur la loupe */}
            {isExpanded && (
            <div className="flex items-center w-full">
                <input
                type="text"
                placeholder="Rechercher un produit..."
                value={query}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {/* icon loupe */}
                <svg
                    className="absolute left-3 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/s"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                    </svg>

                {/*bouton pour réduire la barre de recherche */}
                <button
                onClick={handleToggleSearch}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/s"
                    >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

export default SearchBar;