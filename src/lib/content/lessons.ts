export type KeyType = {
  title: string;
  desc: string;
  goal: string;
};

export type LessonContent = {
  id: string;
  title: string;
  subtitle: string;
  whatItIs: string[];
  keyTypes?: KeyType[];
  howItWorks: { step: string; desc: string }[];
  returnsExample: { 
    initial: number; 
    gainVal: number; 
    lossVal: number; 
    gainPct: number; 
    lossPct: number; 
    note?: string 
  };
  advantages: string[];
  risks: string[];
  challenge: { question: string; options: string[]; correctIndex: number; explanation: string };
  snapshotStats: { label: string; value: string; desc: string }[];
  takeaway: string;
  nextLesson: string | null;
  prevLesson: string | null;
  dialogue: { id: string; sender: 'mentor' | 'learner'; text: string }[];
};

const dialogueDefaults = [
  { id: '1', sender: 'mentor', text: 'Welcome to this interactive masterclass! Ready to learn?' },
  { id: '2', sender: 'learner', text: 'Yes, let us dive into the concepts!' },
  { id: '3', sender: 'mentor', text: 'Awesome! Scroll down to explore the mechanics, interactive calculators, and real India market stats.' }
] as const;

export const LESSON_MAP: Record<string, LessonContent> = {
  'stocks': {
    id: 'stocks',
    title: 'STOCKS',
    subtitle: 'Own a Piece of a Company',
    whatItIs: [
      "Imagine your favourite company is a huge pizza. Each share represents a small piece of ownership in that company.",
      "When you buy a company's shares, you become one of its shareholders. If the company grows and investors value it more highly, its share price may rise. Some companies also pay dividends to shareholders.",
      "However, a company's share price can fall, and you can lose money. High reward, but high risk. Think of it like riding a roller coaster—it can climb very high, but it can also drop sharply when the market dips.",
      "Unlike a bank fixed deposit, a company is never legally obligated to pay you dividends or buy back your shares at a specific price."
    ],
    howItWorks: [
      { step: "Step 1: A company raises money", desc: "A company may issue shares to raise capital for expansion, new products or other business needs." },
      { step: "Step 2: Investors buy shares", desc: "Investors can buy shares through a stockbroker when the shares are available for trading." },
      { step: "Step 3: The share price changes", desc: "The price moves according to demand and supply, company performance, economic conditions and investor expectations." },
      { step: "Step 4: Investors may earn returns", desc: "Returns can come from an increase in the share price and dividends, if declared." }
    ],
    returnsExample: {
      initial: 5000,
      gainVal: 6000,
      lossVal: 4000,
      gainPct: 20,
      lossPct: -20,
      note: "Example: 10 shares purchased at ₹500 each (Initial = ₹5,000). If price rises to ₹600, value is ₹6,000 (+20%). If price drops to ₹400, value is ₹4,000 (-20%). Excludes taxes & fees."
    },
    advantages: [
      "Potential for long-term capital growth.",
      "Opportunity to participate in a company's success.",
      "Some companies pay periodic cash dividends.",
      "Many actively traded stocks can be bought and sold relatively easily."
    ],
    risks: [
      "Share prices can fall sharply during market downturns.",
      "A company may perform poorly or fail completely.",
      "Investors may pay more than a company is fundamentally worth.",
      "Concentrating money in one company increases company-specific risk."
    ],
    challenge: {
      question: "You own shares in a company whose revenue is rising, but its profits are falling. What should you investigate?",
      options: [
        "A. Only its share price.",
        "B. Its expenses, debt and reasons for falling profits.",
        "C. Nothing. Rising revenue guarantees success."
      ],
      correctIndex: 1,
      explanation: "Correct! Revenue growth alone does not guarantee profitability. You must analyze rising expenses, interest burdens, or operational inefficiencies."
    },
    snapshotStats: [
      { label: "Market Capitalization", value: "₹450+ Lakh Cr", desc: "India's stock market rank stands among global top 5 ($5.4+ Trillion)." },
      { label: "NSE Registered Accounts", value: "26+ Crore", desc: "Representing over 13.1 crore unique individual retail investors." },
      { label: "Historical Nifty 50 CAGR", value: "12.5% – 14.5%", desc: "Long-term annualized return over 10–15 year horizons." },
      { label: "Annualized Volatility", value: "14% – 18%", desc: "Standard deviation reflecting sharp short-term market swings." }
    ],
    takeaway: "Revenue growth alone does not guarantee profitability or a rising share price.",
    nextLesson: 'mutual-funds',
    prevLesson: null,
    dialogue: [...dialogueDefaults]
  },

  'mutual-funds': {
    id: 'mutual-funds',
    title: 'MUTUAL FUNDS',
    subtitle: 'Invest Through a Basket',
    whatItIs: [
      "Imagine you want to buy several different items, but instead of purchasing each one yourself, you contribute money to a shared basket.",
      "A mutual fund works on a similar principle. It pools money from many investors and invests it according to the fund's objectives. Depending on the scheme, the portfolio may contain stocks, bonds or other permitted assets.",
      "A professional fund manager manages an actively managed fund. An index fund, by contrast, generally aims to track a specified market index."
    ],
    keyTypes: [
      {
        title: "1. Equity Mutual Funds (Stock-based)",
        desc: "The fund manager invests almost all the pooled money into company stocks.",
        goal: "High growth over time, but comes with stock market ups and downs."
      },
      {
        title: "2. Debt Mutual Funds (Bond-based)",
        desc: "The manager invests the money into bonds, government securities, and fixed-income loans.",
        goal: "Capital safety and steady, predictable interest income with low volatility."
      },
      {
        title: "3. Hybrid Mutual Funds (The Mix)",
        desc: "The manager invests a portion in stocks for growth and a portion in bonds for safety.",
        goal: "A balanced, all-in-one portfolio that automatically manages risk."
      }
    ],
    howItWorks: [
      { step: "Step 1: Investors put money into a fund", desc: "Retail and institutional investors contribute capital into a common pool." },
      { step: "Step 2: The fund issues units", desc: "Units are issued based on the applicable Net Asset Value (NAV)." },
      { step: "Step 3: Pooled money is invested", desc: "The fund manager deploys capital according to the scheme's strategy." },
      { step: "Step 4: Investment value changes", desc: "The underlying stocks, bonds, or assets move in market value." },
      { step: "Step 5: NAV adjusts & returns realized", desc: "Investors realize gains or losses when redeeming their scheme units." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 11200,
      lossVal: 8800,
      gainPct: 12,
      lossPct: -12,
      note: "Example: You invest ₹10,000. If the fund value increases by 12%, it becomes ₹11,200 (+₹1,200 gain). If it decreases by 12%, it becomes ₹8,800 (-₹1,200 loss)."
    },
    advantages: [
      "Instant diversification can be easier to achieve.",
      "Professional portfolio management by experienced fund managers.",
      "Different fund types serve different risk and return objectives.",
      "Access complex portfolios without individually buying every underlying security."
    ],
    risks: [
      "The fund's overall Net Asset Value (NAV) can fall.",
      "Equity funds face stock-market volatility and market risk.",
      "Debt funds face interest-rate fluctuations and credit default risk.",
      "Management expenses (TER) reduce gross investment returns."
    ],
    challenge: {
      question: "You want exposure to multiple companies but do not want to research every company individually. What could you explore?",
      options: [
        "A. Mutual funds.",
        "B. Only one individual stock.",
        "C. Ignore diversification completely."
      ],
      correctIndex: 0,
      explanation: "Correct! Mutual funds provide instant diversification across dozens of companies managed by professionals."
    },
    snapshotStats: [
      { label: "Total Industry AUM", value: "₹85.76+ Lakh Cr", desc: "Massive scale reflecting institutional and retail capital." },
      { label: "Monthly SIP Inflow", value: "₹23,000+ Crore", desc: "Consistent monthly SIP flows demonstrating strong retail discipline." },
      { label: "Active Investor Folios", value: "28+ Crore", desc: "Growing retail footprint across equity, debt, and hybrid schemes." },
      { label: "Large Cap Equity CAGR", value: "12% – 14%", desc: "Long-term historical CAGR for top-tier Indian equity funds." }
    ],
    takeaway: "Mutual funds can provide convenient access to a portfolio, but the right fund depends on its strategy, costs and risks.",
    nextLesson: 'etfs',
    prevLesson: 'stocks',
    dialogue: [...dialogueDefaults]
  },

  'etfs': {
    id: 'etfs',
    title: 'ETFs',
    subtitle: 'A Basket You Can Trade on an Exchange',
    whatItIs: [
      "ETF stands for Exchange-Traded Fund.",
      "An ETF is a fund whose units trade live on a stock exchange, much like individual shares.",
      "Many ETFs track an index, such as the Nifty 50 or Sensex. Other ETFs follow different strategies or track commodities like Gold & Silver.",
      "Think of an ETF as a basket of investments that you can buy or sell instantly through your broker during market hours."
    ],
    howItWorks: [
      { step: "Step 1: Scheme creation", desc: "A fund is created with a defined investment objective (e.g. tracking Nifty 50)." },
      { step: "Step 2: Asset backing", desc: "The fund holds underlying securities matching the index composition." },
      { step: "Step 3: Exchange trading", desc: "Investors buy and sell ETF units on NSE/BSE just like stock shares." },
      { step: "Step 4: Real-time price movement", desc: "The ETF's market price fluctuates continuously during trading hours." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10800,
      lossVal: 9200,
      gainPct: 8,
      lossPct: -8,
      note: "Example: You invest ₹10,000 in a Nifty ETF. If market rises by 8%, value grows to ₹10,800. If market falls by 8%, value drops to ₹9,200."
    },
    advantages: [
      "One purchase provides instant exposure to multiple index securities.",
      "Exchange trading allows buying and selling during live market hours.",
      "Ultra-low expense ratios (0.03% – 0.10% vs 1-2% for active funds).",
      "Full transparency with real-time intraday market prices."
    ],
    risks: [
      "The underlying index assets can lose value.",
      "Tracking error: ETF returns may slightly deviate from the index due to fees.",
      "Trading spreads & brokerage commissions can reduce net returns.",
      "Some specialized ETFs may experience low intraday trading volume."
    ],
    challenge: {
      question: "You want to buy a fund that tracks a market index and trade its units during the day. Which product could you explore?",
      options: [
        "A. An index ETF.",
        "B. A fixed deposit.",
        "C. An unlisted company share."
      ],
      correctIndex: 0,
      explanation: "Correct! ETFs trade live on exchanges during market hours while tracking broad market indices."
    },
    snapshotStats: [
      { label: "Total Indian ETF AUM", value: "₹11.96 Lakh Cr", desc: "Across 350+ listed ETF schemes on NSE & BSE." },
      { label: "Equity Index ETFs AUM", value: "₹8.17 Lakh Cr", desc: "Dominated by Nifty 50 and Sensex tracking passive funds." },
      { label: "Gold & Silver ETFs AUM", value: "₹2.76 Lakh Cr", desc: "Popular commodity hedges backed by physical gold/silver." },
      { label: "Expense Ratio Range", value: "0.03% – 0.10%", desc: "Significantly lower costs compared to active mutual funds." }
    ],
    takeaway: "ETFs combine fund-based investing with exchange trading. They are not automatically safer or better than other funds.",
    nextLesson: 'bonds',
    prevLesson: 'mutual-funds',
    dialogue: [...dialogueDefaults]
  },

  'bonds': {
    id: 'bonds',
    title: 'BONDS',
    subtitle: 'Become a Lender & Earn Coupon Yield',
    whatItIs: [
      "When you buy a bond, you are lending money to a corporation or government entity.",
      "In return, the borrower promises to pay you regular interest payments (called coupon yield) and return your principal amount at maturity.",
      "Bonds offer predictable income stream and lower volatility compared to equity markets."
    ],
    howItWorks: [
      { step: "Step 1: Bond issuance", desc: "Government or company issues bonds to borrow capital." },
      { step: "Step 2: Investor purchases bond", desc: "Investor pays principal amount for the bond certificate." },
      { step: "Step 3: Coupon payouts", desc: "Issuer pays periodic fixed interest payments (e.g. 8% p.a.)." },
      { step: "Step 4: Principal repayment", desc: "On maturity date, full principal is returned to investor." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10800,
      lossVal: 9500,
      gainPct: 8,
      lossPct: -5,
      note: "Example: ₹10,000 bond paying 8% coupon yields ₹800 annual interest. Secondary market prices can fluctuate if interest rates change."
    },
    advantages: [
      "Predictable fixed income stream.",
      "Lower volatility than stock market.",
      "Priority claim over equity in case of company liquidation."
    ],
    risks: [
      "Interest rate risk: Bond prices fall when market interest rates rise.",
      "Credit/Default risk: Issuer may fail to make interest or principal payments."
    ],
    challenge: {
      question: "When market interest rates rise, what typically happens to existing fixed-rate bond prices?",
      options: [
        "A. Existing bond prices fall.",
        "B. Existing bond prices rise.",
        "C. Nothing changes."
      ],
      correctIndex: 0,
      explanation: "Correct! Bond prices and interest rates move in opposite directions."
    },
    snapshotStats: [
      { label: "Indian Bond Market", value: "₹170+ Lakh Cr", desc: "Dominated by Sovereign G-Secs and Corporate Bonds." },
      { label: "10Y G-Sec Benchmark", value: "~6.8% – 7.2%", desc: "Risk-free benchmark rate for Indian fixed income." }
    ],
    takeaway: "Bonds provide portfolio stability and steady income, balancing stock market volatility.",
    nextLesson: 'reits',
    prevLesson: 'etfs',
    dialogue: [...dialogueDefaults]
  },

  'reits': {
    id: 'reits',
    title: 'REITs',
    subtitle: 'Real Estate Ownership Without Buying Buildings',
    whatItIs: [
      "REITs (Real Estate Investment Trusts) own and operate revenue-generating commercial real estate such as IT parks, malls, and warehouses.",
      "By law in India, REITs must distribute at least 90% of their net printable cash flow to unitholders as quarterly dividends.",
      "They allow everyday investors to own prime real estate with small ticket sizes."
    ],
    howItWorks: [
      { step: "Step 1: Property aggregation", desc: "REIT acquires Grade-A office parks and commercial assets." },
      { step: "Step 2: Rental collection", desc: "Corporate tenants pay monthly lease rentals to the REIT." },
      { step: "Step 3: Quarterly distribution", desc: "90%+ of net rental income is distributed to unitholders." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10700,
      lossVal: 9400,
      gainPct: 7,
      lossPct: -6,
      note: "Example: ₹10,000 investment yields ~6.5% rental dividend payout plus potential capital appreciation of underlying IT parks."
    },
    advantages: [
      "High dividend yield distributed quarterly.",
      "Inflation hedge through built-in lease rental escalation clauses.",
      "Liquid exchange trading unlike physical property."
    ],
    risks: [
      "Occupancy risk: Vacancies in IT parks reduce rental payouts.",
      "Interest rate sensitivity: Higher rates increase borrowing costs."
    ],
    challenge: {
      question: "What percentage of net rentable cash flows must Indian REITs distribute to unitholders by law?",
      options: [
        "A. At least 90%",
        "B. Exactly 50%",
        "C. Optional 10%"
      ],
      correctIndex: 0,
      explanation: "Correct! SEBI regulations mandate at least 90% distribution to ensure high yield for unitholders."
    },
    snapshotStats: [
      { label: "Listed Indian REITs", value: "Embassy, Mindspace, Nexus, Brookfield", desc: "Over 110+ Million sq. ft. Grade-A commercial office space." },
      { label: "Average Distribution Yield", value: "6.5% – 7.5%", desc: "Quarterly cash payouts combined with long-term property appreciation." }
    ],
    takeaway: "REITs offer liquid real estate exposure with regular rental dividend distributions.",
    nextLesson: 'invits',
    prevLesson: 'bonds',
    dialogue: [...dialogueDefaults]
  },

  'invits': {
    id: 'invits',
    title: 'InvITs',
    subtitle: 'Infrastructure Generating Daily Cash Flow',
    whatItIs: [
      "InvITs (Infrastructure Investment Trusts) own operational infrastructure projects such as power transmission lines, toll highways, and telecom towers.",
      "Similar to REITs, InvITs distribute predictable cash flows generated from toll collection or long-term power transmission tariffs.",
      "They provide stable, high-yield cash flows backed by critical national infrastructure."
    ],
    howItWorks: [
      { step: "Step 1: Infra asset pooling", desc: "Trust pools toll roads, power grids, or gas pipelines." },
      { step: "Step 2: Tariff collection", desc: "Vehicles pay tolls or state utilities pay transmission tariffs." },
      { step: "Step 3: Unitholder payout", desc: "Net cash flows are distributed as interest, dividend, and capital repayment." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10900,
      lossVal: 9200,
      gainPct: 9,
      lossPct: -8,
      note: "Example: ₹10,000 invested in a PowerGrid InvIT can yield 8-9% annual cash distribution."
    },
    advantages: [
      "High distribution yield (often 8% – 10% p.a.).",
      "Monopoly assets backed by long-term government concession agreements.",
      "Regular quarterly cash flow distributions."
    ],
    risks: [
      "Concession period expiry: Assets return to government after concession term.",
      "Traffic volume & regulatory tariff revision risk."
    ],
    challenge: {
      question: "InvITs primarily derive their cash flows from:",
      options: [
        "A. Operational infrastructure like toll roads & power lines",
        "B. Software apps & e-commerce sales",
        "C. Unlisted startup shares"
      ],
      correctIndex: 0,
      explanation: "Correct! InvITs monetize essential national infrastructure like highways, power lines, and telecom towers."
    },
    snapshotStats: [
      { label: "Major Listed InvITs", value: "POWERGRID InvIT, IndiGrid, IRB Infra", desc: "Managing thousands of kilometers of national highways & power grids." },
      { label: "Cash Distribution Yield", value: "8.0% – 10.5%", desc: "Among the highest cash distribution yields available in Indian markets." }
    ],
    takeaway: "InvITs offer high cash yields from operational national infrastructure projects.",
    nextLesson: null,
    prevLesson: 'reits',
    dialogue: [...dialogueDefaults]
  }
};
