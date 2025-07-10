import React, { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus } from '../types';
import { WifiIcon, WifiOffIcon, BluetoothIcon, AirplaneModeIcon, ChevronRightIcon, SunIcon, MoonIcon, BrowserIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAppContext } from '../contexts/AppContext';

const QuickMenuItem: React.FC<{ icon: React.ReactNode, label: string, sublabel?: string, isActive?: boolean, onClick?: () => void, children?: React.ReactNode }> = React.memo(({ icon, label, sublabel, isActive, onClick, children }) => (
    <div
        onClick={onClick}
        className={`rounded-md p-2 flex items-center transition-all duration-200 ease-out cursor-pointer 
        ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20'}`}
    >
        <div className="flex-1 flex items-start space-x-2">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-sm font-semibold">{label}</p>
                {sublabel && <p className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}>{sublabel}</p>}
            </div>
        </div>
        {children}
    </div>
));

const Taskbar: React.FC = () => {
  const { 
    connectionStatus, handleOpenTroubleshooter, handleSearch, isAirplaneModeOn, 
    handleToggleAirplaneMode, openWindow, toggleStartMenu 
  } = useAppContext();
  
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(90);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      setSearchQuery('');
    }
  }, [searchQuery, handleSearch]);

  const getNetworkStatus = useCallback(() => {
    if (isAirplaneModeOn) {
        return { Icon: AirplaneModeIcon, text: "Mod Avion", color: "text-gray-500 dark:text-gray-400" };
    }
    switch(connectionStatus) {
      case ConnectionStatus.Connected:
        return { Icon: WifiIcon, text: "HomeWiFi", color: "text-gray-800 dark:text-gray-200" };
      case ConnectionStatus.Connecting:
        return { Icon: WifiIcon, text: "Conectare...", color: "text-gray-500 dark:text-gray-400 animate-pulse" };
      default:
        return { Icon: WifiOffIcon, text: "Deconectat", color: "text-gray-500 dark:text-gray-400" };
    }
  }, [connectionStatus, isAirplaneModeOn]);

  const { Icon, color } = getNetworkStatus();
  
  return (
    <>
      {isQuickMenuOpen && (
        <div className="fixed bottom-14 right-2 w-[360px] bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-xl shadow-2xl p-4 animate-fade-in-up transition-colors duration-300 z-50">
            <div className="grid grid-cols-3 gap-2">
                <QuickMenuItem icon={<WifiIcon className="w-5 h-5"/>} label="Wi-Fi" sublabel="HomeWiFi" isActive={connectionStatus === ConnectionStatus.Connected && !isAirplaneModeOn}>
                   <ChevronRightIcon className="w-5 h-5" />
                </QuickMenuItem>
                <QuickMenuItem icon={<BluetoothIcon className="w-5 h-5"/>} label="Bluetooth" sublabel="Activat">
                   <ChevronRightIcon className="w-5 h-5" />
                </QuickMenuItem>
                <QuickMenuItem icon={<AirplaneModeIcon className="w-5 h-5"/>} label="Mod Avion" isActive={isAirplaneModeOn} onClick={handleToggleAirplaneMode}/>
                <QuickMenuItem 
                  icon={theme === 'light' ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>} 
                  label={theme === 'light' ? 'Luminos' : 'Întunecat'}
                  onClick={toggleTheme}
                  isActive
                />
            </div>
            <div className="mt-4 space-y-3">
                 <div className="flex items-center space-x-2">
                    <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                    <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer" aria-label="Luminozitate ecran" />
                </div>
                <div className="flex items-center space-x-2">
                   <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(parseInt(e.target.value))} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer" aria-label="Volum sistem" />
                </div>
            </div>
            <div className="border-t border-gray-400/50 dark:border-gray-600/50 mt-4 pt-2 flex justify-between items-center text-sm">
                <button onClick={() => { handleOpenTroubleshooter(); setIsQuickMenuOpen(false); }} className="text-blue-600 dark:text-blue-400 hover:underline">Depanare probleme</button>
                <button onClick={() => openWindow('settings')} className="p-1 rounded-md hover:bg-gray-300/90 dark:hover:bg-white/20 transition-colors" aria-label="Deschide setările complete">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 21.7c0 .2.2.3.4.3h2.6c.2 0 .4-.1.4-.3v-2.1c.8-.3 1.6-.8 2.2-1.3l1.5 1.5c.1.1.3.2.5.1l1.8-1.1c.2-.1.2-.3.1-.5l-1.5-1.5c.5-.6.9-1.3 1.2-2.2h2.1c.2 0 .3-.2.3-.4v-2.6c0-.2-.1-.4-.3-.4h-2.1c-.3-.8-.7-1.6-1.2-2.2l1.5-1.5c.1-.2.1-.4-.1-.5l-1.8-1.1c-.2-.1-.4-.1-.5.1l-1.5 1.5c-.6-.5-1.4-1-2.2-1.3V2.3c0-.2-.2-.3-.4-.3h-2.6c-.2 0-.4.1-.4.3v2.1c-.8.3-1.6.8-2.2 1.3l-1.5-1.5c-.1-.1-.3-.2-.5-.1l-1.8 1.1c-.2.1-.2.3-.1.5l1.5 1.5c-.5.6-.9 1.3-1.2 2.2H2.3c-.2 0-.3.2-.3-.4v2.6c0 .2.1.4.3.4h2.1c.3.8.7 1.6 1.2 2.2l-1.5 1.5c-.1.2-.1.4.1.5l1.8 1.1c.2.1.4.1.5-.1l1.5-1.5c.6.5 1.3.9 2.2 1.3v2.1z"/><circle cx="12" cy="12" r="3.5"/></svg>
                </button>
            </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 h-12 bg-gray-200/70 dark:bg-gray-800/70 backdrop-blur-2xl flex items-center justify-between text-gray-800 dark:text-gray-200 shadow-lg ring-1 ring-black/10 dark:ring-white/10 px-4 transition-colors duration-300 z-30">
        
        <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={toggleStartMenu} className="p-1 rounded-md transition-colors hover:bg-gray-300/80 dark:hover:bg-white/20" aria-label="Meniu Start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z"/></svg>
            </button>
            
            <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                    <svg className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Căutare"
                        className="bg-white/70 dark:bg-black/20 w-32 sm:w-48 h-8 rounded-md pl-8 pr-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
            </form>
            <button
                onClick={() => openWindow('browser')}
                disabled={connectionStatus !== ConnectionStatus.Connected}
                className="p-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300/80 dark:hover:bg-white/20"
                aria-label="Deschide Browser"
            >
                <BrowserIcon className="h-7 w-7"/>
            </button>
        </div>
        
        <div className="flex items-center h-full space-x-4">
          <div className="text-xs text-right hidden sm:block">
              <div>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div>{currentTime.toLocaleDateString()}</div>
          </div>
          <button onClick={() => setIsQuickMenuOpen(prev => !prev)} className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-300/80 dark:hover:bg-white/20 transition-colors" aria-label="Meniu rapid">
            <Icon className={`w-5 h-5 ${color}`} />
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(Taskbar);