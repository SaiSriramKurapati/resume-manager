"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AlertState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // milliseconds
}

interface AlertContextType {
  alert: AlertState | null;
  showAlert: (message: string, type?: AlertState['type'], duration?: number) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showAlert = (message: string, type: AlertState['type'] = 'info', duration: number = 3000) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setAlert({ message, type, duration });

    // Set new timeout to hide alert
    const id = setTimeout(() => {
      setAlert(null);
    }, duration);
    setTimeoutId(id);
  };

  const hideAlert = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setAlert(null);
    setTimeoutId(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 