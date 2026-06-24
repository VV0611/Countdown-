import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EventCategory {
  id: string;
  label: string;
  color: string;
  isDefault?: boolean;
}

const DEFAULT_CATEGORIES: EventCategory[] = [
  { id: 'anniversary', label: '纪念日', color: '#F472B6', isDefault: true },
  { id: 'work',        label: '工作',   color: '#60A5FA', isDefault: true },
  { id: 'life',        label: '生活',   color: '#34D399', isDefault: true },
];

function genId() {
  return 'cat_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface CategoryState {
  categories: EventCategory[];
  addCategory: (label: string, color: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, label: string, color: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (label, color) =>
        set((s) => ({
          categories: [...s.categories, { id: genId(), label, color }],
        })),

      removeCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        })),

      updateCategory: (id, label, color) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, label, color } : c
          ),
        })),
    }),
    {
      name: 'event-categories',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
