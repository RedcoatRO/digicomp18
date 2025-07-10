import React, { useState, useRef } from 'react';
import { WifiNetwork } from '../types';
import { AddIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const AddNetworkModal: React.FC = () => {
    const { closeWindow, handleAddNetwork } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef);
    
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ssid) return;
        
        const newNetwork: WifiNetwork = {
            ssid,
            signal: 'Puternic',
            isSecure,
            savedPassword: isSecure ? password : undefined,
        };
        
        handleAddNetwork(newNetwork);
        closeWindow('addNetwork');
    };

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="add-network-title" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-50">
            <div ref={modalRef} className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <AddIcon className="w-6 h-6 text-blue-500" />
                            <h2 id="add-network-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Adaugă o rețea Wi-Fi</h2>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="ssid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nume rețea (SSID)</label>
                            <input
                                type="text" id="ssid" value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                required
                            />
                        </div>
                        
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox" id="isSecure" checked={isSecure}
                                onChange={(e) => setIsSecure(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="isSecure" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Rețea securizată</label>
                        </div>

                        {isSecure && (
                             <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parolă</label>
                                <input
                                    type="password" id="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-900/50 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => closeWindow('addNetwork')} className="px-5 py-2 text-sm font-semibold rounded-md hover:bg-gray-300/50">Anulare</button>
                        <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Adaugă</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(AddNetworkModal);