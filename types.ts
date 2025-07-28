import React from 'react';

export enum ConnectionStatus {
  Connected,
  Disconnected,
  Connecting
}

// Defines the possible random scenarios for the troubleshooter
export enum TroubleshootingScenario {
  WIFI_PASSWORD,
  IP_CONFLICT,
  DNS_ISSUE,
  AIRPLANE_MODE_ON,
  ADAPTER_DISABLED,
  DRIVER_OUTDATED,
  PROXY_WRONG,
  LIMITED_CONNECTIVITY,
}

export enum TroubleshootingStep {
  WIFI_CHECK,
  PASSWORD_ENTRY,
  ADAPTER_CHECK,
  AUTOMATIC_FIX,
  COMPLETE,
  IDLE,
  FORGET_NETWORK_CONFIRM,
  PROXY_CHECK,
  DRIVER_UPDATE_CHECK,
  FIX_FAILED,
  CONTACT_ISP_FORM,
}

// Defines the pages available in the Settings > Network & Internet section
export enum SettingsPage {
  TROUBLESHOOTER,
  VPN,
  PROPERTIES,
  HISTORY,
}

// Defines the simulated VPN connection status
export enum VpnStatus {
  Disconnected,
  Connecting,
  Connected,
}

// Defines the structure for a Wi-Fi network object
export interface WifiNetwork {
    ssid: string;
    signal: 'Puternic' | 'Slab';
    isSecure: boolean;
    savedPassword?: string;
    isConnecting?: boolean;
}

// Defines the structure for a single browser tab
export interface BrowserTab {
    id: number;
    title: string;
    type: 'search' | 'results';
    query?: string;
}

// Defines the structure for a simulated device in the Device Manager
export interface SimulatedDevice {
    id: string;
    name: string;
    icon: (props: { className?: string }) => React.ReactElement;
    isEnabled: boolean;
    isProblematic?: boolean;
}

// Defines the structure for a connection history entry
export interface ConnectionHistoryEntry {
  timestamp: number;
  scenario: TroubleshootingScenario;
}

// A unified type for identifying the currently active window/modal
export type ActiveWindow = 
  | 'settings'
  | 'wordpad'
  | 'terminal'
  | 'browser'
  | 'addNetwork'
  | 'contactIsp'
  | 'securityWarning'
  | 'startMenu'
  | 'evaluation'
  | null;

// --- Types for Notifications ---
export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
}


// --- Types for Evaluation System ---

export enum ActionType {
  OPEN_WINDOW,
  CLOSE_WINDOW,
  TOGGLE_START_MENU,
  TOGGLE_AIRPLANE_MODE,
  SUBMIT_WIFI_PASSWORD,
  ENABLE_ADAPTER,
  RUN_TROUBLESHOOTER,
  CONTACT_ISP,
  FIX_CONNECTION_SUCCESS,
  REQUEST_HINT,
  SEARCH,
}

export interface ActionLogEntry {
  type: ActionType;
  payload?: any;
  timestamp: number;
}

export interface EvaluationDetail {
    text: string;
    correct: boolean;
}

export interface EvaluationResult {
    score: number;
    maxScore: number;
    details: EvaluationDetail[];
    tasksCompleted: number;
    totalTasks: number;
    summary: string;
}

// --- Types for the main Application State and Context ---

export interface AppState {
  connectionStatus: ConnectionStatus;
  activeWindow: ActiveWindow;
  isInitialErrorVisible: boolean;
  troubleshootingScenario: TroubleshootingScenario;
  networks: WifiNetwork[];
  isAirplaneModeOn: boolean;
  isProxyEnabled: boolean;
  isDriverOutdated: boolean;
  browserTabs: BrowserTab[];
  activeTabId: number | null;
  simulatedDevices: SimulatedDevice[];
  vpnStatus: VpnStatus;
  connectionHistory: ConnectionHistoryEntry[];
  securityWarningSsid: string | null;
  notifications: Notification[];
  // Evaluation state
  actions: ActionLogEntry[];
  score: number;
  isEvaluationModalOpen: boolean;
  evaluationResult: EvaluationResult | null;
}

export interface AppContextType extends AppState {
    // State updaters
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    
    // Handlers
    openWindow: (window: NonNullable<ActiveWindow>) => void;
    closeWindow: (window: NonNullable<ActiveWindow>) => void;
    toggleStartMenu: () => void;
    
    handleOpenTroubleshooter: () => void;
    handleCloseSettings: (wasFixed: boolean) => void;
    handleToggleDeviceEnabled: (deviceId: string) => void;
    
    handleSearch: (query: string) => void;
    handleToggleAirplaneMode: () => void;
    
    // Browser handlers
    handleBrowserTabUpdate: (id: number, updates: Partial<BrowserTab>) => void;
    handleBrowserAddTab: () => void;
    handleBrowserCloseTab: (id: number) => void;
    handleBrowserSetActiveTab: (id: number) => void;
    
    // New feature handlers
    handleToggleVpn: () => void;
    handleAddNetwork: (network: WifiNetwork) => void;
    
    // Networks
    setNetworks: (networks: WifiNetwork[]) => void;
    setProxyEnabled: (enabled: boolean) => void;
    setDriverOutdated: (outdated: boolean) => void;
    
    // Notifications
    addNotification: (title: string, message: string, type: NotificationType) => void;
    removeNotification: (id: number) => void;

    // Evaluation handlers
    logAction: (type: ActionType, payload?: any) => void;
    requestHint: () => void;
    finishEvaluation: () => void;
}