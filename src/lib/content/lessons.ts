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
    subtitle: 'Become a Lender',
    whatItIs: [
      "Imagine a company needs money to build a factory.",
      "Instead of raising all the money through ownership shares, it may borrow money by issuing bonds.",
      "When you buy a bond, you are lending money to the issuer. The issuer promises to make payments according to the bond's terms.",
      "Issuers can include governments (G-Secs) and private or public corporations."
    ],
    howItWorks: [
      { step: "Step 1: Bond issuance", desc: "An issuer raises money by issuing a bond with specified interest terms." },
      { step: "Step 2: Investor purchase", desc: "Investors purchase the bond certificates." },
      { step: "Step 3: Coupon payments", desc: "The issuer makes periodic interest payments if specified by the bond's terms." },
      { step: "Step 4: Principal repayment at maturity", desc: "At maturity, the issuer is generally expected to repay the principal according to the bond's terms." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10700,
      lossVal: 9300,
      gainPct: 7,
      lossPct: -7,
      note: "Example: Suppose you buy a bond with a face value of ₹10,000 and an annual coupon rate of 7% (₹700 annual coupon). If interest rates rise or issuer credit drops, market secondary price fluctuates."
    },
    advantages: [
      "Some bonds provide scheduled, predictable interest payments.",
      "Cash flows can be more predictable for certain fixed-income securities.",
      "Bonds help diversify a portfolio of stocks.",
      "Serve different financial goals depending on maturity and credit quality."
    ],
    risks: [
      "Credit/Default risk: The issuer may fail to pay interest or principal.",
      "Interest-rate risk: Bond market prices fall when market interest rates rise.",
      "Liquidity risk: Some corporate bonds can be difficult to sell quickly.",
      "Inflation risk: Inflation can reduce the purchasing power of future cash payouts."
    ],
    challenge: {
      question: "You buy a fixed-coupon bond. Market interest rates rise. What may happen to the bond's market price?",
      options: [
        "A. It must rise.",
        "B. It may fall.",
        "C. It can never change."
      ],
      correctIndex: 1,
      explanation: "Correct! Existing fixed-coupon bonds become less attractive when new bonds offer higher interest rates, pushing their market prices down."
    },
    snapshotStats: [
      { label: "Total Indian Debt Market", value: "$2.3+ Trillion", desc: "Valued at over ₹190+ Lakh Crore across G-Secs, SDLs & Corporate Bonds." },
      { label: "10-Year G-Sec Yield", value: "6.8% – 7.3%", desc: "Sovereign risk-free benchmark yield rate." },
      { label: "AAA Corporate Bond Yield", value: "7.5% – 8.5%", desc: "High credit quality corporate debt returns." },
      { label: "High-Yield Corporate Bonds", value: "9.0% – 11.5%", desc: "Reflecting higher credit default risks." }
    ],
    takeaway: "Existing fixed-coupon bonds often become less attractive when new bonds offer higher interest rates, which can push their market prices down.",
    nextLesson: 'reits',
    prevLesson: 'etfs',
    dialogue: [...dialogueDefaults]
  },

  'reits': {
    id: 'reits',
    title: 'REITs',
    subtitle: 'Explore Real Estate Without Buying an Entire Building',
    whatItIs: [
      "REIT stands for Real Estate Investment Trust.",
      "Imagine a commercial building worth hundreds of crores. Most individual investors cannot buy the entire property.",
      "A REIT provides a way to invest in a vehicle that holds or manages eligible real-estate assets, depending on its structure.",
      "In India, listed REIT units can be bought and sold through stock exchanges."
    ],
    howItWorks: [
      { step: "Step 1: Capital raising", desc: "A REIT raises capital from investors through an initial public offer." },
      { step: "Step 2: Property investment", desc: "It holds or invests in commercial real-estate assets (e.g. IT parks, malls)." },
      { step: "Step 3: Rental income generation", desc: "Properties generate monthly rental income from corporate tenants." },
      { step: "Step 4: Payout distribution", desc: "After expenses, the trust distributes net rental cash flows to investors." },
      { step: "Step 5: Exchange trading", desc: "Investors gain or lose money as the market price of their units changes." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10800,
      lossVal: 9200,
      gainPct: 8,
      lossPct: -8,
      note: "Example: You invest ₹10,000 in a REIT. Units increase in market value by ₹500 + receive ₹300 in cash distributions = Total gain ₹800 (8% return)."
    },
    advantages: [
      "Access to commercial real-estate investment without buying an entire building.",
      "Potential regular distributions from property-related rental income.",
      "Listed units provide an easy exit route through the stock exchange.",
      "Diversifies a portfolio beyond individual company shares."
    ],
    risks: [
      "Property vacancies can reduce overall rental income.",
      "Interest-rate increases can affect property valuations and financing costs.",
      "Commercial real-estate market downturns can reduce unit market prices.",
      "Distributions are not guaranteed and trading liquidity can vary."
    ],
    challenge: {
      question: "You want to explore commercial real-estate exposure but cannot afford to buy an entire building. What could you research?",
      options: [
        "A. REITs.",
        "B. Only direct property ownership.",
        "C. A company's ordinary shares without researching its business."
      ],
      correctIndex: 0,
      explanation: "Correct! REITs allow retail investors to buy fractional units of commercial IT parks and office buildings."
    },
    snapshotStats: [
      { label: "Grade-A Commercial Space", value: "115+ Million sq. ft.", desc: "Managed by listed REITs across major Indian tech hubs." },
      { label: "Listed REIT Sector Cap", value: "₹1.07L – ₹1.6L Cr", desc: "Fast-growing sector including Embassy, Mindspace, Nexus & Brookfield." },
      { label: "SEBI Payout Mandate", value: "At least 90%", desc: "Must distribute 90%+ of net distributable cash flows back to unitholders." },
      { label: "Distribution Dividend Yield", value: "5.5% – 6.5% p.a.", desc: "Quarterly rental income cash yield." }
    ],
    takeaway: "REITs offer an alternative route to real-estate exposure, but they are not equivalent to owning a property directly.",
    nextLesson: 'invits',
    prevLesson: 'bonds',
    dialogue: [...dialogueDefaults]
  },

  'invits': {
    id: 'invits',
    title: 'InvITs',
    subtitle: 'Explore the Infrastructure Behind Everyday Life',
    whatItIs: [
      "InvIT stands for Infrastructure Investment Trust.",
      "Think about highways, power transmission lines and other infrastructure assets that support everyday life.",
      "An InvIT allows investors to gain exposure to eligible infrastructure assets through a trust structure.",
      "In India, listed InvIT units can be traded on stock exchanges."
    ],
    howItWorks: [
      { step: "Step 1: Trust establishment", desc: "A sponsor establishes the trust and transfers eligible infrastructure assets." },
      { step: "Step 2: Unit issuance", desc: "Investors buy units in the trust through public or private offerings." },
      { step: "Step 3: Revenue generation", desc: "Assets generate cash flow through toll collections or contractual power tariffs." },
      { step: "Step 4: Cash distribution", desc: "After operating expenses, the trust distributes net income to unitholders." },
      { step: "Step 5: Price fluctuation", desc: "Market price of units changes on the exchange, creating potential gains or losses." }
    ],
    returnsExample: {
      initial: 10000,
      gainVal: 10700,
      lossVal: 9300,
      gainPct: 7,
      lossPct: -7,
      note: "Example: You invest ₹10,000 in an InvIT. Receive ₹400 in cash distributions + units appreciate by ₹300 = Total gain ₹700 (7% return)."
    },
    advantages: [
      "Provides access to infrastructure investment exposure.",
      "Offers regular distributions from essential infrastructure cash flows.",
      "Participate without directly owning an entire highway or power grid.",
      "Provides asset diversification non-correlated with traditional stocks."
    ],
    risks: [
      "Traffic volume or toll usage may fall for highway assets.",
      "Operating and maintenance costs may increase unexpectedly.",
      "Interest-rate changes can affect borrowing costs and valuations.",
      "Regulatory policy changes may impact toll or tariff rates."
    ],
    challenge: {
      question: "You want to learn how investors can gain exposure to infrastructure projects without directly buying the entire project. What could you explore?",
      options: [
        "A. InvITs.",
        "B. Only individual company stocks.",
        "C. Buying a highway directly."
      ],
      correctIndex: 0,
      explanation: "Correct! InvITs monetize operational infrastructure assets like national highways, power transmission lines, and solar parks."
    },
    snapshotStats: [
      { label: "Registered Indian InvITs", value: "24+ InvITs", desc: "Managing national assets valued at over ₹2.5+ Lakh Crore." },
      { label: "SEBI Payout Requirement", value: "At least 90%", desc: "Mandated distribution of net cash flows to investors." },
      { label: "Distribution Yield", value: "8.0% – 12.3% p.a.", desc: "Driven by steady toll collections and regulated power tariffs." },
      { label: "Annualized Total Return", value: "11.0% – 14.0%", desc: "Long-term total return over concession asset lifespans." }
    ],
    takeaway: "InvITs provide an investment route into infrastructure-related assets, but their returns and risks depend on the trust's underlying assets and structure.",
    nextLesson: null,
    prevLesson: 'reits',
    dialogue: [...dialogueDefaults]
  }
};
