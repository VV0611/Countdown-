import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownEvent } from '../types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface EventStore {
  events: CountdownEvent[];
  add: (event: Omit<CountdownEvent, 'id' | 'createdAt'>) => void;
  update: (id: string, updates: Partial<Omit<CountdownEvent, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],

      add: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      update: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      remove: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      togglePin: (id) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, pinned: !e.pinned } : e
          ),
        })),
    }),
    {
      name: 'countdown-events',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
