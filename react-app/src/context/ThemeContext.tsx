import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const TAKTIK_ORANGE = '#E94E1B';
const TAKTIK_ORANGE_DARK = '#C13F12';
const TAKTIK_GREEN = '#7AB800';
const TAKTIK_GREEN_DARK = '#5E8F00';

const getDesignTokens = (mode: Theme) => ({
  palette: {
    mode,
    primary: {
      main: TAKTIK_ORANGE,
      dark: TAKTIK_ORANGE_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: TAKTIK_GREEN,
      dark: TAKTIK_GREEN_DARK,
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#1a1a1a' : '#ffffff',
      paper: mode === 'dark' ? '#262626' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f0f0f0' : '#222222',
      secondary: mode === 'dark' ? '#bdbdbd' : '#555555',
    },
    divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e6e6e6',
  },
  typography: {
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 800, lineHeight: 1.1 },
    h2: { fontWeight: 800, fontSize: '1.6rem' },
    h3: { fontWeight: 700, fontSize: '1.4rem' },
    h4: { fontWeight: 700, fontSize: '1.15rem' },
    button: { fontWeight: 700, textTransform: 'none' as const },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '0.6rem 1.4rem',
          fontSize: '0.95rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('tf-theme') as Theme) || 'light';
    }
    return 'light';
  });

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('tf-theme', next);
    document.documentElement.setAttribute('data-tf-theme', next);
  }, [theme]);

  const muiTheme = useMemo(() => createTheme(getDesignTokens(theme)), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
