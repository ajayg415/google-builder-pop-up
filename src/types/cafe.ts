export type StationType = 
  | 'espresso'      // Pulling shots (45s per double shot)
  | 'steam'         // Steaming dairy/oat/almond (35s per drink)
  | 'pour_over'     // Hand-poured single origin (240s)
  | 'batch_brew'    // Batch drip & cold brew (15s)
  | 'blender'       // Frappes, smoothies (90s)
  | 'oven'          // Pastries warming (120s);

export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'picked_up';

export type PreparationStage = 
  | 'order_received' 
  | 'grinding_extraction' 
  | 'steaming_finishing' 
  | 'packaging' 
  | 'ready_for_pickup';

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'tea' | 'cold' | 'bakery';
  price: number;
  basePrepTimeSec: number;
  requiredStations: StationType[];
  roastProfile?: string;
  origin?: string;
  tastingNotes?: string[];
  description: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: {
    milk?: 'Whole' | 'Oat' | 'Almond' | 'None';
    sweetness?: '0%' | '50%' | '100%';
    ice?: 'Regular' | 'Less' | 'None';
    hot?: boolean;
    warmed?: boolean;
  };
}

export interface Order {
  id: string;
  ticketNumber: string;
  customerName: string;
  createdAt: number; // timestamp ms
  items: OrderItem[];
  status: OrderStatus;
  currentStage: PreparationStage;
  estimatedWaitMinutes: number;
  aiExplanation?: string;
  assignedStation?: StationType;
  pickupCounterBay?: string;
  readyAt?: number;
}

export interface StationCapacity {
  station: StationType;
  name: string;
  parallelSlots: number; // e.g. 2 steam wands, 3 espresso groupheads
  activeTasks: number;
  isBottleNeck: boolean;
}

export interface WaitPredictionResult {
  totalEstimatedSeconds: number;
  ordersAhead: number;
  bottleneckStation: StationType | null;
  confidenceScore: number;
  factors: {
    stationLoad: string;
    drinkComplexity: string;
    historicalPacing: string;
  };
  reasoning: string;
}

export interface HourlyCrowdForecast {
  hour: string; // e.g., "8:00 AM"
  busyness: number; // 0 - 100 percentage
  avgWaitMins: number;
  isPeak: boolean;
  label: string; // "Low", "Moderate", "Peak Rush"
}
