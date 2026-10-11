'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Aarav, Meera } from '@/components/Characters';
import { 
  Play, Pause, RotateCcw, Eye, ArrowRight, Sparkles, 
  CheckCircle2, Volume2, VolumeX, MessageSquare, FastForward
} from 'lucide-react';

export type Message = {
  id: string;
  sender: 'mentor' | 'learner';
  text: string;
  expression?: 'neutral' | 'thinking' | 'happy' | 'surprised';
  tag?: string;
  actionText?: string;
  actionTarget?: string;
};

export default function Dialogue({ messages }: { messages: Message[] }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 0.8>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Soft conversational sound generator (Web Audio API)
  const playPopSound = (isMentor: boolean) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isMentor ? 580 : 720, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext policy fallback
    }
  };

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, isTyping]);

  // Initial Auto-Play Trigger
  useEffect(() => {
    if (messages.length > 0 && currentIndex === -1) {
      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(0);
        playPopSound(messages[0]?.sender === 'mentor');
      }, 700 / playbackSpeed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messages.length]);

  // Sequential Auto-Play Engine
  useEffect(() => {
    if (!autoPlay) return;

    if (currentIndex >= 0 && currentIndex < messages.length - 1 && !isTyping) {
      // Calculate realistic reading pause based on text length
      const currentMsg = messages[currentIndex];
      const charCount = currentMsg?.text.length || 40;
      const readingDelay = Math.max(1600, Math.min(3200, charCount * 32)) / playbackSpeed;

      timerRef.current = setTimeout(() => {
        setIsTyping(true);
        const typingDuration = 900 / playbackSpeed;

        timerRef.current = setTimeout(() => {
          setIsTyping(false);
          setCurrentIndex(prev => {
            const nextIdx = prev + 1;
            playPopSound(messages[nextIdx]?.sender === 'mentor');
            return nextIdx;
          });
        }, typingDuration);

      }, readingDelay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isTyping, autoPlay, playbackSpeed, messages]);

  // Manual Step Forward
  const advance = () => {
    if (currentIndex < messages.length - 1 && !isTyping) {
      setIsTyping(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(prev => {
          const nextIdx = prev + 1;
          playPopSound(messages[nextIdx]?.sender === 'mentor');
          return nextIdx;
        });
      }, 600 / playbackSpeed);
    }
  };

  // Show All Messages Immediately
  const showAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsTyping(false);
    setAutoPlay(false);
    setCurrentIndex(messages.length - 1);
  };

  // Replay from Beginning with Auto-Play
  const replay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(-1);
    setAutoPlay(true);
    setIsTyping(true);
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      setCurrentIndex(0);
      playPopSound(messages[0]?.sender === 'mentor');
    }, 700 / playbackSpeed);
  };

  // Smooth scroll to an interactive target element
  const handleScrollToTarget = (targetId?: string) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const visibleMessages = messages.slice(0, currentIndex + 1);
  const isFinished = currentIndex >= messages.length - 1;
  const nextSender = messages[currentIndex + 1]?.sender;

  return (
    <div className="flex flex-col h-full bg-surface/90 border border-border/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
      
      {/* Top Session Control Bar */}
      <div className="px-5 py-3 border-b border-border bg-bg/70 flex items-center justify-between text-xs font-bold gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gain animate-pulse shrink-0" />
          <span className="text-text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare size={13} className="text-accent" />
            Interactive Mentor Dialogue
          </span>
          <span className="text-[10px] text-text-muted hidden sm:inline font-mono">
            ({Math.min(currentIndex + 1, messages.length)}/{messages.length})
          </span>
        </div>

        {/* Playback & Auto-Play Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Auto-Play Toggle */}
          <button
            type="button"
            onClick={() => setAutoPlay(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
              autoPlay 
                ? 'bg-accent-bg text-accent border-accent/30 shadow-sm' 
                : 'bg-surface text-text-muted border-border hover:text-text-primary'
            }`}
            title={autoPlay ? 'Pause auto conversation' : 'Resume auto conversation'}
          >
            {autoPlay ? <Pause size={11} /> : <Play size={11} />}
            <span>{autoPlay ? 'Auto-Playing' : 'Paused'}</span>
          </button>

          {/* Speed Switcher */}
          <button
            type="button"
            onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 0.8 : 1))}
            className="px-2 py-1 rounded-xl bg-surface border border-border text-[10px] font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Change reading speed"
          >
            {playbackSpeed}x
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 rounded-xl bg-surface border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute bubble sound' : 'Enable bubble sound'}
          >
            {soundEnabled ? <Volume2 size={12} className="text-accent" /> : <VolumeX size={12} />}
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg, idx) => {
            const isMentor = msg.sender === 'mentor';
            const expr = msg.expression || (isMentor ? 'happy' : 'thinking');

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`flex items-start gap-3.5 ${!isMentor ? 'flex-row-reverse' : ''}`}
              >
                {/* Visual Avatar with Animated Expression */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-2xl p-0.5 border shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
                    isMentor 
                      ? 'bg-purple-950/20 border-accent/40 shadow-accent/10' 
                      : 'bg-blue-950/20 border-blue-500/40 shadow-blue-500/10'
                  }`}>
                    {isMentor ? (
                      <Meera expression={expr} className="w-10 h-10 object-contain" />
                    ) : (
                      <Aarav expression={expr} className="w-10 h-10 object-contain" />
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-text-muted mt-1">
                    {isMentor ? 'Meera' : 'Aditya'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[82%] sm:max-w-[75%] space-y-1.5 ${!isMentor ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 ${!isMentor ? 'justify-end' : ''}`}>
                    <span className="text-[10px] font-extrabold text-text-muted">
                      {isMentor ? 'Meera • SEBI Certified Wealth Mentor' : 'Aditya • You'}
                    </span>
                    {msg.tag && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-surface border border-border text-accent">
                        {msg.tag}
                      </span>
                    )}
                  </div>

                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm font-medium ${
                    !isMentor
                      ? 'bg-accent text-white rounded-tr-none shadow-accent/20'
                      : 'bg-bg border border-border/80 text-text-primary rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Actionable jump button inside dialogue */}
                    {msg.actionText && (
                      <button
                        type="button"
                        onClick={() => handleScrollToTarget(msg.actionTarget)}
                        className={`mt-2.5 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          !isMentor
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-accent-bg text-accent border border-accent/20 hover:bg-accent hover:text-white'
                        }`}
                      >
                        <Sparkles size={12} />
                        <span>{msg.actionText}</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Animated Typing Indicator */}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3.5 ${nextSender === 'learner' ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-11 h-11 rounded-2xl p-0.5 border border-border bg-surface flex items-center justify-center shrink-0 shadow-sm">
                {nextSender === 'learner' ? (
                  <Aarav expression="thinking" className="w-10 h-10 object-contain" />
                ) : (
                  <Meera expression="thinking" className="w-10 h-10 object-contain" />
                )}
              </div>

              <div className="p-3 px-4 rounded-2xl bg-bg border border-border flex items-center gap-2 shadow-sm">
                <span className="text-[11px] font-bold text-text-muted mr-1">
                  {nextSender === 'learner' ? 'Aditya is asking...' : 'Meera is answering...'}
                </span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="p-3.5 sm:p-4 border-t border-border bg-bg/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isFinished ? (
            <button 
              type="button"
              onClick={showAll}
              className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-surface flex items-center gap-1 cursor-pointer"
            >
              <Eye size={13} />
              <span>Show full script</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={replay}
              className="text-xs font-extrabold text-accent hover:text-accent-hover transition-colors px-3 py-1.5 rounded-xl bg-accent-bg border border-accent/25 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw size={13} />
              <span>Replay Dialogue</span>
            </button>
          )}
        </div>
        
        {/* Next / Reply Manual Advance Button */}
        {!isFinished && (
          <button 
            type="button"
            onClick={advance}
            disabled={isTyping}
            className="btn-primary py-2 px-4 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-accent/20 cursor-pointer disabled:opacity-50"
          >
            <span>{nextSender === 'learner' ? 'Your Reply' : 'Next Insight'}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

    </div>
  );
}
