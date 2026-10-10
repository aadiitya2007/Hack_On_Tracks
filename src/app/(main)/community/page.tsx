'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, ThumbsUp, Plus, Search, Tag, 
  Award, ShieldCheck, Sparkles, Filter, CheckCircle2, ChevronRight, User, HelpCircle, ArrowUpRight
} from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  authorLevel: 'Fresher' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro' | 'Senior Mentor';
  isVerifiedMentor?: boolean;
  category: string;
  content: string;
  upvotes: number;
  timestamp: string;
  replies: {
    id: string;
    author: string;
    authorRole: string;
    authorLevel: string;
    isVerifiedMentor?: boolean;
    text: string;
    timestamp: string;
  }[];
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'p1',
    title: 'Senior Advice: Transitioning from hype stock tips to a resilient 60/40 index foundation',
    author: 'Vikram Sharma',
    authorRole: 'Senior Portfolio Strategist',
    authorLevel: 'Senior Mentor',
    isVerifiedMentor: true,
    category: 'Senior Guidance & Mentor Q&A',
    content: 'For all beginners joining the community: stop chasing 50% overnight returns on unverified WhatsApp tips. Start with a core 60% allocation in Nifty 50 Index ETFs and 20% in AAA Corporate Bonds. Build wealth systematically before attempting high-leverage trades.',
    upvotes: 68,
    timestamp: '2 hours ago',
    replies: [
      {
        id: 'r1',
        author: 'Rahul Verma',
        authorRole: 'Beginner Investor',
        authorLevel: 'Beginner',
        text: 'Thank you Vikram sir! What percentage of monthly SIP would you recommend allocating to REITs for quarterly rental yields?',
        timestamp: '1 hour ago'
      },
      {
        id: 'r2',
        author: 'Vikram Sharma',
        authorRole: 'Senior Portfolio Strategist',
        authorLevel: 'Senior Mentor',
        isVerifiedMentor: true,
        text: 'Great question Rahul. Allocate around 10-15% into listed REITs like Embassy or Mindspace for steady quarterly dividend yield without buying physical property.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'p2',
    title: 'Duplicate Holdings Alert: Does holding RELIANCE in Zerodha AND Groww drain DP charges?',
    author: 'Priya Nair',
    authorRole: 'Intermediate Investor',
    authorLevel: 'Intermediate',
    category: 'Fresher / Beginner Corner',
    content: 'I noticed Unify flagged a ₹420 annual DP charge leak on my dashboard because I hold RELIANCE in Zerodha Kite and Groww simultaneously. How does consolidating to one demat account eliminate this leak?',
    upvotes: 42,
    timestamp: '4 hours ago',
    replies: [
      {
        id: 'r3',
        author: 'Ananya Iyer',
        authorRole: 'Advanced Investor',
        authorLevel: 'Advanced',
        text: 'Yes! Every time you execute a sell transaction on a broker, NSDL/CDSL charges a flat ₹13.5 + GST depository fee per scrip. If you sell from 2 brokers, you pay double DP fees. Consolidating into one account saves that leak!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'p3',
    title: 'Pro Derivatives Discussion: Managing Theta Decay & Stop-Losses in Nifty Weekly Expiries',
    author: 'Karan Mehta',
    authorRole: 'Quant & Derivatives Specialist',
    authorLevel: 'Pro',
    isVerifiedMentor: true,
    category: 'Pro Derivatives & F&O Room',
    content: 'SEBI reported that 89% of individual retail F&O traders incur net losses. In our trading desk, we strictly enforce defined-risk iron condors with automated stop-losses at 1.5x premium. How are you managing delta risk in current market volatility?',
    upvotes: 85,
    timestamp: '6 hours ago',
    replies: [
      {
        id: 'r4',
        author: 'Siddharth Rao',
        authorRole: 'Derivatives Trader',
        authorLevel: 'Pro',
        text: 'We keep margin utilization strictly below 30% of total portfolio capital to avoid unexpected margin calls during gap-down opens.',
        timestamp: '5 hours ago'
      }
    ]
  },
  {
    id: 'p4',
    title: 'How do you calculate 1-Month 95% Value-at-Risk (VaR) before quarterly corporate earnings?',
    author: 'Amit Kumar',
    authorRole: 'Equity Researcher',
    authorLevel: 'Advanced',
    category: 'Advanced Strategy & Risk',
    content: 'Before quarterly IT & Banking earnings releases, I use the parametric VaR formula (1.645 * daily_std * sqrt(21)) to estimate max drawdown risk. Is anyone using historical simulation VaR instead?',
    upvotes: 31,
    timestamp: '12 hours ago',
    replies: []
  }
];

const CATEGORIES = [
  'All Discussions',
  'Senior Guidance & Mentor Q&A',
  'Fresher / Beginner Corner',
  'Intermediate Swing Trading',
  'Advanced Strategy & Risk',
  'Pro Derivatives & F&O Room'
];

export default function CommunityForum() {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('All Discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>('p1');
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  // User details from localStorage
  const [userLevel, setUserLevel] = useState<string>('Intermediate');
  const [userTitle, setUserTitle] = useState<string>('Intermediate Investor');

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Fresher / Beginner Corner');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const level = localStorage.getItem('unify_trader_level');
      const title = localStorage.getItem('unify_trader_title');
      if (level) setUserLevel(level);
      if (title) setUserTitle(title);
    }
  }, []);

  const handleUpvote = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleAddReply = (postId: string) => {
    const text = replyInput[postId]?.trim();
    if (!text) return;

    const newReply = {
      id: 'r-' + Date.now(),
      author: 'You (Current User)',
      authorRole: userTitle,
      authorLevel: userLevel,
      text,
      timestamp: 'Just now'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...p.replies, newReply] };
      }
      return p;
    }));

    setReplyInput(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const createdPost: ForumPost = {
      id: 'p-' + Date.now(),
      title: newTitle.trim(),
      author: 'You (Current User)',
      authorRole: userTitle,
      authorLevel: userLevel as any,
      category: newCategory,
      content: newContent.trim(),
      upvotes: 1,
      timestamp: 'Just now',
      replies: []
    };

    setPosts(prev => [createdPost, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewPostModalOpen(false);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All Discussions' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Senior Mentor': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Pro': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Advanced': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Beginner': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Fresher':
      default: return 'bg-accent-bg text-accent border-accent/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-bold border border-accent/20">
              <Users size={22} />
            </div>
            <h1 className="heading-hero text-4xl text-gradient">Trader Community & Senior Mentor Network</h1>
          </div>
          <p className="text-text-secondary text-base max-w-3xl">
            Connect with verified senior traders, share portfolio queries, discuss strategy across skill tiers, and learn from experienced market mentors.
          </p>
        </div>

        <button 
          onClick={() => setNewPostModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-3 px-6 text-xs font-extrabold shadow-lg shrink-0"
        >
          <Plus size={18} /> Post Community Query
        </button>
      </div>

      {/* Category Pills & Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-3xl border border-border">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/20' 
                  : 'bg-bg text-text-secondary border-border hover:border-accent hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search queries, topics, mentors..."
            className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Main Forum Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const isExpanded = expandedPostId === post.id;
          return (
            <div key={post.id} className="card p-6 bg-surface border border-border rounded-3xl hover:border-accent/40 transition-all space-y-4">
              
              {/* Post Header: Author, Role Badge, Category */}
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-black text-sm border border-accent/20 shrink-0">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-text-primary text-sm">{post.author}</h3>
                      {post.isVerifiedMentor && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gain-bg text-gain border border-gain/20 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Senior Mentor
                        </span>
                      )}
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getLevelBadgeColor(post.authorLevel)}`}>
                        {post.authorLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                      {post.authorRole} • Posted {post.timestamp}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-bg border border-border text-text-secondary">
                  {post.category}
                </span>
              </div>

              {/* Post Title & Content */}
              <div>
                <h2 className="text-lg font-extrabold text-text-primary mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Actions: Upvote & Reply Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-border hover:border-accent text-text-secondary hover:text-accent font-extrabold transition-all"
                  >
                    <ThumbsUp size={14} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button 
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-border hover:border-accent text-text-secondary hover:text-text-primary font-extrabold transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>{post.replies.length} Replies</span>
                  </button>
                </div>

                <button 
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="text-accent font-extrabold flex items-center gap-1 hover:underline text-xs"
                >
                  {isExpanded ? 'Hide Discussion' : 'View Full Thread & Senior Guidance →'}
                </button>
              </div>

              {/* Expanded Thread & Replies */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 space-y-4 border-t border-border overflow-hidden"
                  >
                    <p className="text-xs font-black uppercase text-text-muted tracking-wider">Discussion & Senior Guidance Thread</p>

                    {/* Replies List */}
                    <div className="space-y-3 pl-4 border-l-2 border-accent/30">
                      {post.replies.length > 0 ? (
                        post.replies.map(reply => (
                          <div key={reply.id} className="p-3.5 rounded-2xl bg-bg border border-border space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-text-primary">{reply.author}</span>
                                {reply.isVerifiedMentor && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gain-bg text-gain border border-gain/20">
                                    Senior Mentor
                                  </span>
                                )}
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getLevelBadgeColor(reply.authorLevel)}`}>
                                  {reply.authorLevel}
                                </span>
                              </div>
                              <span className="text-[10px] text-text-muted font-mono">{reply.timestamp}</span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed">{reply.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-text-muted italic">No replies yet. Be the first to provide professional guidance!</p>
                      )}
                    </div>

                    {/* Add Reply Form */}
                    <div className="flex gap-2 pt-2">
                      <input 
                        type="text"
                        value={replyInput[post.id] || ''}
                        onChange={e => setReplyInput({ ...replyInput, [post.id]: e.target.value })}
                        placeholder="Write a professional reply or guidance note..."
                        className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                        onKeyDown={e => { if (e.key === 'Enter') handleAddReply(post.id); }}
                      />
                      <button 
                        onClick={() => handleAddReply(post.id)}
                        className="btn-primary py-2 px-5 text-xs font-extrabold"
                      >
                        Reply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

      {/* CREATE NEW POST MODAL */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNewPostModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-xl p-6 relative rounded-3xl border border-border bg-surface z-10 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-black text-text-primary">Post Community Query or Guidance</h2>
                <p className="text-xs text-text-secondary mt-0.5">Post a professional query to discuss with peers and senior market mentors.</p>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getLevelBadgeColor(userLevel)}`}>
                Posting as {userLevel}
              </span>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-text-muted">Topic Category</label>
                <select 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-xs font-extrabold text-text-primary focus:outline-none focus:border-accent"
                >
                  <option>Fresher / Beginner Corner</option>
                  <option>Senior Guidance & Mentor Q&A</option>
                  <option>Intermediate Swing Trading</option>
                  <option>Advanced Strategy & Risk</option>
                  <option>Pro Derivatives & F&O Room</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-text-muted">Query Title</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., How should I rebalance 20% equity into AAA corporate bonds during rate cuts?"
                  required
                  className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-text-muted">Detailed Query Content</label>
                <textarea 
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Provide context, portfolio parameters, or specific questions for community guidance..."
                  required
                  className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setNewPostModalOpen(false)}
                  className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-extrabold text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary py-3 text-xs font-extrabold"
                >
                  Publish Query to Community →
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
