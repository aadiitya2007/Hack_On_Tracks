'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Minus, Filter, Sparkles } from 'lucide-react';
import { MarketNewsIntroAnimation } from '@/components/MarketNewsIntroAnimation';
import type { NewsArticle } from '@/app/api/news/route';

const SOURCES = ['All', 'Times of India', 'Economic Times', 'Moneycontrol', 'Financial Express', 'Reuters'];

export default function MarketNewsPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState<string>('All');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data.news || []);
    } catch (e) {
      console.error('Failed to load news:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSource = activeSource === 'All' || item.source.toLowerCase().includes(activeSource.toLowerCase());
    const matchesSentiment = sentimentFilter === 'All' || item.sentiment === sentimentFilter;
    return matchesSource && matchesSentiment;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative z-10">
      
      {/* News Intelligence Intro Animation */}
      {showIntro && <MarketNewsIntroAnimation onComplete={() => setShowIntro(false)} />}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-bg text-accent flex items-center justify-center">
              <Newspaper size={22} />
            </div>
            <h1 className="heading-hero text-4xl text-gradient">Financial Market News Feed</h1>
          </div>
          <p className="text-text-secondary text-base">
            Live curated financial coverage aggregated from established publications: <strong>Times of India, Economic Times, Moneycontrol, Financial Express, and Reuters</strong>.
          </p>
        </div>

        <button 
          onClick={fetchNews} 
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing Feed...' : 'Sync Latest News'}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-5 bg-surface border border-border space-y-4">
        
        {/* Source Tabs */}
        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5 block">
            Publication Source
          </span>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeSource === src
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-bg border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Filters */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs font-bold text-text-muted uppercase">Market Sentiment:</span>
          </div>

          <div className="flex gap-2">
            {['All', 'BULLISH', 'BEARISH', 'NEUTRAL'].map(sent => (
              <button
                key={sent}
                onClick={() => setSentimentFilter(sent)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  sentimentFilter === sent
                    ? (sent === 'BULLISH' ? 'bg-gain-bg border-gain text-gain' : (sent === 'BEARISH' ? 'bg-loss-bg border-loss text-loss' : 'bg-accent-bg border-accent text-accent'))
                    : 'bg-bg border-border text-text-muted hover:text-text-primary'
                }`}
              >
                {sent}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* News Stream Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNews.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id}
              className="card p-6 bg-surface border border-border hover:border-accent/40 transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-extrabold px-2.5 py-0.5 rounded bg-accent-bg text-accent border border-accent/20">
                    {item.source}
                  </span>
                  
                  <span className="text-text-muted">• {item.category}</span>
                  <span className="text-text-muted">• {item.timeAgo}</span>

                  {item.symbol && (
                    <span className="px-2 py-0.5 rounded bg-bg border border-border font-mono font-bold text-text-primary text-[10px]">
                      {item.symbol}
                    </span>
                  )}
                </div>

                {/* Title */}
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-extrabold text-base md:text-lg text-text-primary hover:text-accent transition-colors flex items-start gap-2 group leading-snug"
                >
                  <span>{item.title}</span>
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1 text-accent" />
                </a>

                {/* Summary */}
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Sentiment Indicator Badge */}
              <div className="shrink-0 flex md:flex-col justify-between items-end gap-2">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-sm ${
                  item.sentiment === 'BULLISH'
                    ? 'bg-gain-bg border-gain/40 text-gain'
                    : item.sentiment === 'BEARISH'
                    ? 'bg-loss-bg border-loss/40 text-loss'
                    : 'bg-accent-bg border-accent/40 text-accent'
                }`}>
                  {item.sentiment === 'BULLISH' && <TrendingUp size={14} />}
                  {item.sentiment === 'BEARISH' && <TrendingDown size={14} />}
                  {item.sentiment === 'NEUTRAL' && <Minus size={14} />}
                  {item.sentiment} SIGNAL
                </span>

                <span className="text-[10px] text-text-muted font-bold">
                  Impact: <strong className="text-text-primary">{item.impact}</strong>
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNews.length === 0 && (
          <div className="card p-12 text-center text-text-muted">
            <p className="font-bold text-sm">No articles match the selected source or sentiment filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
