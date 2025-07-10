import React, { useRef, useEffect } from 'react';
import { TextDocumentIcon, TerminalIcon, BrowserIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const StartMenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center w-24 p-2 text-center text-gray-800 dark:text-white transition-colors duration-200 rounded-lg cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
    >
        <div className="w-8 h-8 mb-2">{icon}</div>
        <span className="text-xs break-words leading-tight h-8 flex items-center justify-center">{label}</span>
    </button>
);

const StartMenu: React.FC = () => {
    const { openWindow, closeWindow } = useAppContext();
    const menuRef = useRef<HTMLDivElement>(null);
    useFocusTrap(menuRef);
    
    useEffect(() => {
        const handleEvent = (e: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeWindow('startMenu');
            }
        };
        document.addEventListener('mousedown', handleEvent);
        document.addEventListener('touchstart', handleEvent);
        return () => {
            document.removeEventListener('mousedown', handleEvent);
            document.removeEventListener('touchstart', handleEvent);
        };
    }, [closeWindow]);

    return (
        <div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Meniu Start"
            className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-xl bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-2xl border dark:border-white/10 rounded-2xl shadow-2xl p-6 animate-fade-in-up z-40"
        >
             <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Aplicații fixate</h2>
            <div className="flex flex-wrap gap-2 justify-center">
                <StartMenuItem icon={<TextDocumentIcon className="w-full h-full" />} label="Parola WiFi.txt" onClick={() => openWindow('wordpad')} />
                <StartMenuItem icon={<TerminalIcon className="w-full h-full" />} label="Terminal" onClick={() => openWindow('terminal')} />
                <StartMenuItem icon={<BrowserIcon className="w-full h-full" />} label="Browser" onClick={() => openWindow('browser')} />
            </div>
        </div>
    );
};

export default React.memo(StartMenu);