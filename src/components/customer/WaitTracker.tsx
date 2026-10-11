import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  PackageCheck, 
  Check
} from 'lucide-react';
import { useCafe } from '../../store/cafeStore';
import { PreparationStage } from '../../types/cafe';

const STAGES: { stage: PreparationStage; label: string; sub: string }[] = [
  { stage: 'order_received', label: 'Ticket In', sub: 'Queued at bar' },
  { stage: 'grinding_extraction', label: 'Extracting', sub: 'Precision 9-bar pull' },
  { stage: 'steaming_finishing', label: 'Crafting', sub: 'Steaming & texture' },
  { stage: 'ready_for_pickup', label: 'Ready', sub: 'At pickup bar' },
];

export const WaitTracker: React.FC = () => {
  const { currentOrder, prediction, orders, setCurrentOrderId, currentOrderId } = useCafe();

  // Local seconds countdown for smooth real-time ticking
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    prediction.totalEstimatedSeconds
  );

  useEffect(() => {
    setSecondsRemaining(prediction.totalEstimatedSeconds);
  }, [prediction.totalEstimatedSeconds, currentOrder?.id]);

  useEffect(() => {
    if (currentOrder?.status === 'ready' || currentOrder?.status === 'picked_up') {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev: number) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentOrder?.status]);

  if (!currentOrder) {
    return (
      <div className="p-6 text-center text-stone-500">
        No active order found. Tap below to place an order.
      </div>
    );
  }

  const isReady = currentOrder.status === 'ready';
  const isPickedUp = currentOrder.status === 'picked_up';
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Calculate current stage index
  const stageIndex = STAGES.findIndex(s => s.stage === currentOrder.currentStage);
  const activeStageIndex = stageIndex >= 0 ? stageIndex : 0;
  const progressPercent = isReady || isPickedUp 
    ? 100 
    : Math.min(95, Math.round(((activeStageIndex + 0.3) / STAGES.length) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 overflow-hidden relative">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Ticket Number & Order Switcher */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-stone-900 text-amber-400 shadow-sm">
            {currentOrder.ticketNumber}
          </span>
          <div>
            <h2 className="font-bold text-stone-900 text-sm tracking-tight">
              {currentOrder.customerName}
            </h2>
            <p className="text-[11px] text-stone-500">
              Ordered {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Order Selector (allows user to see other tickets) */}
        <select
          value={currentOrderId}
          onChange={e => setCurrentOrderId(e.target.value)}
          aria-label="Select active order ticket"
          className="text-xs bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-lg px-2 py-1 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {orders.map(o => (
            <option key={o.id} value={o.id}>
              {o.ticketNumber} - {o.customerName} ({o.status})
            </option>
          ))}
        </select>
      </div>

      {/* Main Wait Time Hero Section */}
      {isReady ? (
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-5 mb-5 shadow-lg shadow-emerald-500/20 text-center animate-bounce-subtle">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
            <PackageCheck className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Your Coffee is Ready!</h3>
          <p className="text-emerald-100 text-xs mt-1">
            Pick up fresh at <strong className="text-white underline">{currentOrder.pickupCounterBay || 'Counter Bay A'}</strong>
          </p>
          <div className="mt-3 inline-block bg-white text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            Show Ticket {currentOrder.ticketNumber} to Barista
          </div>
        </div>
      ) : isPickedUp ? (
        <div className="bg-stone-100 text-stone-700 rounded-2xl p-5 mb-5 text-center border border-stone-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
          <h3 className="font-bold text-base text-stone-900">Order Completed</h3>
          <p className="text-xs text-stone-500">Enjoy your handcrafted coffee!</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-2xl p-5 mb-5 shadow-md relative overflow-hidden">
          {/* Subtle steam particles */}
          <div className="absolute right-4 top-3 opacity-20">
            <Flame className="w-20 h-20 text-amber-400" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300/90 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Wait Time</span>
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <span className="text-xs text-stone-300 font-sans">
                  {prediction.ordersAhead === 0 ? 'Up next!' : `(${prediction.ordersAhead} in front)`}
                </span>
              </div>
            </div>

            {/* Confidence & Pickup Bay */}
            <div className="text-right">
              <span className="inline-flex items-center text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
                {prediction.confidenceScore}% AI Confidence
              </span>
              <div className="text-xs text-stone-300 mt-1 font-medium">
                Pickup: <span className="text-white font-semibold">{currentOrder.pickupCounterBay || 'Bay A'}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-3 border-t border-stone-800">
            <div className="flex justify-between text-[11px] text-stone-300 mb-1.5 font-medium">
              <span>{STAGES[activeStageIndex]?.label || 'In Progress'}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual Step-by-Step Preparation Flow */}
      <div className="mb-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
          Kitchen Bar Progress
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {STAGES.map((st, idx) => {
            const isCompleted = idx < activeStageIndex || isReady || isPickedUp;
            const isCurrent = idx === activeStageIndex && !isReady && !isPickedUp;

            return (
              <div
                key={st.stage}
                className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                    : isCompleted
                    ? 'bg-stone-50 border-stone-200 text-stone-700'
                    : 'bg-stone-50/50 border-transparent text-stone-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 font-bold ${
                    isCurrent
                      ? 'bg-amber-600 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span className={`text-[11px] font-semibold leading-tight ${isCurrent ? 'text-amber-900' : ''}`}>
                  {st.label}
                </span>
                <span className="text-[9px] text-stone-400 line-clamp-1 mt-0.5">
                  {st.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items in this Order */}
      <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-stone-700">Order Items ({currentOrder.items.length})</span>
          <span>${currentOrder.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0).toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-stone-800 bg-stone-200 px-1.5 py-0.5 rounded text-[11px]">
                  {item.quantity}x
                </span>
                <div>
                  <span className="font-medium text-stone-800">{item.menuItem.name}</span>
                  {item.customizations && (
                    <div className="text-[10px] text-amber-700 font-medium space-x-1">
                      {item.customizations.milk && <span>• {item.customizations.milk} milk</span>}
                      {item.customizations.sweetness && <span>• {item.customizations.sweetness} sweet</span>}
                      {item.customizations.warmed && <span>• Warmed</span>}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-stone-600 font-mono text-[11px]">
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
