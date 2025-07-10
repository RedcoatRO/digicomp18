import React from 'react';
import { ConnectionHistoryEntry, TroubleshootingScenario } from '../types';
import { HistoryIcon } from './icons';

interface ConnectionHistoryViewProps {
    history: ConnectionHistoryEntry[];
    getScenarioDisplayName: (scenario: TroubleshootingScenario) => string;
}

const ConnectionHistoryView: React.FC<ConnectionHistoryViewProps> = ({ history, getScenarioDisplayName }) => {
    return (
        <div>
             <div className="flex items-center space-x-2 mb-4">
                 <HistoryIcon className="w-6 h-6 text-blue-500" />
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Istoric depanări</h2>
            </div>
            
            {history.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Nu au fost înregistrate probleme de conexiune.</p>
            ) : (
                <div className="bg-gray-100/50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Mai jos este un grafic simplificat al problemelor de rețea care au necesitat depanare.</p>
                    
                    {/* Simple bar chart simulation using flexbox */}
                    <div className="w-full h-48 bg-gray-200/50 dark:bg-gray-800/50 rounded-md p-2 flex items-end justify-start gap-2 overflow-x-auto">
                        {history.map(entry => (
                            <div 
                                key={entry.timestamp} 
                                className="group relative flex-shrink-0 w-8 h-full flex flex-col justify-end"
                                title={`${new Date(entry.timestamp).toLocaleString()}\nProblemă: ${getScenarioDisplayName(entry.scenario)}`}
                            >
                                <div className="w-full bg-yellow-400 dark:bg-yellow-500 rounded-t-sm hover:opacity-80 transition-all" style={{ height: `${Math.max(20, Math.random() * 90)}%` }}></div>
                                {/* Tooltip visible on hover */}
                                <div className="absolute bottom-full mb-2 w-48 p-2 text-xs text-white bg-black/70 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="font-bold">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                                    <p>{getScenarioDisplayName(entry.scenario)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Treceți cursorul peste bare pentru detalii.</div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ConnectionHistoryView);