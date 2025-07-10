
import React from 'react';

interface SearchResultsPageProps {
    query: string;
    onBack: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onBack }) => {
    return (
        <div className="p-4 sm:p-8 bg-white dark:bg-gray-700 text-black dark:text-white">
            <div className="flex items-center mb-6">
                 <button onClick={onBack} className="mr-4 text-blue-500 hover:underline">&larr; Înapoi la căutare</button>
                <div className="flex-1">
                    <input
                        type="text"
                        value={query}
                        readOnly
                        className="w-full border border-gray-300 dark:border-gray-500 rounded-full px-6 py-2 bg-gray-100 dark:bg-gray-800"
                    />
                </div>
            </div>

            <div className="max-w-3xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Aproximativ 3,141,592 rezultate (0.42 secunde)</p>
                
                {/* Mock Search Result 1 */}
                <div className="mb-6">
                    <a href="#" className="text-sm text-gray-700 dark:text-gray-300">https://www.wikipedia.org/wiki/{query.replace(/\s/g, '_')}</a>
                    <h3 className="text-xl text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">{query.charAt(0).toUpperCase() + query.slice(1)} - Wikipedia</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        Enciclopedia liberă pe care o poate edita oricine. Aflați mai multe despre <strong>{query}</strong>, istoria sa, și impactul cultural. Articole detaliate, surse verificate și conținut multimedia.
                    </p>
                </div>
                
                {/* Mock Search Result 2 */}
                <div className="mb-6">
                    <a href="#" className="text-sm text-gray-700 dark:text-gray-300">https://www.youtube.com/results?search_query={query.replace(/\s/g, '+')}</a>
                    <h3 className="text-xl text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">Videoclipuri despre {query} - YouTube</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        Vizionează videoclipuri populare, tutoriale, recenzii și documentare despre <strong>{query}</strong>. Conținut de la creatori din întreaga lume.
                    </p>
                </div>

                 {/* Mock Search Result 3 */}
                <div className="mb-6">
                    <a href="#" className="text-sm text-gray-700 dark:text-gray-300">https://www.stirileprotv.ro/cauta?q={query.replace(/\s/g, '+')}</a>
                    <h3 className="text-xl text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">Știri de ultimă oră despre {query} - Știrile ProTV</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        Cele mai recente știri și informații despre <strong>{query}</strong>. Află ce se întâmplă în România și în lume, cu analize și reportaje exclusive.
                    </p>
                </div>
            </div>
        </div>
    );
};
