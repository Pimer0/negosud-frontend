'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import {GoX} from "react-icons/go";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmitSearch = () => {

        onSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmitSearch();
        }
    };

    const handleToggleSearch = () => {
        if (isExpanded) {

            setQuery('');
            onSearch('');
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="relative flex items-center">

                {!isExpanded && (
                    <button
                        onClick={handleToggleSearch}
                        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        aria-label="Ouvrir la recherche"
                    >
                        <FaSearch />
                    </button>
                )}


                {isExpanded && (
                    <div className="flex items-center w-full flex-row">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-2 pl-10 mb-0 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:#1E4147 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>


                        <button
                            onClick={handleSubmitSearch}
                            className="ml-2 p-2 bg-[#1E4147] text-white rounded-lg hover:#1E4147 focus:outline-none focus:ring-2 focus:#1E4147 transition-colors"
                            aria-label="Rechercher"
                        >
                            <FaSearch />
                        </button>


                        <button
                            onClick={handleToggleSearch}
                            className="ml-2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            aria-label="Fermer la recherche"
                        >
                            <GoX />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;