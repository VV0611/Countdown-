import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { lightColors, darkColors, ThemeColors } from './colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const systemScheme = useColorScheme();

  const isDark =
    colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? darkColors : lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
