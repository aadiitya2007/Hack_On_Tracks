# VaultIQ - Unified Financial Engine

VaultIQ is an intelligent, unified investment dashboard and financial literacy platform designed for Indian retail investors. 

*Built for the Hackathon.*

## 🏆 The Problem
Retail investors in India often have fragmented portfolios spread across multiple brokerages (Zerodha, Groww, Upstox). This leads to duplicate DP charges on overlapping holdings, a lack of clear asset allocation insights, and—most dangerously—panic selling during market dips due to a lack of core financial literacy. Furthermore, many legacy brokerages do not provide open APIs to export historical buy prices.

## 🚀 Our Solution
VaultIQ solves this by unifying fragmented data and pairing it with interactive, risk-free education:
1. **Unified Telemetry**: Connect brokerages via mock API or our offline **Mail Sync Engine** (parsing PDFs locally) to see your true net worth, P&L, and overlapping assets in one place.
2. **Practice Trading Engine**: A risk-free ₹10L virtual sandbox with a "Time Warp" feature to simulate market crashes, rate hikes, and see the long-term compounding effects of SIPs.
3. **Interactive Learn Modules**: Stop reading dry wikis. We provide guided, conversational lessons with virtual mentors (Aarav & Meera) and mathematical simulators for Stocks, Mutual Funds, ETFs, Bonds, REITs, and InvITs.
4. **Ask VaultIQ**: An intelligent, embedded AI Assistant that streams context-aware answers about your portfolio while strictly adhering to compliance rules (no personalized advice).

## 💻 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Strict custom design token system)
- **Database**: Prisma ORM + SQLite (Easily swappable to PostgreSQL)
- **Animation**: Framer Motion
- **Charts**: Recharts

## 🧑‍⚖️ Guide for Hackathon Judges

To evaluate this prototype, we highly recommend following this exact flow:

### 1. The Landing Page & Onboarding
- Start at `http://localhost:3000/`. Notice the custom scroll-reveal animations and the ultra-clean, Alizo-inspired design system.
- Click **"Sign Up"** to see our simulated, privacy-first onboarding flow (mock PAN verification and Aadhaar consent).

### 2. The Dashboard (`/dashboard`)
- Watch the live telemetry load. 
- Look for the **"Cross-Broker Overlap Detected"** alert in the top right. This represents our engine saving users money on duplicate DP charges.
- Click **"Simulate Trade"** on any holding to see how buying/selling affects the overall asset allocation doughnut chart in real-time before executing a real trade.

### 3. The Mail Sync Engine (`/accounts`)
- Navigate to "Accounts" via the sidebar.
- Scroll down to the **Mail Sync (Beta)** section. This solves the "Legacy Broker" problem.
- Click **Upload Statement** to establish a baseline, then click **Scan Inbox & Process Emails**. Watch as the engine parses local simulated PDF contract notes to extract missing `BUY` and `SELL` quantities.

### 4. Interactive Learning (`/learn`)
- Go to the **Learn** module and click on **"Stocks"**.
- Scroll through the beautifully animated conversational dialogue between our virtual mentors.
- Play with the **Returns Calculator** slider to see real-time P&L changes.
- Click **"Start 1-Year Sim"** on the *Rollercoaster Simulator* to watch a mathematically generated random-walk stock chart respond to simulated news events.

### 5. Ask VaultIQ (AI Chat)
- At any time, click the purple floating chat bubble in the bottom right corner.
- Ask it: *"What is a stock?"* or *"Should I buy Reliance?"*
- Watch the text stream out character-by-character. Notice how it refuses to give personalized financial advice to remain compliant!

## 🛠️ Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Reset and Seed the Database**:
   ```bash
   npx prisma db push --force-reset
   npx tsx prisma/seed.ts
   node seed_questions.js
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🎨 Design System Note
This prototype was custom-designed using an ultra-vibrant, strict 4-color CSS variable token system. No off-the-shelf component libraries (like Bootstrap or MUI) were used. All components (Cards, Steppers, Dialogues, Charts) were built entirely from scratch with Tailwind v4 for maximum performance and a premium SaaS aesthetic.
