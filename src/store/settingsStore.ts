import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSizeOption = 'small' | 'normal' | 'large';
export type ColorSchemeOption = 'light' | 'dark' | 'system';

export const FONT_SIZE_LABEL: Record<FontSizeOption, string> = {
  small: '小',
  normal: '中',
  large: '大',
};

export const FONT_SCALE: Record<FontSizeOption, number> = {
  small: 0.85,
  normal: 1.0,
  large: 1.18,
};

interface SettingsState {
  fontSize: FontSizeOption;
  colorScheme: ColorSchemeOption;
  setFontSize: (size: FontSizeOption) => void;
  setColorScheme: (scheme: ColorSchemeOption) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 'normal',
      colorScheme: 'system',
      setFontSize: (fontSize) => set({ fontSize }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
