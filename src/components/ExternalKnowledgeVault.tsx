'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EXTERNAL_RESOURCES, ExternalResource 
} from '@/lib/content/externalResources';
import { 
  ExternalLink, Play, BookOpen, ShieldCheck, Award, 
  CheckCircle2, Sparkles, Globe, FileText, 
  Layers, Filter, ChevronRight, X, Clock
} from 'lucide-react';

function YouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface ExternalKnowledgeVaultProps {
  filterAssetId?: string;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export function ExternalKnowledgeVault({
  filterAssetId,
  limit,
  title = "Curated & Globally Recognised Knowledge Vault",
  subtitle = "Direct learning modules and official research from India's apex financial regulators (SEBI, RBI), premier stock exchanges (NSE), and trusted institutional researchers."
}: ExternalKnowledgeVaultProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeVideoModal, setActiveVideoModal] = useState<ExternalResource | null>(null);

  const categories = [
    'All',
    'Official Regulators & NSE',
    'Stocks & Trading',
    'Mutual Funds & Regulations',
    'Bonds & Fixed Income',
    'REITs & Real Estate',
    'InvITs & Infrastructure',
    'Futures & Options',
    'ETFs & Indexing'
  ];

  const filteredResources = EXTERNAL_RESOURCES.filter(res => {
    if (filterAssetId && res.assetId !== filterAssetId) {
      return false;
    }
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Official Regulators & NSE') {
      return res.sourceType === 'Official Exchange' || res.sourceType === 'Statutory Regulator' || res.sourceType === 'Central Bank Portal';
    }
    return res.category === activeCategory;
  }).slice(0, limit || EXTERNAL_RESOURCES.length);

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider border border-accent/20 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck size={14} /> Trusted & Globally Recognised
            </span>
            <span className="text-[10px] font-bold text-text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
              {EXTERNAL_RESOURCES.length} Verified Modules
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS (Only shown on full vault view) */}
      {!filterAssetId && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
                    : 'bg-surface text-text-secondary border-border hover:border-accent/40 hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* RESOURCE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res, idx) => {
          const isYouTube = !!res.youtubeId;
          const isGovOrRegulator = res.sourceType === 'Official Exchange' || res.sourceType === 'Statutory Regulator' || res.sourceType === 'Central Bank Portal';

          return (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card p-6 bg-surface border border-border hover:border-accent/40 rounded-3xl flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg relative overflow-hidden"
            >
              {/* Card Header & Badges */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-xl border inline-flex items-center gap-1.5 shadow-sm ${
                    isGovOrRegulator
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-accent/15 text-accent border-accent/30'
                  }`}>
                    {isGovOrRegulator ? <ShieldCheck size={13} className="shrink-0" /> : <Award size={13} className="shrink-0" />}
                    <span>{res.badge}</span>
                  </span>

                  <span className="text-[11px] font-mono font-bold text-text-muted flex items-center gap-1.5 bg-bg/90 px-2.5 py-1 rounded-xl border border-border shrink-0 shadow-xs">
                    {isYouTube ? <Play size={11} className="text-destructive shrink-0" fill="currentColor" /> : <BookOpen size={11} className="text-accent shrink-0" />}
                    <span>{res.durationOrReadTime}</span>
                  </span>
                </div>

                {/* Resource Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
                    {res.title}
                  </h3>
                  
                  {/* Source & Authority Tag */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs font-extrabold text-text-primary">
                      {res.source}
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-border" />
                    <span className="text-[11px] font-bold text-accent bg-accent-bg px-2 py-0.5 rounded-md border border-accent/20">
                      {res.sourceType}
                    </span>
                  </div>
                </div>

                {/* Plain-Language Synopsis */}
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1 border-t border-border/50">
                  {res.description}
                </p>

                {/* Key Concepts / Syllabus Checklist */}
                <div className="p-3.5 rounded-2xl bg-bg/80 border border-border space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-text-muted tracking-wider block">
                    Core Knowledge Covered:
                  </span>
                  <ul className="space-y-2">
                    {res.keyTopics.map((topic, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2 leading-snug font-medium">
                        <CheckCircle2 size={13} className="text-gain shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Source Authority & Action Buttons */}
              <div className="pt-4 mt-5 border-t border-border space-y-3">
                <div className="text-[11px] text-text-muted flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={13} className="text-accent shrink-0" />
                  <span className="truncate">Source Authority: <strong className="text-text-primary font-bold">{res.authority}</strong></span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {isYouTube ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveVideoModal(res)}
                        className="btn-primary flex-1 py-2.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                      >
                        <Play size={13} fill="currentColor" /> Watch Inside App
                      </button>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-2xl bg-bg border border-border hover:bg-surface-hover hover:border-accent/40 text-text-muted hover:text-text-primary transition-all cursor-pointer flex items-center justify-center"
                        title="Open on YouTube in new tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </>
                  ) : (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                    >
                      <Globe size={13} /> Open Official Portal <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EMBEDDED VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeVideoModal && activeVideoModal.youtubeId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoModal(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-surface border border-border rounded-3xl shadow-2xl relative z-10 overflow-hidden my-auto flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-bg/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center border border-destructive/20 shrink-0">
                    <YouTubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-text-primary leading-tight">
                      {activeVideoModal.title}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {activeVideoModal.source} • {activeVideoModal.authority}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeVideoModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-accent hover:underline"
                  >
                    Open on YouTube <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(null)}
                    className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* 16:9 Responsive Video IFrame */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Video Info Bottom Sheet */}
              <div className="p-4 sm:p-5 bg-surface space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-accent-bg text-accent border border-accent/20">
                      {activeVideoModal.badge}
                    </span>
                    <span className="text-xs font-bold text-text-secondary">
                      {activeVideoModal.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted font-medium">
                    Verified Content: {activeVideoModal.durationOrReadTime}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {activeVideoModal.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {activeVideoModal.keyTopics.map((topic, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-bg border border-border text-text-primary font-medium flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-gain shrink-0" /> {topic}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
