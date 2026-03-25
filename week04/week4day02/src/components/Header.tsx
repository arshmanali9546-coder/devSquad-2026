'use client';

import { useJobStore } from '@/store/useJobStore';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useJobStore();

  return (
    <header className="relative h-40 bg-primary bg-[url('/assets/images/bg-header-mobile.svg')] lg:bg-[url('/assets/images/bg-header-desktop.svg')] bg-cover bg-no-repeat">
      <div className="container-custom flex justify-end pt-8">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
}
