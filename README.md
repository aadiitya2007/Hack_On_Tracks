# InvestDash

A unified investment dashboard for Indian retail investors, built as a hackathon prototype. It aggregates holdings across multiple brokers (Zerodha, Upstox, Groww, CDSL), highlights duplicates, calculates cross-broker P&L, and features a "Time Machine" simulator to see historical performance.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, Recharts, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM

## Local Setup

1. **Prerequisites**: Ensure you have Node.js 20+ and a running PostgreSQL instance.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   Create a `.env` file and set your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/investment_db?schema=public"
   ```
4. **Generate Prisma Client & Push Schema**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Seed the Database**:
   Populate the database with mock accounts, trades, and time machine history:
   ```bash
   npm run db:seed
   ```
6. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tests

To run the unit tests (e.g. data adapter logic):
```bash
npm run test
```

## Render Deployment Steps

This project includes a `render.yaml` blueprint for one-click deployment on [Render](https://render.com).

1. Commit all your code to a GitHub repository.
2. Log in to your Render Dashboard.
3. Go to **Blueprints** and click **New Blueprint Instance**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` file and provision:
   - A free **PostgreSQL Database** (`investment-db`)
   - A free **Web Service** (`indian-investment-dashboard`) running Node.
   - It will automatically link the database URL securely via `DATABASE_URL`.
6. Once deployed, the web service build command will automatically run `npm install`, generate the Prisma client, deploy migrations, and build the Next.js app.
