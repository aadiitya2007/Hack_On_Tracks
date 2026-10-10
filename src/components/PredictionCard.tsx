'use client';
import { useState, useEffect } from 'react';
import { RefreshCcw, Activity, ShieldAlert, Cpu } from 'lucide-react';

export function PredictionCard({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/metrics/${symbol}`);
      if (!res.ok) throw new Error('Service unavailable');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Prediction service is currently asleep or unreachable.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (symbol) fetchPrediction();
  }, [symbol]);

  if (loading) return (
    <div className="card p-6 h-64 flex flex-col items-center justify-center animate-pulse">
      <Cpu className="text-text-muted mb-4 animate-spin-slow" size={32} />
      <p className="text-sm font-bold text-text-muted">Waking up ML Service...</p>
    </div>
  );

  if (error) return (
    <div className="card p-6 bg-surface-hover flex flex-col items-center justify-center text-center">
      <p className="text-sm font-bold text-text-secondary mb-4">{error}</p>
      <button onClick={fetchPrediction} className="px-4 py-2 bg-bg border border-border rounded-lg text-sm font-bold hover:border-accent transition-colors flex items-center gap-2">
        <RefreshCcw size={14} /> Retry
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="card overflow-hidden">
      <div className="bg-surface-hover p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-accent" />
          <h3 className="font-bold text-sm">Next-Day Direction Model</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">v1.0 XGBoost</span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Probability of Positive Return</p>
            <p className="text-xs text-text-muted">For next trading day after {data.last_date}</p>
          </div>
          <div className={`text-3xl font-extrabold tabular-nums ${data.latest_prob_up > 0.5 ? 'text-gain' : 'text-loss'}`}>
            {(data.latest_prob_up * 100).toFixed(1)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg p-3 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Model Accuracy (Test Set)</p>
            <p className="text-lg font-bold">{(data.accuracy * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted mt-1">vs Baseline {(data.baseline_accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-bg p-3 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Top Signals (Features)</p>
            <ul className="text-xs font-medium space-y-1">
              {data.top_features.map((f: string) => (
                <li key={f} className="text-accent">• {f.replace('_', ' ').toUpperCase()}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Confusion Matrix (Held-out Test)</p>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-loss-bg/30 text-loss rounded p-2">True Neg: {data.confusion_matrix[0][0]}</div>
            <div className="bg-bg border border-border rounded p-2">False Pos: {data.confusion_matrix[0][1]}</div>
            <div className="bg-bg border border-border rounded p-2">False Neg: {data.confusion_matrix[1][0]}</div>
            <div className="bg-gain-bg/30 text-gain rounded p-2">True Pos: {data.confusion_matrix[1][1]}</div>
          </div>
        </div>

        <div className="bg-surface-hover rounded-xl p-3 flex gap-3 text-xs leading-relaxed border border-border">
          <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-text-muted font-medium">
            <strong>Using Sample Data.</strong> Past performance does not guarantee future results. Accuracy is historically near { (data.accuracy * 100).toFixed(0) }%. This is a weak statistical edge. Do not use for real trading.
          </p>
        </div>
      </div>
    </div>
  );
}
