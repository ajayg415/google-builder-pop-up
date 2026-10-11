import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus, PreparationStage, OrderItem, WaitPredictionResult, HourlyCrowdForecast } from '../types/cafe';
import { INITIAL_MOCK_ORDERS } from '../data/mockOrders';
import { calculateQueueWait, getCrowdForecast } from '../services/waitPredictor';
import { getAiWaitReasoning, getAiCoffeeStory } from '../services/gemini';

interface CafeContextType {
  orders: Order[];
  currentOrderId: string;
  currentOrder: Order | undefined;
  prediction: WaitPredictionResult;
  aiExplanation: string;
  isAiLoading: boolean;
  beanStory: string;
  crowdForecast: HourlyCrowdForecast[];
  setCurrentOrderId: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, stage: PreparationStage) => void;
  advanceOrderStage: (orderId: string) => void;
  addNewOrder: (customerName: string, items: OrderItem[]) => string;
  refreshAiReasoning: () => void;
  resetDemoData: () => void;
  activeQueueCount: number;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_MOCK_ORDERS);
  const [currentOrderId, setCurrentOrderId] = useState<string>('ord-104');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [beanStory, setBeanStory] = useState<string>('');

  const crowdForecast = useMemo(() => getCrowdForecast(), []);

  const currentOrder = useMemo(() => {
    return orders.find(o => o.id === currentOrderId) || orders[orders.length - 1];
  }, [orders, currentOrderId]);

  // Recalculate deterministic queue wait whenever orders change
  const prediction = useMemo(() => {
    return calculateQueueWait(currentOrderId, orders);
  }, [currentOrderId, orders]);

  const activeQueueCount = useMemo(() => {
    return orders.filter(o => o.status === 'queued' || o.status === 'preparing').length;
  }, [orders]);

  // Fetch AI reasoning when queue bottlenecks shift or order changes
  const fetchAiReasoning = useCallback(async () => {
    if (!currentOrder) return;
    setIsAiLoading(true);
    try {
      const explanation = await getAiWaitReasoning(
        currentOrder,
        prediction.ordersAhead,
        prediction.bottleneckStation,
        prediction.totalEstimatedSeconds
      );
      setAiExplanation(explanation);
    } finally {
      setIsAiLoading(false);
    }
  }, [currentOrder, prediction.ordersAhead, prediction.bottleneckStation, prediction.totalEstimatedSeconds]);

  // Fetch Bean Story for the primary coffee item
  const fetchBeanStory = useCallback(async () => {
    if (!currentOrder || currentOrder.items.length === 0) return;
    const primaryCoffee = currentOrder.items[0].menuItem;
    const story = await getAiCoffeeStory(
      primaryCoffee.name,
      primaryCoffee.origin,
      primaryCoffee.tastingNotes
    );
    setBeanStory(story);
  }, [currentOrder]);

  useEffect(() => {
    fetchAiReasoning();
    fetchBeanStory();
  }, [currentOrderId]); // When user changes active order

  // Trigger celebration confetti when the customer's order hits "ready"
  const triggerReadyCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DEAA8B', '#B86533', '#1A73E8', '#34A853', '#FBBC04']
      });
    } catch {
      // ignore in test environments
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, stage: PreparationStage) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const isNowReady = status === 'ready';
      if (isNowReady && order.id === currentOrderId) {
        triggerReadyCelebration();
      }
      return {
        ...order,
        status,
        currentStage: stage,
        readyAt: isNowReady ? Date.now() : order.readyAt
      };
    }));
  };

  const advanceOrderStage = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      let nextStatus: OrderStatus = order.status;
      let nextStage: PreparationStage = order.currentStage;

      switch (order.currentStage) {
        case 'order_received':
          nextStatus = 'preparing';
          nextStage = 'grinding_extraction';
          break;
        case 'grinding_extraction':
          nextStatus = 'preparing';
          nextStage = 'steaming_finishing';
          break;
        case 'steaming_finishing':
          nextStatus = 'ready';
          nextStage = 'ready_for_pickup';
          if (order.id === currentOrderId) {
            triggerReadyCelebration();
          }
          break;
        case 'ready_for_pickup':
          nextStatus = 'picked_up';
          nextStage = 'ready_for_pickup';
          break;
        default:
          break;
      }

      return {
        ...order,
        status: nextStatus,
        currentStage: nextStage,
        readyAt: nextStatus === 'ready' ? Date.now() : order.readyAt
      };
    }));
  };

  const addNewOrder = (customerName: string, items: OrderItem[]): string => {
    const newId = `ord-${Date.now().toString().slice(-4)}`;
    const nextTicketNum = `#${100 + orders.length + 1}`;
    
    const newOrder: Order = {
      id: newId,
      ticketNumber: nextTicketNum,
      customerName: customerName || 'Alex (You)',
      createdAt: Date.now(),
      items,
      status: 'queued',
      currentStage: 'order_received',
      estimatedWaitMinutes: 5,
      pickupCounterBay: 'Bay A'
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrderId(newId);
    return newId;
  };

  const resetDemoData = () => {
    setOrders(INITIAL_MOCK_ORDERS);
    setCurrentOrderId('ord-104');
    fetchAiReasoning();
    fetchBeanStory();
  };

  return (
    <CafeContext.Provider
      value={{
        orders,
        currentOrderId,
        currentOrder,
        prediction,
        aiExplanation,
        isAiLoading,
        beanStory,
        crowdForecast,
        setCurrentOrderId,
        updateOrderStatus,
        advanceOrderStage,
        addNewOrder,
        refreshAiReasoning: fetchAiReasoning,
        resetDemoData,
        activeQueueCount
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
