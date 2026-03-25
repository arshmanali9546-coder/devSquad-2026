'use client';

import { useJobStore } from '@/store/useJobStore';
import Image from 'next/image';

export default function FilterBar() {
  const { filters, removeFilter, clearFilters } = useJobStore();

  if (filters.length === 0) return null;

  return (
    <div className="container-custom relative -mt-9 z-10">
      <div className="bg-white dark:bg-v-dark-gray-cyan p-6 rounded-lg shadow-xl shadow-primary/20 flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <div
              key={filter}
              className="flex items-center bg-filter-tablet dark:bg-dark-gray-cyan/20 rounded overflow-hidden"
            >
              <span className="text-primary dark:text-bg-light font-bold px-3 py-1 text-sm bg-transparent">
                {filter}
              </span>
              <button
                onClick={() => removeFilter(filter)}
                className="bg-primary hover:bg-v-dark-gray-cyan p-2 transition-colors h-full flex items-center justify-center"
                aria-label={`Remove filter ${filter}`}
              >
                <Image
                  src="/assets/images/icon-remove.svg"
                  alt="Remove"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5"
                />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={clearFilters}
          className="text-dark-gray-cyan dark:text-bg-light font-bold hover:text-primary hover:underline transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
