import { Order, StationType, WaitPredictionResult, HourlyCrowdForecast } from '../types/cafe';

// Station constraints in typical high-end coffee bar
export const DEFAULT_STATION_CAPACITIES: Record<StationType, number> = {
  espresso: 3,    // 3 group heads
  steam: 2,       // 2 steam wands
  pour_over: 1,   // 1 dedicated barista slow-bar kettle
  batch_brew: 2,  // 2 taps
  blender: 1,     // 1 blender
  oven: 2         // 2 slots in turbo oven
};

/**
 * Calculates deterministic dynamic prep time & bottleneck analysis
 * based on station queues and pending items.
 */
export function calculateQueueWait(
  targetOrderId: string,
  orders: Order[]
): WaitPredictionResult {
  const activeOrders = orders.filter(
    o => o.status === 'queued' || o.status === 'preparing'
  );

  const targetOrderIndex = activeOrders.findIndex(o => o.id === targetOrderId);
  const ordersAhead = targetOrderIndex >= 0 ? targetOrderIndex : activeOrders.length;
  const targetOrder = activeOrders.find(o => o.id === targetOrderId);

  // Station cumulative workloads (in seconds)
  const stationWorkloads: Record<StationType, number> = {
    espresso: 0,
    steam: 0,
    pour_over: 0,
    batch_brew: 0,
    blender: 0,
    oven: 0,
  };

  // Tally workload of orders preceding the target order
  const relevantOrders = targetOrderIndex >= 0 
    ? activeOrders.slice(0, targetOrderIndex + 1)
    : [...activeOrders, targetOrder].filter(Boolean) as Order[];

  relevantOrders.forEach(order => {
    order.items.forEach(item => {
      const stations = item.menuItem.requiredStations;
      const prepPerStation = (item.menuItem.basePrepTimeSec * item.quantity) / (stations.length || 1);
      stations.forEach(st => {
        stationWorkloads[st] += prepPerStation;
      });
    });
  });

  // Factor in parallel slots for each station
  let bottleneck: StationType | null = null;
  let maxStationWait = 0;

  (Object.keys(stationWorkloads) as StationType[]).forEach(station => {
    const rawSeconds = stationWorkloads[station];
    const capacity = DEFAULT_STATION_CAPACITIES[station] || 1;
    const effectiveStationWait = rawSeconds / capacity;

    if (effectiveStationWait > maxStationWait) {
      maxStationWait = effectiveStationWait;
      if (rawSeconds > 60) {
        bottleneck = station;
      }
    }
  });

  // Total estimated seconds is the bottleneck flow + baseline handoff
  const totalEstimatedSeconds = Math.max(30, Math.round(maxStationWait + 40));

  // Determine descriptive factors
  let stationLoadText = 'Stations operating smoothly';
  if (bottleneck === 'steam') {
    stationLoadText = 'Steam wand congestion (high milk drink demand)';
  } else if (bottleneck === 'pour_over') {
    stationLoadText = 'Hand-brew slow bar occupied with precision pour-over';
  } else if (bottleneck === 'oven') {
    stationLoadText = 'Pastry oven queue active';
  } else if (bottleneck === 'espresso') {
    stationLoadText = 'Espresso group heads running at peak capacity';
  }

  const drinkCount = targetOrder 
    ? targetOrder.items.reduce((acc, i) => acc + i.quantity, 0)
    : 1;

  const drinkComplexityText = drinkCount > 1 
    ? `Multi-item ticket (${drinkCount} items)`
    : (targetOrder?.items[0]?.menuItem.category === 'cold' 
      ? 'Express cold tap drink (low prep)'
      : 'Craft espresso / handcrafted drink');

  const reasoning = generateExplanation(ordersAhead, totalEstimatedSeconds, bottleneck, drinkComplexityText);

  return {
    totalEstimatedSeconds,
    ordersAhead,
    bottleneckStation: bottleneck,
    confidenceScore: ordersAhead > 6 ? 88 : 96,
    factors: {
      stationLoad: stationLoadText,
      drinkComplexity: drinkComplexityText,
      historicalPacing: 'Real-time kitchen telemetry active'
    },
    reasoning
  };
}

function generateExplanation(
  ordersAhead: number,
  seconds: number,
  bottleneck: StationType | null,
  complexity: string
): string {
  const mins = Math.ceil(seconds / 60);

  if (ordersAhead === 0) {
    return `Your order is up next on the bar (${complexity}). Barista is prepping ingredients now. Estimated completion in ~${mins} min.`;
  }

  if (bottleneck === 'pour_over') {
    return `There are ${ordersAhead} order(s) ahead. Note: Slow-bar artisan pour-overs require 3-4 minutes of bloom & draw-down, which adds slight buffer.`;
  }

  if (bottleneck === 'steam') {
    return `${ordersAhead} ticket(s) ahead. Steam wands are in high demand right now for lattes & flat whites, pacing your wait to ~${mins} mins (${complexity}).`;
  }

  return `${ordersAhead} ticket(s) ahead. Smooth throughput across espresso machines. Your order will be ready in approximately ${mins} mins (${complexity}).`;
}

/**
 * Predicts 24-hour / working day crowd trends
 */
export function getCrowdForecast(): HourlyCrowdForecast[] {
  return [
    { hour: '7:00 AM', busyness: 25, avgWaitMins: 2, isPeak: false, label: 'Quiet' },
    { hour: '8:00 AM', busyness: 65, avgWaitMins: 5, isPeak: false, label: 'Moderate' },
    { hour: '8:30 AM', busyness: 95, avgWaitMins: 9, isPeak: true, label: 'Morning Rush' },
    { hour: '9:00 AM', busyness: 88, avgWaitMins: 8, isPeak: true, label: 'Morning Rush' },
    { hour: '10:00 AM', busyness: 60, avgWaitMins: 4, isPeak: false, label: 'Moderate' },
    { hour: '11:00 AM', busyness: 40, avgWaitMins: 3, isPeak: false, label: 'Smooth' },
    { hour: '12:00 PM', busyness: 55, avgWaitMins: 4, isPeak: false, label: 'Lunch Break' },
    { hour: '1:00 PM', busyness: 82, avgWaitMins: 7, isPeak: true, label: 'Afternoon Pick-Me-Up' },
    { hour: '2:30 PM', busyness: 50, avgWaitMins: 4, isPeak: false, label: 'Moderate' },
    { hour: '4:00 PM', busyness: 30, avgWaitMins: 2, isPeak: false, label: 'Relaxed' },
    { hour: '5:30 PM', busyness: 20, avgWaitMins: 2, isPeak: false, label: 'Quiet' },
  ];
}
