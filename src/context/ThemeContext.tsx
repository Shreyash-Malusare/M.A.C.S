import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeKeys = {
  light: 'light',
  dark: 'dark',
} as const;

function getSystemPreference(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? themeKeys.dark 
    : themeKeys.light;
}

function getInitialTheme(): Theme {
  // Check localStorage first
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === themeKeys.dark || storedTheme === themeKeys.light) {
    return storedTheme;
  }
  
  // Fallback to system preference
  return getSystemPreference();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDarkMode = theme === themeKeys.dark;

  useEffect(() => {
    // Update DOM and localStorage
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle(themeKeys.dark, isDarkMode);
    
    // Cleanup on unmount
    return () => document.documentElement.classList.remove(themeKeys.dark);
  }, [theme, isDarkMode]);

  const toggleTheme = () => {
    setTheme(prev => prev === themeKeys.light ? themeKeys.dark : themeKeys.light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}