import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface JobState {
  filters: string[];
  isDarkMode: boolean;
  addFilter: (tag: string) => void;
  removeFilter: (tag: string) => void;
  clearFilters: () => void;
  toggleDarkMode: () => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      filters: [],
      isDarkMode: false,
      addFilter: (tag) =>
        set((state) => ({
          filters: state.filters.includes(tag)
            ? state.filters
            : [...state.filters, tag],
        })),
      removeFilter: (tag) =>
        set((state) => ({
          filters: state.filters.filter((f) => f !== tag),
        })),
      clearFilters: () => set({ filters: [] }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'job-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
