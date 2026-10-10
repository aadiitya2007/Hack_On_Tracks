import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "VaultIQ",
  description: "Unified Investment Dashboard",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%236D28D9"/><path d="M30 70V50l20-20 20 20v20" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
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
            VaultIQ • Simulated Demo • Not real financial data
          </div>
        </div>
      </body>
    </html>
  );
}
