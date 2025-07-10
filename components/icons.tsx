

import React from 'react';

// Generic Icon for theme toggling
export const SunIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
export const MoonIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);


// --- Fluent-style Icons ---

export const WifiIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 14a1 1 0 100-2 1 1 0 000 2z" />
    <path fillRule="evenodd" d="M14.39 8.33a.75.75 0 01.02 1.06l-.02.02a6.5 6.5 0 01-8.78 0l-.02-.02a.75.75 0 011.08-1.04l.02.02a5 5 0 016.74 0l.02-.02a.75.75 0 011.04-.02z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M17.53 5.19a.75.75 0 01.07 1.06l-.07.07a10.5 10.5 0 01-15 0l-.07-.07a.75.75 0 011.06-1.06l.07.07a9 9 0 0112.86 0l.07-.07a.75.75 0 011.06-.07z" clipRule="evenodd" />
  </svg>
);

export const WifiOffIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
);

export const BluetoothIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 7 10 10-5 5V2l5 5L7 17" />
  </svg>
);

export const AirplaneModeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-1-3 0-4.5 1.5L13 8 4.8 6.2" /><path d="m5 2 2.5 2.5" /><path d="M13 8V2l8 5-6 6" />
  </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const SystemIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M8 21h8"></path><line x1="12" y1="18" x2="12" y2="21"></line></svg>);
export const DevicesIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 10h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1Zm0-8H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path></svg>);
export const NetworkIcon = ({ className }: { className?: string }) => WifiIcon({className}); // Re-use the main wifi icon
export const PersonalizationIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19.4 7.3-3.1-3.1.9-.9c.4-.4 1.2-.4 1.6 0l1.6 1.6c.4.4.4 1.2 0 1.6l-.9.9Z"></path><path d="m10.3 12.8-5.3 5.3H3v-2.1l5.3-5.3 2 2.1Z"></path><path d="M12.8 10.3 18 5.1"></path><path d="M9 21h12"></path></svg>);
export const AppsIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="8" height="8" rx="1"></rect><rect x="13" y="3" width="8" height="8" rx="1"></rect><rect x="3" y="13" width="8" height="8" rx="1"></rect><rect x="13" y="13" width="8" height="8" rx="1"></rect></svg>);
export const AccountsIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18.364 18.364A9 9 0 1 0 5.636 5.636a9 9 0 0 0 12.728 12.728Z"></path><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M12 15c-3.333 0-5 1.667-5 2.5V19h10v-1.5c0-.833-1.667-2.5-5-2.5Z"></path></svg>);
export const TimeLangIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path><path d="M7.6 15.9 4 12l3.6-3.9M16.4 15.9 20 12l-3.6-3.9"></path><path d="M12 4v16M4 12h16"></path></svg>);
export const GamingIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19.23 6.62C18.2 5.92 17.02 5.5 15.75 5.5H8.25C5.9 5.5 4 7.4 4 9.75v4.5C4 16.6 5.9 18.5 8.25 18.5h7.5c2.35 0 4.25-1.9 4.25-4.25v-3c0-1.28-.42-2.45-1.27-3.63Z"></path><path d="M8.5 10.5h1v-1h-1v1Zm6 3h1v-1h-1v1Z"></path><path d="m11.5 8.5-3 3"></path></svg>);
export const AccessibilityIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M21.5 13.6c-1.3-4.1-5-7.1-9.5-7.1s-8.2 3-9.5 7.1"></path><path d="M5.5 16.8c1.3 1.9 3.4 3.2 5.7 3.2h1.6c2.3 0 4.4-1.3 5.7-3.2"></path></svg>);
export const PrivacyIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path><path d="M12 15a4 4 0 0 0 4-4V8.5A4 4 0 1 0 8 8.5V11a4 4 0 0 0 4 4Z"></path></svg>);
export const WindowsUpdateIcon = ({ className }: { className?: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 12a9.5 9.5 0 1 1-9.5-9.5"></path><path d="M12 2v4"></path><path d="m15.5 4.5-2 2"></path><path d="M12 22a9.47 9.47 0 0 1-5.13-1.49L12 15.37V2Z"></path></svg>);

export const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const LoadingSpinner = ({ className }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const TextDocumentIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.198 0l7.599 13.16a3 3 0 01-2.599 4.5H4.401a3 3 0 01-2.599-4.5l7.599-13.16zM12 16a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

// --- Browser and Scenario Icons ---

export const BrowserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 18 15.3 15.3 0 0 1-8 0 15.3 15.3 0 0 1 4-18z" />
  </svg>
);

export const ProxyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 10a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-8Z"/>
    <path d="M4 14a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v4Z"/>
    <path d="M8 12h1"/>
    <path d="M12 12V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3Z"/>
    <path d="M18 15a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v6Z"/>
  </svg>
);

export const UpdateDriverIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4V2"/>
        <path d="M12 10v-1"/>
        <path d="m15 7-1-1"/>
        <path d="m9 7 1-1"/>
        <path d="M12 22a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7v2Z"/>
        <path d="M3 13a9 9 0 0 0 9 9v-2a7 7 0 0 1-7-7H3Z"/>
        <path d="M13 3a9 9 0 0 0-9 9h2a7 7 0 0 1 7-7V3Z"/>
        <path d="M11 14h2v2h-2z"/>
        <path d="M12 12h.01"/>
    </svg>
);

export const DinoIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 12V8a1 1 0 0 0-1-1H9.5a2.5 2.5 0 1 0 0 5H11"/>
        <path d="M18 13.5a1.5 1.5 0 0 1 0 3H4.5a1.5 1.5 0 0 1 0-3H5"/>
        <path d="M19 12a7 7 0 0 0-14 0h14Z"/>
        <path d="M6.5 16.5v-3"/>
        <path d="M9 16.5v-3"/>
        <path d="M11.5 16.5v-3"/>
    </svg>
);

export const TerminalIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

export const AudioIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

// --- NEW ICONS FOR NEW FEATURES ---

export const VpnIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 11.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        <path d="M16.5 11.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5"/>
        <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z"/>
    </svg>
);

export const HistoryIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v5h5"/>
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    </svg>
);

export const SupportIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

export const AddIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const InfoIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);
