import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.text || '';
    const query = lastUserMessage.toLowerCase().trim();

    // Check if external LLM API key exists
    const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
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
                content: 'You are Unify AI, a knowledgeable, friendly Indian financial advisor and wealth management expert. Provide clear, direct, and actionable answers to any question about investing, portfolio growth, stock predictions, risk management, tax rules (STCG/LTCG), REITs, InvITs, and market strategies.'
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
        console.warn('External LLM call failed, using Unify Knowledge Engine:', err);
      }
    }

    // Comprehensive Unify Financial Knowledge Engine
    let reply = "";

    // 1. Rapid Growth / Wealth Building Strategy
    if (
      query.includes('grow') || query.includes('rapid') || query.includes('wealth') || 
      query.includes('make money') || query.includes('maximize') || query.includes('double') || 
      query.includes('fast') || query.includes('increase') || query.includes('returns')
    ) {
      reply = `To grow your portfolio rapidly and sustainably in Indian markets, focus on 4 core pillars:

1. **Quality Equity Allocation**: Focus 60-70% of your portfolio on high-growth compounding blue-chip & mid-cap stocks (e.g., Tech, Banking, Green Energy).
2. **SIP & Systematic Reinvestment**: Reinvest all dividends & capital gains systematically through monthly SIPs to harness exponential compounding.
3. **Smart Asset Rebalancing**: Use Unify's Risk Engine to balance high-beta growth equities with yield-bearing REITs/Bonds (20-30%) to cushion drawdowns during market corrections.
4. **Eliminate DP Charge Leakage**: Consolidate duplicate scrips held across Zerodha, Groww & Upstox to eliminate hidden DP fee leaks (saving ₹420/yr per duplicate).`;

    // 2. Greetings / Introduction
    } else if (query === 'hi' || query === 'hello' || query === 'hey' || query.includes('who are you') || query.includes('good morning') || query.includes('good evening')) {
      reply = "Hello! I am your Unify AI Assistant. I can help you analyze portfolio growth, explain stock predictions, calculate risk metrics (VaR & Volatility), optimize multi-broker DP fees, or explain Indian tax rules (STCG/LTCG). What would you like to explore today?";

    // 3. How to Start Investing / Beginner Strategy
    } else if (query.includes('how to invest') || query.includes('beginner') || query.includes('starter') || query.includes('where to put money')) {
      reply = "For beginner investors in India, a balanced 60/30/10 portfolio blueprint is recommended:\n\n• **60% Low-Cost Index Funds / ETFs**: Track NIFTY 50 or Sensex for steady market growth.\n• **30% Flexi-Cap Mutual Funds**: Managed by expert fund managers for alpha returns.\n• **10% Fixed Income / REITs**: Yield-bearing assets to protect capital during volatility.";

    // 4. ML Predictions & Technical Analysis
    } else if (query.includes('predict') || query.includes('xgboost') || query.includes('ml') || query.includes('technical') || query.includes('indicator')) {
      reply = "Our ML Prediction Engine uses an XGBoost Classifier trained on 124,000+ daily OHLCV historical records across 50 Indian stocks. It processes technical indicators (RSI-14, 10/50 day MAs, 20-day rolling volatility) to predict next-day directional probabilities (Bullish/Bearish) with zero future data leakage.";

    // 5. Portfolio Risk & Volatility
    } else if (query.includes('risk') || query.includes('volatility') || query.includes('drawdown') || query.includes('loss') || query.includes('protect')) {
      reply = "Unify calculates your Portfolio Risk Score (0-100) using 1-year Annualized Volatility (40%), Herfindahl-Hirschman Concentration Index (30%), and Max Drawdown (30%). You can use the 'What-If' slider on the Risk page to simulate shifting capital into bonds to lower your risk score!";

    // 6. Multi-Broker Accounts & DP Fee Leakage
    } else if (query.includes('account') || query.includes('broker') || query.includes('zerodha') || query.includes('groww') || query.includes('upstox') || query.includes('cas') || query.includes('dp fee')) {
      reply = "Unify aggregates live telemetry across Zerodha, Groww, Upstox, CDSL, Angel One, and ICICI Direct. If you hold the same stock (e.g. RELIANCE) across Zerodha and Groww, Unify flags it as a duplicate scrip overlap that drains ₹420/year in depository fees.";

    // 7. REITs & InvITs
    } else if (query.includes('reit') || query.includes('invit') || query.includes('real estate') || query.includes('infrastructure')) {
      reply = "REITs (Real Estate Investment Trusts like Embassy, Mindspace) and InvITs (Infrastructure Investment Trusts like PGInvIT) pass through rental and infrastructure yield to unitholders. They offer 6-9% annual yields and serve as excellent fixed-income alternatives in a diversified portfolio.";

    // 8. Capital Gains & Indian Tax Rules
    } else if (query.includes('tax') || query.includes('stcg') || query.includes('ltcg') || query.includes('sebi')) {
      reply = "Under current Indian tax laws:\n\n• **Short-Term Capital Gains (STCG)**: Equity held under 1 year is taxed at **20%**.\n• **Long-Term Capital Gains (LTCG)**: Equity held over 1 year is taxed at **12.5%** for gains exceeding ₹1.25 Lakh per financial year.";

    // 9. Futures & Options (F&O)
    } else if (query.includes('futures') || query.includes('options') || query.includes('fno') || query.includes('f&o') || query.includes('call') || query.includes('put') || query.includes('leverage')) {
      reply = "Futures and Options are derivative contracts based on underlying stock/index price movements. Call Options give the right to buy, Put Options give the right to sell. **Important Note**: SEBI reports that 9 out of 10 individual traders in Indian equity F&O incur net losses. Use strict risk management and leverage controls!";

    // 10. Time Machine & SIP Compounding
    } else if (query.includes('time machine') || query.includes('sip') || query.includes('cagr') || query.includes('compound')) {
      reply = "The Time Machine Engine calculates historical Lump Sum and Monthly SIP compounding growth, CAGR, and max drawdown profiles across Stocks, Bonds, REITs, and Mutual Funds over custom date ranges.";

    // 11. Advice Disclaimer
    } else if (query.includes('advice') || query.includes('should i buy') || query.includes('which stock to buy')) {
      reply = "While I analyze your portfolio telemetry, risk scores, and ML probabilities, I cannot provide direct SEBI-registered financial advice. For individual buy/sell decisions, consult a certified financial advisor.";

    // 12. Dynamic Intelligent Fallback based on Query Terms
    } else {
      reply = `Great question regarding "${lastUserMessage}"! 

To optimize your investments on Unify:
• Explore **AI Predictions** (/prediction) to view XGBoost probability metrics.
• Check your **Portfolio Risk Profile** (/risk) to simulate bond allocation shifts.
• Learn asset mechanics in **Masterclasses** (/learn) across Stocks, REITs, Bonds, and F&O.

Feel free to ask for specific details on portfolio growth, tax rules, or stock analysis!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ reply: 'Sorry, I encountered an error processing your request. Please try again.' }, { status: 500 });
  }
}
