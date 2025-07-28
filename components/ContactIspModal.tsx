import React, { useState, useRef } from 'react';
import { ActionType } from '../types';
import { SupportIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const ContactIspModal: React.FC = () => {
    const { closeWindow, logAction } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef);

    const [name, setName] = useState('Utilizator');
    const [issue, setIssue] = useState('Fără conexiune la internet.');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        logAction(ActionType.CONTACT_ISP);
        setIsSubmitted(true);
        setTimeout(() => {
            closeWindow('contactIsp');
        }, 3000);
    };

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="isp-modal-title" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-50">
            <div ref={modalRef} className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <SupportIcon className="w-6 h-6 text-blue-500" />
                                <h2 id="isp-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">Contactează Suportul ISP</h2>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Completează detaliile de mai jos pentru a trimite o cerere de suport.</p>
                            
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numele tău</label>
                                <input
                                    type="text" id="name" value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="issue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrierea problemei</label>
                                <textarea
                                    id="issue" rows={3} value={issue}
                                    onChange={(e) => setIssue(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-900/50 p-4 flex justify-end space-x-3">
                            <button type="button" onClick={() => closeWindow('contactIsp')} className="px-5 py-2 text-sm font-semibold rounded-md hover:bg-gray-300/50">Anulare</button>
                            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Trimite</button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center">
                        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cerere Trimisă</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Cererea ta de suport a fost înregistrată. Un tehnician te va contacta în curând.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ContactIspModal);