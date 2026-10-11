import { MapPin, Compass } from 'lucide-react';
import { useCafe } from '../../store/cafeStore';

export const BeanCompanionCard: React.FC = () => {
  const { currentOrder, beanStory } = useCafe();

  if (!currentOrder || currentOrder.items.length === 0) return null;

  const primaryItem = currentOrder.items[0].menuItem;

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-5 shadow-sm border border-stone-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              While You Wait
            </span>
            <h4 className="font-bold text-stone-100 text-sm">
              The Bean Behind Your Cup
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full border border-stone-700">
          Single Origin
        </span>
      </div>

      {/* Coffee Origin Details */}
      <div className="bg-stone-800/80 rounded-2xl p-3.5 border border-stone-700/60 mb-3">
        <div className="flex items-center space-x-1.5 text-xs text-stone-300 font-semibold mb-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{primaryItem.origin || 'Artisan Estate'}</span>
        </div>
        <p className="text-xs text-amber-100/90 leading-relaxed italic">
          "{beanStory || 'Craft-roasted in micro-lots to showcase delicate acidity and distinct terroir.'}"
        </p>
      </div>

      {/* Tasting Notes */}
      {primaryItem.tastingNotes && primaryItem.tastingNotes.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            Key Tasting Notes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {primaryItem.tastingNotes.map((note, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-stone-800/90 text-amber-200/90 px-2.5 py-0.5 rounded-lg border border-stone-700"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
