import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { registry } from './registry';
import './styles/admin.css';

// Theme detection — runs immediately on bundle load to prevent FOUC
(function () {
  var theme = localStorage.getItem('tf-theme') || 'dark';
  document.documentElement.setAttribute('data-tf-theme', theme);
})();

declare global {
  interface Window {
    __REACT_RENDER__: (name: string, props: Record<string, unknown>, containerId: string) => void;
  }
}

window.__REACT_RENDER__ = (name: string, props: Record<string, unknown>, containerId: string) => {
  const Component = registry[name];
  if (!Component) {
    console.error(`[TypeForge React] Unknown component: "${name}"`);
    return;
  }
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[TypeForge React] Container not found: "#${containerId}"`);
    return;
  }
  createRoot(container).render(
    <LanguageProvider>
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    </LanguageProvider>
  );
};
