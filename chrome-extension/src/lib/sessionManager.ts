import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const setSession = async (session: Session | null) => {
  await chrome.storage.local.set({ session });
};

export const clearSession = async () => {
  await chrome.storage.local.remove('session');
};

export const onSessionChange = (callback: (session: Session | null) => void) => {
  chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes.session) {
      callback(changes.session.newValue);
    }
  });
}; 