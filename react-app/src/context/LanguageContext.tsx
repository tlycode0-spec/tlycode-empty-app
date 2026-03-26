import React, { createContext, useContext, useMemo } from 'react';

export type Language = 'cs' | 'en';

interface LanguageContextValue {
  lang: Language;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: 'en' });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useMemo<Language>(() => {
    if (typeof window !== 'undefined' && (window as any).__LANG__) {
      const v = (window as any).__LANG__;
      if (v === 'cs' || v === 'en') return v;
    }
    return 'en';
  }, []);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}
