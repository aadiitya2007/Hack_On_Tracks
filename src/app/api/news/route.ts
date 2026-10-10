import { NextResponse } from 'next/server';

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  url: string;
  timeAgo: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  symbol?: string;
  impact: 'High' | 'Medium' | 'Low';
};

const CURATED_FINANCIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Times of India: Nifty 50 and Sensex surge as foreign institutional investors (FIIs) resume net buying',
    summary: 'Indian benchmark indices rallied over 450 points led by banking and IT majors as global inflation fears ease and crude prices stabilize.',
    source: 'Times of India (Business)',
    category: 'Indian Markets',
    url: 'https://timesofindia.indiatimes.com/business/india-business',
    timeAgo: '15 mins ago',
    sentiment: 'BULLISH',
    symbol: 'NIFTY 50',
    impact: 'High'
  },
  {
    id: 'news-2',
    title: 'Economic Times: Reliance Industries announces ₹75,000 Cr green hydrogen & gigafactory expansion',
    summary: 'RIL leadership confirms new clean energy capex milestone. Institutional brokerages upgrade target prices citing long-term ESG value unlock.',
    source: 'Economic Times',
    category: 'Corporate',
    url: 'https://economictimes.indiatimes.com/markets',
    timeAgo: '42 mins ago',
    sentiment: 'BULLISH',
    symbol: 'RELIANCE',
    impact: 'High'
  },
  {
    id: 'news-3',
    title: 'Moneycontrol: RBI maintains repo rate at 6.5%, signals focus on durable inflation target',
    summary: 'The Monetary Policy Committee voted unanimously to keep policy rates unchanged while retaining an optimistic GDP growth outlook of 7.2%.',
    source: 'Moneycontrol',
    category: 'Banking & Macro',
    url: 'https://www.moneycontrol.com/news/',
    timeAgo: '1 hour ago',
    sentiment: 'NEUTRAL',
    symbol: 'HDFCBANK',
    impact: 'High'
  },
  {
    id: 'news-4',
    title: 'Financial Express: Indian IT services sector faces short-term revenue margin pressure',
    summary: 'Tier-1 IT service exporters report modest discretionary tech spending revisions from North American and European banking clients.',
    source: 'Financial Express',
    category: 'Tech & IT',
    url: 'https://www.financialexpress.com/market/',
    timeAgo: '2 hours ago',
    sentiment: 'BEARISH',
    symbol: 'TCS',
    impact: 'Medium'
  },
  {
    id: 'news-5',
    title: 'Reuters: Global markets rebound as US Federal Reserve signals potential rate cuts',
    summary: 'Asian and European equities gain momentum following dovish commentary from central bankers. Dollar index drops to 4-month lows.',
    source: 'Reuters (Global Finance)',
    category: 'Global Finance',
    url: 'https://www.reuters.com/business/',
    timeAgo: '3 hours ago',
    sentiment: 'BULLISH',
    symbol: 'GLOBAL',
    impact: 'High'
  },
  {
    id: 'news-6',
    title: 'Times of India: SEBI introduces streamlined disclosure norms for REITs and InvITs',
    summary: 'Securities and Exchange Board of India enhances liquidity and quarterly payout distribution transparency for retail unitholders.',
    source: 'Times of India (Business)',
    category: 'Regulations',
    url: 'https://timesofindia.indiatimes.com/business',
    timeAgo: '4 hours ago',
    sentiment: 'BULLISH',
    symbol: 'EMBASSY_REIT',
    impact: 'Medium'
  },
  {
    id: 'news-7',
    title: 'Economic Times: Tata Motors JLR records 22% quarter-on-quarter growth in electric SUV sales',
    summary: 'Jaguar Land Rover premium EV order book expands across European markets, driving margin expansion expectations.',
    source: 'Economic Times',
    category: 'Auto & Industrials',
    url: 'https://economictimes.indiatimes.com/',
    timeAgo: '5 hours ago',
    sentiment: 'BULLISH',
    symbol: 'TATAMOTORS',
    impact: 'Medium'
  },
  {
    id: 'news-8',
    title: 'Moneycontrol: Mutual fund SIP inflows hit record high of ₹23,500 Crore per month',
    summary: 'AMFI data highlights disciplined retail participation across large-cap and flexi-cap equity schemes despite market volatility.',
    source: 'Moneycontrol',
    category: 'Mutual Funds',
    url: 'https://www.moneycontrol.com/mutual-funds/',
    timeAgo: '6 hours ago',
    sentiment: 'BULLISH',
    symbol: 'MUTUAL_FUNDS',
    impact: 'High'
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterSource = searchParams.get('source');
  const filterSymbol = searchParams.get('symbol');

  try {
    let result = [...CURATED_FINANCIAL_NEWS];

    if (filterSource && filterSource !== 'All') {
      result = result.filter(n => n.source.toLowerCase().includes(filterSource.toLowerCase()));
    }

    if (filterSymbol) {
      result = result.filter(n => n.symbol?.toUpperCase() === filterSymbol.toUpperCase());
    }

    return NextResponse.json({
      status: 'ok',
      count: result.length,
      timestamp: new Date().toISOString(),
      sources: ['Times of India', 'Economic Times', 'Moneycontrol', 'Financial Express', 'Reuters'],
      news: result
    });
  } catch (error) {
    console.error('Error serving financial news API:', error);
    return NextResponse.json({
      status: 'error',
      news: CURATED_FINANCIAL_NEWS
    }, { status: 500 });
  }
}
