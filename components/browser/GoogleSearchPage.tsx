
import React, { useState, useMemo } from 'react';

interface GoogleSearchPageProps {
    onSearch: (query: string) => void;
}

// Predefined list of search suggestions
const suggestions = [
    "vremea bucuresti", "retete prajituri", "stiri de ultima ora",
    "curs valutar bnr", "program cinema", "rezultate fotbal",
    "traducere engleza romana", "emag oferte", "cat costa o vigneta",
    "definitie dex"
];

export const GoogleSearchPage: React.FC<GoogleSearchPageProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = useMemo(() => {
        if (!query) return suggestions;
        return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()){
            onSearch(query.trim());
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-700 text-black dark:text-white">
            <h1 className="text-8xl font-bold mb-8">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
            </h1>
            <div className="w-full max-w-xl lg:max-w-2xl relative">
                <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                         <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click
                            className="w-full border border-gray-300 dark:border-gray-500 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
                            placeholder="Caută pe Google sau tastează o adresă URL"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </form>
                {showSuggestions && query && (
                    <ul className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-b-2xl shadow-lg overflow-hidden">
                        {filteredSuggestions.slice(0, 10).map(s => (
                            <li 
                                key={s}
                                onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s); }}
                                className="px-6 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
             <div className="mt-8">
                <button onClick={() => onSearch("Google I'm Feeling Lucky")} className="bg-gray-100 dark:bg-gray-600 px-4 py-2 rounded-md text-sm hover:ring-1 hover:ring-gray-300">Căutare Google</button>
            </div>
        </div>
    );
};
