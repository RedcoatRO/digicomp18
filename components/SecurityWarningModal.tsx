import React, { useRef } from 'react';
import { WarningIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const SecurityWarningModal: React.FC = () => {
    const { securityWarningSsid, closeWindow, addNotification } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef);
    
    const handleConfirm = () => {
        addNotification("Conectare nesecurizată", `V-ați conectat la rețeaua nesecurizată ${securityWarningSsid}.`, 'info');
        closeWindow('securityWarning');
    };

    const handleCancel = () => {
        closeWindow('securityWarning');
    };

    return (
        <div role="alertdialog" aria-modal="true" aria-labelledby="security-warning-title" aria-describedby="security-warning-desc" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-50">
            <div ref={modalRef} className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                <div className="p-6 text-center">
                    <WarningIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 id="security-warning-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Avertisment de Securitate</h2>
                    <div id="security-warning-desc">
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Rețeaua "<span className="font-semibold">{securityWarningSsid}</span>" nu este securizată. Oricine din apropiere poate vedea informațiile pe care le trimiteți.
                        </p>
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
                            Doriți să vă conectați oricum?
                        </p>
                    </div>
                </div>
                <div className="bg-gray-200 dark:bg-gray-900/50 p-4 flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-700 rounded-md hover:bg-gray-300/50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Anulare
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Conectare
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SecurityWarningModal);