'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { STOCKS_LESSON } from '@/lib/content/lessons';

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'assistant', text: 'Hi! I am the VaultIQ AI Assistant. I can help you understand your portfolio or general financial concepts. What would you like to know?' }
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
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    // Generate context-aware response based on lessons
    let replyText = "I am a simulated assistant for this demo. In a live environment, I would connect to a real LLM API. But to answer your question: Diversification is key to managing risk in any portfolio!";
    
    const query = userMsg.toLowerCase();
    
    if (query.includes('advice') || query.includes('should i buy') || query.includes('invest in')) {
      replyText = "I can provide educational information, but I cannot give personalized investment advice. Always consult a certified financial planner before making investment decisions.";
    } else if (query.includes('stock') || query.includes('shares')) {
      replyText = `Based on our learning modules: ${STOCKS_LESSON.sections.whatIsIt.text.split('\n')[0]} Stocks offer high reward but carry high risk.`;
    } else if (query.includes('portfolio') || query.includes('holdings')) {
      replyText = "Looking at your simulated portfolio, I see you hold assets across Zerodha and Groww. You have a mix of Equities and Mutual Funds. If you'd like to simulate a trade to see how it affects your balance, you can use the 'Simulate Trade' button on the Dashboard!";
    } else if (query.includes('mail sync') || query.includes('pdf')) {
      replyText = "Our Mail Sync engine safely parses password-protected PDF contract notes locally to extract your trade history. This helps calculate your true average buy price without needing broker APIs.";
    }

    // Stream the text character by character like a real AI
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
    
    let currentText = '';
    const chars = replyText.split('');
    
    for (let i = 0; i < chars.length; i++) {
      await new Promise(r => setTimeout(r, 15)); // 15ms per character streaming speed
      currentText += chars[i];
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].text = currentText;
        return newMsgs;
      });
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center text-white shadow-[0_8px_20px_rgba(109,40,217,0.3)] transition-transform hover:scale-105 z-50 border border-transparent"
        aria-label="Open Assistant"
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
            className="fixed bottom-24 right-6 w-[360px] h-[550px] bg-surface border border-border rounded-2xl shadow-[0_20px_50px_-10px_rgba(109,40,217,0.15)] flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 bg-surface border-b border-border flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-bg flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-text-primary">Ask VaultIQ</h3>
                  <p className="text-[10px] text-text-secondary font-medium">Educational Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            
            {/* Chat Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-bg">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent text-white rounded-br-sm shadow-sm' : 'bg-surface border border-border text-text-primary shadow-sm rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-surface border border-border p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-surface border-t border-border flex gap-2 z-10">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a financial question..." 
                className="flex-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 shrink-0 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
