'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: 'Hi! I am VaultIQ AI Assistant. Ask me anything about your portfolio telemetry, risk scores, XGBoost stock predictions, or tax implications!' }
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
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(109,40,217,0.4)] transition-transform hover:scale-105 z-50 border border-white/20"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] h-[560px] bg-surface border border-border rounded-2xl shadow-[0_20px_50px_-10px_rgba(109,40,217,0.2)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-surface border-b border-border flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-bg text-accent flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-text-primary">VaultIQ AI Assistant</h3>
                  <p className="text-[10px] text-gain font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span> LLM Engine Connected
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
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
                    {m.text}
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
                    className="text-[10px] bg-bg border border-border hover:border-accent text-text-secondary hover:text-text-primary px-2.5 py-1 rounded-full transition-colors text-left"
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
                className="w-9 h-9 shrink-0 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
