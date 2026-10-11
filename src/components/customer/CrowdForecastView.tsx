import { useState } from 'react';
import { TrendingUp, Clock, Zap } from 'lucide-react';
import { useCafe } from '../../store/cafeStore';

export const CrowdForecastView: React.FC = () => {
  const { crowdForecast } = useCafe();
  const [selectedHour, setSelectedHour] = useState<string>('8:30 AM');

  const selectedData = crowdForecast.find(c => c.hour === selectedHour) || crowdForecast[2];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm tracking-tight">
              Best Time to Visit
            </h3>
            <p className="text-[11px] text-stone-500">
              Predictive footfall & wait-time forecasting
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-stone-100 text-stone-600 font-semibold px-2 py-1 rounded-md border border-stone-200">
          Weekday Schedule
        </span>
      </div>

      {/* Selected Time Callout Box */}
      <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60 mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-stone-500 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Target Arrival: <strong className="text-stone-800">{selectedData.hour}</strong></span>
          </div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              ~{selectedData.avgWaitMins}m
            </span>
            <span className="text-xs text-stone-500">average wait</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${
              selectedData.isPeak
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : selectedData.busyness > 50
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {selectedData.label}
          </span>
          <div className="text-[10px] text-stone-400 mt-1">
            {selectedData.busyness}% capacity
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between h-28 pt-4 pb-2 px-1 border-b border-stone-200 gap-1.5">
          {crowdForecast.map(item => {
            const isSelected = item.hour === selectedHour;
            const heightPercent = Math.max(15, item.busyness);

            return (
              <button
                key={item.hour}
                onClick={() => setSelectedHour(item.hour)}
                className="flex-1 flex flex-col items-center group h-full justify-end focus:outline-none"
                title={`${item.hour}: ~${item.avgWaitMins}m wait`}
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-600 ring-2 ring-amber-300'
                      : item.isPeak
                      ? 'bg-rose-400 group-hover:bg-rose-500'
                      : 'bg-stone-300 group-hover:bg-amber-400'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </button>
            );
          })}
        </div>

        {/* Hour Labels */}
        <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1.5 px-0.5">
          <span>7am</span>
          <span className="font-bold text-amber-700">8:30am</span>
          <span>10am</span>
          <span>12pm</span>
          <span>2:30pm</span>
          <span>5:30pm</span>
        </div>
      </div>

      {/* Proactive Barista AI Tip */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2.5">
        <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-900 leading-snug">
          <strong>Smart Timing Tip:</strong> Avoid the <strong>8:30 AM</strong> commuter spike by ordering either before <strong>8:00 AM</strong> or in the <strong>10:30 AM lull</strong> to cut wait time by over <strong>60%</strong>.
        </div>
      </div>
    </div>
  );
};
