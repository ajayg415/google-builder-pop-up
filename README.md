# The Café Companion — Better Waits ☕

> **Google Cloud Builder Pop-Up Solution**  
> An AI-powered café companion application that transforms the waiting and ordering experience for both customers and café teams.
> 
> 🌐 **Live Cloud Run Deployment**: [https://cafe-companion-39713706830.us-central1.run.app](https://cafe-companion-39713706830.us-central1.run.app)

---

## 🎯 The Problem: Better Waits
In artisanal and high-volume coffee shops, wait times are unpredictable and stressful. Traditional timer apps use static estimates that fail to account for station bottlenecks (e.g. steam wand backlogs, manual pour-over bloat, or pastry ovens).

**Café Companion** solves this with:
1. **Dynamic Kitchen Queue Intelligence**: Factors in exact equipment bottlenecks (espresso groupheads, steam wands, slow bar, batch taps, ovens) to compute accurate wait times.
2. **Transparent "Why This Wait?" Gemini AI Reasoning**: An attentive master barista AI that explains queue pacing in plain language powered by Google Gemini.
3. **Interactive Barista KDS (Kitchen Display System)**: Real-time two-way synchronization between the barista's station and the customer's phone.
4. **"Best Time to Visit" Predictive Analytics**: Hourly crowd and rush hour forecasting to help customers dodge the 8:30 AM morning commuter spike.
5. **"While You Wait" Bean Companion**: Contextual micro-stories showcasing bean terroir, altitude, and tasting notes while drinks are being crafted.

---

## 🛠️ Tech Stack & Google Technology

- **AI Engine**: Google Gemini API (`@google/generative-ai`, `gemini-1.5-flash`)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Icons & Motion**: Lucide React, Canvas Confetti
- **Telemetry & Queue Engine**: Deterministic station capacity algorithms with real-time reactive state

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone git@github.com:ajayg415/google-builder-pop-up.git
cd google-builder-pop-up
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile device.

### 3. Optional: Configure Gemini API Key
You can add your key via the in-app Settings modal or in `.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: An embedded high-fidelity queue simulation engine runs out-of-the-box even without an API key).*

---

## 📐 Scalable Architecture
Designed with a modular foundation to easily plug in future tracks:
- `src/services/waitPredictor.ts`: Queue mathematical modeling and crowd analytics.
- `src/services/gemini.ts`: Centralized Google Gemini AI service.
- `src/store/cafeStore.tsx`: Reactive state store structured like Firestore collections.
- `src/components/customer/`: Mobile-first customer experience.
- `src/components/barista/`: Barista Kitchen Display System.
