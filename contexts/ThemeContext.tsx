import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

// Define the shape of the context data
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the provider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides theme state (light/dark) to its children.
 * It also handles persisting the theme to localStorage and
 * applying the 'dark' class to the root HTML element.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or system preference, default to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
        console.error("Could not access localStorage to get theme.", e);
    }
    return 'light';
  });

  // Effect to apply theme class to HTML element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.error("Could not access localStorage to set theme.", e);
    }
  }, [theme]);

  // Function to toggle the theme, wrapped in useCallback for performance
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to easily access the theme context.
 * Throws an error if used outside of a ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};