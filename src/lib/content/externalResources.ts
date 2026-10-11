export interface ExternalResource {
  id: string;
  title: string;
  url: string;
  youtubeId?: string;
  source: string;
  sourceType: 'Official Exchange' | 'Statutory Regulator' | 'Central Bank Portal' | 'Institutional Research' | 'Industry Leader' | 'Financial Authority';
  category: 'Stocks & Trading' | 'Mutual Funds & Regulations' | 'Bonds & Fixed Income' | 'REITs & Real Estate' | 'ETFs & Indexing' | 'InvITs & Infrastructure' | 'Futures & Options';
  assetId: 'stocks' | 'mutual-funds' | 'etfs' | 'bonds' | 'reits' | 'invits' | 'futures-options';
  mediaType: 'Official Web Portal' | 'Regulator Video Portal' | 'Institutional Guide' | 'Research Paper' | 'Video Masterclass' | 'Interactive Video';
  description: string;
  keyTopics: string[];
  authority: string;
  badge: string;
  durationOrReadTime: string;
}

export const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    id: 'nse-official-videos',
    title: 'NSE India Official Investor Education & Help Videos',
    url: 'https://www.nseindia.com/static/products-services/nm-help-videos?hl=en-IN',
    source: 'National Stock Exchange of India (NSE)',
    sourceType: 'Official Exchange',
    category: 'Stocks & Trading',
    assetId: 'stocks',
    mediaType: 'Official Web Portal',
    description: 'Official video guide directly from India\'s premier stock exchange explaining order placement, trading mechanics, clearing, settlement cycles, and market risk management.',
    keyTopics: [
      'Order Matching & Book Mechanics (Limit vs Market)',
      'NSE NOW & NEAT Trading Interfaces',
      'Clearing & Settlement Cycle (T+1 Rules)',
      'Market Volatility & Index Circuit Breakers'
    ],
    authority: 'Globally Recognized National Stock Exchange (NSE India)',
    badge: 'NSE Official',
    durationOrReadTime: 'Official Video Library'
  },
  {
    id: 'sebi-investor-education',
    title: 'SEBI Investor Awareness & Education Portal',
    url: 'https://investor.sebi.gov.in/inv_aware_edu_videos.html?hl=en-IN',
    source: 'Securities & Exchange Board of India (SEBI)',
    sourceType: 'Statutory Regulator',
    category: 'Mutual Funds & Regulations',
    assetId: 'mutual-funds',
    mediaType: 'Regulator Video Portal',
    description: 'Regulatory investor education videos produced by SEBI covering investor charter rights, fraud prevention, grievance redressal via SCORES, and depository safeguarding.',
    keyTopics: [
      'SEBI SCORES 2.0 Grievance Redressal System',
      'Investor Charter: Fundamental Legal Rights & Duties',
      'CDSL & NSDL Depository Verification & CKYC',
      'Unregulated Scheme & Ponzi Prevention Safeguards'
    ],
    authority: 'Statutory Capital Markets Regulator of India (SEBI)',
    badge: 'SEBI Verified',
    durationOrReadTime: 'Regulator Portal'
  },
  {
    id: 'rbi-retail-direct-guide',
    title: 'What is RBI Retail Direct? Complete Guide for Beginners',
    url: 'https://www.truedata.in/blog/what-is-rbi-retail-direct-complete-guide-for-beginners?hl=en-IN',
    source: 'TrueData Research & RBI Framework',
    sourceType: 'Central Bank Portal',
    category: 'Bonds & Fixed Income',
    assetId: 'bonds',
    mediaType: 'Institutional Guide',
    description: 'Comprehensive institutional walkthrough on opening an RBI Retail Direct Gilt Account to buy Government of India Treasury Bills (T-Bills), Sovereign Green Bonds, and State Development Loans (SDLs) with zero intermediary fees.',
    keyTopics: [
      'Opening Zero-Commission Retail Gilt Accounts with RBI',
      '91-day, 182-day & 364-day Treasury Bills (T-Bills)',
      'Sovereign Green Bonds & State Development Loans (SDLs)',
      'Direct RBI Primary Auctions & Non-Competitive Bidding'
    ],
    authority: 'Reserve Bank of India (RBI) Retail Direct Platform',
    badge: 'RBI G-Secs',
    durationOrReadTime: '10 min read'
  },
  {
    id: 'finxpert-reits-invits',
    title: 'Beginner\'s Guide to Indian REITs & InvITs',
    url: 'https://finxpert.org/beginners-guide-to-reits-invits/?hl=en-IN',
    source: 'FinXpert Research',
    sourceType: 'Institutional Research',
    category: 'REITs & Real Estate',
    assetId: 'reits',
    mediaType: 'Research Paper',
    description: 'A foundational institutional guide detailing how retail investors can own fractional commercial real estate (REITs) and national infrastructure assets (InvITs) with mandated 90% cash flow dividend distributions.',
    keyTopics: [
      'SEBI 90% NDCF (Net Distributable Cash Flow) Payout Mandate',
      'Commercial Grade-A Office Parks vs Residential Real Estate',
      'InvITs: National Highway Tolls & Power Grid Transmission Assets',
      'Taxation Breakdown: Dividend, Interest, and Capital Repayment Tranches'
    ],
    authority: 'SEBI REITs & InvITs Regulatory Framework',
    badge: 'REIT Masterguide',
    durationOrReadTime: '12 min read'
  },
  {
    id: 'zerodha-reits-deepdive',
    title: 'Everything You Need to Know About India\'s REITs Space',
    url: 'https://youtu.be/_FztQfe9vDc?si=Haz_dyN9nOBfUdUK',
    youtubeId: '_FztQfe9vDc',
    source: 'Markets by Zerodha',
    sourceType: 'Industry Leader',
    category: 'REITs & Real Estate',
    assetId: 'reits',
    mediaType: 'Video Masterclass',
    description: 'Comprehensive market breakdown of listed Indian REITs (Embassy Office Parks, Mindspace, Brookfield, Nexus Select Malls), analyzing rental yield mechanics, vacancy risks, and tax efficiency.',
    keyTopics: [
      'Comparative Analysis of All 4 Listed Indian REITs',
      'Rental Yield vs Traditional Equity Dividend Yields',
      'Cap Rates, Weighted Average Lease Expiry (WALE), and Tenant Mix',
      'Liquidity Considerations & Demat Trading on NSE'
    ],
    authority: 'India\'s Premier Retail Broker (Zerodha Varsity / Markets)',
    badge: 'Zerodha Masterclass',
    durationOrReadTime: '18 min video'
  },
  {
    id: 'nse-invits-investor-portal',
    title: 'NSE Infrastructure Investment Trusts (InvITs) Guide',
    url: 'https://www.nseindia.com/products-services/equity-market-invits',
    source: 'National Stock Exchange of India (NSE)',
    sourceType: 'Official Exchange',
    category: 'InvITs & Infrastructure',
    assetId: 'invits',
    mediaType: 'Official Web Portal',
    description: 'Official framework and listed repository of Infrastructure Investment Trusts on the National Stock Exchange of India, outlining toll roads, telecom towers, and transmission grids.',
    keyTopics: [
      'Operational Cash Flows from National Highway Tolls & Power Transmission',
      'SEBI InvIT Regulations & 90% Distributable Cash Flow Mandate',
      'Trading Lot Sizes & Demat Liquidity on NSE',
      'Comparative Yield Performance against 10-Year G-Sec Benchmarks'
    ],
    authority: 'National Stock Exchange of India (NSE Official)',
    badge: 'NSE InvIT Portal',
    durationOrReadTime: 'Official Portal'
  },
  {
    id: 'sebi-invits-framework',
    title: 'SEBI (Infrastructure Investment Trusts) Regulations & Investor Charter',
    url: 'https://www.sebi.gov.in/legal/regulations/sep-2014/securities-and-exchange-board-of-india-infrastructure-investment-trusts-regulations-2014_28038.html',
    source: 'Securities & Exchange Board of India (SEBI)',
    sourceType: 'Statutory Regulator',
    category: 'InvITs & Infrastructure',
    assetId: 'invits',
    mediaType: 'Research Paper',
    description: 'Statutory regulatory provisions governing leverage limits (49% to 70% with credit rating requirements), independent valuations, and investor distribution safety.',
    keyTopics: [
      'Cap on Leverage: 49% Debt Cap expandable to 70% with AAA Rating',
      'Independent Semi-Annual NAV & Asset Valuation Mandates',
      'Public vs Privately Placed InvIT Governance Differences',
      'Retail Investor Protection & Grievance Redressal Mechanisms'
    ],
    authority: 'Statutory Capital Markets Regulator of India (SEBI)',
    badge: 'SEBI Statutory',
    durationOrReadTime: 'Statutory Regulatory Act'
  },
  {
    id: 'sebi-derivatives-study-report',
    title: 'SEBI Study on F&O: Retail Traders in Equity Derivatives Segment',
    url: 'https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-in-equity-derivatives-segment-among-individual-investors_67525.html',
    source: 'Securities & Exchange Board of India (SEBI)',
    sourceType: 'Statutory Regulator',
    category: 'Futures & Options',
    assetId: 'futures-options',
    mediaType: 'Research Paper',
    description: 'Landmark empirical research study by SEBI revealing that 9 out of 10 individual traders suffered net trading losses in equity F&O, analyzing turnover costs, transaction friction, and risk management.',
    keyTopics: [
      'Empirical Analysis: 89% Individual F&O Traders Incur Net Losses',
      'Transaction Drag: Brokerage, STT, and Exchange Turnover Charges',
      'Theta Time Decay in Out-of-the-Money (OTM) Options Buying',
      'Statistical Survivorship in Leveraged Index Derivatives (Nifty / Bank Nifty)'
    ],
    authority: 'SEBI Research Department (Empirical Regulatory Study)',
    badge: 'SEBI Official Report',
    durationOrReadTime: '15 min read'
  },
  {
    id: 'nse-fno-mechanics-guide',
    title: 'NSE Equity Derivatives (F&O) Trading Manual & Margins',
    url: 'https://www.nseindia.com/products-services/equity-derivatives-faqs',
    source: 'National Stock Exchange of India (NSE)',
    sourceType: 'Official Exchange',
    category: 'Futures & Options',
    assetId: 'futures-options',
    mediaType: 'Official Web Portal',
    description: 'Comprehensive official guide on SPAN margins, Extreme Loss Margin (ELM), lot sizes, contract expiries, cash settlement procedures, and circuit filters in the derivative segment.',
    keyTopics: [
      'SPAN + Extreme Loss Margin (ELM) Real-Time Upfront Requirement',
      'Standardized Monthly & Weekly Contract Cycles and Expiry Settlement',
      'Physical Delivery vs Cash Settlement Mechanics in Stock Options',
      'Protective Put & Covered Call Hedging vs Pure Directional Speculation'
    ],
    authority: 'National Stock Exchange of India (NSE Derivatives Segment)',
    badge: 'NSE Derivatives',
    durationOrReadTime: 'Official FAQ & Guide'
  },
  {
    id: 'nse-swing-trading-secrets',
    title: 'NSE Website Secrets: Identify Strong Stocks for Swing Trading',
    url: 'https://youtu.be/H7x_abGlDaA?si=5PsnyCtb3gYwRU29',
    youtubeId: 'H7x_abGlDaA',
    source: 'NSE Institutional Market Analysis',
    sourceType: 'Official Exchange',
    category: 'Stocks & Trading',
    assetId: 'stocks',
    mediaType: 'Video Masterclass',
    description: 'How to utilize free institutional telemetry on the NSE website (Delivery Volume %, Bhavcopy data, Sectoral Heatmaps, and 52-week High breakthroughs) to spot high-conviction swing trade setups.',
    keyTopics: [
      'Delivery Percentage vs Intraday Speculative Volume Spikes',
      'Reading Institutional Bhavcopy Reports for Bulk Accumulation',
      'Sectoral Rotation & Index Momentum Screeners on NSE',
      'Rule-Based Entry Execution & Mechanical Stop-Loss Protection'
    ],
    authority: 'NSE Official Telemetry & Technical Analysis',
    badge: 'NSE Trading Secrets',
    durationOrReadTime: '15 min video'
  },
  {
    id: 'sebi-mf-new-rules',
    title: 'SEBI Mutual Fund Regulations Explained: Expense Ratios, TER & Brokerage',
    url: 'https://youtu.be/rp1TYBqU8Go?si=eWwDpd6heE_f6TIF',
    youtubeId: 'rp1TYBqU8Go',
    source: 'Financial Regulatory Review',
    sourceType: 'Statutory Regulator',
    category: 'Mutual Funds & Regulations',
    assetId: 'mutual-funds',
    mediaType: 'Video Masterclass',
    description: 'Detailed analysis of SEBI\'s regulatory amendments governing Total Expense Ratios (TER), distributor brokerage caps, and direct mutual fund transparency to protect retail compounding.',
    keyTopics: [
      'Direct Plan vs Regular Plan 1.5% Annual Fee Difference over 20 Years',
      'SEBI Tiered TER Caps based on Asset Under Management (AUM)',
      'Transaction Charge Transparency & Depository Fee Disclosure',
      'Portfolio Turnover Ratio Impact on Net CAGR Returns'
    ],
    authority: 'SEBI Mutual Fund Governance Framework',
    badge: 'SEBI TER Rules',
    durationOrReadTime: '14 min video'
  },
  {
    id: 'etmoney-how-to-pick-mf',
    title: 'How to Pick the Right Mutual Fund Easily (Sharpe, Sortino & Alpha)',
    url: 'https://youtu.be/55hkxW61hZ4?si=Kvjmbypz3HYFIIi2',
    youtubeId: '55hkxW61hZ4',
    source: 'ETMONEY Research',
    sourceType: 'Institutional Research',
    category: 'Mutual Funds & Regulations',
    assetId: 'mutual-funds',
    mediaType: 'Video Masterclass',
    description: 'A quantitative framework for selecting outperforming mutual funds without relying on past star ratings, utilizing Sharpe Ratio, Sortino Ratio, Information Ratio, and downside risk capture.',
    keyTopics: [
      'Sharpe Ratio (Excess Return generated per unit of Total Risk)',
      'Sortino Ratio (Shielding capital against Negative / Downside Volatility)',
      'Rolling 3-Year & 5-Year Consistency vs Misleading Point-to-Point CAGR',
      'Fund Manager Track Record, Philosophy & Style Drift Checks'
    ],
    authority: 'ETMONEY Quantitative Research & Analytics',
    badge: 'Quantitative Selection',
    durationOrReadTime: '16 min video'
  },
  {
    id: 'etmoney-etfs-vs-index',
    title: 'Should You Invest in ETFs or Index Funds? The Ultimate Comparison',
    url: 'https://youtu.be/MRO5WDwryYI?si=a_qJc-IEQFIDZk8F',
    youtubeId: 'MRO5WDwryYI',
    source: 'ETMONEY Research',
    sourceType: 'Institutional Research',
    category: 'ETFs & Indexing',
    assetId: 'etfs',
    mediaType: 'Video Masterclass',
    description: 'Clear, unbiased decision framework between Exchange-Traded Funds (ETFs) and Index Mutual Funds, evaluating intraday liquidity, Authorized Participant bid-ask spreads, tracking error, and demat charges.',
    keyTopics: [
      'Intraday Real-Time Execution vs 3:00 PM End-of-Day NAV',
      'Understanding Bid-Ask Spreads & Tracking Error in Indian ETFs',
      'Demat DP Charges vs SIP Auto-Debit Convenience in Index Funds',
      'Nifty 50, Nifty Next 50 & Gold ETF Portfolio Use-Cases'
    ],
    authority: 'Passive Indexing & ETF Analysis',
    badge: 'ETF vs Index Fund',
    durationOrReadTime: '17 min video'
  },
  {
    id: 'nse-etf-masterguide',
    title: 'NSE India Exchange Traded Funds (ETFs) Handbook & Live Market Watch',
    url: 'https://www.nseindia.com/products-services/equity-market-etf',
    source: 'National Stock Exchange of India (NSE)',
    sourceType: 'Official Exchange',
    category: 'ETFs & Indexing',
    assetId: 'etfs',
    mediaType: 'Official Web Portal',
    description: 'The official exchange portal tracking all listed Equity, Debt, and Commodity ETFs, live indicative iNAV updates, Market Maker quoting obligations, and trading turnover.',
    keyTopics: [
      'Live iNAV (Indicative Net Asset Value) Calculation every 10 seconds',
      'Authorized Participants (AP) & Market Maker Quoting Obligations',
      'Equity ETFs (Nifty 50, Nifty Bank), Liquid ETFs & Gold/Silver ETFs',
      'Settlement via T+1 Rolling Cycle in Demat Account'
    ],
    authority: 'National Stock Exchange of India (NSE Official)',
    badge: 'NSE ETF Handbook',
    durationOrReadTime: 'Official Exchange Portal'
  },
  {
    id: 'amit-bond-masterclass',
    title: 'Bond Investing Masterclass: Yields, Credit Risk & Ratings',
    url: 'https://youtu.be/N2RkST9at4s?si=-d-OP305p71jPUbf',
    youtubeId: 'N2RkST9at4s',
    source: 'Fixed Income Masterclass (Amit Upadhyaya)',
    sourceType: 'Financial Authority',
    category: 'Bonds & Fixed Income',
    assetId: 'bonds',
    mediaType: 'Video Masterclass',
    description: 'An authoritative masterclass deconstructing corporate and government bonds, yield curves, credit ratings (AAA to D), interest rate cycle dynamics, and how fixed income cushions equity drawdown.',
    keyTopics: [
      'Yield to Maturity (YTM) vs Coupon Rate Dynamics',
      'CRISIL, ICRA & CARE Credit Rating Matrices (AAA vs AA vs High Yield)',
      'Modified Duration & Sensitivity to RBI Repo Rate Changes',
      'Senior Secured vs Subordinated Tier-2 Debt Seniority'
    ],
    authority: 'Institutional Fixed Income & Credit Analysis',
    badge: 'Bond Masterclass',
    durationOrReadTime: '18 min video'
  },
  {
    id: 'valueresearch-lump-sum-allocation',
    title: 'Deploying Lump Sum Capital: Liquid vs Arbitrage Funds',
    url: 'https://youtu.be/SFOICa3c2Do?si=jT0fB4DHa8Pqp0ln',
    youtubeId: 'SFOICa3c2Do',
    source: 'Value Research (Dhirendra Kumar)',
    sourceType: 'Industry Leader',
    category: 'Mutual Funds & Regulations',
    assetId: 'mutual-funds',
    mediaType: 'Video Masterclass',
    description: 'Veteran investment analyst Dhirendra Kumar breaks down how to strategically park a large sum of money, leveraging the equity tax advantage of Arbitrage Funds over Liquid Funds, and deploying via STPs.',
    keyTopics: [
      'Arbitrage Funds (Equity Tax Treatment) vs Debt/Liquid Funds',
      'Systematic Transfer Plans (STP) to Mitigate Market Peak Risk',
      'Capital Preservation & Liquidity during High Market Valuations',
      'Exit Load, Expense Ratio & Short-Term Capital Gains (STCG) Efficiency'
    ],
    authority: 'Value Research (30+ Years Pioneer in Indian Mutual Funds)',
    badge: 'Value Research',
    durationOrReadTime: '13 min video'
  }
];
