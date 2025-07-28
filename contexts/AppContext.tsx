import React, { createContext, useState, useEffect, useContext, useMemo, useCallback, ReactNode } from 'react';
import { 
    AppState, AppContextType, ConnectionStatus, TroubleshootingScenario, WifiNetwork, 
    BrowserTab, SimulatedDevice, ConnectionHistoryEntry, VpnStatus, ActiveWindow,
    Notification, NotificationType, ActionType, ActionLogEntry, EvaluationResult
} from '../types';
import { BluetoothIcon, AudioIcon, NetworkIcon } from '../components/icons';
import { calculateScore } from '../utils/evaluation';
import { sendEvaluationResult } from '../utils/communication';

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
            // Evaluation state
            actions: [],
            score: 100,
            isEvaluationModalOpen: false,
            evaluationResult: null,
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
                    isEvaluationModalOpen: false,
                    simulatedDevices: defaultState.simulatedDevices,
                    notifications: [],
                    actions: [], // Reset actions on reload
                    score: 100,
                };
            }
        } catch (error) { console.error("Failed to parse state from localStorage", error); }
        return defaultState;
    });

    // Effect to calculate live score whenever actions change
    useEffect(() => {
        // Don't calculate score if evaluation is finished
        if (state.isEvaluationModalOpen) return;
        
        const liveScoreResult = calculateScore(state.actions, state, true);
        setState(prev => ({ ...prev, score: liveScoreResult.score }));
    }, [state.actions, state.isEvaluationModalOpen]);

    // --- NOTIFICATION HANDLERS (integrated from NotificationContext) ---
    const removeNotification = useCallback((id: number) => {
        setState(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.id !== id) }));
    }, []);

    const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
        const id = Date.now();
        setState(prev => ({ ...prev, notifications: [...prev.notifications, { id, title, message, type }] }));
        setTimeout(() => removeNotification(id), 5000);
    }, [removeNotification]);
    
    // --- EVALUATION HANDLERS ---
    const logAction = useCallback((type: ActionType, payload?: any) => {
        // Prevent logging actions after evaluation is complete
        if (state.isEvaluationModalOpen) return;
        
        const entry: ActionLogEntry = { type, payload, timestamp: Date.now() };
        setState(prev => ({ ...prev, actions: [...prev.actions, entry] }));
    }, [state.isEvaluationModalOpen]);

    const requestHint = useCallback(() => {
        logAction(ActionType.REQUEST_HINT);
        let hint = "Încearcă să folosești depanatorul de probleme de rețea din Setări.";
        switch (state.troubleshootingScenario) {
            case TroubleshootingScenario.WIFI_PASSWORD:
                hint = "Verifică dacă ai introdus parola corectă. Poți găsi parola în fișierul 'Parola WiFi.txt'.";
                break;
            case TroubleshootingScenario.ADAPTER_DISABLED:
                hint = "Adaptorul de rețea ar putea fi dezactivat. Verifică în setările Wi-Fi sau în Manager Dispozitive.";
                break;
            case TroubleshootingScenario.AIRPLANE_MODE_ON:
                hint = "Modul Avion este activat. Acesta oprește toate comunicațiile wireless. Îl poți dezactiva din meniul rapid.";
                break;
        }
        addNotification("Indiciu", hint, "info");
    }, [state.troubleshootingScenario, addNotification, logAction]);

    const finishEvaluation = useCallback(() => {
        const result = calculateScore(state.actions, state, false);
        setState(prev => ({
            ...prev,
            isEvaluationModalOpen: true,
            evaluationResult: result,
            score: result.score
        }));

        // Format details for postMessage
        const detailsString = result.details.map(d => `${d.correct ? '[CORECT]' : '[INCORECT]'} ${d.text}`).join('\n');
        
        sendEvaluationResult(
            result.score,
            result.maxScore,
            detailsString,
            result.tasksCompleted,
            result.totalTasks
        );
    }, [state.actions, state]);


    // --- WINDOW MANAGEMENT ---
    const openWindow = useCallback((window: NonNullable<ActiveWindow>) => {
        logAction(ActionType.OPEN_WINDOW, { window });
        if (window === 'browser' && state.connectionStatus !== ConnectionStatus.Connected) {
            addNotification("Eroare", "Browser-ul necesită o conexiune la internet.", "error");
            return;
        }
        setState(prev => ({...prev, activeWindow: window}));
        if(window === 'browser' && state.browserTabs.length === 0) {
            const newTab: BrowserTab = { id: Date.now(), title: 'Google', type: 'search' };
            setState(prev => ({...prev, browserTabs: [newTab], activeTabId: newTab.id}));
        }
    }, [state.connectionStatus, state.browserTabs.length, addNotification, logAction]);

    const closeWindow = useCallback((window: NonNullable<ActiveWindow>) => {
        logAction(ActionType.CLOSE_WINDOW, { window });
        setState(prev => prev.activeWindow === window ? { ...prev, activeWindow: null } : prev);
    }, [logAction]);

    const toggleStartMenu = useCallback(() => {
        logAction(ActionType.TOGGLE_START_MENU);
        setState(prev => ({ ...prev, activeWindow: prev.activeWindow === 'startMenu' ? null : 'startMenu' }));
    }, [logAction]);

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
        // This is the start of a new attempt, but we don't clear actions to see full history
        // If we wanted to reset, we would clear actions here.
        
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

        openWindow('settings');
        setState(prev => ({
            ...prev,
            troubleshootingScenario: randomScenario,
            isInitialErrorVisible: false,
            connectionHistory: [...prev.connectionHistory, newHistoryEntry],
            isAirplaneModeOn: randomScenario === TroubleshootingScenario.AIRPLANE_MODE_ON,
            isProxyEnabled: randomScenario === TroubleshootingScenario.PROXY_WRONG,
            isDriverOutdated: randomScenario === TroubleshootingScenario.DRIVER_OUTDATED,
            simulatedDevices: devicesForScenario,
        }));
    }, [openWindow]);

    const handleCloseSettings = useCallback((wasFixed: boolean) => {
        closeWindow('settings');
        if (wasFixed) {
            logAction(ActionType.FIX_CONNECTION_SUCCESS);
            setState(prev => ({ ...prev, connectionStatus: ConnectionStatus.Connecting }));
            setTimeout(() => {
                setState(prev => ({ ...prev, connectionStatus: ConnectionStatus.Connected, isInitialErrorVisible: false }));
                addNotification('✅ Conexiune activă!', 'Sunteți conectat la internet.', 'success');
            }, 1000);
        }
    }, [closeWindow, addNotification, logAction]);

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
        logAction(ActionType.SEARCH, { query });
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
    }, [handleOpenTroubleshooter, openWindow, logAction]);

    const handleToggleAirplaneMode = useCallback(() => {
        logAction(ActionType.TOGGLE_AIRPLANE_MODE);
        setState(prev => ({ ...prev, isAirplaneModeOn: !prev.isAirplaneModeOn }));
    }, [logAction]);

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
        // Evaluation
        logAction,
        requestHint,
        finishEvaluation
    }), [state, openWindow, closeWindow, toggleStartMenu, handleOpenTroubleshooter, handleCloseSettings, handleToggleDeviceEnabled, handleSearch, handleToggleAirplaneMode, handleBrowserTabUpdate, handleBrowserAddTab, handleBrowserCloseTab, handleBrowserSetActiveTab, handleToggleVpn, handleAddNetwork, setNetworks, setProxyEnabled, setDriverOutdated, addNotification, removeNotification, logAction, requestHint, finishEvaluation]);

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