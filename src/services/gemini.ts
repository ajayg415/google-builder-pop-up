import { GoogleGenerativeAI } from '@google/generative-ai';
import { Order, StationType } from '../types/cafe';

const LOCAL_STORAGE_KEY = 'cafe_gemini_api_key';

export function getStoredApiKey(): string {
  const envKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;
  return localStorage.getItem(LOCAL_STORAGE_KEY) || envKey || '';
}

export function saveStoredApiKey(key: string): void {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

/**
 * Uses Google Gemini to generate human-centered, transparent wait-time explanations
 * based on current kitchen station loads.
 */
export async function getAiWaitReasoning(
  order: Order,
  ordersAhead: number,
  bottleneck: StationType | null,
  estimatedSeconds: number
): Promise<string> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Elegant fallback simulation when no API key is configured
    return simulateAiReasoning(order, ordersAhead, bottleneck, estimatedSeconds);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are the lead barista AI at an artisanal specialty coffee shop.
Explain to the customer why their order (${order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}) will take approximately ${Math.ceil(estimatedSeconds / 60)} minutes.
Current Kitchen Context:
- Orders ahead in queue: ${ordersAhead}
- Primary station bottleneck: ${bottleneck || 'smooth balance across all stations'}
- Total prep seconds: ${estimatedSeconds}

Guidelines:
- Keep it under 2 sentences.
- Be transparent, reassuring, and celebrate craft quality.
- Highlight the specific station or drink prep factor (e.g., steam wand micro-foaming, espresso extraction, cold brew batch tap, pour-over bloom).
- Never sound generic or like a bot. Sound like an attentive master barista.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.warn('Gemini API call failed, using fallback barista insight:', error);
    return simulateAiReasoning(order, ordersAhead, bottleneck, estimatedSeconds);
  }
}

/**
 * Generates a fascinating "While You Wait" craft coffee story for the customer
 */
export async function getAiCoffeeStory(
  coffeeName: string,
  origin?: string,
  tastingNotes?: string[]
): Promise<string> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    return simulateCoffeeStory(coffeeName, origin, tastingNotes);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Write a captivating 2-sentence bite-sized tasting note and origin fact for a customer waiting for their ${coffeeName}.
Origin: ${origin || 'High-altitude micro-lot'}
Tasting notes: ${tastingNotes?.join(', ') || 'Chocolate, citrus, caramel'}

Focus on what makes the beans or processing method special. Keep it under 35 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.warn('Gemini story generation failed, using fallback:', error);
    return simulateCoffeeStory(coffeeName, origin, tastingNotes);
  }
}

function simulateAiReasoning(
  order: Order,
  ordersAhead: number,
  bottleneck: StationType | null,
  estimatedSeconds: number
): string {
  const mins = Math.ceil(estimatedSeconds / 60);
  const drinkNames = order.items.map(i => i.menuItem.name).join(', ');

  if (ordersAhead === 0) {
    return `Your ${drinkNames} is currently active on the bar. Extraction and temperature profiling are in progress — ready in ~${mins} min!`;
  }

  if (bottleneck === 'steam') {
    return `${ordersAhead} orders ahead with milk-steaming in high demand. We are texturing each pitcher to glossy micro-foam perfection. Estimated wait: ${mins} mins.`;
  }

  if (bottleneck === 'pour_over') {
    return `Your order is behind a precision slow-bar pour-over requiring a timed 45-second bloom. We will begin your ${drinkNames} right next! Estimated: ~${mins} mins.`;
  }

  return `Kitchen queue is moving with steady flow (${ordersAhead} tickets ahead). Your ${drinkNames} is scheduled for prompt pull in ~${mins} mins.`;
}

function simulateCoffeeStory(
  coffeeName: string,
  origin?: string,
  tastingNotes?: string[]
): string {
  if (coffeeName.toLowerCase().includes('oat') || coffeeName.toLowerCase().includes('flat white')) {
    return `Sourced from high-altitude volcanic soils in Ethiopia at 1,950m. Natural drying on raised beds highlights vibrant notes of ${tastingNotes?.slice(0, 2).join(' & ') || 'peach blossom and bergamot'}.`;
  }
  if (coffeeName.toLowerCase().includes('pour-over') || coffeeName.toLowerCase().includes('geisha')) {
    return `Prized Panamanian Geisha beans hand-picked on steep slopes. The delicate floral jasmine and honey notes emerge through our 93°C slow spiral pour.`;
  }
  if (coffeeName.toLowerCase().includes('nitro') || coffeeName.toLowerCase().includes('cold')) {
    return `Steeped cold for 18 hours to drop acidity by 65%, then charged with food-grade nitrogen to give a velvety, stout-like foam without a drop of dairy.`;
  }
  return `Grown in ${origin || 'high-altitude sustainable micro-lots'} and roasted in small 5kg batches to lock in delicate aromatic oils (${tastingNotes?.join(', ') || 'rich caramel and chocolate'}).`;
}
