import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSizeOption = 'small' | 'normal' | 'large';

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
  setFontSize: (size: FontSizeOption) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 'normal',
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
