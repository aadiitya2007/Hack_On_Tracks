'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, GripHorizontal, Move } from 'lucide-react';
import Link from 'next/link';

function parseInlineMarkdown(text: string) {
  // Regex to split by **bold** or routes like /prediction, /risk, /learn, /dashboard, /news, /community
  const regex = /(\*\*[^*]+\*\*|\/(?:prediction|risk|learn|dashboard|news|community)\b)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={i} className="font-extrabold text-text-primary">{boldText}</strong>;
    }

    if (part.startsWith('/')) {
      return (
        <Link
          key={i}
          href={part}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded bg-accent/15 text-accent font-bold hover:bg-accent hover:text-white transition-colors text-[10px]"
        >
          {part}
        </Link>
      );
    }

    return part;
  });
}

function FormattedMessageText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`space-${idx}`} className="h-1.5" />);
      return;
    }

    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
    const isNumbered = /^\d+\.\s/.test(trimmed);

    const content = isBullet 
      ? trimmed.replace(/^[•\-\*]\s*/, '') 
      : isNumbered 
        ? trimmed.replace(/^\d+\.\s*/, '') 
        : trimmed;

    const renderedContent = parseInlineMarkdown(content);

    if (isBullet) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
          <div className="flex-1 leading-relaxed">{renderedContent}</div>
        </div>
      );
    } else if (isNumbered) {
      const match = trimmed.match(/^(\d+)\./);
      const num = match ? match[1] : (idx + 1);
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
          <span className="w-4 h-4 rounded-full bg-accent/15 text-accent text-[9px] font-black flex items-center justify-center mt-0.5 shrink-0 border border-accent/20">
            {num}
          </span>
          <div className="flex-1 leading-relaxed">{renderedContent}</div>
        </div>
      );
    } else {
      elements.push(
        <p key={idx} className="leading-relaxed">
          {renderedContent}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: 'Hi! I am Unify AI Assistant. Ask me anything about your portfolio telemetry, risk scores, XGBoost stock predictions, or tax implications!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    const updatedMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();
      const replyText = data.reply || "I'm having trouble analyzing that query right now. Feel free to ask about risk profiles or ML predictions!";

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      // Smooth streaming effect
      let currentText = '';
      const chars = replyText.split('');

      for (let i = 0; i < chars.length; i++) {
        await new Promise(r => setTimeout(r, 12));
        currentText += chars[i];
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = currentText;
          return newMsgs;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Unable to connect to assistant backend. Please try again.' }]);
    }
  };

  const samplePrompts = [
    "Explain my portfolio risk score",
    "How does the XGBoost prediction model work?",
    "What is the difference between REITs and InvITs?",
    "How does STCG vs LTCG tax work in India?"
  ];

  return (
    <>
      {/* Draggable Launcher Button */}
      <motion.button 
        drag
        dragMomentum={false}
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(109,40,217,0.5)] transition-transform hover:scale-105 z-[999] border border-white/20 cursor-grab active:cursor-grabbing"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-2 sm:bottom-24 sm:right-6 w-[calc(100vw-1rem)] sm:w-[380px] max-w-[380px] h-[75vh] sm:h-[560px] max-h-[560px] bg-surface border border-border rounded-3xl shadow-[0_25px_60px_-15px_rgba(109,40,217,0.35)] flex flex-col z-[999] overflow-hidden cursor-default"
          >
            {/* Top Drag Handle Header */}
            <div className="bg-accent/10 border-b border-border py-1.5 px-4 flex items-center justify-between cursor-grab active:cursor-grabbing select-none text-[10px] font-extrabold text-accent">
              <div className="flex items-center gap-1.5">
                <GripHorizontal size={14} className="text-accent" />
                <span>Movable Assistant • Drag Anywhere</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-text-muted font-bold">
                <Move size={10} /> Drag Window
              </div>
            </div>

            {/* Header */}
            <div className="p-4 bg-surface border-b border-border flex justify-between items-center z-10 select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-bg text-accent flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-text-primary">Unify AI Assistant</h3>
                  <p className="text-[10px] text-gain font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span> LLM Engine Connected
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Messages Stream */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-accent text-white rounded-br-sm shadow-sm font-medium' 
                      : 'bg-surface border border-border text-text-primary shadow-sm rounded-bl-sm font-normal'
                  }`}>
                    {m.role === 'user' ? m.text : <FormattedMessageText text={m.text} />}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border p-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-surface/50 border-t border-border flex flex-wrap gap-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(p); }}
                    className="text-[10px] bg-bg border border-border hover:border-accent text-text-secondary hover:text-text-primary px-2.5 py-1 rounded-full transition-colors text-left cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            
            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-surface border-t border-border flex gap-2 z-10">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about risk, predictions, tax..." 
                className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 shrink-0 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
