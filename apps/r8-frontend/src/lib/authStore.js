// Simple global auth state that persists across component unmounts
class AuthStore {
  constructor() {
    this.state = { isAuthenticated: false, balance: null };
    this.listeners = new Set();
    this.initialized = false;
    
    // Load from localStorage immediately when available
    this.initFromStorage();
  }

  initFromStorage() {
    if (typeof window !== 'undefined' && !this.initialized) {
      try {
        const saved = localStorage.getItem('r8_auth_state');
        if (saved) {
          this.state = JSON.parse(saved);
        }
        this.initialized = true;
      } catch {}
    }
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('r8_auth_state', JSON.stringify(this.state));
      } catch {}
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const authStore = new AuthStore();

export function useAuthStore() {
  // Ensure store is initialized before first render
  authStore.initFromStorage();
  const [state, setState] = useState(authStore.getState());
  
  useEffect(() => {
    return authStore.subscribe(setState);
  }, []);
  
  return [state, (newState) => authStore.setState(newState)];
}

// Import at top of file
import { useState, useEffect } from 'react';
