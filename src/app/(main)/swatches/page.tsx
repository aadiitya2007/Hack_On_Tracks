'use client';
import { ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SwatchPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-text-primary">Design System Swatches</h1>
        <p className="text-text-secondary text-sm mb-6">Review the color palette in both Light and Dark themes.</p>
      </div>

      {/* 1. Surfaces */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">1. Surfaces & Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 flex flex-col gap-4">
            <p className="text-text-primary font-semibold">Standard Card Surface</p>
            <p className="text-text-secondary text-sm">Secondary text used for descriptions and subtitles.</p>
            <p className="text-text-muted text-xs">Muted text used for fine print, disclaimers, or timestamps.</p>
          </div>
          <div className="card p-6 border-accent/30 bg-accent-bg flex flex-col gap-4">
            <p className="text-accent font-semibold">Subtle Tinted Surface (Accent)</p>
            <p className="text-text-primary text-sm">Used for active states or highlighted blocks.</p>
            <button className="btn-primary w-max">Accent Button</button>
          </div>
        </div>
      </section>

      {/* 2. Semantic Colors */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">2. Semantic Meaning (Gain / Loss / Status)</h2>
        <div className="flex flex-wrap gap-6">
          
          <div className="card p-5 w-48 flex flex-col gap-2">
            <p className="text-xs font-semibold text-text-secondary uppercase">Gain</p>
            <div className="text-2xl font-bold tabular-nums text-text-primary">₹14,500</div>
            <span className="pill-gain self-start">
              <ArrowUpRight size={14} />
              +2.34%
            </span>
          </div>

          <div className="card p-5 w-48 flex flex-col gap-2">
            <p className="text-xs font-semibold text-text-secondary uppercase">Loss</p>
            <div className="text-2xl font-bold tabular-nums text-text-primary">₹2,300</div>
            <span className="pill-loss self-start">
              <ArrowDownRight size={14} />
              -1.12%
            </span>
          </div>

          <div className="card p-5 w-48 flex flex-col gap-2">
            <p className="text-xs font-semibold text-text-secondary uppercase">Warning / Pending</p>
            <div className="text-2xl font-bold tabular-nums text-text-primary">Review</div>
            <span className="pill-warning self-start">
              <AlertCircle size={14} />
              Action Needed
            </span>
          </div>

          <div className="card p-5 w-48 flex flex-col gap-2">
            <p className="text-xs font-semibold text-text-secondary uppercase">Success (Alt)</p>
            <div className="text-2xl font-bold tabular-nums text-text-primary">Synced</div>
            <span className="pill-gain self-start">
              <CheckCircle2 size={14} />
              Completed
            </span>
          </div>

        </div>
      </section>

      {/* 3. Asset Classes */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">3. Asset Classes (Chart Colors)</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          
          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-stocks)' }}></div>
            <p className="text-sm font-medium">Stocks</p>
            <p className="text-[10px] text-text-muted">Blue</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-bonds)' }}></div>
            <p className="text-sm font-medium">Bonds</p>
            <p className="text-[10px] text-text-muted">Amber</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-reits)' }}></div>
            <p className="text-sm font-medium">REITs</p>
            <p className="text-[10px] text-text-muted">Teal</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-invits)' }}></div>
            <p className="text-sm font-medium">InvITs</p>
            <p className="text-[10px] text-text-muted">Violet</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-funds)' }}></div>
            <p className="text-sm font-medium">Mutual Funds</p>
            <p className="text-[10px] text-text-muted">Orange</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-md" style={{ backgroundColor: 'var(--color-asset-cash)' }}></div>
            <p className="text-sm font-medium">Cash</p>
            <p className="text-[10px] text-text-muted">Slate</p>
          </div>

        </div>
      </section>

    </div>
  );
}
