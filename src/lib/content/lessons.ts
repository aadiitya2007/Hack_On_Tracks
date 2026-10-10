export type LessonData = {
  id: string;
  title: string;
  colorType: 'stocks' | 'funds' | 'etfs' | 'bonds' | 'reits' | 'invits';
  sections: {
    whatIsIt: {
      text: string;
      analogy: string;
    };
    howItWorks: {
      steps: { title: string; text: string }[];
    };
    returns: {
      intro: string;
      example: {
        setup: string;
        initial: number;
        gainScenario: { price: number; value: number; gain: number; returnPct: number };
        lossScenario: { price: number; value: number; loss: number; returnPct: number };
        disclaimer: string;
      };
    };
    prosCons: {
      advantages: string[];
      risks: string[];
    };
    challenge: {
      text: string;
      options: string[];
      correctIndex: number;
    };
    stats: {
      title: string;
      points: { label: string; value: string }[];
      disclaimer: string;
    };
    takeaway: string;
  }
};

export const STOCKS_LESSON: LessonData = {
  id: 'stocks',
  title: 'Own a Piece of a Company',
  colorType: 'stocks',
  sections: {
    whatIsIt: {
      text: "Imagine your favourite company is a huge pizza. Each share represents a small piece of ownership in that company.\n\nWhen you buy a company's shares, you become one of its shareholders. If the company grows and investors value it more highly, its share price may rise. Some companies also pay dividends to shareholders.\n\nHowever, a company's share price can fall, and you can lose money. High reward, but high risk. Think of it like riding a roller coaster—it can climb very high, but it can also drop sharply when the market dips. Unlike a bank fixed deposit, a company is never legally obligated to pay you dividends or buy back your shares at a specific price.",
      analogy: "Pizza Slices"
    },
    howItWorks: {
      steps: [
        { title: 'A company raises money', text: 'A company may issue shares to raise capital for expansion, new products or other business needs.' },
        { title: 'Investors buy shares', text: 'Investors can buy shares through a stockbroker when the shares are available for trading.' },
        { title: 'The share price changes', text: 'The price moves according to demand and supply, company performance, economic conditions and investor expectations.' },
        { title: 'Investors may earn returns', text: 'Returns can come from an increase in the share price and dividends, if declared.' }
      ]
    },
    returns: {
      intro: 'Stocks do not offer a fixed return. Your result depends on the company, the price you pay, the holding period and market conditions.',
      example: {
        setup: 'You buy 10 shares at ₹500 each. Initial investment = ₹5,000.',
        initial: 5000,
        gainScenario: { price: 600, value: 6000, gain: 1000, returnPct: 20 },
        lossScenario: { price: 400, value: 4000, loss: 1000, returnPct: -20 },
        disclaimer: 'These examples exclude dividends, taxes and transaction costs.'
      }
    },
    prosCons: {
      advantages: [
        'Potential for long-term capital growth.',
        'Opportunity to participate in a company\'s success.',
        'Some companies pay dividends.',
        'Many actively traded stocks can be bought and sold relatively easily.'
      ],
      risks: [
        'Share prices can fall sharply.',
        'A company may perform poorly or fail.',
        'Investors may pay more than a company is worth.',
        'Concentrating money in one company increases company-specific risk.'
      ]
    },
    challenge: {
      text: 'You own shares in a company whose revenue is rising, but its profits are falling. What should you investigate?',
      options: [
        'Only its share price.',
        'Its expenses, debt and reasons for falling profits.',
        'Nothing. Rising revenue guarantees success.'
      ],
      correctIndex: 1
    },
    stats: {
      title: 'Asset Class Performance & Industry Statistics (India Context)',
      points: [
        { label: 'Market Capitalization & Global Rank', value: 'India\'s stock market stands as one of the largest in the world, with total listed market capitalization hovering around ₹450+ lakh crore ($5.4+ trillion).' },
        { label: 'Investor Base & Trading Accounts', value: 'Total registered investor accounts on the National Stock Exchange (NSE) cross 26 crore (260 million), representing over 13.1 crore unique registered investors.' },
        { label: 'Historical Returns (Nifty 50 / Sensex)', value: 'Long-Term CAGR (10–15 Years): ~12.5% to 14.5% annualized returns. Short-Term Volatility: Standard deviation typically ranges between 14% to 18%.' }
      ],
      disclaimer: 'Indicative figures, verify with current sources (SEBI, NSE, AMFI) before relying on them. Last updated: Oct 2026.'
    },
    takeaway: 'Revenue growth alone does not guarantee profitability or a rising share price.'
  }
};

export const MUTUAL_FUNDS_LESSON: LessonData = {
  id: 'mutual-funds', title: 'Invest Through a Basket', colorType: 'funds',
  sections: {
    whatIsIt: { text: "A mutual fund is a pool of money collected from many investors to invest in securities like stocks, bonds, and other assets.", analogy: "A fruit basket picked by an expert" },
    howItWorks: { steps: [{ title: 'Pool Money', text: 'Investors pool their money.' }, { title: 'Fund Manager', text: 'An expert invests it.' }] },
    returns: { intro: 'Returns vary.', example: { setup: '₹5000 SIP', initial: 5000, gainScenario: { price: 6000, value: 6000, gain: 1000, returnPct: 20 }, lossScenario: { price: 4000, value: 4000, loss: 1000, returnPct: -20 }, disclaimer: 'Subject to market risk.' } },
    prosCons: { advantages: ['Diversification', 'Professional management'], risks: ['Fees (Expense Ratio)', 'Market Risk'] },
    challenge: { text: 'What is the main benefit of a mutual fund?', options: ['Guaranteed Returns', 'Diversification', 'Zero risk'], correctIndex: 1 },
    stats: { title: 'India Context', points: [{ label: 'AUM', value: 'Massive' }], disclaimer: 'Demo data' },
    takeaway: 'Mutual funds offer easy diversification.'
  }
};

export const ETFS_LESSON: LessonData = {
  id: 'etfs', title: 'A Basket You Can Trade', colorType: 'etfs',
  sections: {
    whatIsIt: { text: "ETFs track an index and trade like a stock on an exchange.", analogy: "A pre-packaged assorted box of chocolates" },
    howItWorks: { steps: [{ title: 'Track Index', text: 'Mirrors NIFTY 50.' }, { title: 'Trade Live', text: 'Buy/Sell anytime.' }] },
    returns: { intro: 'Tracks index.', example: { setup: '₹5000', initial: 5000, gainScenario: { price: 6000, value: 6000, gain: 1000, returnPct: 20 }, lossScenario: { price: 4000, value: 4000, loss: 1000, returnPct: -20 }, disclaimer: 'Subject to market risk.' } },
    prosCons: { advantages: ['Low Cost', 'Liquidity'], risks: ['Tracking Error'] },
    challenge: { text: 'Can you buy an ETF at 1 PM on a Tuesday?', options: ['Yes', 'No, only at day close'], correctIndex: 0 },
    stats: { title: 'India Context', points: [{ label: 'Growth', value: 'High' }], disclaimer: 'Demo data' },
    takeaway: 'ETFs combine the diversification of mutual funds with the flexibility of stocks.'
  }
};

export const BONDS_LESSON: LessonData = {
  id: 'bonds', title: 'Become a Lender', colorType: 'bonds',
  sections: {
    whatIsIt: { text: "You lend money to a company or government in exchange for regular interest.", analogy: "An IOU note" },
    howItWorks: { steps: [{ title: 'Lend', text: 'Give money.' }, { title: 'Interest', text: 'Get coupons.' }] },
    returns: { intro: 'Fixed returns.', example: { setup: '₹5000', initial: 5000, gainScenario: { price: 5500, value: 5500, gain: 500, returnPct: 10 }, lossScenario: { price: 4000, value: 4000, loss: 1000, returnPct: -20 }, disclaimer: 'Subject to credit risk.' } },
    prosCons: { advantages: ['Predictable Income', 'Lower Risk'], risks: ['Interest Rate Risk', 'Default Risk'] },
    challenge: { text: 'If interest rates go up, bond prices usually go...', options: ['Up', 'Down'], correctIndex: 1 },
    stats: { title: 'India Context', points: [{ label: 'Market', value: 'Growing' }], disclaimer: 'Demo data' },
    takeaway: 'Bonds add stability to a portfolio.'
  }
};

export const REITS_LESSON: LessonData = {
  id: 'reits', title: 'Real Estate Without the Building', colorType: 'reits',
  sections: {
    whatIsIt: { text: "REITs own and operate income-producing real estate.", analogy: "Owning a brick of a mall" },
    howItWorks: { steps: [{ title: 'Buy Shares', text: 'Buy REIT on exchange.' }, { title: 'Get Rent', text: 'Receive dividends from rent.' }] },
    returns: { intro: 'Dividend focus.', example: { setup: '₹5000', initial: 5000, gainScenario: { price: 6000, value: 6000, gain: 1000, returnPct: 20 }, lossScenario: { price: 4000, value: 4000, loss: 1000, returnPct: -20 }, disclaimer: 'Subject to property market.' } },
    prosCons: { advantages: ['High Dividends', 'Real Estate Exposure'], risks: ['Interest Rate Sensitivity'] },
    challenge: { text: 'REITs must distribute most of their income as dividends.', options: ['True', 'False'], correctIndex: 0 },
    stats: { title: 'India Context', points: [{ label: 'Yields', value: '5-8%' }], disclaimer: 'Demo data' },
    takeaway: 'REITs provide liquid exposure to real estate.'
  }
};

export const INVITS_LESSON: LessonData = {
  id: 'invits', title: 'Infrastructure Behind Everyday Life', colorType: 'invits',
  sections: {
    whatIsIt: { text: "InvITs own infrastructure assets like toll roads and power grids.", analogy: "Collecting tolls on a highway" },
    howItWorks: { steps: [{ title: 'Invest', text: 'Buy units.' }, { title: 'Cash Flow', text: 'Get a share of infrastructure income.' }] },
    returns: { intro: 'Yield focused.', example: { setup: '₹5000', initial: 5000, gainScenario: { price: 6000, value: 6000, gain: 1000, returnPct: 20 }, lossScenario: { price: 4000, value: 4000, loss: 1000, returnPct: -20 }, disclaimer: 'Subject to regulatory risk.' } },
    prosCons: { advantages: ['Steady Income', 'Inflation Hedge'], risks: ['Regulatory Risk'] },
    challenge: { text: 'InvITs typically invest in:', options: ['Tech startups', 'Toll roads and power grids'], correctIndex: 1 },
    stats: { title: 'India Context', points: [{ label: 'Assets', value: 'Roads, Power' }], disclaimer: 'Demo data' },
    takeaway: 'InvITs offer access to large-scale infrastructure projects.'
  }
};

export const LESSON_MAP: Record<string, LessonData> = {
  'stocks': STOCKS_LESSON,
  'mutual-funds': MUTUAL_FUNDS_LESSON,
  'etfs': ETFS_LESSON,
  'bonds': BONDS_LESSON,
  'reits': REITS_LESSON,
  'invits': INVITS_LESSON,
};
