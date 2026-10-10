import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.text || '';
    const query = lastUserMessage.toLowerCase();

    // Check if external LLM API key exists
    const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        // Call external Open-AI compatible or Gemini LLM endpoint if configured
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are VaultIQ AI, an expert Indian financial advisor assistant specializing in portfolio tracking, equities, mutual funds, REITs, InvITs, tax implications, risk management, and ML stock prediction.'
              },
              ...messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text
              }))
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('External LLM call failed, falling back to VaultIQ Financial Knowledge Engine:', err);
      }
    }

    // Intelligent VaultIQ Financial Knowledge Engine
    let reply = "VaultIQ Assistant here! How can I help you analyze your portfolio, evaluate stock predictions, or manage your risk profile today?";

    if (query.includes('advice') || query.includes('should i buy') || query.includes('invest in')) {
      reply = "I can provide analytical insights based on your portfolio telemetry, but I cannot give direct SEBI-registered financial advice. For personalized investment decisions, consult a certified financial planner.";
    } else if (query.includes('predict') || query.includes('xgboost') || query.includes('ml')) {
      reply = "Our ML Prediction Engine uses an XGBoost Classifier trained on historical daily OHLCV technical indicators (RSI-14, 10/50 day MAs, rolling volatility). It predicts next-day directional probabilities (Bullish/Bearish) rather than exact target prices.";
    } else if (query.includes('risk') || query.includes('volatility') || query.includes('drawdown')) {
      reply = "Your Portfolio Risk Profile calculates 1-year annual volatility, Herfindahl-Hirschman concentration index (HHI), and 95% 1-month Value-at-Risk (VaR). You can use the 'What-If' engine on the Risk page to simulate shifting allocation into fixed-income bonds to lower your risk score!";
    } else if (query.includes('account') || query.includes('broker') || query.includes('zerodha') || query.includes('groww')) {
      reply = "VaultIQ supports live API telemetry connections across Zerodha, Groww, Upstox, Angel One, ICICI Direct, and Paytm Money. For non-API accounts, our Mail Sync module parses password-protected PDF Consolidated Account Statements (CAS) automatically!";
    } else if (query.includes('reit') || query.includes('invit')) {
      reply = "REITs (Real Estate Investment Trusts like Embassy) and InvITs (Infrastructure Investment Trusts like PGInvIT) pass through rental and infrastructure yield to unitholders. They offer 6-9% annual yields and serve as excellent fixed-income alternatives in a diversified portfolio.";
    } else if (query.includes('practice') || query.includes('trade') || query.includes('virtual')) {
      reply = "In Practice Trading Studio, you start with ₹10,00,000 in virtual capital. You can test buy/sell orders on real stock data and run fast-forward market shock simulations (-28%) to evaluate portfolio resilience.";
    } else if (query.includes('tax') || query.includes('stcg') || query.includes('ltcg')) {
      reply = "In India, equity investments incur 20% Short-Term Capital Gains (STCG) for holding under 1 year, and 12.5% Long-Term Capital Gains (LTCG) for holdings above 1 year exceeding ₹1.25 Lakh exemption.";
    } else if (query.includes('stock') || query.includes('equity') || query.includes('shares')) {
      reply = "Equities represent ownership in companies like Reliance, HDFC Bank, TCS, and Infosys. They offer high long-term return potential but carry higher price volatility. Diversifying across non-correlated sectors reduces overall portfolio variance.";
    } else if (query.includes('time machine') || query.includes('sip') || query.includes('cagr')) {
      reply = "The Time Machine Engine calculates historical Lump Sum and Monthly SIP compounding growth, CAGR, and max drawdown profiles across Stocks, Bonds, REITs, and Mutual Funds over custom date ranges.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ reply: 'Sorry, I encountered an error processing your request. Please try again.' }, { status: 500 });
  }
}
