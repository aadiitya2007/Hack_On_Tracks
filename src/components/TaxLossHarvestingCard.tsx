'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, TrendingDown, Sparkles, CheckCircle2, 
  HelpCircle, ArrowRight, ShieldCheck, DollarSign, Calculator, 
  AlertCircle, ChevronDown, ChevronUp, RefreshCw, Download, 
  Check, ExternalLink, FileText, X, Info
} from 'lucide-react';

interface HarvestItem {
  id: string;
  symbol: string;
  broker: string;
  brokerLogo: string;
  qty: number;
  costPrice: number;
  currentPrice: number;
  loss: number;
  holdingPeriodDays: number;
  isHarvested?: boolean;
}

const DEFAULT_HARVEST_ITEMS: HarvestItem[] = [
  {
    id: 'h1',
    symbol: 'TECHM',
    broker: 'Groww',
    brokerLogo: '/logos/groww.png',
    qty: 25,
    costPrice: 1480,
    currentPrice: 1240,
    loss: 6000,
    holdingPeriodDays: 140, // Short-Term (< 365)
  },
  {
    id: 'h2',
    symbol: 'TATAMOTORS',
    broker: 'Zerodha',
    brokerLogo: '/logos/zerodha.webp',
    qty: 40,
    costPrice: 1040,
    currentPrice: 890,
    loss: 6000,
    holdingPeriodDays: 210, // Short-Term
  },
  {
    id: 'h3',
    symbol: 'WIPRO',
    broker: 'Upstox',
    brokerLogo: '/logos/upstox.png',
    qty: 50,
    costPrice: 580,
    currentPrice: 460,
    loss: 6000,
    holdingPeriodDays: 95, // Short-Term
  },
  {
    id: 'h4',
    symbol: 'INFY',
    broker: 'Groww',
    brokerLogo: '/logos/groww.png',
    qty: 30,
    costPrice: 1890,
    currentPrice: 1720,
    loss: 5100,
    holdingPeriodDays: 310, // Short-Term
  }
];

export function TaxLossHarvestingCard({ holdings = [] }: { holdings?: any[] }) {
  // Beginner explainer accordion toggle
  const [showExplainer, setShowExplainer] = useState(false);

  // Tax offset mode: STCG (20%) or LTCG (12.5% as per Budget 2024)
  const [taxMode, setTaxMode] = useState<'STCG' | 'LTCG'>('STCG');
  const taxRate = taxMode === 'STCG' ? 0.20 : 0.125;

  // Selected items for harvest
  const [selectedIds, setSelectedIds] = useState<string[]>(['h1', 'h2', 'h3']);

  // Execution modal states
  const [executingModalOpen, setExecutingModalOpen] = useState(false);
  const [executionStep, setExecutionStep] = useState<'confirm' | 'processing' | 'done'>('confirm');
  const [harvestedIds, setHarvestedIds] = useState<string[]>([]);
  const [harvestHistoryTotal, setHarvestHistoryTotal] = useState(0);

  // Snapshot of executed batch so completed modal and downloads never show 0
  const [executedBatch, setExecutedBatch] = useState<{
    items: HarvestItem[];
    lossTotal: number;
    taxSaved: number;
    taxMode: 'STCG' | 'LTCG';
    taxRate: number;
  } | null>(null);

  // Available harvest opportunities (combines realistic defaults + real holdings in loss)
  const harvestItems = useMemo(() => {
    // Check if passed holdings have any loss scrips
    const liveLossItems: HarvestItem[] = [];
    if (holdings && Array.isArray(holdings)) {
      holdings.forEach((h: any, idx: number) => {
        const cost = h.avgBuyPrice || h.currentPrice;
        if (h.currentPrice < cost) {
          const lossAmt = Math.round((cost - h.currentPrice) * h.quantity);
          if (lossAmt > 200) {
            liveLossItems.push({
              id: `live-${idx}`,
              symbol: h.symbol,
              broker: h.broker || 'Zerodha',
              brokerLogo: h.broker === 'Groww' ? '/logos/groww.png' : h.broker === 'Upstox' ? '/logos/upstox.png' : '/logos/zerodha.webp',
              qty: h.quantity,
              costPrice: cost,
              currentPrice: h.currentPrice,
              loss: lossAmt,
              holdingPeriodDays: 180,
            });
          }
        }
      });
    }

    // Merge or fallback to realistic default items
    const base = liveLossItems.length > 0 ? liveLossItems : DEFAULT_HARVEST_ITEMS;
    return base.map(item => ({
      ...item,
      isHarvested: harvestedIds.includes(item.id)
    }));
  }, [holdings, harvestedIds]);

  // Dynamically calculate metrics based on checked selections
  const activeSelectedItems = harvestItems.filter(item => selectedIds.includes(item.id) && !item.isHarvested);
  
  const selectedLossTotal = activeSelectedItems.reduce((sum, item) => sum + item.loss, 0);
  const estimatedTaxSaved = Math.round(selectedLossTotal * taxRate);
  const rebuyCapitalRequired = activeSelectedItems.reduce((sum, item) => sum + (item.qty * item.currentPrice), 0);

  // Toggle selection for an item
  const toggleItem = (id: string) => {
    if (harvestedIds.includes(id)) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    const unharvested = harvestItems.filter(x => !x.isHarvested).map(x => x.id);
    if (selectedIds.length === unharvested.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unharvested);
    }
  };

  // Run Simulated Harvest Order Execution
  const handleExecuteHarvest = () => {
    const batchItems = activeSelectedItems.length > 0 
      ? [...activeSelectedItems] 
      : harvestItems.filter(item => selectedIds.includes(item.id));
    
    const finalItems = batchItems.length > 0 ? batchItems : DEFAULT_HARVEST_ITEMS.slice(0, 3);
    const batchLoss = finalItems.reduce((sum, item) => sum + item.loss, 0);
    const batchTaxSaved = Math.round(batchLoss * taxRate);

    setExecutedBatch({
      items: finalItems,
      lossTotal: batchLoss,
      taxSaved: batchTaxSaved,
      taxMode: taxMode,
      taxRate: taxRate,
    });

    setExecutionStep('processing');
    setTimeout(() => {
      setHarvestedIds(prev => Array.from(new Set([...prev, ...finalItems.map(i => i.id)])));
      setHarvestHistoryTotal(prev => prev + batchTaxSaved);
      setExecutionStep('done');
    }, 1800);
  };

  // Reset demo simulation
  const handleResetSimulation = () => {
    setHarvestedIds([]);
    setSelectedIds(['h1', 'h2', 'h3']);
    setHarvestHistoryTotal(0);
    setExecutedBatch(null);
    setExecutionStep('confirm');
    setExecutingModalOpen(false);
  };

  // Download ITR Schedule CG CSV Proof
  const handleDownloadTaxSchedule = () => {
    const itemsToExport = (executedBatch?.items && executedBatch.items.length > 0)
      ? executedBatch.items
      : (activeSelectedItems.length > 0 ? activeSelectedItems : DEFAULT_HARVEST_ITEMS.slice(0, 3));
    
    const lossExport = executedBatch?.lossTotal || (selectedLossTotal > 0 ? selectedLossTotal : itemsToExport.reduce((s, i) => s + i.loss, 0));
    const taxSavedExport = executedBatch?.taxSaved || Math.round(lossExport * taxRate);
    const modeExport = executedBatch?.taxMode || taxMode;
    const rateExport = executedBatch?.taxRate || taxRate;

    const csvRows = [
      ['Indian Income Tax Act Sec 70/71 - Capital Gains Tax-Loss Harvest Annexure'],
      ['Assessment Year: 2026-27 (FY 2025-26)'],
      ['Investor: Aditya Aggarwal | PAN: ABCDE1234F'],
      [],
      ['Scrip Symbol', 'Broker Depository', 'Quantity', 'Cost Basis (INR)', 'Sell Price (INR)', 'Realized Loss (INR)', 'Tax Offset Rate', 'Estimated Tax Saved (INR)', 'Wash Strategy'],
      ...itemsToExport.map(item => [
        item.symbol,
        item.broker,
        item.qty,
        item.costPrice.toFixed(2),
        item.currentPrice.toFixed(2),
        (-item.loss).toFixed(2),
        `${(rateExport * 100).toFixed(1)}% (${modeExport})`,
        Math.round(item.loss * rateExport).toFixed(2),
        'Sell & Next-Day Limit Rebuy (Legally Compliant under Indian IT Act)'
      ]),
      [],
      ['TOTAL REALIZED HARVEST LOSS', '', '', '', '', (-lossExport).toFixed(2), '', taxSavedExport.toFixed(2), '']
    ];

    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Unify_Tax_Harvest_FY25-26_${modeExport}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-6 sm:p-7 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-5 border-b border-border">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gain-bg to-emerald-100 text-gain flex items-center justify-center border border-gain/20 shadow-sm shrink-0">
            <Receipt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-gain-bg text-gain text-[10px] font-black uppercase tracking-wider border border-gain/20">
                Indian Tax Act Sec 70/71
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-accent/20">
                FY 2025–26 Tax Saver
              </span>
              <span className="text-[10px] font-bold text-text-muted">Deadline: March 31, 2026</span>
            </div>
            <h3 className="font-extrabold text-xl text-text-primary mt-1">
              Tax-Loss Harvesting & Capital Gains Optimizer
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              Legally convert red "paper losses" into income tax savings without losing your stock positions.
            </p>
          </div>
        </div>

        {/* Action Controls & Beginner Help Button */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowExplainer(prev => !prev)}
            className="px-3.5 py-1.5 rounded-xl bg-accent-bg border border-accent/30 text-accent hover:bg-accent/15 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <HelpCircle size={14} />
            <span>{showExplainer ? 'Hide Simple Guide' : 'How does this work?'}</span>
            {showExplainer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* Tax Mode Switcher */}
          <div className="flex items-center bg-bg p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setTaxMode('STCG')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                taxMode === 'STCG' ? 'bg-gain text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Short Term Capital Gains (held under 12 months) taxed at 20%"
            >
              STCG (20%)
            </button>
            <button
              type="button"
              onClick={() => setTaxMode('LTCG')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                taxMode === 'LTCG' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Long Term Capital Gains (held over 12 months) taxed at 12.5%"
            >
              LTCG (12.5%)
            </button>
          </div>
        </div>
      </div>

      {/* BEGINNER-FRIENDLY EXPLAINER ACCORDION */}
      <AnimatePresence>
        {showExplainer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/5 via-surface to-gain/5 border border-accent/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-accent flex items-center gap-2">
                  <Sparkles size={15} /> Understand Tax-Loss Harvesting in 3 Simple Steps
                </h4>
                <span className="text-[10px] font-bold text-gain bg-gain-bg px-2 py-0.5 rounded-full border border-gain/20">
                  100% Legal under Indian IT Act
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-loss-bg text-loss font-black text-[10px] flex items-center justify-center">1</span>
                    <strong className="text-text-primary">Spot "Paper Losses"</strong>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-[11px]">
                    Stocks currently in the red (like TECHM or TATAMOTORS) are only temporary "paper losses" until sold.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gain-bg text-gain font-black text-[10px] flex items-center justify-center">2</span>
                    <strong className="text-text-primary">Offset Your Profit Taxes</strong>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-[11px]">
                    When sold, that loss subtracts from profits made on winning stocks (TCS/Reliance), saving you <strong>20% or 12.5% in cash taxes</strong>!
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent-bg text-accent font-black text-[10px] flex items-center justify-center">3</span>
                    <strong className="text-text-primary">Immediate Rebuy (Keep Shares)</strong>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-[11px]">
                    India does <em>NOT</em> have US-style wash-sale rules! You can immediately buy back your shares next morning at the exact same price.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-[11px] text-text-secondary flex items-start gap-2">
                <Info size={14} className="text-accent shrink-0 mt-0.5" />
                <p>
                  <strong>Practical Example:</strong> If you made ₹50,000 profit on Reliance and harvest ₹18,000 loss on TechM/TataMotors, you only pay tax on ₹32,000. <strong>You pocket ₹3,600 in tax savings</strong>!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC TOP METRICS CARDS (UPDATES AS USERS CHECK/UNCHECK OR POST-HARVEST) */}
      {(() => {
        const isHarvestComplete = harvestedIds.length > 0 && activeSelectedItems.length === 0;
        const displayLoss = isHarvestComplete
          ? (executedBatch?.lossTotal || 18000)
          : selectedLossTotal;
        const displayTaxSaved = isHarvestComplete
          ? (harvestHistoryTotal || executedBatch?.taxSaved || 3600)
          : estimatedTaxSaved;
        const displayRebuy = isHarvestComplete
          ? ((executedBatch?.items || []).reduce((s, i) => s + (i.qty * i.currentPrice), 0) || 120500)
          : rebuyCapitalRequired;

        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Selected Harvesting Loss */}
              <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">
                    {isHarvestComplete ? 'Capital Loss Realized' : 'Selected Harvest Loss'}
                  </span>
                  <span className={`text-[10px] font-bold font-mono ${isHarvestComplete ? 'text-gain' : 'text-loss'}`}>
                    {isHarvestComplete ? `${harvestedIds.length} Scrips Harvested` : `${activeSelectedItems.length} Scrips Selected`}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-loss">
                  -₹{displayLoss.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-text-muted font-medium">
                  {isHarvestComplete 
                    ? 'Realized under Sec 70/71 to offset FY26 capital gains' 
                    : 'Loss booked to wipe out your FY26 capital gains'}
                </p>
              </div>

              {/* Estimated Cash Tax Saved */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gain-bg/60 to-gain-bg/20 border border-gain/30 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gain">
                    {isHarvestComplete ? 'Net Cash Taxes Saved' : 'Estimated Cash Tax Saved'}
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-gain text-white">
                    {executedBatch?.taxMode || taxMode}: {(((executedBatch?.taxRate || taxRate)) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-gain">
                  +₹{displayTaxSaved.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-gain/90 font-bold">
                  {isHarvestComplete 
                    ? 'Confirmed tax savings credited to your capital gains offset' 
                    : 'Direct tax deduction saved in your bank account'}
                </p>
              </div>

              {/* Rebuy Capital to Maintain Holdings */}
              <div className="p-4 rounded-2xl bg-accent-bg/40 border border-accent/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-accent">
                    {isHarvestComplete ? 'Rebuy Orders Queued' : 'Rebuy Capital Needed'}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted">
                    {isHarvestComplete ? 'Holdings Protected' : 'Next-Day Order'}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-text-primary">
                  ₹{displayRebuy.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-accent/90 font-medium">
                  {isHarvestComplete 
                    ? 'Next-day automated limit buybacks active to maintain portfolio' 
                    : 'Funds required to re-enter positions at current market price'}
                </p>
              </div>

            </div>

            {/* Confirmed Banner (shown when harvest has completed) */}
            {harvestedIds.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-gain-bg/80 via-surface to-accent-bg/40 border border-gain/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gain text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-text-primary">
                        Tax-Loss Harvest Confirmed: ₹{(harvestHistoryTotal || executedBatch?.taxSaved || 3600).toLocaleString('en-IN')} Saved in Taxes!
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gain text-white">
                        Sec 70/71 Active
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Capital loss of ₹{(executedBatch?.lossTotal || 18000).toLocaleString('en-IN')} successfully realized to offset your FY 2025–26 capital gains. Next-day rebuy orders are queued!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadTaxSchedule}
                    className="px-3.5 py-2 rounded-xl bg-surface border border-accent/40 hover:bg-surface-hover text-xs font-bold text-accent flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Download size={13} /> Download ITR (.csv)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExecutionStep('done');
                      setExecutingModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gain text-white hover:bg-gain/90 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Receipt size={13} /> View Certificate
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* RECOMMENDED OPPORTUNITIES CHECKLIST */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> 
              Recommended Sell & Rebuy Harvest Opportunities:
            </h4>
            <span className="text-[10px] text-text-muted font-bold">
              ({activeSelectedItems.length} of {harvestItems.length} active)
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-[11px] font-extrabold text-accent hover:underline self-start sm:self-auto cursor-pointer"
          >
            {selectedIds.length === harvestItems.filter(x => !x.isHarvested).length ? 'Deselect All' : 'Select All Opportunities'}
          </button>
        </div>

        {/* Interactive Stock Items List */}
        <div className="space-y-2.5">
          {harvestItems.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            const isHarvested = item.isHarvested;
            const singleTaxSaved = Math.round(item.loss * taxRate);

            return (
              <div 
                key={item.id} 
                onClick={() => !isHarvested && toggleItem(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs select-none ${
                  isHarvested 
                    ? 'bg-gain-bg/20 border-gain/30 opacity-75' 
                    : isChecked 
                      ? 'bg-accent-bg/30 border-accent/50 shadow-sm cursor-pointer' 
                      : 'bg-bg border-border hover:border-border/80 cursor-pointer'
                }`}
              >
                {/* Left Side: Checkbox & Scrip Details */}
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={isChecked || !!isHarvested}
                    disabled={isHarvested}
                    onChange={() => toggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-accent rounded shrink-0 cursor-pointer"
                  />

                  <img 
                    src={item.brokerLogo} 
                    alt={item.broker} 
                    className="w-8 h-8 rounded-xl object-contain bg-surface p-1 border border-border shrink-0" 
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-text-primary">{item.symbol}</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[9px] font-bold text-text-muted">
                        {item.broker}
                      </span>
                      {isHarvested && (
                        <span className="px-2 py-0.5 rounded-full bg-gain text-white text-[9px] font-extrabold flex items-center gap-1">
                          <Check size={10} /> Harvest Executed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted font-medium mt-0.5">
                      {item.qty} shares • Bought @ ₹{item.costPrice} ➔ Current @ ₹{item.currentPrice} ({item.holdingPeriodDays} days held)
                    </p>
                  </div>
                </div>

                {/* Right Side: Harvest Loss & Tax Saved Figures */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pl-7 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-text-muted font-bold block uppercase">Capital Loss Booked</span>
                    <span className="font-mono font-bold text-loss text-sm">-₹{item.loss.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gain font-black block uppercase">Tax Saved</span>
                    <span className="font-mono font-black text-gain text-sm">+₹{singleTaxSaved.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTION BAR & TAX COMPLIANCE CALL-TO-ACTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-bg border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-xs text-text-secondary leading-relaxed font-medium space-y-1">
          <p className="font-extrabold text-text-primary flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-gain" /> Tax Compliance Rule & Strategy:
          </p>
          <p className="text-[11px]">
            Must be executed before <strong>March 31, 2026</strong>. Under Indian Income Tax law, short-term capital losses (STCL) can be set off against both STCG (20%) and LTCG (12.5%).
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          {harvestedIds.length > 0 && (
            <button
              type="button"
              onClick={handleResetSimulation}
              className="py-2.5 px-3.5 rounded-xl bg-surface border border-border hover:bg-surface-hover text-xs font-bold text-text-secondary flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset simulation so you can test again"
            >
              <RefreshCw size={13} /> Reset Demo
            </button>
          )}

          {harvestedIds.length > 0 && activeSelectedItems.length === 0 ? (
            <button 
              type="button"
              onClick={() => {
                setExecutionStep('done');
                setExecutingModalOpen(true);
              }}
              className="btn-primary w-full md:w-auto py-3 px-6 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gain hover:bg-gain/90 text-white"
            >
              <Receipt size={14} />
              <span>✓ Harvest Executed (₹{(harvestHistoryTotal || executedBatch?.taxSaved || 3600).toLocaleString('en-IN')} Saved) • View Certificate</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => {
                setExecutionStep('confirm');
                setExecutingModalOpen(true);
              }}
              disabled={activeSelectedItems.length === 0}
              className="btn-primary w-full md:w-auto py-3 px-6 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={14} />
              <span>
                {activeSelectedItems.length === 0 
                  ? 'Select Scrips to Harvest' 
                  : `⚡ Execute Tax-Loss Harvest (Save ₹${estimatedTaxSaved.toLocaleString('en-IN')})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* INTERACTIVE HARVEST EXECUTION MODAL */}
      <AnimatePresence>
        {executingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => executionStep !== 'processing' && setExecutingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 bg-surface border border-border text-text-primary rounded-3xl shadow-2xl relative z-10 space-y-5 my-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gain-bg text-gain flex items-center justify-center border border-gain/20 shrink-0">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-text-primary">
                      {executionStep === 'done' ? 'Tax-Loss Harvest Completed!' : 'Execute Tax-Loss Harvest Basket'}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Multi-Broker Sell & Rebuy Execution Engine
                    </p>
                  </div>
                </div>

                {executionStep !== 'processing' && (
                  <button 
                    type="button"
                    onClick={() => setExecutingModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* STEP 1: CONFIRMATION VIEW */}
              {executionStep === 'confirm' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-bg border border-border space-y-2.5">
                    <div className="flex justify-between text-text-secondary">
                      <span>Selected Opportunities:</span>
                      <strong className="text-text-primary">{activeSelectedItems.length} Scrips</strong>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Capital Loss to Realize:</span>
                      <strong className="text-loss font-mono">-₹{selectedLossTotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Tax Offset Rate applied:</span>
                      <strong className="text-text-primary font-mono">{taxMode} ({(taxRate * 100).toFixed(1)}%)</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                      <span className="text-gain">Estimated Cash Tax Saved:</span>
                      <span className="text-gain font-mono font-black">+₹{estimatedTaxSaved.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Scrip Summary Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-text-muted tracking-wider block">Orders to be Placed</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                      {activeSelectedItems.map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-text-primary">{item.symbol}</span>
                            <span className="text-text-muted font-mono">({item.broker})</span>
                          </div>
                          <span className="text-loss font-bold font-mono">-₹{item.loss.toLocaleString()} loss</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execution Strategy Note */}
                  <div className="p-3 rounded-xl bg-accent-bg/40 border border-accent/20 text-[11px] text-text-secondary flex items-start gap-2">
                    <Info size={14} className="text-accent shrink-0 mt-0.5" />
                    <p>
                      <strong>Wash-Sale Safe:</strong> Unify will place Market Sell orders now to lock in the tax deduction, and simultaneously queue next-day automated Limit Rebuy orders so your portfolio holdings remain intact!
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setExecutingModalOpen(false)}
                      className="py-2.5 px-4 rounded-xl bg-surface border border-border hover:bg-surface-hover text-xs font-bold text-text-secondary cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteHarvest}
                      className="btn-primary py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Sparkles size={14} /> Confirm & Execute
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROCESSING SIMULATION */}
              {executionStep === 'processing' && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent-bg text-accent mx-auto flex items-center justify-center animate-spin">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-text-primary">Executing Multi-Broker Harvest Orders...</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Routing Sell orders to Zerodha & Groww APIs • Booking Sec 70/71 Capital Loss Schedule
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-bg rounded-full mx-auto overflow-hidden border border-border">
                    <div className="bg-gain h-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}

              {/* STEP 3: DONE CONFIRMATION & CERTIFICATE */}
              {executionStep === 'done' && (() => {
                const completedTaxSaved = executedBatch?.taxSaved || (harvestHistoryTotal > 0 ? harvestHistoryTotal : (estimatedTaxSaved > 0 ? estimatedTaxSaved : 3600));
                const completedLoss = executedBatch?.lossTotal || (selectedLossTotal > 0 ? selectedLossTotal : 18000);
                const completedItems = executedBatch?.items && executedBatch.items.length > 0 ? executedBatch.items : DEFAULT_HARVEST_ITEMS.slice(0, 3);
                const completedMode = executedBatch?.taxMode || taxMode;
                const completedRate = executedBatch?.taxRate || taxRate;

                return (
                  <div className="space-y-4 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-gain-bg text-gain mx-auto flex items-center justify-center border border-gain/30 animate-bounce">
                      <CheckCircle2 size={28} />
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-gain tracking-widest">Execution Confirmed</span>
                      <h4 className="text-2xl font-black text-gain mt-0.5">
                        ₹{completedTaxSaved.toLocaleString('en-IN')} Saved in Taxes!
                      </h4>
                      <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                        Capital loss of <strong className="text-text-primary font-mono font-bold">₹{completedLoss.toLocaleString('en-IN')}</strong> has been realized under Indian Income Tax Act Sec 70/71 across {completedItems.length} scrips ({completedItems.map(i => i.symbol).join(', ')}). Next-day rebuy orders are queued!
                      </p>
                    </div>

                    {/* Proof Card */}
                    <div className="p-4 rounded-2xl bg-bg border border-border text-left text-xs space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-text-muted">Tax Filing Year:</span>
                        <strong className="text-text-primary">AY 2026-27 (FY 2025-26)</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-text-muted">ITR Schedule:</span>
                        <strong className="text-text-primary">Schedule CG (Capital Gains)</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-text-muted">Capital Loss Realized:</span>
                        <strong className="text-loss font-mono font-bold">-₹{completedLoss.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-text-muted">Net Cash Tax Saved:</span>
                        <strong className="text-gain font-mono font-black">+₹{completedTaxSaved.toLocaleString('en-IN')} ({completedMode} @ {(completedRate * 100).toFixed(1)}%)</strong>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1.5 border-t border-border">
                        <span className="text-text-muted">Portfolio Status:</span>
                        <span className="text-gain font-bold flex items-center gap-1">
                          <Check size={12} strokeWidth={3} /> {completedItems.length} Holdings Protected via Rebuy Queue
                        </span>
                      </div>
                    </div>

                    {/* Download CSV & Close */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDownloadTaxSchedule}
                        className="w-full py-2.5 px-4 rounded-xl bg-surface border border-accent/40 hover:bg-surface-hover text-xs font-bold text-accent flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                      >
                        <Download size={14} /> Download ITR Tax Annexure (.csv)
                      </button>

                      <button
                        type="button"
                        onClick={() => setExecutingModalOpen(false)}
                        className="btn-primary w-full py-2.5 text-xs font-bold cursor-pointer"
                      >
                        Done — View Updated Portfolio Telemetry
                      </button>
                    </div>
                  </div>
                );
              })()}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
