import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Unify — Unified Investment Portfolio Engine",
  description: "Unified Multi-Broker Investment & ML Prediction Dashboard",
  icons: {
    icon: '/logos/unify.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col relative z-10">
          {children}
          <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-border py-2 text-center text-[10px] font-bold tracking-wider uppercase text-text-muted z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            Unify • Simulated Demo • Not real financial data
          </div>
        </div>
      </body>
    </html>
  );
}
