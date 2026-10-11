import { MenuItem } from '../types/cafe';

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'oat-flat-white',
    name: 'Velvet Oat Flat White',
    category: 'coffee',
    price: 5.50,
    basePrepTimeSec: 90,
    requiredStations: ['espresso', 'steam'],
    roastProfile: 'Medium-Light Ethiopian Yirgacheffe',
    origin: 'Kochere, Ethiopia (1,950m elevation)',
    tastingNotes: ['Bergamot', 'Peach Blossom', 'Meyer Lemon', 'Caramel'],
    description: 'Double ristretto with micro-foamed organic minor figures oat milk.'
  },
  {
    id: 'single-origin-pourover',
    name: 'Geisha V60 Pour-Over',
    category: 'coffee',
    price: 7.00,
    basePrepTimeSec: 240, // 4 mins
    requiredStations: ['pour_over'],
    roastProfile: 'Light Roast Natural Process',
    origin: 'Boquete, Panama (Hacienda La Esmeralda)',
    tastingNotes: ['Jasmine', 'Papaya', 'Wild Honey', 'Lemongrass'],
    description: 'Precision hand-poured with 93°C filtered water in a spiral ratio.'
  },
  {
    id: 'nitro-cold-brew',
    name: 'Single Origin Nitro Cold Brew',
    category: 'cold',
    price: 5.25,
    basePrepTimeSec: 25, // Quick batch tap!
    requiredStations: ['batch_brew'],
    roastProfile: 'Colombian Huila 18-hour cold steep',
    origin: 'Huila, Colombia',
    tastingNotes: ['Dark Chocolate', 'Molasses', 'Candied Pecan'],
    description: 'Infused with nitrogen for a Guinness-like silky cascade and creamy head.'
  },
  {
    id: 'iced-cardamom-latte',
    name: 'Iced Spiced Cardamom Latte',
    category: 'coffee',
    price: 6.00,
    basePrepTimeSec: 100,
    requiredStations: ['espresso', 'steam'],
    roastProfile: 'Medium Roast Guatemala Antigua',
    origin: 'Sacatepéquez, Guatemala',
    tastingNotes: ['Crushed Cardamom', 'Toffee', 'Orange Peel'],
    description: 'Double espresso shaken with house-steeped green cardamom syrup over clear ice.'
  },
  {
    id: 'ceremonial-matcha',
    name: 'Uji Ceremonial Matcha Latte',
    category: 'tea',
    price: 6.25,
    basePrepTimeSec: 110,
    requiredStations: ['steam'],
    origin: 'Kyoto, Japan',
    tastingNotes: ['Umami', 'Fresh Cut Grass', 'Creamy Vanilla'],
    description: 'Whisked ceremonial first-harvest Uji matcha paired with steamed whole or oat milk.'
  },
  {
    id: 'almond-croissant',
    name: 'Warm Almond Frangipane Croissant',
    category: 'bakery',
    price: 4.75,
    basePrepTimeSec: 120, // Toaster oven
    requiredStations: ['oven'],
    origin: 'House Patisserie',
    tastingNotes: ['Toasted Almond', 'Vanilla Butter', 'Flaky Brioche'],
    description: 'Twice-baked butter croissant filled with velvety almond cream and dusted with powdered sugar.'
  }
];
