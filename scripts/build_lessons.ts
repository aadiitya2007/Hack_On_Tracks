import fs from 'fs';

const content = `
export type LessonContent = {
  id: string;
  title: string;
  subtitle: string;
  whatItIs: string[];
  howItWorks: { step: string; desc: string }[];
  returnsExample: { initial: number; bullPrice: number; bearPrice: number; basePrice: number };
  advantages: string[];
  risks: string[];
  challenge: { question: string; options: string[]; correctIndex: number };
  snapshot: string[];
  takeaway: string;
  nextLesson: string | null;
  dialogue: { id: string; sender: 'mentor' | 'learner'; text: string }[];
};

const dialogueDefaults = [
  { id: '1', sender: 'mentor', text: 'Welcome to this lesson! Ready to start?' },
  { id: '2', sender: 'learner', text: 'Yes, let us dive in.' },
  { id: '3', sender: 'mentor', text: 'Great. Read through the sections below.' }
] as any;

export const LESSON_MAP: Record<string, LessonContent> = {
  'stocks': {
    id: 'stocks',
    title: 'STOCKS',
    subtitle: 'Own a Piece of a Company',
    whatItIs: [
      "Imagine your favourite company is a huge pizza. Each share represents a small piece of ownership.",
      "High reward, but high risk. Think of it like riding a roller coaster."
    ],
    howItWorks: [
      { step: "A company raises money", desc: "Issues shares to raise capital." },
      { step: "Investors buy shares", desc: "Buy through a stockbroker." },
      { step: "The share price changes", desc: "Moves according to demand and supply." },
      { step: "Investors may earn returns", desc: "From price increase and dividends." }
    ],
    returnsExample: { initial: 5000, bullPrice: 600, bearPrice: 400, basePrice: 500 },
    advantages: ["Potential for long-term growth", "Opportunity to participate in success", "Dividends"],
    risks: ["Prices fall sharply", "Company may fail", "Concentration risk"],
    challenge: {
      question: "You own shares in a company whose revenue is rising, but its profits are falling. What should you investigate?",
      options: ["Only its share price", "Its expenses, debt and reasons for falling profits", "Nothing. Rising revenue guarantees success."],
      correctIndex: 1
    },
    snapshot: [
      "Market Cap: India is ~$5.4+ trillion.",
      "Historical Returns (Nifty 50): ~12.5% to 14.5% annualized."
    ],
    takeaway: "Revenue growth alone does not guarantee profitability or a rising share price.",
    nextLesson: 'mutual-funds',
    dialogue: dialogueDefaults
  },
  'mutual-funds': {
    id: 'mutual-funds',
    title: 'MUTUAL FUNDS',
    subtitle: 'Invest Through a Basket',
    whatItIs: ["Pool money from investors to buy a diversified basket of stocks or bonds."],
    howItWorks: [{ step: "Pooling", desc: "Investors pool money." }, { step: "Management", desc: "Fund manager buys assets." }],
    returnsExample: { initial: 10000, bullPrice: 120, bearPrice: 90, basePrice: 100 },
    advantages: ["Diversification", "Professional Management"],
    risks: ["Market risk", "Fees/Expense ratios"],
    challenge: { question: "What is the main benefit of a mutual fund?", options: ["Guaranteed returns", "Instant diversification", "No fees"], correctIndex: 1 },
    snapshot: ["AUM: Over ₹50 lakh crore in India."],
    takeaway: "Mutual funds offer an easy way to diversify.",
    nextLesson: 'etfs',
    dialogue: dialogueDefaults
  },
  'etfs': {
    id: 'etfs', title: 'ETFs', subtitle: 'A Basket You Can Trade', whatItIs: ["Like a mutual fund that trades on an exchange."], howItWorks: [], returnsExample: { initial: 5000, bullPrice: 110, bearPrice: 90, basePrice: 100 }, advantages: ["Liquidity"], risks: ["Tracking error"], challenge: { question: "ETF stands for?", options: ["Exchange Traded Fund", "Equity Traded Fund"], correctIndex: 0 }, snapshot: [], takeaway: "ETFs combine diversification with stock-like trading.", nextLesson: 'bonds', dialogue: dialogueDefaults
  },
  'bonds': {
    id: 'bonds', title: 'BONDS', subtitle: 'Become a Lender', whatItIs: ["Loans made by you to a company or government."], howItWorks: [], returnsExample: { initial: 10000, bullPrice: 105, bearPrice: 98, basePrice: 100 }, advantages: ["Regular income"], risks: ["Interest rate risk", "Default risk"], challenge: { question: "When interest rates rise, existing bond prices usually:", options: ["Rise", "Fall"], correctIndex: 1 }, snapshot: [], takeaway: "Bonds provide stability.", nextLesson: 'reits', dialogue: dialogueDefaults
  },
  'reits': {
    id: 'reits', title: 'REITs', subtitle: 'Real Estate Without the Building', whatItIs: ["Companies that own income-producing real estate."], howItWorks: [], returnsExample: { initial: 10000, bullPrice: 110, bearPrice: 90, basePrice: 100 }, advantages: ["Real estate exposure", "High dividends"], risks: ["Property market downturns"], challenge: { question: "REITs primarily invest in:", options: ["Tech stocks", "Real Estate"], correctIndex: 1 }, snapshot: [], takeaway: "REITs are liquid real estate.", nextLesson: 'invits', dialogue: dialogueDefaults
  },
  'invits': {
    id: 'invits', title: 'InvITs', subtitle: 'Infrastructure Behind Everyday Life', whatItIs: ["Trusts that own infrastructure assets like toll roads."], howItWorks: [], returnsExample: { initial: 10000, bullPrice: 110, bearPrice: 90, basePrice: 100 }, advantages: ["Yield from infrastructure"], risks: ["Regulatory changes"], challenge: { question: "InvITs stand for:", options: ["Infrastructure Investment Trusts", "Inventory Trusts"], correctIndex: 0 }, snapshot: [], takeaway: "InvITs offer yield from large-scale infra projects.", nextLesson: null, dialogue: dialogueDefaults
  }
};
`;

fs.writeFileSync('src/lib/content/lessons.ts', content);
