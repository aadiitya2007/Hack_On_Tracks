export type KeyType = {
  title: string;
  desc: string;
  goal: string;
};

export type ChallengeQuestion = {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  challenge: ChallengeQuestion;
  challenges: ChallengeQuestion[];
  snapshotStats: { label: string; value: string; desc: string }[];
  takeaway: string;
  nextLesson: string | null;
  prevLesson: string | null;
  dialogue: { 
    id: string; 
    sender: 'mentor' | 'learner'; 
    text: string;
    expression?: 'neutral' | 'thinking' | 'happy' | 'surprised';
    tag?: string;
    actionText?: string;
    actionTarget?: string;
  }[];
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
      id: 'st-1',
      question: "You own shares in a company whose revenue is rising, but its profits are falling. What should you investigate?",
      options: [
        "A. Only its share price.",
        "B. Its expenses, debt and reasons for falling profits.",
        "C. Nothing. Rising revenue guarantees success."
      ],
      correctIndex: 1,
      explanation: "Correct! Revenue growth alone does not guarantee profitability. You must analyze rising expenses, interest burdens, or operational inefficiencies."
    },
    challenges: [
      {
        id: 'st-1',
        question: "You own shares in a company whose revenue is rising, but its profits are falling. What should you investigate?",
        options: [
          "A. Only its share price.",
          "B. Its expenses, debt and reasons for falling profits.",
          "C. Nothing. Rising revenue guarantees success."
        ],
        correctIndex: 1,
        explanation: "Correct! Revenue growth alone does not guarantee profitability. You must analyze rising expenses, interest burdens, or operational inefficiencies."
      },
      {
        id: 'st-2',
        question: "Unlike a bank fixed deposit, what is a fundamental legal reality of owning company shares?",
        options: [
          "A. The company is legally required to pay you fixed annual dividends.",
          "B. The company must buy back your shares at your original purchase price.",
          "C. The company has no legal obligation to pay dividends or guarantee share prices."
        ],
        correctIndex: 2,
        explanation: "Correct! Equities represent risk ownership capital. A listed company is never legally obligated to declare dividends or protect your invested principal."
      },
      {
        id: 'st-3',
        question: "What does Market Capitalization (Market Cap) of an Indian listed company represent?",
        options: [
          "A. The total annual revenue generated by the company.",
          "B. Total outstanding shares multiplied by the current share price.",
          "C. The amount of liquid cash the company holds in its bank accounts."
        ],
        correctIndex: 1,
        explanation: "Correct! Market Cap = Total Outstanding Shares × Current Market Price. It classifies stocks into Large-Cap (top 100), Mid-Cap (101-250), and Small-Cap."
      },
      {
        id: 'st-4',
        question: "If an investor allocates 100% of their investment capital into a single company's stock, what key risk are they taking?",
        options: [
          "A. Severe company-specific concentration risk.",
          "B. Complete protection against nationwide recessions.",
          "C. Guaranteed market index outperformance."
        ],
        correctIndex: 0,
        explanation: "Correct! Concentrating capital in a single stock exposes you to business failure or governance issues without any diversification safety cushion."
      },
      {
        id: 'st-5',
        question: "What are the two primary mechanisms through which long-term equity investors generate returns?",
        options: [
          "A. Capital appreciation (stock price rise) and corporate dividend payouts.",
          "B. Guaranteed monthly coupons backed by the RBI.",
          "C. Daily fixed interest independent of stock market prices."
        ],
        correctIndex: 0,
        explanation: "Correct! Equity returns come from capital growth (when the company expands and its valuation increases) and cash dividends distributed from net profits."
      }
    ],
    snapshotStats: [
      { label: "Market Capitalization", value: "₹450+ Lakh Cr", desc: "India's stock market rank stands among global top 5 ($5.4+ Trillion)." },
      { label: "NSE Registered Accounts", value: "26+ Crore", desc: "Representing over 13.1 crore unique individual retail investors." },
      { label: "Historical Nifty 50 CAGR", value: "12.5% – 14.5%", desc: "Long-term annualized return over 10–15 year horizons." },
      { label: "Annualized Volatility", value: "14% – 18%", desc: "Standard deviation reflecting sharp short-term market swings." }
    ],
    takeaway: "Revenue growth alone does not guarantee profitability or a rising share price.",
    nextLesson: 'mutual-funds',
    prevLesson: null,
    dialogue: [
      {
        id: 's-1',
        sender: 'mentor',
        text: 'Hey Aditya! Welcome to the Stocks Masterclass. When you buy a share of Reliance, TCS, or Tata Motors, what do you think actually happens?',
        expression: 'happy',
        tag: 'Welcome'
      },
      {
        id: 's-2',
        sender: 'learner',
        text: 'Do I actually become a co-owner of the company, or am I just speculating on daily chart tickers?',
        expression: 'thinking'
      },
      {
        id: 's-3',
        sender: 'mentor',
        text: 'You become a real partial shareholder! That equity gives you legal voting rights at AGMs and an entitlement to dividend distributions.',
        expression: 'happy',
        tag: 'Ownership'
      },
      {
        id: 's-4',
        sender: 'learner',
        text: 'What causes share prices to swing so aggressively every second on NSE and BSE?',
        expression: 'surprised'
      },
      {
        id: 's-5',
        sender: 'mentor',
        text: 'Demand and supply! When quarterly profits beat analyst estimates, buyers outbid sellers. In the short run it is a voting machine, but in the long run it is a weighing machine.',
        expression: 'neutral',
        tag: 'Pricing Edge'
      },
      {
        id: 's-6',
        sender: 'learner',
        text: 'How can I simulate the potential gain vs downside risk of holding stocks over market cycles?',
        expression: 'happy'
      },
      {
        id: 's-7',
        sender: 'mentor',
        text: 'Try our interactive Return Simulator right below! Move the slider to see how compounding drives multi-year returns.',
        expression: 'happy',
        tag: 'Actionable',
        actionText: 'Open Return Simulator',
        actionTarget: 'return-simulator'
      }
    ]
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
      id: 'mf-1',
      question: "You want exposure to multiple companies but do not want to research every company individually. What could you explore?",
      options: [
        "A. Mutual funds.",
        "B. Only one individual stock.",
        "C. Ignore diversification completely."
      ],
      correctIndex: 0,
      explanation: "Correct! Mutual funds provide instant diversification across dozens of companies managed by professionals."
    },
    challenges: [
      {
        id: 'mf-1',
        question: "You want exposure to multiple companies but do not want to research every company individually. What could you explore?",
        options: [
          "A. Mutual funds.",
          "B. Only one individual stock.",
          "C. Ignore diversification completely."
        ],
        correctIndex: 0,
        explanation: "Correct! Mutual funds provide instant diversification across dozens of companies managed by professionals."
      },
      {
        id: 'mf-2',
        question: "What does the Net Asset Value (NAV) of a mutual fund scheme represent?",
        options: [
          "A. The fixed legal maximum share price set by the SEBI regulator.",
          "B. Market value of fund assets minus liabilities, divided by total outstanding units.",
          "C. The annual commission paid to marketing agents."
        ],
        correctIndex: 1,
        explanation: "Correct! NAV is the per-unit book value computed at the end of every trading day as (Assets - Liabilities) / Units."
      },
      {
        id: 'mf-3',
        question: "How does a lower Total Expense Ratio (TER) in a mutual fund affect an investor over a 15-year compounding period?",
        options: [
          "A. It reduces long-term net wealth because higher fees guarantee higher stock picks.",
          "B. Lower fees leave more capital invested to compound exponentially, resulting in substantially higher wealth.",
          "C. Expense ratios have zero mathematical effect on final corpus value."
        ],
        correctIndex: 1,
        explanation: "Correct! Compounding works both ways; saving 1% annually in expense ratios can add lakhs of rupees to a 15-year retirement corpus."
      },
      {
        id: 'mf-4',
        question: "Why is a monthly Systematic Investment Plan (SIP) considered advantageous during volatile market corrections?",
        options: [
          "A. It guarantees that the fund will never fall in value.",
          "B. It enforces Rupee-Cost Averaging, buying more units when prices fall and fewer when prices rise.",
          "C. It automatically cancels your investments whenever the NIFTY drops."
        ],
        correctIndex: 1,
        explanation: "Correct! Rupee-cost averaging through SIPs automatically turns market pullbacks into unit accumulation opportunities without emotional timing."
      },
      {
        id: 'mf-5',
        question: "What is the primary financial distinction between 'Direct Plans' and 'Regular Plans' of the same mutual fund?",
        options: [
          "A. Direct plans bypass distributor commissions, resulting in a lower expense ratio and higher returns.",
          "B. Regular plans invest in safer government bonds while Direct plans invest in risky derivatives.",
          "C. Direct plans are only accessible to foreign institutional funds."
        ],
        correctIndex: 0,
        explanation: "Correct! Direct plans eliminate distributor trail commissions (saving 0.5%–1.5% annually), meaning 100% of your money works for your growth."
      }
    ],
    snapshotStats: [
      { label: "Total Industry AUM", value: "₹85.76+ Lakh Cr", desc: "Massive scale reflecting institutional and retail capital." },
      { label: "Monthly SIP Inflow", value: "₹23,000+ Crore", desc: "Consistent monthly SIP flows demonstrating strong retail discipline." },
      { label: "Active Investor Folios", value: "28+ Crore", desc: "Growing retail footprint across equity, debt, and hybrid schemes." },
      { label: "Large Cap Equity CAGR", value: "12% – 14%", desc: "Long-term historical CAGR for top-tier Indian equity funds." }
    ],
    takeaway: "Mutual funds can provide convenient access to a portfolio, but the right fund depends on its strategy, costs and risks.",
    nextLesson: 'etfs',
    prevLesson: 'stocks',
    dialogue: [
      {
        id: 'mf-1',
        sender: 'mentor',
        text: 'Welcome to Mutual Funds! Imagine you want a 50-dish culinary feast, but you only have budget to buy one plate. What do you do?',
        expression: 'happy',
        tag: 'Analogy'
      },
      {
        id: 'mf-2',
        sender: 'learner',
        text: 'Pool funds together with 50 friends so everyone gets a portion of the entire feast!',
        expression: 'thinking'
      },
      {
        id: 'mf-3',
        sender: 'mentor',
        text: 'Bingo! A Mutual Fund pools capital from millions of investors into an AMC managed by a SEBI-registered professional fund manager.',
        expression: 'happy',
        tag: 'Pooling Power'
      },
      {
        id: 'mf-4',
        sender: 'learner',
        text: 'What is the real difference between an Active Equity Fund and a Passive Index Fund?',
        expression: 'thinking'
      },
      {
        id: 'mf-5',
        sender: 'mentor',
        text: 'Active funds charge ~1.5% expense ratios to pick winners. Passive Index funds charge <0.15% to simply mirror Nifty 50 with zero human bias!',
        expression: 'neutral',
        tag: 'Fee Alpha'
      },
      {
        id: 'mf-6',
        sender: 'mentor',
        text: 'Check out the interactive Fund Basket comparison canvas right below to see how risk is diversified.',
        expression: 'happy',
        actionText: 'Explore Basket Canvas',
        actionTarget: 'concept-canvas'
      }
    ]
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
      id: 'etf-1',
      question: "You want to buy a fund that tracks a market index and trade its units during the day. Which product could you explore?",
      options: [
        "A. An index ETF.",
        "B. A fixed deposit.",
        "C. An unlisted company share."
      ],
      correctIndex: 0,
      explanation: "Correct! ETFs trade live on exchanges during market hours while tracking broad market indices."
    },
    challenges: [
      {
        id: 'etf-1',
        question: "You want to buy a fund that tracks a market index and trade its units during the day. Which product could you explore?",
        options: [
          "A. An index ETF.",
          "B. A fixed deposit.",
          "C. An unlisted company share."
        ],
        correctIndex: 0,
        explanation: "Correct! ETFs trade live on exchanges during market hours while tracking broad market indices."
      },
      {
        id: 'etf-2',
        question: "What does 'Tracking Error' quantify when evaluating an index ETF like NIFTYBEES?",
        options: [
          "A. How much the ETF's returns deviate from the underlying benchmark index.",
          "B. The number of technical glitches on the stock exchange website.",
          "C. The total taxes paid by individual investors."
        ],
        correctIndex: 0,
        explanation: "Correct! Tracking error measures the performance gap between the ETF and the index, caused by expense ratios, cash buffers, and rebalancing timing."
      },
      {
        id: 'etf-3',
        question: "Why do investors frequently allocate capital to Gold ETFs (such as Nippon Gold BeES)?",
        options: [
          "A. Gold ETFs pay guaranteed monthly interest into bank accounts.",
          "B. Gold serves as an inflation hedge and has historically low correlation with equity crashes.",
          "C. Gold ETFs are backed by real estate apartments."
        ],
        correctIndex: 1,
        explanation: "Correct! Gold BeES units are backed by 99.5% pure physical gold, offering a portfolio buffer against currency depreciation and equity drawdowns."
      },
      {
        id: 'etf-4',
        question: "What is a major cost advantage of Index ETFs over actively managed mutual funds?",
        options: [
          "A. Ultra-low expense ratios (often 0.03% to 0.15% vs 1.5% to 2.2% for active funds).",
          "B. Complete exemption from all stock exchange transaction fees.",
          "C. Guaranteed zero capital gains tax for life."
        ],
        correctIndex: 0,
        explanation: "Correct! Because passive ETFs mirror established rules-based indices, they do not require expensive research teams, passing immense fee savings to investors."
      },
      {
        id: 'etf-5',
        question: "What does Indicative Net Asset Value (iNAV) tell a trader before placing an ETF market order?",
        options: [
          "A. The real-time estimated fair value of the ETF basket based on live market prices.",
          "B. The historical dividend paid 10 years ago.",
          "C. The closing price from the previous month."
        ],
        correctIndex: 0,
        explanation: "Correct! iNAV helps investors check whether the live trading price has an excessive bid-ask premium or discount relative to the true underlying securities."
      }
    ],
    snapshotStats: [
      { label: "Total Indian ETF AUM", value: "₹11.96 Lakh Cr", desc: "Across 350+ listed ETF schemes on NSE & BSE." },
      { label: "Equity Index ETFs AUM", value: "₹8.17 Lakh Cr", desc: "Dominated by Nifty 50 and Sensex tracking passive funds." },
      { label: "Gold & Silver ETFs AUM", value: "₹2.76 Lakh Cr", desc: "Popular commodity hedges backed by physical gold/silver." },
      { label: "Expense Ratio Range", value: "0.03% – 0.10%", desc: "Significantly lower costs compared to active mutual funds." }
    ],
    takeaway: "ETFs combine fund-based investing with exchange trading. They are not automatically safer or better than other funds.",
    nextLesson: 'bonds',
    prevLesson: 'mutual-funds',
    dialogue: [
      {
        id: 'etf-1',
        sender: 'mentor',
        text: 'ETFs are the modern hybrid between Mutual Funds and Stocks. Have you traded NIFTYBEES or GOLDBEES on Zerodha or Groww?',
        expression: 'neutral',
        tag: 'Hybrid Edge'
      },
      {
        id: 'etf-2',
        sender: 'learner',
        text: 'I know they track indices, but how are they different from standard mutual funds?',
        expression: 'thinking'
      },
      {
        id: 'etf-3',
        sender: 'mentor',
        text: 'Mutual funds settle NAV once daily at 3:30 PM. ETFs trade live on NSE/BSE every single second just like ordinary shares!',
        expression: 'happy',
        tag: 'Live Liquidity'
      },
      {
        id: 'etf-4',
        sender: 'learner',
        text: 'So I get real-time price discovery, ultra-low expense ratios, and zero lock-in exit loads?',
        expression: 'surprised'
      },
      {
        id: 'etf-5',
        sender: 'mentor',
        text: 'Exactly! Most Nifty 50 ETFs have expense ratios below 0.05%—one-thirtieth the cost of active funds. Let us simulate ETF returns below!',
        expression: 'happy',
        actionText: 'Simulate ETF Growth',
        actionTarget: 'return-simulator'
      }
    ]
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
      id: 'bd-1',
      question: "You buy a fixed-coupon bond. Market interest rates rise. What may happen to the bond's market price?",
      options: [
        "A. It must rise.",
        "B. It may fall.",
        "C. It can never change."
      ],
      correctIndex: 1,
      explanation: "Correct! Existing fixed-coupon bonds become less attractive when new bonds offer higher interest rates, pushing their market prices down."
    },
    challenges: [
      {
        id: 'bd-1',
        question: "You buy a fixed-coupon bond. Market interest rates rise. What may happen to the bond's market price?",
        options: [
          "A. It must rise.",
          "B. It may fall.",
          "C. It can never change."
        ],
        correctIndex: 1,
        explanation: "Correct! Existing fixed-coupon bonds become less attractive when new bonds offer higher interest rates, pushing their market prices down."
      },
      {
        id: 'bd-2',
        question: "What does the 'Coupon Rate' of a bond specify to the investor?",
        options: [
          "A. The fixed annual interest percentage paid by the issuer on the bond's face value.",
          "B. The discount percentage applied during festive shopping seasons.",
          "C. The brokerage fee charged when selling the bond on NSE."
        ],
        correctIndex: 0,
        explanation: "Correct! The coupon rate is the contractual periodic interest rate the bond issuer commits to pay on nominal face value."
      },
      {
        id: 'bd-3',
        question: "Why are Government of India Dated Securities (G-Secs) considered the sovereign risk-free standard in India?",
        options: [
          "A. Because the government guarantees zero credit default risk on rupee principal and interest.",
          "B. Because their market prices never fluctuate under any circumstances.",
          "C. Because they pay guaranteed 20% annual returns."
        ],
        correctIndex: 0,
        explanation: "Correct! Sovereign securities carry the full faith and credit backing of the central government, eliminating credit default risk."
      },
      {
        id: 'bd-4',
        question: "What generally happens to a corporate bond if a rating agency downgrades its credit rating from AAA to BBB?",
        options: [
          "A. Its secondary market price drops as perceived default risk increases.",
          "B. The company is forced to give free equity shares to bondholders.",
          "C. The bond's maturity date is automatically moved forward."
        ],
        correctIndex: 0,
        explanation: "Correct! A credit downgrade increases risk perception, forcing institutional investors to sell, pushing secondary market prices down."
      },
      {
        id: 'bd-5',
        question: "Through which official scheme can retail individuals open a direct gilt account to buy G-Secs with zero intermediary fees?",
        options: [
          "A. RBI Retail Direct Scheme.",
          "B. SEBI Demat Sachet Portal.",
          "C. GST Network Portal."
        ],
        correctIndex: 0,
        explanation: "Correct! The RBI Retail Direct portal provides direct individual access to buy primary sovereign auctions and Treasury bills seamlessly."
      }
    ],
    snapshotStats: [
      { label: "Total Indian Debt Market", value: "$2.3+ Trillion", desc: "Valued at over ₹190+ Lakh Crore across G-Secs, SDLs & Corporate Bonds." },
      { label: "10-Year G-Sec Yield", value: "6.8% – 7.3%", desc: "Sovereign risk-free benchmark yield rate." },
      { label: "AAA Corporate Bond Yield", value: "7.5% – 8.5%", desc: "High credit quality corporate debt returns." },
      { label: "High-Yield Corporate Bonds", value: "9.0% – 11.5%", desc: "Reflecting higher credit default risks." }
    ],
    takeaway: "Existing fixed-coupon bonds often become less attractive when new bonds offer higher interest rates, which can push their market prices down.",
    nextLesson: 'reits',
    prevLesson: 'etfs',
    dialogue: [
      {
        id: 'b-1',
        sender: 'mentor',
        text: 'Welcome to Bonds! When you buy equity, you are an owner. But when you buy a Bond, what role do you play?',
        expression: 'happy',
        tag: 'Fixed Income'
      },
      {
        id: 'b-2',
        sender: 'learner',
        text: 'Am I lending capital to the company or the Government of India?',
        expression: 'thinking'
      },
      {
        id: 'b-3',
        sender: 'mentor',
        text: 'Correct! You become a debt lender. The issuer is legally bound to pay periodic coupon interest and refund your principal on maturity.',
        expression: 'happy',
        tag: 'Legal Claim'
      },
      {
        id: 'b-4',
        sender: 'learner',
        text: 'Can a bond ever default or lose value?',
        expression: 'thinking'
      },
      {
        id: 'b-5',
        sender: 'mentor',
        text: 'Central Government G-Secs have zero credit risk. For corporate bonds, always check the credit rating: AAA is safest, while BBB or lower carries credit spread risk.',
        expression: 'neutral',
        tag: 'Credit Ratings'
      },
      {
        id: 'b-6',
        sender: 'mentor',
        text: 'Notice how bond yields move inversely to interest rates. Let us test the calculator below!',
        expression: 'happy',
        actionText: 'View Fixed Yield Calculations',
        actionTarget: 'return-simulator'
      }
    ]
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
      id: 're-1',
      question: "You want to explore commercial real-estate exposure but cannot afford to buy an entire building. What could you research?",
      options: [
        "A. REITs.",
        "B. Only direct property ownership.",
        "C. A company's ordinary shares without researching its business."
      ],
      correctIndex: 0,
      explanation: "Correct! REITs allow retail investors to buy fractional units of commercial IT parks and office buildings."
    },
    challenges: [
      {
        id: 're-1',
        question: "You want to explore commercial real-estate exposure but cannot afford to buy an entire building. What could you research?",
        options: [
          "A. REITs.",
          "B. Only direct property ownership.",
          "C. A company's ordinary shares without researching its business."
        ],
        correctIndex: 0,
        explanation: "Correct! REITs allow retail investors to buy fractional units of commercial IT parks and office buildings."
      },
      {
        id: 're-2',
        question: "Under statutory SEBI regulations, what percentage of net distributable cash flows must an Indian REIT distribute to unitholders?",
        options: [
          "A. At least 90% semi-annually or quarterly.",
          "B. Only 25% at management's sole discretion.",
          "C. Distributions are strictly prohibited."
        ],
        correctIndex: 0,
        explanation: "Correct! SEBI mandates that Indian REITs must pass through at least 90% of net operational cash flows back to unitholders as quarterly payouts."
      },
      {
        id: 're-3',
        question: "What minimum proportion of an Indian REIT's asset value must be invested in completed, rent-generating commercial properties?",
        options: [
          "A. At least 80% to protect investors against long construction delays.",
          "B. 10%, with 90% in raw undeveloped farmland.",
          "C. 0%, REITs are allowed to be purely speculative."
        ],
        correctIndex: 0,
        explanation: "Correct! The 80% completed property rule ensures that the majority of REIT assets generate immediate, stable commercial rental income."
      },
      {
        id: 're-4',
        question: "How do rising macroeconomic interest rates (e.g. RBI rate hike cycles) typically impact listed REIT unit prices?",
        options: [
          "A. Higher bond yields can compress REIT yield spreads, putting downward pressure on REIT unit prices.",
          "B. REIT prices are guaranteed to double whenever the repo rate increases.",
          "C. Interest rates have zero connection with commercial property valuations."
        ],
        correctIndex: 0,
        explanation: "Correct! When risk-free bond yields rise, REIT prices often soften in the secondary market so that their distribution yield remains competitive."
      },
      {
        id: 're-5',
        question: "What does WALE (Weighted Average Lease Expiry) indicate when researching REITs like Embassy or Mindspace?",
        options: [
          "A. The average remaining contract duration of corporate tenant leases in years.",
          "B. The total electricity bill of the commercial shopping malls.",
          "C. The brokerage commission charged by stockbrokers."
        ],
        correctIndex: 0,
        explanation: "Correct! A long WALE (e.g., 6–8 years) indicates that Fortune 500 tenants are locked into long-term leases with contractual annual rental escalations."
      }
    ],
    snapshotStats: [
      { label: "Grade-A Commercial Space", value: "115+ Million sq. ft.", desc: "Managed by listed REITs across major Indian tech hubs." },
      { label: "Listed REIT Sector Cap", value: "₹1.07L – ₹1.6L Cr", desc: "Fast-growing sector including Embassy, Mindspace, Nexus & Brookfield." },
      { label: "SEBI Payout Mandate", value: "At least 90%", desc: "Must distribute 90%+ of net distributable cash flows back to unitholders." },
      { label: "Distribution Dividend Yield", value: "5.5% – 6.5% p.a.", desc: "Quarterly rental income cash yield." }
    ],
    takeaway: "REITs offer an alternative route to real-estate exposure, but they are not equivalent to owning a property directly.",
    nextLesson: 'invits',
    prevLesson: 'bonds',
    dialogue: [
      {
        id: 'r-1',
        sender: 'mentor',
        text: 'Real Estate Investment Trusts (REITs)! Ever wanted steady commercial rental income from Cyber City or Tech Parks without needing ₹50 Crores?',
        expression: 'happy',
        tag: 'Commercial Yield'
      },
      {
        id: 'r-2',
        sender: 'learner',
        text: 'Can I really own commercial real estate with just ₹300–₹400 on the stock exchange?',
        expression: 'surprised'
      },
      {
        id: 'r-3',
        sender: 'mentor',
        text: 'Yes! India has premier listed REITs like Embassy Office Parks and Mindspace. SEBI mandates they distribute 90% of net distributable cash flows directly to unit holders!',
        expression: 'happy',
        tag: 'Mandated Payouts'
      },
      {
        id: 'r-4',
        sender: 'learner',
        text: 'What kind of quarterly dividend yield and capital appreciation can I anticipate?',
        expression: 'thinking'
      },
      {
        id: 'r-5',
        sender: 'mentor',
        text: 'Typically 6.5% to 8.2% annual cash distribution yields, plus Grade-A commercial asset valuation growth. Explore the rental building metaphor below!',
        expression: 'happy',
        actionText: 'Inspect REIT Building Metaphor',
        actionTarget: 'concept-canvas'
      }
    ]
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
      id: 'inv-1',
      question: "You want to learn how investors can gain exposure to infrastructure projects without directly buying the entire project. What could you explore?",
      options: [
        "A. InvITs.",
        "B. Only individual company stocks.",
        "C. Buying a highway directly."
      ],
      correctIndex: 0,
      explanation: "Correct! InvITs monetize operational infrastructure assets like national highways, power transmission lines, and solar parks."
    },
    challenges: [
      {
        id: 'inv-1',
        question: "You want to learn how investors can gain exposure to infrastructure projects without directly buying the entire project. What could you explore?",
        options: [
          "A. InvITs.",
          "B. Only individual company stocks.",
          "C. Buying a highway directly."
        ],
        correctIndex: 0,
        explanation: "Correct! InvITs monetize operational infrastructure assets like national highways, power transmission lines, and solar parks."
      },
      {
        id: 'inv-2',
        question: "Which of the following real assets are typically held inside an Indian Infrastructure Investment Trust (InvIT)?",
        options: [
          "A. Operational toll roads, power transmission grids, and renewable solar pipelines.",
          "B. Residential luxury studio apartments in resort towns.",
          "C. Cryptocurrencies and speculative venture capital tokens."
        ],
        correctIndex: 0,
        explanation: "Correct! InvITs own long-gestation, cash-generating national utility assets like NHAI highway networks and PowerGrid transmission lines."
      },
      {
        id: 'inv-3',
        question: "How do operational highway InvITs provide a natural hedge against inflation for investors?",
        options: [
          "A. Annual toll tariffs are contractually linked to inflation indices (WPI or CPI).",
          "B. Vehicles pay zero toll during inflation years.",
          "C. Highway traffic is legally required to double every fiscal quarter."
        ],
        correctIndex: 0,
        explanation: "Correct! Most concession agreements include built-in inflation adjustment formulas that periodically increase toll charges, safeguarding real yields."
      },
      {
        id: 'inv-4',
        question: "What happens when a highway BOT (Build-Operate-Transfer) concession agreement reaches its maturity date?",
        options: [
          "A. The highway is handed back to the government (NHAI), and trust cash flows from that asset conclude.",
          "B. The trust keeps permanent ownership of the road for the next 500 years.",
          "C. The road is converted into a private railway line."
        ],
        correctIndex: 0,
        explanation: "Correct! Concession assets have finite operational lifespans; the trust collects cash and returns invested capital before transferring the asset to the state."
      },
      {
        id: 'inv-5',
        question: "What is the typical cash distribution yield profile generated by listed Indian InvITs?",
        options: [
          "A. High cash distribution yields (typically 8%–11% p.a.) backed by steady infrastructure tariffs.",
          "B. Zero cash distributions, InvITs only reward investors with store discount vouchers.",
          "C. Negative yields with mandatory annual margin calls."
        ],
        correctIndex: 0,
        explanation: "Correct! InvITs pass through steady utility cashflows, offering attractive yields between 8% and 11% p.a., often higher than corporate bond rates."
      }
    ],
    snapshotStats: [
      { label: "Registered Indian InvITs", value: "24+ InvITs", desc: "Managing national assets valued at over ₹2.5+ Lakh Crore." },
      { label: "SEBI Payout Requirement", value: "At least 90%", desc: "Mandated distribution of net cash flows to investors." },
      { label: "Distribution Yield", value: "8.0% – 12.3% p.a.", desc: "Driven by steady toll collections and regulated power tariffs." },
      { label: "Annualized Total Return", value: "11.0% – 14.0%", desc: "Long-term total return over concession asset lifespans." }
    ],
    takeaway: "InvITs provide an investment route into infrastructure-related assets, but their returns and risks depend on the trust's underlying assets and structure.",
    nextLesson: 'futures-options',
    prevLesson: 'reits',
    dialogue: [
      {
        id: 'i-1',
        sender: 'mentor',
        text: 'Infrastructure Investment Trusts (InvITs) are the industrial powerhouse siblings of REITs. What infrastructure assets do they own?',
        expression: 'neutral',
        tag: 'National Assets'
      },
      {
        id: 'i-2',
        sender: 'learner',
        text: 'Do they hold toll expressways, power transmission grids, and telecom optic fiber?',
        expression: 'thinking'
      },
      {
        id: 'i-3',
        sender: 'mentor',
        text: 'Exactly! Like IRB InvIT and PowerGrid InvIT. Every vehicle paying toll on National Highways or kilowatt of power transmitted generates steady dividend cash flows.',
        expression: 'happy',
        tag: 'Toll Revenue'
      },
      {
        id: 'i-4',
        sender: 'learner',
        text: 'Are they meant for aggressive capital growth or steady passive cash yield?',
        expression: 'thinking'
      },
      {
        id: 'i-5',
        sender: 'mentor',
        text: 'They are cash-flow machines with 8% to 11% pre-tax distribution yields, making them ideal for compounding passive income portfolios.',
        expression: 'happy',
        actionText: 'View Infrastructure Pipeline',
        actionTarget: 'concept-canvas'
      }
    ]
  },

  'futures-options': {
    id: 'futures-options',
    title: 'FUTURES & OPTIONS (F&O)',
    subtitle: 'Understand the Power of Price Movements',
    whatItIs: [
      "Futures and Options are financial contracts whose value depends on an underlying asset, such as a stock, market index, currency or commodity.",
      "Think of F&O as making a contract based on where you expect a market price to move.",
      "Futures: A contract that creates an obligation to buy or sell an underlying asset under specified terms.",
      "Options: A contract that gives the buyer the right, but not the obligation, to buy or sell an underlying asset at a specified price. Buyers pay a premium for this right.",
      "A Call Option gives the buyer the right to buy, while a Put Option gives the buyer the right to sell."
    ],
    keyTypes: [
      {
        title: "1. Futures Contracts",
        desc: "Creates an obligation to buy or sell an underlying asset under specified terms on a future date.",
        goal: "Hedging portfolios or taking leveraged directional market positions."
      },
      {
        title: "2. Call Options (CE)",
        desc: "Gives the buyer the right (not obligation) to BUY the underlying asset at a specified price.",
        goal: "Participate in upside price movements with capped risk equal to premium paid."
      },
      {
        title: "3. Put Options (PE)",
        desc: "Gives the buyer the right (not obligation) to SELL the underlying asset at a specified price.",
        goal: "Hedge existing stock holdings or capitalize on expected downward price moves."
      }
    ],
    howItWorks: [
      { step: "Step 1: Choose underlying asset", desc: "Choose an underlying stock, index (e.g. NIFTY 50) or other eligible asset." },
      { step: "Step 2: Select contract & expiry", desc: "Select a futures or options contract with its expiry date and contract details." },
      { step: "Step 3: Take a position", desc: "Take a position based on your market view or hedging requirement." },
      { step: "Step 4: Contract value changes", desc: "The contract's value changes as underlying price, time and market factors change." },
      { step: "Step 5: Close or settle position", desc: "Close or settle the position according to contract and exchange rules, resulting in a gain or loss." }
    ],
    returnsExample: {
      initial: 3000,
      gainVal: 10000,
      lossVal: 0,
      gainPct: 233,
      lossPct: -100,
      note: "Futures Example: Index at 22,000, lot size 50. Rise to 22,200 (+200 pts) = ₹10,000 gain. Fall to 21,800 (-200 pts) = ₹10,000 loss. Call Option Example: Strike ₹1,000, premium ₹30, lot 100 (Cost ₹3,000). Stock at ₹1,100 = net profit ₹7,000 (+233%). Stock ≤ ₹1,000 = lose full ₹3,000 premium (-100%)."
    },
    advantages: [
      "Can help hedge against certain market-price risks.",
      "Offers ways to take positions on expected price movements.",
      "Provides different strategies for different market views.",
      "May require less upfront capital than buying the full underlying exposure, but leverage increases risk."
    ],
    risks: [
      "Leverage can magnify losses as well as gains.",
      "Futures can result in substantial losses.",
      "Option buyers can lose the entire premium paid.",
      "Option sellers may face very large losses, depending on the position.",
      "Expiry, time decay, volatility, liquidity and transaction costs can affect results."
    ],
    challenge: {
      id: 'fo-1',
      question: "You buy a call option, but the underlying asset finishes below the strike price at expiry. What generally happens?",
      options: [
        "A. You automatically earn a profit.",
        "B. You generally lose the entire premium paid.",
        "C. Your profit is guaranteed by the exchange."
      ],
      correctIndex: 1,
      explanation: "Correct! The option may expire worthless when the underlying price finishes below the strike price at expiry, resulting in a loss of the premium paid."
    },
    challenges: [
      {
        id: 'fo-1',
        question: "You buy a call option, but the underlying asset finishes below the strike price at expiry. What generally happens?",
        options: [
          "A. You automatically earn a profit.",
          "B. You generally lose the entire premium paid.",
          "C. Your profit is guaranteed by the exchange."
        ],
        correctIndex: 1,
        explanation: "Correct! Out-of-the-money options expire worthless (₹0) at expiry, resulting in a complete 100% loss of the initial premium paid."
      },
      {
        id: 'fo-2',
        question: "What did SEBI's official nationwide study reveal regarding individual retail traders active in Indian equity F&O segments?",
        options: [
          "A. 89% to 93% of individual retail traders incurred net financial losses.",
          "B. 90% of retail traders generated over 50% consistent annual profits.",
          "C. Retail traders never experience drawdowns in derivative contracts."
        ],
        correctIndex: 0,
        explanation: "Correct! SEBI's milestone study revealed that approximately 9 out of 10 individual retail derivative traders lose money, averaging over ₹1.1 Lakh in losses."
      },
      {
        id: 'fo-3',
        question: "What does 'Theta' (Time Decay) do to an option's value as it approaches its expiration date?",
        options: [
          "A. It continuously reduces the extrinsic time value of the option each passing day.",
          "B. It guarantees that the stock price will rise.",
          "C. It increases option premium values even if market prices stay completely stationary."
        ],
        correctIndex: 0,
        explanation: "Correct! Options are decaying assets; each day that passes erodes time value, acting as a relentless headwind for naked option buyers."
      },
      {
        id: 'fo-4',
        question: "How can an investor holding ₹10 Lakh in direct Indian equities use Index Put Options as portfolio insurance?",
        options: [
          "A. The Put options surge in value if the broad market crashes, offsetting paper losses in the stock portfolio.",
          "B. Selling naked call options to double down on risk.",
          "C. Put options make it illegal for stock prices to decline."
        ],
        correctIndex: 0,
        explanation: "Correct! Institutional portfolio hedging involves holding Put options so that downside market crashes are offset by lucrative derivative payouts."
      },
      {
        id: 'fo-5',
        question: "Why does leverage in Futures contracts make unmanaged positions dangerous for retail capital?",
        options: [
          "A. Small adverse percentage price swings are amplified, rapidly wiping out margin deposits.",
          "B. Leverage eliminates all downside volatility.",
          "C. Futures contracts are permanently free with zero margin requirements."
        ],
        correctIndex: 0,
        explanation: "Correct! Because small margin deposits control massive contract values, even a 2%–3% move against your position can trigger devastating 30%–60% margin liquidations."
      }
    ],
    snapshotStats: [
      { label: "SEBI Loss Fact (FY19 & FY22)", value: "89% (9 in 10)", desc: "SEBI reported that 9 out of 10 individual traders in equity F&O incurred net losses." },
      { label: "Average Net Loss / Trader", value: "~₹1.1 Lakh", desc: "Average loss incurred by loss-making retail traders across Indian exchanges." },
      { label: "Active Retail F&O Base", value: "45+ Lakh", desc: "Registered individual retail accounts trading in Indian derivative segments." },
      { label: "Derivative Settlement", value: "99%+ Cash Settled", desc: "High turnover velocity with cash settlement execution on NSE & BSE." }
    ],
    takeaway: "Futures and Options can be used for hedging or trading, but they are complex instruments and are not a reliable shortcut to guaranteed income. Learn the contract mechanics and risks before participating.",
    nextLesson: null,
    prevLesson: 'invits',
    dialogue: [
      {
        id: 'f-1',
        sender: 'mentor',
        text: 'Welcome to Derivatives. Before we start, a sobering statutory warning from SEBI: 89% of retail F&O traders incur net financial losses.',
        expression: 'surprised',
        tag: 'SEBI Alert'
      },
      {
        id: 'f-2',
        sender: 'learner',
        text: 'Why do so many retail traders blow up their accounts in Futures and Options?',
        expression: 'thinking'
      },
      {
        id: 'f-3',
        sender: 'mentor',
        text: 'High leverage and theta time decay! Buying naked out-of-the-money Call options without mathematical edge erodes 100% of capital as expiry approaches.',
        expression: 'neutral',
        tag: 'Leverage Risk'
      },
      {
        id: 'f-4',
        sender: 'learner',
        text: 'How should smart investors actually use Options as intended?',
        expression: 'thinking'
      },
      {
        id: 'f-5',
        sender: 'mentor',
        text: 'As Portfolio Insurance! Just like health or car insurance, institutional managers buy Put options to protect equity portfolios against sudden market crashes.',
        expression: 'happy',
        tag: 'Hedging Alpha'
      },
      {
        id: 'f-6',
        sender: 'mentor',
        text: 'Let us study how delta, theta, and position sizing work before placing any derivative trades!',
        expression: 'happy',
        actionText: 'Test Knowledge Challenge Below',
        actionTarget: 'challenge'
      }
    ]
  }
};
