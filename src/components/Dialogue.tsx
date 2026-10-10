'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Message = {
  id: string;
  sender: 'mentor' | 'learner';
  text: string;
  avatar?: string;
};

export default function Dialogue({ messages }: { messages: Message[] }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Deterministic sequence: 
  // - Starts at -1 (nothing showing).
  // - advances to 0 with typing.
  // - when typing finishes, shows 0, then waits.
  
  useEffect(() => {
    // Start the first message typing indicator
    if (messages.length > 0 && currentIndex === -1) {
      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(0);
      }, 800);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messages.length, currentIndex]);

  const advance = () => {
    if (currentIndex < messages.length - 1 && !isTyping) {
      setIsTyping(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(prev => prev + 1);
      }, 800);
    }
  };

  const showAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsTyping(false);
    setCurrentIndex(messages.length - 1);
  };

  const replay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(-1);
    setIsTyping(true);
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      setCurrentIndex(0);
    }, 800);
  };

  const visibleMessages = messages.slice(0, currentIndex + 1);
  const isFinished = currentIndex >= messages.length - 1;

  return (
    <div className="flex flex-col h-full bg-surface-hover rounded-2xl border border-border overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.sender === 'learner' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'learner' ? 'bg-accent text-white' : 'bg-primary text-primary-content'
              }`}>
                {msg.sender === 'learner' ? 'U' : 'M'}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === 'learner' 
                  ? 'bg-accent text-white rounded-tr-none' 
                  : 'bg-bg border border-border text-text-primary rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex gap-3 ${
                // Next message determines who is typing
                messages[currentIndex + 1]?.sender === 'learner' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                messages[currentIndex + 1]?.sender === 'learner' ? 'bg-accent text-white' : 'bg-primary text-primary-content'
              }`}>
                {messages[currentIndex + 1]?.sender === 'learner' ? 'U' : 'M'}
              </div>
              <div className={`p-3 rounded-2xl bg-bg border border-border flex items-center gap-1 ${
                messages[currentIndex + 1]?.sender === 'learner' ? 'rounded-tr-none' : 'rounded-tl-none'
              }`}>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-150"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
        <div className="flex gap-2">
          {!isFinished ? (
            <button 
              onClick={showAll}
              className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors px-3 py-1.5"
            >
              Show all
            </button>
          ) : (
            <button 
              onClick={replay}
              className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors px-3 py-1.5"
            >
              Replay
            </button>
          )}
        </div>
        
        {!isFinished && !isTyping && (
          <button 
            onClick={advance}
            className="px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {messages[currentIndex + 1]?.sender === 'learner' ? 'Reply →' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}
