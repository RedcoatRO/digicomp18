import React from 'react';
import { InfoIcon } from './icons';

interface NetworkPropertiesViewProps {
    properties: Record<string, string>;
}

const NetworkPropertiesView: React.FC<NetworkPropertiesViewProps> = ({ properties }) => {
    return (
        <div>
            <div className="flex items-center space-x-2 mb-4">
                 <InfoIcon className="w-6 h-6 text-blue-500" />
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Proprietăți conexiune</h2>
            </div>

            <div className="bg-gray-100/50 dark:bg-white/5 rounded-lg p-4">
                <dl>
                    {Object.entries(properties).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-2 py-2 border-b border-gray-300/50 dark:border-white/10 last:border-b-0">
                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{key}:</dt>
                            <dd className="text-sm text-gray-900 dark:text-gray-200 sm:col-span-2 font-mono">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default React.memo(NetworkPropertiesView);