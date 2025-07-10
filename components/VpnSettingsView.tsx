import React from 'react';
import { VpnStatus } from '../types';
import { LoadingSpinner, VpnIcon } from './icons';

interface VpnSettingsViewProps {
    vpnStatus: VpnStatus;
    onToggleVpn: () => void;
}

const vpnServers = [
    { name: 'Romania - Bucharest', flag: '🇷🇴' },
    { name: 'Germany - Frankfurt', flag: '🇩🇪' },
    { name: 'USA - New York', flag: '🇺🇸' },
];

const VpnSettingsView: React.FC<VpnSettingsViewProps> = ({ vpnStatus, onToggleVpn }) => {

    const getStatusInfo = () => {
        switch (vpnStatus) {
            case VpnStatus.Connected:
                return { text: 'Conectat', color: 'text-green-500', buttonText: 'Deconectare' };
            case VpnStatus.Connecting:
                return { text: 'Conectare...', color: 'text-yellow-500', buttonText: 'Anulare' };
            case VpnStatus.Disconnected:
            default:
                return { text: 'Deconectat', color: 'text-gray-500', buttonText: 'Conectare' };
        }
    };

    const { text, color, buttonText } = getStatusInfo();
    const isConnectedOrConnecting = vpnStatus === VpnStatus.Connected || vpnStatus === VpnStatus.Connecting;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Conexiune VPN</h2>
            
            <div className="bg-gray-100/50 dark:bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <VpnIcon className={`w-6 h-6 ${color}`} />
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Stare VPN</p>
                            <p className={`text-sm font-medium ${color}`}>{text}</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleVpn}
                        disabled={vpnStatus === VpnStatus.Connecting}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {vpnStatus === VpnStatus.Connecting ? <LoadingSpinner className="w-5 h-5" /> : buttonText}
                    </button>
                </div>
                {isConnectedOrConnecting && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-gray-300/50 dark:border-white/10">
                        Conectat la: <span className="font-semibold">{vpnServers[0].flag} {vpnServers[0].name}</span>
                    </p>
                )}
            </div>

            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Listă servere (simulat)</h3>
            <div className="space-y-2">
                {vpnServers.map((server, index) => (
                    <div key={server.name} className={`flex items-center justify-between p-3 rounded-md ${index === 0 && isConnectedOrConnecting ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100/50 dark:bg-white/5'}`}>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{server.flag} {server.name}</span>
                        {index === 0 && isConnectedOrConnecting && <span className="text-sm font-bold text-green-600 dark:text-green-400">ACTIV</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(VpnSettingsView);