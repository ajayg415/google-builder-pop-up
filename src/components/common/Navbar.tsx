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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800 shadow-md">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Event Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-inner">
            <Coffee className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-stone-100">Café Companion</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Better Waits
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-stone-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Google Cloud Pop-Up</span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300 font-medium">{activeQueueCount} in queue</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="bg-stone-800 p-0.5 rounded-xl flex items-center border border-stone-700/60 shadow-inner">
            <button
              onClick={() => onTabChange('customer')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'customer'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => onTabChange('barista')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'barista'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              <span>Barista KDS</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-stone-900/60 text-amber-300 rounded-full">
                {activeQueueCount}
              </span>
            </button>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemoData}
            title="Reset demo data"
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors border border-stone-700/50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Settings & AI Key"
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors border border-stone-700/50"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
