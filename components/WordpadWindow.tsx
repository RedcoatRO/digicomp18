import React, { useRef } from 'react';
import { TextDocumentIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const WordpadWindow: React.FC = () => {
    const { closeWindow } = useAppContext();
    const windowRef = useRef<HTMLDivElement>(null);
    useFocusTrap(windowRef);

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="wordpad-title" className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-40">
            <div ref={windowRef} className="w-full max-w-lg bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 flex justify-between items-center cursor-move">
                    <div className="flex items-center space-x-2">
                        <TextDocumentIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span id="wordpad-title" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Parola WiFi.txt - WordPad (Simulat)</span>
                    </div>
                    <button 
                        onClick={() => closeWindow('wordpad')} 
                        aria-label="Închide Wordpad"
                        className="p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700">
                    <p>Detalii rețea Wi-Fi:</p>
                    <br />
                    <p>Nume rețea (SSID): <span className="font-bold">HomeWiFi</span></p>
                    <p>Parolă: <span className="font-bold bg-yellow-200 dark:bg-yellow-400/80 dark:text-black px-1 rounded">password123</span></p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WordpadWindow);