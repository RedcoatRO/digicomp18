
import React from 'react';
import { DinoIcon } from '../icons';

export const NoConnectionPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-8">
            <div className="flex items-center space-x-4 mb-6">
                <DinoIcon className="w-16 h-16" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Fără conexiune la internet</h1>
                    <p>Încercați următoarele:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                        <li>Verificați cablurile de rețea, modemul și ruterul</li>
                        <li>Reconectați-vă la Wi-Fi</li>
                        <li>Rulați Diagnosticul de rețea Windows</li>
                    </ul>
                    <p className="text-xs mt-1">ERR_INTERNET_DISCONNECTED</p>
                </div>
            </div>
        </div>
    );
};
