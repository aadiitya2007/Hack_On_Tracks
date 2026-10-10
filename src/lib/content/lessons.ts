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
