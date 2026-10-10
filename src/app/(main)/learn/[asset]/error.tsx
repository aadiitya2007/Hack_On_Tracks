'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error("Learn Section Error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto pt-24 text-center">
      <div className="card p-12 bg-loss-bg border-loss/20 text-loss">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-8 font-medium">We couldn't load this lesson module. It might be missing or there was an error processing the content.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => reset()} className="px-6 py-3 bg-loss text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Try Again
          </button>
          <Link href="/learn" className="px-6 py-3 bg-white text-loss font-bold rounded-xl border border-loss/20 hover:bg-white/80 transition-colors">
            Back to Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
