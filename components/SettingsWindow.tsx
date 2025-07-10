import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TroubleshootingStep, TroubleshootingScenario, SettingsPage, ConnectionStatus } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
    WifiIcon, LockIcon, ChevronRightIcon, SystemIcon, PersonalizationIcon, AppsIcon, LoadingSpinner, VpnIcon, HistoryIcon, AddIcon, InfoIcon
} from './icons';

import VpnSettingsView from './VpnSettingsView';
import NetworkPropertiesView from './NetworkPropertiesView';
import ConnectionHistoryView from './ConnectionHistoryView';

export const getScenarioDisplayName = (scenario: TroubleshootingScenario): string => {
    switch(scenario) {
        case TroubleshootingScenario.WIFI_PASSWORD: return "Problemă parolă Wi-Fi";
        case TroubleshootingScenario.IP_CONFLICT: return "Conflict de adresă IP";
        case TroubleshootingScenario.DNS_ISSUE: return "Problemă server DNS";
        case TroubleshootingScenario.AIRPLANE_MODE_ON: return "Mod Avion este activat";
        case TroubleshootingScenario.ADAPTER_DISABLED: return "Adaptor de rețea dezactivat";
        case TroubleshootingScenario.DRIVER_OUTDATED: return "Driver de rețea învechit";
        case TroubleshootingScenario.PROXY_WRONG: return "Server proxy configurat greșit";
        case TroubleshootingScenario.LIMITED_CONNECTIVITY: return "Conectivitate limitată";
        default: return "Problemă necunoscută";
    }
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, isActive?: boolean, onClick?: () => void }> = React.memo(({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 text-left ${isActive ? 'bg-blue-100 dark:bg-blue-500/30' : 'hover:bg-gray-300/60 dark:hover:bg-white/10'}`}>
        {icon}
        <span className={`text-sm ${isActive ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
    </button>
));

const SettingsWindow: React.FC = () => {
    const {
        closeWindow, handleCloseSettings, troubleshootingScenario, networks, setNetworks,
        isProxyEnabled, setProxyEnabled, isDriverOutdated, setDriverOutdated, 
        simulatedDevices, handleToggleDeviceEnabled, connectionStatus,
        openWindow, addNotification, vpnStatus, handleToggleVpn,
        connectionHistory
    } = useAppContext();

    const windowRef = useRef<HTMLDivElement>(null);
    useFocusTrap(windowRef);

    const [page, setPage] = useState<SettingsPage>(SettingsPage.TROUBLESHOOTER);
    const [step, setStep] = useState<TroubleshootingStep>(TroubleshootingStep.IDLE);
    const [isWifiOn, setIsWifiOn] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState<'idle' | 'incorrect' | 'correct'>('idle');
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const [diagLog, setDiagLog] = useState<string[]>([]);
    
    useEffect(() => {
        setIsWifiOn(true);
        setPage(SettingsPage.TROUBLESHOOTER);
        
        if(connectionStatus === ConnectionStatus.Connected) {
            setPage(SettingsPage.PROPERTIES);
            return;
        }

        switch(troubleshootingScenario) {
            case TroubleshootingScenario.ADAPTER_DISABLED: setStep(TroubleshootingStep.ADAPTER_CHECK); break;
            case TroubleshootingScenario.DRIVER_OUTDATED: setStep(TroubleshootingStep.DRIVER_UPDATE_CHECK); break;
            case TroubleshootingScenario.PROXY_WRONG: setStep(TroubleshootingStep.PROXY_CHECK); break;
            case TroubleshootingScenario.AIRPLANE_MODE_ON:
            case TroubleshootingScenario.IP_CONFLICT:
            case TroubleshootingScenario.DNS_ISSUE:
            case TroubleshootingScenario.LIMITED_CONNECTIVITY:
                setStep(TroubleshootingStep.AUTOMATIC_FIX); break;
            case TroubleshootingScenario.WIFI_PASSWORD:
            default:
                setIsWifiOn(false);
                setStep(TroubleshootingStep.WIFI_CHECK); break;
        }
    }, [troubleshootingScenario, connectionStatus]);

    const completeTroubleshooting = useCallback(() => {
        setStep(TroubleshootingStep.COMPLETE);
        const timer = setTimeout(() => handleCloseSettings(true), 2000);
        return () => clearTimeout(timer);
    }, [handleCloseSettings]);

    const handleWifiToggle = useCallback(() => {
        setIsWifiOn(true);
        setTimeout(() => setStep(TroubleshootingStep.PASSWORD_ENTRY), 1000);
    }, []);

    const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = 'password123';
        const network = networks.find(n => n.ssid === 'HomeWiFi');
        
        if (password !== (network?.savedPassword || correctPassword)) {
            setPasswordStatus('incorrect');
            return;
        }
        setPasswordStatus('correct');
        if (!network?.savedPassword) {
            const updatedNetworks = networks.map(n => n.ssid === 'HomeWiFi' ? { ...n, savedPassword: correctPassword } : n);
            setNetworks(updatedNetworks);
        }
        setTimeout(() => setStep(TroubleshootingStep.AUTOMATIC_FIX), 1000);
    }, [password, networks, setNetworks]);
    
    const handleEnableAdapter = useCallback(() => {
        const problematicDevice = simulatedDevices.find(d => d.isProblematic);
        if (problematicDevice) handleToggleDeviceEnabled(problematicDevice.id);
        setTimeout(() => setStep(TroubleshootingStep.AUTOMATIC_FIX), 1000);
    }, [simulatedDevices, handleToggleDeviceEnabled]);
    
    const runTroubleshooter = useCallback(() => {
        setIsDiagnosing(true);
        setDiagLog([]);
        const shouldFail = Math.random() < 0.3;
        
        const diagnosticSteps = shouldFail
            ? ["Identificare probleme...", "Resetare adaptor rețea...", "Eroare la resetarea stivei TCP/IP.", "❌ Depanarea nu a putut identifica problema."]
            : ["Identificare probleme...", "Resetare adaptor...", "Verificare IP...", "✅ Problema rezolvată!"];
        
        diagnosticSteps.forEach((log, index) => {
            setTimeout(() => {
                setDiagLog(prev => [...prev, log]);
                if (index === diagnosticSteps.length - 1) {
                    setIsDiagnosing(false);
                    if (shouldFail) {
                        setStep(TroubleshootingStep.FIX_FAILED);
                    } else {
                        completeTroubleshooting();
                    }
                }
            }, (index + 1) * 1500);
        });
    }, [completeTroubleshooting]);

    const networkProperties = {
      'SSID': 'HomeWiFi', 'Protocol': 'Wi-Fi 5 (802.11ac)', 'Tip de securitate': 'WPA2-Personal',
      'Producător': 'Intel Corporation', 'Descriere': 'Intel(R) Wireless-AC 9560 160MHz', 'Versiune driver': '22.150.1.1',
      'Adresă IPv4': '192.168.1.104', 'Servere DNS IPv4': '8.8.8.8, 8.8.4.4', 'Adresă fizică (MAC)': '9C-B6-D0-FF-C3-E8'
    };

    const renderTroubleshooterPage = () => {
        switch (step) {
            case TroubleshootingStep.IDLE: return <div className="flex justify-center items-center h-full"><LoadingSpinner className="w-10 h-10 text-blue-500" /></div>;
            case TroubleshootingStep.WIFI_CHECK:
                 return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Wi-Fi</h2>
                        <div className="bg-gray-100/50 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3"><WifiIcon className="w-6 h-6"/><p className="font-semibold">Wi-Fi</p></div>
                            <button onClick={handleWifiToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isWifiOn ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isWifiOn ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                );
            case TroubleshootingStep.PASSWORD_ENTRY:
                const homeWifi = networks.find(n => n.ssid === 'HomeWiFi');
                 return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Rețele disponibile</h2>
                            <button onClick={() => openWindow('addNetwork')} className="flex items-center space-x-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
                                <AddIcon className="w-4 h-4" />
                                <span>Adaugă o rețea</span>
                            </button>
                        </div>
                        {homeWifi && (
                             <div className="p-3 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-500/20">
                                <div className="flex items-center"><WifiIcon className="w-5 h-5"/><LockIcon className="w-4 h-4 absolute ml-[2px] mt-[1px]"/><span className="font-semibold ml-1">HomeWiFi</span></div>
                                <form onSubmit={handlePasswordSubmit} className="mt-3">
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Parolă rețea" required/>
                                    {passwordStatus === 'incorrect' && <p className="text-sm text-red-500 mt-1">Parolă incorectă!</p>}
                                    <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">Conectare</button>
                                </form>
                            </div>
                        )}
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Sfat: Parola pentru 'HomeWiFi' este salvată în fișierul deschis cu 'Parola WiFi.txt'.</p>
                    </div>
                );
            case TroubleshootingStep.ADAPTER_CHECK:
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Manager Dispozitive (Simulat)</h2>
                        <div className="bg-gray-100/50 dark:bg-white/5 rounded-lg p-4 space-y-2">
                           {simulatedDevices.map(device => (
                               <div key={device.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                   <div className="flex items-center space-x-3"><device.icon className="w-5 h-5" /> <p>{device.name}</p></div>
                                   {!device.isEnabled ? 
                                        <div className="flex items-center space-x-2">
                                            <span className="text-yellow-500 text-sm font-semibold">⚠ Dezactivat</span>
                                            {device.isProblematic && <button onClick={handleEnableAdapter} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md">Activează</button>}
                                        </div> 
                                        : <span className="text-green-500 text-sm font-semibold">✔ Activat</span>
                                   }
                               </div>
                           ))}
                        </div>
                    </div>
                );
             case TroubleshootingStep.AUTOMATIC_FIX:
                return (
                     <div>
                        <h2 className="text-xl font-semibold mb-4">Depanator de rețea</h2>
                        {!isDiagnosing && diagLog.length === 0 && (
                            <div className="text-center"><p className="mb-4">Sistemul a detectat probleme.</p><button onClick={runTroubleshooter} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md">Rulează depanatorul</button></div>
                        )}
                        {(isDiagnosing || diagLog.length > 0) && (
                            <div className="bg-gray-800 text-white font-mono text-sm rounded-lg p-4 h-48 overflow-y-auto"><pre className="whitespace-pre-wrap">{diagLog.join("\n")}</pre>{isDiagnosing && <div className="flex items-center space-x-2 mt-2"><LoadingSpinner className="w-4 h-4"/><span>Se analizează...</span></div>}</div>
                        )}
                    </div>
                );
            case TroubleshootingStep.FIX_FAILED:
                 return (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-red-500 mb-2">Depanarea a eșuat</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Nu am putut rezolva problema automat. Puteți încerca să contactați furnizorul de servicii de internet (ISP).</p>
                        <button onClick={() => openWindow('contactIsp')} className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600">
                            Contactează furnizorul (ISP)
                        </button>
                    </div>
                 );
            case TroubleshootingStep.COMPLETE:
                 return (
                    <div className="text-center py-10"><svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><h2 className="text-2xl font-semibold">Conexiune restabilită!</h2><p className="mt-2">Fereastra se va închide automat.</p></div>
                 );
            default:
                return <p>Pas neașteptat: {TroubleshootingStep[step]}</p>;
        }
    };
    
    const renderContent = () => {
        switch (page) {
            case SettingsPage.VPN:
                return <VpnSettingsView vpnStatus={vpnStatus} onToggleVpn={handleToggleVpn} />;
            case SettingsPage.PROPERTIES:
                return <NetworkPropertiesView properties={networkProperties} />;
            case SettingsPage.HISTORY:
                return <ConnectionHistoryView history={connectionHistory} getScenarioDisplayName={getScenarioDisplayName} />;
            case SettingsPage.TROUBLESHOOTER:
            default:
                return renderTroubleshooterPage();
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-40">
            <div ref={windowRef} className="w-full h-full sm:w-[1024px] sm:h-[700px] bg-gray-200/90 dark:bg-gray-900/80 backdrop-blur-2xl rounded-none sm:rounded-xl shadow-2xl flex flex-col sm:flex-row overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                <div className="w-full sm:w-64 bg-gray-200/80 dark:bg-black/20 p-4 space-y-1 border-b sm:border-r">
                    <SidebarItem icon={<WifiIcon className="w-5 h-5 text-blue-500"/>} label="Wi-Fi" isActive={page === SettingsPage.TROUBLESHOOTER} onClick={() => setPage(SettingsPage.TROUBLESHOOTER)} />
                    <SidebarItem icon={<VpnIcon className="w-5 h-5 text-blue-500"/>} label="VPN" isActive={page === SettingsPage.VPN} onClick={() => setPage(SettingsPage.VPN)} />
                    <SidebarItem icon={<HistoryIcon className="w-5 h-5 text-blue-500"/>} label="Istoric depanări" isActive={page === SettingsPage.HISTORY} onClick={() => setPage(SettingsPage.HISTORY)} />
                    {connectionStatus === ConnectionStatus.Connected && <SidebarItem icon={<InfoIcon className="w-5 h-5 text-blue-500"/>} label="Proprietăți" isActive={page === SettingsPage.PROPERTIES} onClick={() => setPage(SettingsPage.PROPERTIES)}/>}
                    <div className="pt-4 mt-4 border-t opacity-50">
                      <SidebarItem icon={<SystemIcon className="w-5 h-5"/>} label="System" />
                      <SidebarItem icon={<PersonalizationIcon className="w-5 h-5"/>} label="Personalization" />
                      <SidebarItem icon={<AppsIcon className="w-5 h-5"/>} label="Apps" />
                    </div>
                </div>

                <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-1 mb-2">
                        <span>Network & internet</span><ChevronRightIcon className="w-4 h-4"/>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {page === SettingsPage.TROUBLESHOOTER && 'Wi-Fi'}
                          {page === SettingsPage.VPN && 'VPN'}
                          {page === SettingsPage.HISTORY && 'Istoric depanări'}
                          {page === SettingsPage.PROPERTIES && 'Proprietăți'}
                        </span>
                    </div>
                    {page === SettingsPage.TROUBLESHOOTER && connectionStatus !== ConnectionStatus.Connected && (
                      <div className="mb-6 bg-blue-100 dark:bg-blue-900/50 border border-blue-700/50 text-blue-800 dark:text-blue-200 text-sm font-semibold px-3 py-1.5 rounded-md">Scenariu activ: {getScenarioDisplayName(troubleshootingScenario)}</div>
                    )}

                    {renderContent()}
                </div>
                
                <button onClick={() => handleCloseSettings(false)} aria-label="Închide fereastra de setări" className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default React.memo(SettingsWindow);