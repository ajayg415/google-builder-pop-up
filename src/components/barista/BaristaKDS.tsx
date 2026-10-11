import { 
  Play, 
  Clock, 
  PlusCircle 
} from 'lucide-react';
import { useCafe } from '../../store/cafeStore';
import { MOCK_MENU } from '../../data/mockMenu';
import { OrderItem } from '../../types/cafe';

export const BaristaKDS: React.FC = () => {
  const { 
    orders, 
    advanceOrderStage, 
    updateOrderStatus, 
    addNewOrder, 
    activeQueueCount,
    currentOrderId,
    setCurrentOrderId
  } = useCafe();

  const handleSimulateRush = () => {
    // Add two orders simultaneously to simulate a morning rush
    const rushOrder1: OrderItem[] = [
      {
        menuItem: MOCK_MENU[0], // Flat white (steam + espresso)
        quantity: 2,
        customizations: { milk: 'Oat' }
      }
    ];
    const rushOrder2: OrderItem[] = [
      {
        menuItem: MOCK_MENU[1], // Geisha Pour-Over (slow bar)
        quantity: 1
      }
    ];

    addNewOrder('Jordan M.', rushOrder1);
    addNewOrder('Chloe T.', rushOrder2);
  };

  return (
    <div className="space-y-4">
      {/* KDS Station Top Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Barista Kitchen Display (KDS)
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live preparation queue • Tap tickets to progress stages & test customer wait updates
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateRush}
              className="flex items-center space-x-1.5 text-xs bg-amber-600/90 hover:bg-amber-600 text-white font-semibold px-3 py-2 rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Simulate Rush (+2 Orders)</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-800 text-center">
          <div className="bg-stone-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Active Tickets</span>
            <div className="text-lg font-bold font-mono text-white">{activeQueueCount}</div>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Steam Load</span>
            <div className="text-lg font-bold font-mono text-amber-400">High (2/2)</div>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Avg Bar Speed</span>
            <div className="text-lg font-bold font-mono text-emerald-400">1m 45s</div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-3">
        {orders.map(order => {
          const isUserOrder = order.id === currentOrderId;
          const isReady = order.status === 'ready';
          const isPickedUp = order.status === 'picked_up';

          let statusBadgeColor = 'bg-stone-100 text-stone-700 border-stone-300';
          if (order.status === 'preparing') {
            statusBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
          } else if (isReady) {
            statusBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          }

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-sm ${
                isUserOrder
                  ? 'ring-2 ring-amber-500 border-amber-300'
                  : 'border-stone-200/80 hover:border-stone-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs bg-stone-900 text-amber-300 px-2 py-0.5 rounded-lg">
                    {order.ticketNumber}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-stone-900">{order.customerName}</span>
                    {isUserOrder && (
                      <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                        You (Customer View Active)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusBadgeColor}`}>
                    {order.currentStage.replace(/_/g, ' ')}
                  </span>
                  {!isUserOrder && (
                    <button
                      onClick={() => setCurrentOrderId(order.id)}
                      className="text-[10px] text-stone-500 hover:text-stone-900 underline"
                    >
                      Track
                    </button>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="py-2.5 space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-stone-800">{item.menuItem.name}</span>
                    </div>
                    {item.customizations?.milk && (
                      <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        {item.customizations.milk} Milk
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Station Tags & Advance Controls */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-[10px] text-stone-500">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>
                    Est: ~{order.estimatedWaitMinutes}m • Bay: {order.pickupCounterBay || 'Bay A'}
                  </span>
                </div>

                {/* Advance Button */}
                <div className="flex items-center space-x-2">
                  {!isPickedUp && (
                    <button
                      onClick={() => advanceOrderStage(order.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                        isReady
                          ? 'bg-stone-800 hover:bg-stone-900 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      }`}
                    >
                      <span>
                        {order.currentStage === 'order_received' && 'Start Brewing'}
                        {order.currentStage === 'grinding_extraction' && 'Steam / Texture'}
                        {order.currentStage === 'steaming_finishing' && 'Mark Ready'}
                        {order.currentStage === 'ready_for_pickup' && 'Mark Picked Up'}
                      </span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
