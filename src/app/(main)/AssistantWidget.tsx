'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'assistant', text: 'Hi! I am the VaultIQ AI Assistant. I can help you understand your portfolio or general financial concepts.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const query = input;
    setInput('');

    // Mock LLM response
    setTimeout(() => {
      let reply = "I'm a demo assistant! In a live environment, I would connect to an LLM with access to your portfolio summary.";
      if (query.toLowerCase().includes('advice') || query.toLowerCase().includes('should i buy')) {
        reply = "I can provide educational information, but I cannot give personalized investment advice. Always consult a certified financial planner.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white shadow-[0_4px_24px_rgba(34,211,238,0.4)] hover:scale-110 transition-transform z-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="m8.5 13.5 2-2 3 3 4-6"/></svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 h-[450px] bg-[#0F0A2A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="font-bold text-sm">Ask VaultIQ</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-foreground/50 hover:text-foreground">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-foreground/90'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/10">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your portfolio..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
