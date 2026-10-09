# VaultIQ - Unified Investment Dashboard

VaultIQ is a desktop-first hackathon prototype for Indian retail investors, built with Next.js (App Router), Tailwind CSS v4, shadcn/ui, Framer Motion, Recharts, and Prisma.

## 🚀 Features

1. **Simulated Onboarding**: Mock PAN validation, OTP, and Aadhaar consent with clear "simulated" warnings.
2. **Unified Dashboard**: Live multi-broker telemetry, asset allocation donut charts, PnL tracking, and a cross-broker duplication alert.
3. **Time Machine**: Deterministic historical trajectory calculator demonstrating the power of long-term compounding across asset classes.
4. **Knowledge Check**: 15-question interactive financial literacy MCQ with dynamic feedback and investor leveling.
5. **Practice Trading**: Virtual ₹10,00,000 portfolio sandbox with a "Time-Warp" engine simulating market crashes, rate hikes, and SIP rupee-cost averaging.
6. **Mail Sync (Beta)**: An independent parser module for users without API-enabled brokers. Features a "Demo Mailbox" mode simulating Gmail OAuth read-only extraction of PDF contract notes.
7. **Ask VaultIQ**: Floating AI Assistant mock to answer portfolio queries (non-advisory).

## 💻 Local Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Setup the Prisma SQLite database and seed the mock data:
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## ☁️ Deployment (Render)

This repository includes a `render.yaml` blueprint.
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Choose "Blueprint" -> Connect `render.yaml`.
3. Render will automatically build the Next.js app, run the Prisma generation, and start the web service using the provided commands.

## 🔒 Privacy & Safety

- **No Real Data Storage**: Aadhaar and PAN inputs are purely for the front-end simulation flow.
- **Read-Only Scope**: The Mail Sync module utilizes `gmail.readonly` scopes and processes logic exclusively on-server. Passwords for PDFs are never stored in plain text.
- **No Financial Advice**: All assistant interactions and practice scenarios carry clear disclaimers that they are educational tools.

---
*Logos belong to their respective owners, used for identification in a demo.*
