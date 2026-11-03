'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePresetId = 'rose' | 'sage' | 'lavender' | 'peach' | 'ocean' | 'midnight';

export interface ThemeConfig {
  id: ThemePresetId;
  name: string;
  tagline: string;
  primary: string;
  primaryDark: string;
  accent: string;
  bg: string;
  card: string;
  textMain: string;
  textMuted: string;
  isDark?: boolean;
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'rose',
    name: 'Rose Atelier',
    tagline: 'Signature Luxury & French Elegance',
    primary: '#B65B78',
    primaryDark: '#8F3E58',
    accent: '#C79A62',
    bg: '#FFF9F8',
    card: '#FFFFFF',
    textMain: '#25212A',
    textMuted: '#6F6775',
  },
  {
    id: 'sage',
    name: 'Sage Serenity',
    tagline: 'Calming Botanical & Ayurvedic Wellness',
    primary: '#477F69',
    primaryDark: '#2E5848',
    accent: '#B89255',
    bg: '#F6FAF5',
    card: '#FFFFFF',
    textMain: '#1E3029',
    textMuted: '#5D7267',
  },
  {
    id: 'lavender',
    name: 'Lavender Glow',
    tagline: 'Ethereal Glamour & Haute Couture',
    primary: '#7856A8',
    primaryDark: '#54397B',
    accent: '#BA9452',
    bg: '#F9F7FF',
    card: '#FFFFFF',
    textMain: '#29223A',
    textMuted: '#6B627F',
  },
  {
    id: 'peach',
    name: 'Peach Bloom',
    tagline: 'Warm Radiance & Summer Glow',
    primary: '#A65C43',
    primaryDark: '#7E3E28',
    accent: '#BD9854',
    bg: '#FFF9F3',
    card: '#FFFFFF',
    textMain: '#33251E',
    textMuted: '#756259',
  },
  {
    id: 'ocean',
    name: 'Ocean Mist',
    tagline: 'Fresh Coastal Clarity & Vitality',
    primary: '#287A91',
    primaryDark: '#195262',
    accent: '#C29655',
    bg: '#F5FAFC',
    card: '#FFFFFF',
    textMain: '#18313B',
    textMuted: '#536C77',
  },
  {
    id: 'midnight',
    name: 'Midnight Luxe',
    tagline: 'Nocturne Slate & Dramatic Gold',
    primary: '#D99AAB',
    primaryDark: '#F3C5D1',
    accent: '#D8B26E',
    bg: '#14141B',
    card: '#21212B',
    textMain: '#F8F5F8',
    textMuted: '#A79FA9',
    isDark: true,
  },
];

export function getAccessibleContrast(hexColor: string): '#FFFFFF' | '#14141B' {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#FFFFFF';
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  // Relative luminance calculation according to WCAG 2.1
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l > 0.45 ? '#14141B' : '#FFFFFF';
}

interface ThemeContextType {
  theme: ThemePresetId;
  setTheme: (t: ThemePresetId) => void;
  customAccent: string | null;
  setCustomAccent: (hex: string) => void;
  resetCustomAccent: () => void;
  contrastColor: '#FFFFFF' | '#14141B';
  presets: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'rose',
  setTheme: () => {},
  customAccent: null,
  setCustomAccent: () => {},
  resetCustomAccent: () => {},
  contrastColor: '#FFFFFF',
  presets: THEME_PRESETS,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePresetId>('rose');
  const [customAccent, setCustomAccentState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('beyond_theme') as ThemePresetId;
      if (savedTheme && THEME_PRESETS.some((t) => t.id === savedTheme)) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'rose');
      }

      const savedAccent = localStorage.getItem('beyond_custom_accent');
      if (savedAccent && /^#[0-9A-Fa-f]{6}$/.test(savedAccent)) {
        setCustomAccentState(savedAccent);
        applyCustomAccentDOM(savedAccent);
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'rose');
    }
  }, []);

  const applyCustomAccentDOM = (hex: string) => {
    document.documentElement.style.setProperty('--theme-primary', hex);
    document.documentElement.style.setProperty('--theme-contrast', getAccessibleContrast(hex));
  };

  const removeCustomAccentDOM = () => {
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-contrast');
  };

  const setTheme = (newTheme: ThemePresetId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('beyond_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (customAccent) {
        applyCustomAccentDOM(customAccent);
      }
    } catch {
      // ignore
    }
  };

  const setCustomAccent = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    setCustomAccentState(hex);
    try {
      localStorage.setItem('beyond_custom_accent', hex);
      applyCustomAccentDOM(hex);
    } catch {
      // ignore
    }
  };

  const resetCustomAccent = () => {
    setCustomAccentState(null);
    try {
      localStorage.removeItem('beyond_custom_accent');
      removeCustomAccentDOM();
    } catch {
      // ignore
    }
  };

  const currentPreset = THEME_PRESETS.find((t) => t.id === theme) || THEME_PRESETS[0];
  const activeAccent = customAccent || currentPreset.primary;
  const contrastColor = getAccessibleContrast(activeAccent);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        customAccent,
        setCustomAccent,
        resetCustomAccent,
        contrastColor,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
// Export legacy alias for backwards compatibility
export const THEMES = THEME_PRESETS;
export type ThemeName = ThemePresetId;
