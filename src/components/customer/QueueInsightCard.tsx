import { Sparkles, RefreshCw } from 'lucide-react';
import { useCafe } from '../../store/cafeStore';
import { DEFAULT_STATION_CAPACITIES } from '../../services/waitPredictor';
import { StationType } from '../../types/cafe';

const STATION_META: Record<StationType, { label: string; icon: string }> = {
  espresso: { label: 'Espresso Bar', icon: '☕' },
  steam: { label: 'Steam Wands', icon: '💨' },
  pour_over: { label: 'Slow Bar (V60)', icon: '⏳' },
  batch_brew: { label: 'Batch Taps', icon: '⚡' },
  blender: { label: 'Blenders', icon: '🌪️' },
  oven: { label: 'Pastry Oven', icon: '🥐' },
};

export const QueueInsightCard: React.FC = () => {
  const { prediction, aiExplanation, isAiLoading, refreshAiReasoning, orders } = useCafe();

  // Compute live station active counts from orders currently in preparing / queued
  const activeOrders = orders.filter(o => o.status === 'queued' || o.status === 'preparing');
  const stationUsage: Record<StationType, number> = {
    espresso: 0,
    steam: 0,
    pour_over: 0,
    batch_brew: 0,
    blender: 0,
    oven: 0,
  };

  activeOrders.forEach(o => {
    o.items.forEach(i => {
      i.menuItem.requiredStations.forEach(st => {
        stationUsage[st] = (stationUsage[st] || 0) + i.quantity;
      });
    });
  });

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80">
      {/* Title & Gemini Branding */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm tracking-tight flex items-center space-x-1.5">
              <span>Why This Wait?</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                Gemini Reasoning
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Station bottlenecks & prep factors analyzed in real time
            </p>
          </div>
        </div>

        <button
          onClick={refreshAiReasoning}
          disabled={isAiLoading}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Refresh AI Analysis"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Gemini AI Barista Explanation */}
      <div className="bg-gradient-to-r from-blue-50/70 via-stone-50 to-amber-50/60 rounded-2xl p-3.5 border border-blue-100/80 mb-4">
        {isAiLoading ? (
          <div className="flex items-center space-x-2 text-xs text-stone-500 py-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
            <span>Analyzing kitchen telemetry with Gemini...</span>
          </div>
        ) : (
          <p className="text-xs text-stone-700 leading-relaxed italic">
            "{aiExplanation || prediction.reasoning}"
          </p>
        )}
      </div>

      {/* Station Telemetry Breakdown */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          <span>Barista Station Loads</span>
          <span>Active / Capacity</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['espresso', 'steam', 'pour_over', 'oven'] as StationType[]).map(st => {
            const active = stationUsage[st] || 0;
            const max = DEFAULT_STATION_CAPACITIES[st] || 1;
            const isBottleneck = prediction.bottleneckStation === st;
            const percent = Math.min(100, Math.round((active / max) * 100));

            return (
              <div
                key={st}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isBottleneck
                    ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-200'
                    : 'bg-stone-50 border-stone-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-800 flex items-center space-x-1">
                    <span>{STATION_META[st].icon}</span>
                    <span className="text-[11px]">{STATION_META[st].label}</span>
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isBottleneck ? 'text-amber-700' : 'text-stone-500'}`}>
                    {active}/{max}
                  </span>
                </div>

                {/* Micro bar */}
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBottleneck
                        ? 'bg-amber-500'
                        : percent > 70
                        ? 'bg-stone-600'
                        : 'bg-stone-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
