import React, { Suspense } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useAppContext } from './contexts/AppContext';

import Taskbar from './components/Taskbar';
import { NotificationHost } from './components/NotificationHost';
import { LoadingSpinner } from './components/icons';

// Lazy load all major window/modal components
const SettingsWindow = React.lazy(() => import('./components/SettingsWindow'));
const WordpadWindow = React.lazy(() => import('./components/WordpadWindow'));
const TerminalWindow = React.lazy(() => import('./components/TerminalWindow'));
const BrowserWindow = React.lazy(() => import('./components/BrowserWindow'));
const AddNetworkModal = React.lazy(() => import('./components/AddNetworkModal'));
const ContactIspModal = React.lazy(() => import('./components/ContactIspModal'));
const SecurityWarningModal = React.lazy(() => import('./components/SecurityWarningModal'));
const StartMenu = React.lazy(() => import('./components/StartMenu'));
const EvaluationModal = React.lazy(() => import('./components/EvaluationModal'));


const App: React.FC = () => {
  const { theme } = useTheme();
  const { 
    activeWindow, 
    isInitialErrorVisible, 
    handleOpenTroubleshooter,
    isEvaluationModalOpen,
  } = useAppContext();

  const backgroundImageUrl = theme === 'light' 
    ? "url('https://picsum.photos/seed/windows11light/1920/1080')"
    : "url('https://picsum.photos/seed/windows11dark/1920/1080')";

  const renderActiveWindow = () => {
    // The evaluation modal is special and can overlay other windows.
    // It's handled separately.
    switch (activeWindow) {
      case 'settings': return <SettingsWindow />;
      case 'wordpad': return <WordpadWindow />;
      case 'terminal': return <TerminalWindow />;
      case 'browser': return <BrowserWindow />;
      case 'addNetwork': return <AddNetworkModal />;
      case 'contactIsp': return <ContactIspModal />;
      case 'securityWarning': return <SecurityWarningModal />;
      case 'startMenu': return <StartMenu />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-cover bg-center">
      
      {isInitialErrorVisible && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center animate-fade-in z-20">
          <div className="relative bg-white/80 dark:bg-gray-800/80 p-8 text-center shadow-2xl max-w-md w-full rounded-lg">
            <h1 className="text-5xl mb-4">❌</h1>
            <h2 className="text-2xl font-bold">Nu există conexiune la Internet</h2>
            <button onClick={handleOpenTroubleshooter} className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500">
              Depanare conexiune
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner className="w-12 h-12 text-white" />
        </div>
      }>
        {renderActiveWindow()}
        {isEvaluationModalOpen && <EvaluationModal />}
      </Suspense>

      <NotificationHost />
      <Taskbar />
      
      <style>{`
        body { background-image: ${backgroundImageUrl}; background-size: cover; background-position: center; }
        @keyframes animate-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: animate-fade-in 0.3s ease-out forwards; }
        @keyframes animate-fade-in-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: animate-fade-in-up 0.25s ease-out forwards; }
        @keyframes animate-out-up { to { opacity: 0; transform: translateY(-20px); } }
        .animate-out-up { animation: animate-out-up 0.3s ease-in forwards; }
        /* Focus outline for accessibility */
        *:focus-visible {
          outline: 2px solid #3b82f6; /* Tailwind's blue-500 */
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default App;