import React from 'react';
import { Coffee, MonitorCheck, Settings, RotateCcw } from 'lucide-react';
import { useCafe } from '../../store/cafeStore';

interface NavbarProps {
  currentTab: 'customer' | 'barista';
  onTabChange: (tab: 'customer' | 'barista') => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenSettings }) => {
  const { activeQueueCount, resetDemoData } = useCafe();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800 shadow-sm transition-all">
      {/* iOS safe area container */}
      <div className="max-w-md md:max-w-2xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2 min-w-0 flex-shrink-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-inner flex-shrink-0">
            <Coffee className="w-4 h-4 text-amber-100" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-stone-100 truncate">
                Café Companion
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Better Waits
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-stone-400 leading-none">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
              <span className="truncate">{activeQueueCount} in queue</span>
            </div>
          </div>
        </div>

        {/* Right: View Switcher & Action Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* View Mode Toggle Pill */}
          <div className="bg-stone-800/90 p-0.5 rounded-xl flex items-center border border-stone-700/60 shadow-inner">
            <button
              onClick={() => onTabChange('customer')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'customer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Customer View"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => onTabChange('barista')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'barista'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Barista KDS"
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              <span>KDS</span>
              <span className="px-1 py-0.2 text-[10px] bg-stone-900/80 text-amber-300 rounded-full font-mono">
                {activeQueueCount}
              </span>
            </button>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={resetDemoData}
              title="Reset demo data"
              className="p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors border border-stone-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Settings & Gemini AI Key"
              className="p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors border border-stone-700/50"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
