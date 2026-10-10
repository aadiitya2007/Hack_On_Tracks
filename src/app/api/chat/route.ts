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
                content: 'You are Unify AI, a knowledgeable, friendly Indian financial advisor and wealth management expert. Provide clear, direct, well-structured answers using markdown formatting (bullet points, bold text) to any question about investing, portfolio growth, stock predictions, risk management, tax rules (STCG/LTCG), REITs, InvITs, and market strategies. Never say "Great question regarding [statement]" if the user is saying thank you or casual pleasantries.'
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

    // Comprehensive Unify Financial & Conversational Knowledge Engine
    let reply = "";

    // 1. Gratitude / Thanks / Pleasantries / Acknowledgements (e.g. "Thank you for the guidance", "thanks", "got it")
    const isGratitude = /\b(thank|thanks|thx|thankyou|appreciated|grateful|got it|okay|ok|cool|awesome|great|nice|perfect|sounds good|understood|makes sense)\b/i.test(query);
    const isGoodbye = /\b(bye|goodbye|see ya|cheers)\b/i.test(query);

    if (isGratitude && !query.includes('how') && !query.includes('what') && !query.includes('why')) {
      reply = "You're very welcome! 😊 I'm always happy to assist you with your portfolio telemetry, risk management, or market insights. Let me know whenever you'd like to check predictions or explore new asset masterclasses!";

    } else if (isGoodbye) {
      reply = "Goodbye! Have a great day and happy investing! 🚀 Feel free to open the assistant anytime you need insights.";

    // 2. Greetings / Introduction
    } else if (query === 'hi' || query === 'hello' || query === 'hey' || query.includes('who are you') || query.includes('good morning') || query.includes('good evening') || query.includes('good afternoon')) {
      reply = "Hello! 👋 I am your Unify AI Assistant.\n\nI can help you analyze your portfolio telemetry, explain stock predictions, calculate risk metrics (VaR & Volatility), optimize multi-broker DP fee leaks, or clarify Indian tax rules (STCG/LTCG).\n\nWhat would you like to explore today?";

    // 3. Rapid Growth / Wealth Building Strategy
    } else if (
      query.includes('grow') || query.includes('rapid') || query.includes('wealth') || 
      query.includes('make money') || query.includes('maximize') || query.includes('double') || 
      query.includes('fast') || query.includes('increase') || query.includes('returns')
    ) {
      reply = `To grow your portfolio rapidly and sustainably in Indian markets, focus on 4 core pillars:\n\n1. **Quality Equity Allocation**: Focus 60-70% of your portfolio on high-growth compounding blue-chip & mid-cap stocks (e.g., Tech, Banking, Green Energy).\n2. **SIP & Systematic Reinvestment**: Reinvest all dividends & capital gains systematically through monthly SIPs to harness exponential compounding.\n3. **Smart Asset Rebalancing**: Use Unify's Risk Engine to balance high-beta growth equities with yield-bearing REITs/Bonds (20-30%) to cushion drawdowns during market corrections.\n4. **Eliminate DP Charge Leakage**: Consolidate duplicate scrips held across Zerodha, Groww & Upstox to eliminate hidden DP fee leaks (saving ₹420/yr per duplicate).`;

    // 4. How to Start Investing / Beginner Strategy
    } else if (query.includes('how to invest') || query.includes('beginner') || query.includes('starter') || query.includes('where to put money')) {
      reply = "For beginner investors in India, a balanced 60/30/10 portfolio blueprint is recommended:\n\n• **60% Low-Cost Index Funds / ETFs**: Track NIFTY 50 or Sensex for steady market growth.\n• **30% Flexi-Cap Mutual Funds**: Managed by expert fund managers for alpha returns.\n• **10% Fixed Income / REITs**: Yield-bearing assets to protect capital during volatility.";

    // 5. ML Predictions & Technical Analysis
    } else if (query.includes('predict') || query.includes('xgboost') || query.includes('ml') || query.includes('technical') || query.includes('indicator')) {
      reply = "Our ML Prediction Engine uses an XGBoost Classifier trained on 124,000+ daily OHLCV historical records across 50 Indian stocks.\n\nKey details:\n• **Inputs**: RSI-14, 10/50 day Moving Averages, 20-day rolling volatility.\n• **Output**: Next-day directional probabilities (Bullish/Bearish) with zero future data leakage.\n• **Verification**: Backtested across 5-year historical cycles.";

    // 6. Portfolio Risk & Volatility
    } else if (query.includes('risk') || query.includes('volatility') || query.includes('drawdown') || query.includes('loss') || query.includes('protect') || query.includes('var')) {
      reply = "Unify calculates your Portfolio Risk Score (0-100) using 3 weighted metrics:\n\n1. **Annualized Volatility (40%)**: 1-year standard deviation of daily returns.\n2. **Concentration Index (30%)**: Herfindahl-Hirschman Index measuring stock/sector overexposure.\n3. **Max Drawdown (30%)**: Peak-to-trough decline over historical stress cycles.\n\nTip: You can use the 'What-If' slider on the Risk page (/risk) to simulate shifting capital into bonds to lower your risk score!";

    // 7. Multi-Broker Accounts & DP Fee Leakage
    } else if (query.includes('account') || query.includes('broker') || query.includes('zerodha') || query.includes('groww') || query.includes('upstox') || query.includes('cas') || query.includes('dp fee') || query.includes('depository')) {
      reply = "Unify aggregates live telemetry across Zerodha, Groww, Upstox, CDSL, Angel One, and ICICI Direct.\n\n• **DP Fee Leak**: If you hold the same stock (e.g. RELIANCE) across Zerodha and Groww, Unify flags it as a duplicate scrip overlap that drains ₹420/year in depository fees.\n• **Solution**: Consolidate holdings under a single depository participant to maximize net returns.";

    // 8. REITs & InvITs
    } else if (query.includes('reit') || query.includes('invit') || query.includes('real estate') || query.includes('infrastructure')) {
      reply = "REITs and InvITs are high-yield asset classes regulated by SEBI:\n\n• **REITs (Real Estate Investment Trusts)**: Pass through commercial rental yields from grade-A office spaces (e.g., Embassy, Mindspace).\n• **InvITs (Infrastructure Investment Trusts)**: Pass through cash flows from toll roads and power transmission lines (e.g., PGInvIT).\n• **Yield**: Provide 6-9% annual cash yields with quarterly dividend payouts.";

    // 9. Capital Gains & Tax Rules
    } else if (query.includes('tax') || query.includes('stcg') || query.includes('ltcg') || query.includes('sebi') || query.includes('80c') || query.includes('elss')) {
      reply = "Under current Indian tax laws:\n\n1. **Short-Term Capital Gains (STCG)**: Equity held under 1 year is taxed at **20%**.\n2. **Long-Term Capital Gains (LTCG)**: Equity held over 1 year is taxed at **12.5%** for gains exceeding ₹1.25 Lakh per financial year.\n3. **ELSS Mutual Funds**: Eligible for up to ₹1.5 Lakh tax deduction under Section 80C (Old Regime) with a 3-year lock-in period.";

    // 10. Futures & Options (F&O)
    } else if (query.includes('futures') || query.includes('options') || query.includes('fno') || query.includes('f&o') || query.includes('call') || query.includes('put') || query.includes('leverage')) {
      reply = "Futures and Options are derivative contracts based on underlying stock or index price movements:\n\n• **Call Option**: Gives the right to buy an asset at a set strike price.\n• **Put Option**: Gives the right to sell an asset at a set strike price.\n\n⚠️ **SEBI Risk Warning**: 9 out of 10 individual traders in Indian equity F&O incur net financial losses. Maintain strict position sizing and leverage limits!";

    // 11. Time Machine & SIP Compounding
    } else if (query.includes('time machine') || query.includes('sip') || query.includes('cagr') || query.includes('compound')) {
      reply = "The Unify Time Machine Engine computes historical Lump Sum and Monthly SIP compounding growth, CAGR, and drawdown profiles across Stocks, Bonds, REITs, and Mutual Funds over custom historical date ranges.";

    // 12. Inflation & Economic Indicators
    } else if (query.includes('inflation') || query.includes('rbi') || query.includes('interest rate') || query.includes('repo')) {
      reply = "Economic indicators impact portfolio asset allocation:\n\n• **Inflation Risk**: Erodes real returns of traditional savings. Equities & REITs historically outpace inflation over 3+ year horizons.\n• **RBI Repo Rates**: High interest rates favor debt funds & fixed income, while rate cuts typically spark equity bull rallies.";

    // 13. Crypto vs Equities vs Gold
    } else if (query.includes('crypto') || query.includes('bitcoin') || query.includes('gold') || query.includes('sgb')) {
      reply = "Asset Class Comparison:\n\n• **Equities**: High growth backed by company earnings & GDP growth.\n• **Sovereign Gold Bonds (SGB)**: Hedge against inflation with 2.5% annual interest + capital gain tax exemption if held to maturity.\n• **Crypto**: High-volatility speculative asset. In India, crypto gains are taxed at 30% flat with no loss set-off.";

    // 14. Financial Advice Disclaimer
    } else if (query.includes('advice') || query.includes('should i buy') || query.includes('which stock to buy')) {
      reply = "While Unify analyzes your live portfolio telemetry, risk scores, and ML probabilities, I cannot provide direct SEBI-registered financial advice. For individual buy/sell decisions, consult a certified financial advisor.";

    // 15. Dynamic Clean Fallback for General / Random Queries
    } else {
      reply = `Here is how Unify helps you analyze **${lastUserMessage}**:\n\n• **Portfolio Telemetry**: Live aggregation of holdings across Zerodha, Groww & Upstox.\n• **Predictive ML**: XGBoost classification models forecasting short-term directional probabilities.\n• **Risk Diagnostics**: Multi-factor VaR and sector concentration scoring.\n\nExplore our core modules:\n1. **AI Predictions** (/prediction)\n2. **Portfolio Risk Profile** (/risk)\n3. **Masterclasses** (/learn)\n\nFeel free to ask specific questions about portfolio growth, risk reduction, or tax implications!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ reply: 'Sorry, I encountered an error processing your request. Please try again.' }, { status: 500 });
  }
}
