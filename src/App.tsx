import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { WaitTracker } from './components/customer/WaitTracker';
import { QueueInsightCard } from './components/customer/QueueInsightCard';
import { CrowdForecastView } from './components/customer/CrowdForecastView';
import { BeanCompanionCard } from './components/customer/BeanCompanionCard';
import { BaristaKDS } from './components/barista/BaristaKDS';
import { OrderAheadModal } from './components/customer/OrderAheadModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { Plus, Sparkles } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'barista'>('customer');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 pb-20 selection:bg-amber-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-md md:max-w-xl mx-auto px-4 pt-4 space-y-4">
        {activeTab === 'customer' ? (
          <>
            {/* Customer Action Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Your Café Visit
              </span>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex items-center space-x-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-full shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order Drink</span>
              </button>
            </div>

            {/* 1. Primary Live Wait Tracker (Hero) */}
            <WaitTracker />

            {/* 2. "Why this Wait?" Gemini Reasoning & Telemetry */}
            <QueueInsightCard />

            {/* 3. "While You Wait" Bean Companion Story */}
            <BeanCompanionCard />

            {/* 4. "Best Time to Visit" Predictive Crowd Analytics */}
            <CrowdForecastView />
          </>
        ) : (
          /* Barista Kitchen Display System */
          <BaristaKDS />
        )}

        {/* Scalable Architecture Footnote for Hackathon / Presentation */}
        <div className="pt-6 pb-4 text-center border-t border-stone-200/80">
          <div className="inline-flex items-center space-x-1.5 text-[11px] text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Built for Google Cloud Builder Pop-Up • Powered by Gemini AI</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      <OrderAheadModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default AppContent;
