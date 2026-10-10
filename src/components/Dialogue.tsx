/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Aarav, Meera } from './Characters';

type Message = {
  id: string;
  speaker: 'aarav' | 'meera';
  text: string;
  expression?: 'neutral' | 'thinking' | 'happy' | 'surprised';
};

// Sub-component to handle the typewriter streaming effect
const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayed(''); // reset on new text
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15); // streaming speed

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayed}</>;
};

export default function Dialogue({ messages }: { messages: Message[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // When moving to a new message index
    if (currentIndex < messages.length && !isStreaming) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setIsStreaming(true); // Start the typewriter effect
      }, 800); // 800ms bounce indicator delay
      return () => clearTimeout(timer);
    }
  }, [currentIndex, messages.length, isStreaming]);

  const handleNext = () => {
    if (currentIndex < messages.length && !isTyping && !isStreaming) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentIndex(messages.length);
    setIsTyping(false);
    setIsStreaming(false);
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setIsStreaming(false);
    setIsTyping(false);
  };

  const handleStreamComplete = () => {
    setIsStreaming(false);
  };

  // We show all fully completed messages, plus the one currently streaming (if any)
  const visibleMessages = messages.slice(0, currentIndex + (isStreaming ? 1 : 0));

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto my-8">
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg, idx) => {
          const isAarav = msg.speaker === 'aarav';
          const isCurrentStreamingMsg = isStreaming && idx === currentIndex;
          
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 items-end ${isAarav ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {isAarav 
                ? <Aarav expression={msg.expression} className="w-12 h-12 shrink-0 shadow-sm rounded-full" /> 
                : <Meera expression={msg.expression} className="w-12 h-12 shrink-0 shadow-sm rounded-full" />
              }
              
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm md:text-base leading-relaxed ${isAarav ? 'bg-surface border border-border text-text-primary rounded-bl-sm' : 'bg-accent text-white rounded-br-sm shadow-md'}`}>
                {isCurrentStreamingMsg ? (
                  <TypewriterText text={msg.text} onComplete={handleStreamComplete} />
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          );
        })}

        {isTyping && currentIndex < messages.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex gap-4 items-end ${messages[currentIndex].speaker === 'aarav' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            {messages[currentIndex].speaker === 'aarav' ? <Aarav expression="neutral" className="w-12 h-12 shrink-0" /> : <Meera expression="neutral" className="w-12 h-12 shrink-0" />}
            
            <div className={`p-4 rounded-2xl ${messages[currentIndex].speaker === 'aarav' ? 'bg-surface border border-border rounded-bl-sm' : 'bg-accent rounded-br-sm'}`}>
              <div className="flex gap-1 items-center h-4">
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${messages[currentIndex].speaker === 'aarav' ? 'bg-text-muted' : 'bg-white/70'}`} style={{ animationDelay: '0ms' }}></span>
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${messages[currentIndex].speaker === 'aarav' ? 'bg-text-muted' : 'bg-white/70'}`} style={{ animationDelay: '150ms' }}></span>
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${messages[currentIndex].speaker === 'aarav' ? 'bg-text-muted' : 'bg-white/70'}`} style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-border">
        {currentIndex < messages.length - 1 || isTyping || isStreaming ? (
          <>
            <button 
              onClick={handleNext} 
              disabled={isTyping || isStreaming} 
              className="btn-primary flex-1 max-w-[200px]"
            >
              Next Message
            </button>
            <button 
              onClick={handleSkip} 
              className="px-6 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors border border-transparent hover:border-border rounded-md"
            >
              Skip
            </button>
          </>
        ) : (
          <button onClick={handleReplay} className="px-6 py-2 text-sm font-medium text-accent hover:bg-accent-bg border border-accent/20 rounded-md transition-colors">
            Replay Conversation
          </button>
        )}
      </div>
    </div>
  );
}
