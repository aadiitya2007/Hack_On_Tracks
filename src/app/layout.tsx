import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Unify — Unified Investment Portfolio Engine",
  description: "Unified Multi-Broker Investment & ML Prediction Dashboard",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logos/unify-icon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    shortcut: ['/favicon.ico']
  }
};

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          <div className="min-h-screen flex flex-col relative z-10">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
