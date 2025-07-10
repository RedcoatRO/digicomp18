import React, { useRef } from 'react';
import { ConnectionStatus } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

import { GoogleSearchPage } from './browser/GoogleSearchPage';
import { SearchResultsPage } from './browser/SearchResultsPage';
import { NoConnectionPage } from './browser/NoConnectionPage';

const BrowserWindow: React.FC = () => {
    const { 
        connectionStatus, browserTabs: tabs, activeTabId, closeWindow,
        handleBrowserAddTab, handleBrowserCloseTab, handleBrowserSetActiveTab, handleBrowserTabUpdate
    } = useAppContext();

    const windowRef = useRef<HTMLDivElement>(null);
    useFocusTrap(windowRef);
    
    const handleSearch = (query: string) => {
        if (activeTabId) {
            handleBrowserTabUpdate(activeTabId, {
                type: 'results',
                query: query,
                title: `${query} - Căutare Google`
            });
        }
    };
    
    const handleGoBackToSearch = () => {
         if (activeTabId) {
            handleBrowserTabUpdate(activeTabId, {
                type: 'search',
                query: undefined,
                title: 'Google'
            });
        }
    }

    const activeTab = tabs.find(t => t.id === activeTabId);

    const renderContent = () => {
        if (connectionStatus !== ConnectionStatus.Connected) {
            return <NoConnectionPage />;
        }
        if (!activeTab) {
             return <NoConnectionPage />;
        }
        
        switch(activeTab.type) {
            case 'search':
                return <GoogleSearchPage onSearch={handleSearch} />;
            case 'results':
                return <SearchResultsPage query={activeTab.query || ""} onBack={handleGoBackToSearch} />;
            default:
                return null;
        }
    };

    return (
        <div role="dialog" aria-modal="true" aria-label="Fereastră browser" className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fade-in z-40">
            <div ref={windowRef} className="w-full h-full sm:w-[95vw] sm:max-w-[1200px] sm:h-[90vh] bg-gray-200 dark:bg-gray-800 rounded-none sm:rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                <div className="bg-gray-300 dark:bg-gray-900 flex items-center pr-2">
                    <div className="flex-1 flex items-end pt-1">
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                role="tab"
                                aria-selected={tab.id === activeTabId}
                                onClick={() => handleBrowserSetActiveTab(tab.id)}
                                className={`flex items-center justify-between pl-3 pr-1 py-1.5 border-r border-gray-400/50 dark:border-gray-700/50 min-w-[120px] max-w-[200px] cursor-pointer relative ${tab.id === activeTabId ? 'bg-gray-200 dark:bg-gray-800 rounded-t-md' : 'bg-gray-300/80 dark:bg-gray-900/80 hover:bg-gray-200/80 dark:hover:bg-gray-800/80'}`}
                            >
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{tab.title}</p>
                                <button onClick={(e) => { e.stopPropagation(); handleBrowserCloseTab(tab.id); }} aria-label={`Închide tab-ul ${tab.title}`} className="ml-2 p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                    <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        <button onClick={handleBrowserAddTab} aria-label="Adaugă tab nou" className="px-2.5 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 rounded-t-md">+</button>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => closeWindow('browser')} aria-label="Închide browser" className="p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-gray-700 overflow-y-auto" role="tabpanel">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default React.memo(BrowserWindow);