import React, { useState, useEffect, memo } from 'react';
import { useAppContext } from '../contexts/AppContext';

const NotificationToast = memo(({ id, title, message, type, onDismiss }: { id: number, title: string, message: string, type: string, onDismiss: (id: number) => void }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const exitTimer = setTimeout(() => onDismiss(id), 300); // Match animation duration
            return () => clearTimeout(exitTimer);
        }, 4700); // Start exit animation just before removal
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(id), 300);
    };

    const typeClasses = {
        success: 'border-green-500 text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-900/80',
        error: 'border-red-500 text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/80',
        info: 'border-blue-500 text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/80',
    };

    return (
        <div 
            role="alert"
            className={`relative w-80 max-w-sm rounded-md shadow-lg p-4 border-l-4 backdrop-blur-sm mb-3 transition-all duration-300 ${typeClasses[type]} ${isExiting ? 'animate-out-up' : 'animate-fade-in-up'}`}
        >
            <button 
                onClick={handleDismiss} 
                aria-label={`Închide notificarea: ${title}`}
                className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <p className="font-bold">{title}</p>
            <p className="text-sm">{message}</p>
        </div>
    );
});


export const NotificationHost: React.FC = memo(() => {
    const { notifications, removeNotification } = useAppContext();

    return (
        <div className="fixed top-5 right-5 z-50">
            {notifications.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    id={notification.id}
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onDismiss={removeNotification}
                />
            ))}
        </div>
    );
});