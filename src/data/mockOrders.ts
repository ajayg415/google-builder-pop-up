import { Order } from '../types/cafe';
import { MOCK_MENU } from './mockMenu';

const now = Date.now();

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    ticketNumber: '#101',
    customerName: 'Maya L.',
    createdAt: now - 180000,
    items: [
      {
        menuItem: MOCK_MENU[1], // Geisha Pour-Over (slow bar)
        quantity: 1,
      }
    ],
    status: 'preparing',
    currentStage: 'grinding_extraction',
    estimatedWaitMinutes: 2,
    assignedStation: 'pour_over',
    pickupCounterBay: 'Bay A (Slow Bar)'
  },
  {
    id: 'ord-102',
    ticketNumber: '#102',
    customerName: 'Daniel K.',
    createdAt: now - 120000,
    items: [
      {
        menuItem: MOCK_MENU[3], // Iced Cardamom Latte
        quantity: 1,
        customizations: { milk: 'Oat', sweetness: '50%' }
      },
      {
        menuItem: MOCK_MENU[5], // Almond Croissant
        quantity: 1,
        customizations: { warmed: true }
      }
    ],
    status: 'preparing',
    currentStage: 'steaming_finishing',
    estimatedWaitMinutes: 3,
    assignedStation: 'steam',
    pickupCounterBay: 'Bay B'
  },
  {
    id: 'ord-103',
    ticketNumber: '#103',
    customerName: 'Sophie R.',
    createdAt: now - 60000,
    items: [
      {
        menuItem: MOCK_MENU[4], // Ceremonial Matcha Latte
        quantity: 1,
        customizations: { milk: 'Oat', sweetness: '100%' }
      }
    ],
    status: 'queued',
    currentStage: 'order_received',
    estimatedWaitMinutes: 4,
    assignedStation: 'steam',
    pickupCounterBay: 'Bay B'
  },
  // The User's default order:
  {
    id: 'ord-104',
    ticketNumber: '#104',
    customerName: 'You (Alex)',
    createdAt: now - 15000,
    items: [
      {
        menuItem: MOCK_MENU[0], // Velvet Oat Flat White
        quantity: 1,
        customizations: { milk: 'Oat' }
      },
      {
        menuItem: MOCK_MENU[2], // Nitro Cold Brew
        quantity: 1
      }
    ],
    status: 'queued',
    currentStage: 'order_received',
    estimatedWaitMinutes: 5,
    assignedStation: 'espresso',
    pickupCounterBay: 'Bay A'
  }
];
