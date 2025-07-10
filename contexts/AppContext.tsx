import React, { createContext, useState, useEffect, useContext, useMemo, useCallback, ReactNode } from 'react';
import { 
    AppState, AppContextType, ConnectionStatus, TroubleshootingScenario, WifiNetwork, 
    BrowserTab, SimulatedDevice, ConnectionHistoryEntry, VpnStatus, ActiveWindow,
    Notification, NotificationType
} from '../types';
import { BluetoothIcon, AudioIcon, NetworkIcon } from '../components/icons';

// 1. Create the Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// 2. Define the Provider Component
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // Initial state loader from localStorage or defaults
    const [state, setState] = useState<AppState>(() => {
        const defaultState: AppState = {
            connectionStatus: ConnectionStatus.Disconnected,
            activeWindow: null,
            isInitialErrorVisible: true,
            troubleshootingScenario: TroubleshootingScenario.WIFI_PASSWORD,
            networks: [
                { ssid: 'HomeWiFi', signal: 'Puternic', isSecure: true, savedPassword: 'password123' },
                { ssid: 'UPB-Guest', signal: 'Puternic', isSecure: false },
            ],
            isAirplaneModeOn: false,
            isProxyEnabled: false,
            isDriverOutdated: false,
            browserTabs: [],
            activeTabId: null,
            simulatedDevices: [
                { id: 'bt', name: 'Bluetooth Adapter', icon: BluetoothIcon, isEnabled: true },
                { id: 'audio', name: 'Realtek Audio', icon: AudioIcon, isEnabled: true },
                { id: 'net', name: 'Intel(R) Wireless-AC', icon: NetworkIcon, isEnabled: true, isProblematic: false },
            ],
            vpnStatus: VpnStatus.Disconnected,
            connectionHistory: [],
            securityWarningSsid: null,
            notifications: [],
        };
        try {
            const savedState = localStorage.getItem('windowsSimState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                // Combine saved state with defaults, ensuring non-serializable parts are fresh
                return {
                    ...defaultState,
                    ...parsedState,
                    activeWindow: null, // Windows should not be open on reload
                    simulatedDevices: defaultState.simulatedDevices,
                    notifications: [],
                };
            }
        } catch (error) { console.error("Failed to parse state from localStorage", error); }
        return defaultState;
    });

    // Effect to save state to localStorage on change
    useEffect(() => {
        try {
            const stateToSave = { ...state };
            // Exclude non-serializable or transient state
            delete (stateToSave as Partial<AppState>).simulatedDevices;
            delete (stateToSave as Partial<AppState>).activeWindow;
            delete (stateToSave as Partial<AppState>).notifications;
            localStorage.setItem('windowsSimState', JSON.stringify(stateToSave));
        } catch (error) { console.error("Failed to save state to localStorage", error); }
    }, [state]);

    // --- NOTIFICATION HANDLERS (integrated from NotificationContext) ---
    const removeNotification = useCallback((id: number) => {
        setState(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.id !== id) }));
    }, []);

    const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
        const id = Date.now();
        setState(prev => ({ ...prev, notifications: [...prev.notifications, { id, title, message, type }] }));
        setTimeout(() => removeNotification(id), 5000);
    }, [removeNotification]);


    // --- WINDOW MANAGEMENT ---
    const openWindow = useCallback((window: NonNullable<ActiveWindow>) => {
        if (window === 'browser' && state.connectionStatus !== ConnectionStatus.Connected) {
            addNotification("Eroare", "Browser-ul necesită o conexiune la internet.", "error");
            return;
        }
        setState(prev => ({...prev, activeWindow: window}));
        // Logic for opening browser with a default tab if none exist
        if(window === 'browser' && state.browserTabs.length === 0) {
            const newTab: BrowserTab = { id: Date.now(), title: 'Google', type: 'search' };
            setState(prev => ({...prev, browserTabs: [newTab], activeTabId: newTab.id}));
        }
    }, [state.connectionStatus, state.browserTabs.length, addNotification]);

    const closeWindow = useCallback((window: NonNullable<ActiveWindow>) => {
        setState(prev => prev.activeWindow === window ? { ...prev, activeWindow: null } : prev);
    }, []);

    const toggleStartMenu = useCallback(() => {
        setState(prev => ({ ...prev, activeWindow: prev.activeWindow === 'startMenu' ? null : 'startMenu' }));
    }, []);

    // --- BROWSER HANDLERS ---
    const handleBrowserAddTab = useCallback(() => {
        const newTab: BrowserTab = { id: Date.now(), title: 'Google', type: 'search' };
        setState(prev => ({...prev, browserTabs: [...prev.browserTabs, newTab], activeTabId: newTab.id}));
    }, []);

    const handleBrowserCloseTab = useCallback((id: number) => {
        setState(prev => {
            const newTabs = prev.browserTabs.filter(t => t.id !== id);
            let newActiveId = prev.activeTabId;
            if (prev.activeTabId === id) {
                newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
            }
            if (newTabs.length === 0) {
                return {...prev, browserTabs: [], activeTabId: null, activeWindow: null};
            }
            return {...prev, browserTabs: newTabs, activeTabId: newActiveId};
        });
    }, []);
    
    const handleBrowserSetActiveTab = useCallback((id: number) => {
        setState(prev => ({...prev, activeTabId: id}));
    }, []);
    
    const handleBrowserTabUpdate = useCallback((id: number, updates: Partial<BrowserTab>) => {
        setState(prev => ({
            ...prev,
            browserTabs: prev.browserTabs.map(tab => tab.id === id ? {...tab, ...updates} : tab)
        }));
    }, []);

    // --- FEATURE HANDLERS ---
    const handleOpenTroubleshooter = useCallback(() => {
        const scenarios = Object.values(TroubleshootingScenario).filter(v => typeof v === 'number') as TroubleshootingScenario[];
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const newHistoryEntry: ConnectionHistoryEntry = { timestamp: Date.now(), scenario: randomScenario };

        const defaultDevices: SimulatedDevice[] = [
            { id: 'bt', name: 'Bluetooth Adapter', icon: BluetoothIcon, isEnabled: true },
            { id: 'audio', name: 'Realtek Audio', icon: AudioIcon, isEnabled: true },
            { id: 'net', name: 'Intel(R) Wireless-AC', icon: NetworkIcon, isEnabled: true, isProblematic: false },
        ];
        
        let devicesForScenario = defaultDevices;
        if (randomScenario === TroubleshootingScenario.ADAPTER_DISABLED) {
            devicesForScenario = defaultDevices.map(d => d.id === 'net' ? { ...d, isEnabled: false, isProblematic: true } : d);
        }

        setState(prev => ({
            ...prev,
            activeWindow: 'settings',
            troubleshootingScenario: randomScenario,
            isInitialErrorVisible: false,
            connectionHistory: [...prev.connectionHistory, newHistoryEntry],
            isAirplaneModeOn: randomScenario === TroubleshootingScenario.AIRPLANE_MODE_ON,
            isProxyEnabled: randomScenario === TroubleshootingScenario.PROXY_WRONG,
            isDriverOutdated: randomScenario === TroubleshootingScenario.DRIVER_OUTDATED,
            simulatedDevices: devicesForScenario,
        }));
    }, []);

    const handleCloseSettings = useCallback((wasFixed: boolean) => {
        closeWindow('settings');
        if (wasFixed) {
            setState(prev => ({ ...prev, connectionStatus: ConnectionStatus.Connecting }));
            setTimeout(() => {
                setState(prev => ({ ...prev, connectionStatus: ConnectionStatus.Connected, isInitialErrorVisible: false }));
                addNotification('✅ Conexiune activă!', 'Sunteți conectat la internet.', 'success');
            }, 1000);
        }
    }, [closeWindow, addNotification]);

    const handleToggleVpn = useCallback(() => {
        if (state.vpnStatus === VpnStatus.Disconnected) {
            setState(prev => ({ ...prev, vpnStatus: VpnStatus.Connecting }));
            addNotification('VPN', 'Se conectează la serverul VPN...', 'info');
            setTimeout(() => {
                setState(prev => ({ ...prev, vpnStatus: VpnStatus.Connected }));
                addNotification('VPN Conectat', 'Conexiunea VPN a fost stabilită.', 'success');
            }, 2500);
        } else {
            setState(prev => ({ ...prev, vpnStatus: VpnStatus.Disconnected }));
            addNotification('VPN Deconectat', 'Conexiunea VPN a fost închisă.', 'info');
        }
    }, [state.vpnStatus, addNotification]);

    const handleAddNetwork = useCallback((newNetwork: WifiNetwork) => {
        if (state.networks.some(n => n.ssid === newNetwork.ssid)) {
            addNotification('Eroare', `Rețeaua "${newNetwork.ssid}" există deja.`, 'error');
            return;
        }
        setState(prev => ({ ...prev, networks: [...prev.networks, newNetwork] }));
        addNotification('Succes', `Rețeaua "${newNetwork.ssid}" a fost adăugată.`, 'success');
    }, [state.networks, addNotification]);

    const handleSearch = useCallback((query: string) => {
        const keywords = ['setări', 'network', 'internet', 'wifi', 'vpn', 'istoric'];
        if (keywords.some(k => query.toLowerCase().includes(k))) {
            handleOpenTroubleshooter();
        } else {
            openWindow('browser');
             setState(prev => {
                const newTab: BrowserTab = { id: Date.now(), title: `${query} - Căutare`, type: 'results', query };
                const newTabs = [...prev.browserTabs, newTab];
                return {...prev, browserTabs: newTabs, activeTabId: newTab.id};
             });
        }
    }, [handleOpenTroubleshooter, openWindow]);

    const handleToggleAirplaneMode = useCallback(() => setState(prev => ({ ...prev, isAirplaneModeOn: !prev.isAirplaneModeOn })), []);
    const handleToggleDeviceEnabled = useCallback((deviceId: string) => setState(prev => ({ ...prev, simulatedDevices: prev.simulatedDevices.map(d => d.id === deviceId ? { ...d, isEnabled: !d.isEnabled } : d) })), []);
    const setNetworks = useCallback((networks: WifiNetwork[]) => setState(prev => ({...prev, networks})), []);
    const setProxyEnabled = useCallback((enabled: boolean) => setState(prev => ({...prev, isProxyEnabled: enabled})), []);
    const setDriverOutdated = useCallback((outdated: boolean) => setState(prev => ({...prev, isDriverOutdated: outdated})), []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        ...state,
        setState,
        openWindow,
        closeWindow,
        toggleStartMenu,
        handleOpenTroubleshooter,
        handleCloseSettings,
        handleToggleDeviceEnabled,
        handleSearch,
        handleToggleAirplaneMode,
        handleBrowserTabUpdate,
        handleBrowserAddTab,
        handleBrowserCloseTab,
        handleBrowserSetActiveTab,
        handleToggleVpn,
        handleAddNetwork,
        setNetworks,
        setProxyEnabled,
        setDriverOutdated,
        addNotification,
        removeNotification,
    }), [state, openWindow, closeWindow, toggleStartMenu, handleOpenTroubleshooter, handleCloseSettings, handleToggleDeviceEnabled, handleSearch, handleToggleAirplaneMode, handleBrowserTabUpdate, handleBrowserAddTab, handleBrowserCloseTab, handleBrowserSetActiveTab, handleToggleVpn, handleAddNetwork, setNetworks, setProxyEnabled, setDriverOutdated, addNotification, removeNotification]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// 3. Create a custom hook for easy consumption
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};