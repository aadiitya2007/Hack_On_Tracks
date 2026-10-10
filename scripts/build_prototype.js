const fs = require('fs');

// ---------------------------------------------------------
// 1. DATA.JS
// ---------------------------------------------------------
const dataJsContent = `
window.AppData = {
  user: { name: "Aaditya A.", panMasked: "ABCDE****F", lastSynced: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
  portfolio: { totalValue: 1234567.89, totalInvested: 980000.00, todayChange: 14500.25, todayChangePct: 1.18, overallChange: 254567.89, overallChangePct: 25.97 },
  assetAllocation: [
    { name: "Stocks", value: 650000, color: "var(--color-stocks)" },
    { name: "Mutual Funds", value: 300000, color: "var(--color-mf)" },
    { name: "Bonds", value: 150000, color: "var(--color-bonds)" },
    { name: "REITs", value: 80000, color: "var(--color-reits)" },
    { name: "ETFs", value: 54567.89, color: "var(--color-etfs)" }
  ],
  chartSeries: {
    "1M": [1180000, 1195000, 1182000, 1205000, 1215000, 1220000, 1234567.89],
    "6M": [950000, 980000, 1020000, 1100000, 1080000, 1180000, 1234567.89],
    "1Y": [850000, 890000, 920000, 900000, 980000, 1050000, 1120000, 1100000, 1150000, 1190000, 1220000, 1234567.89],
    "ALL": [500000, 550000, 600000, 580000, 700000, 800000, 850000, 1000000, 1100000, 1234567.89]
  },
  holdings: [
    { id: 1, symbol: "RELIANCE", name: "Reliance Industries", assetClass: "Stocks", broker: "Zerodha", quantity: 50, avgPrice: 2420.00, ltp: 2985.40, source: "Live API" },
    { id: 2, symbol: "HDFCBANK", name: "HDFC Bank Ltd", assetClass: "Stocks", broker: "Zerodha", quantity: 120, avgPrice: 1510.00, ltp: 1680.50, source: "Live API" },
    { id: 3, symbol: "TCS", name: "Tata Consultancy", assetClass: "Stocks", broker: "Upstox", quantity: 20, avgPrice: 3410.00, ltp: 4120.00, source: "Live API" },
    { id: 4, symbol: "RELIANCE", name: "Reliance Industries", assetClass: "Stocks", broker: "Groww", quantity: 25, avgPrice: 2310.00, ltp: 2985.40, source: "Statement" },
    { id: 5, symbol: "PARAGPPF", name: "PPFAS Flexi Cap", assetClass: "Mutual Funds", broker: "Angel One", quantity: 1500.45, avgPrice: 50.12, ltp: 68.40, source: "Live API" },
    { id: 6, symbol: "SGBAUG28", name: "SGB Aug 2028", assetClass: "Bonds", broker: "NSDL", quantity: 20, avgPrice: 5120.00, ltp: 6250.00, source: "Mail Sync" }
  ],
  riskProfile: { score: 58, category: "Moderate", volatility: 0.145, maxDrawdown: 0.18, hhi: 2150, var1d: 14500, var1m: 65000 },
  brokers: [
    { name: "Groww", id: "groww", color: "#00d09c", connected: true },
    { name: "Zerodha", id: "zerodha", color: "#387ed1", connected: true },
    { name: "Upstox", id: "upstox", color: "#542a8b", connected: true },
    { name: "Angel One", id: "angel", color: "#ff5722", connected: false },
    { name: "NSDL", id: "nsdl", color: "#00478e", connected: true }
  ],
  predictionData: [
    { symbol: "RELIANCE", prob: 54, accuracy: 52, f1: 53, ltp: 2985.40 },
    { symbol: "HDFCBANK", prob: 48, accuracy: 51, f1: 50, ltp: 1680.50 },
    { symbol: "TCS", prob: 56, accuracy: 54, f1: 55, ltp: 4120.00 },
    { symbol: "INFY", prob: 51, accuracy: 50, f1: 49, ltp: 1450.00 }
  ],
  timeMachineAssets: [
    { id: 'reliance', name: 'Reliance (Large Cap)', series: [100, 110, 105, 125, 140, 135, 160, 180, 210, 250], startYear: 2014 },
    { id: 'nifty', name: 'Nifty 50 ETF', series: [100, 112, 115, 122, 130, 135, 145, 155, 165, 180], startYear: 2014 },
    { id: 'bond', name: 'Govt Bond (10Y)', series: [100, 107, 114.5, 122.5, 131, 140, 150, 160.5, 171.7, 183.7], startYear: 2014 },
    { id: 'reit', name: 'Embassy REIT', series: [100, 105, 95, 110, 115, 120, 125, 135], startYear: 2018 }
  ],
  lessons: [
    { id: 'stocks', title: 'STOCKS', subtitle: 'Own a Piece of a Company', icon: '📈', content: [
      { type: 'text', val: 'Imagine a company is a huge pizza. Each share is a slice.' },
      { type: 'dialogue', val: [
        { sender: 'Meera', text: 'Ready to learn about stocks?' },
        { sender: 'Aarav', text: 'Yes, but aren\\'t they risky?' },
        { sender: 'Meera', text: 'They carry higher risk than bonds, but historically offer higher long-term rewards.' }
      ]},
      { type: 'takeaway', val: 'High risk, high potential reward.' }
    ]},
    { id: 'mutual-funds', title: 'MUTUAL FUNDS', subtitle: 'Invest Through a Basket', icon: '🧺', content: [
      { type: 'text', val: 'Pools money from many investors to buy a diversified basket.' },
      { type: 'dialogue', val: [
        { sender: 'Meera', text: 'Mutual funds give you instant diversification.' },
        { sender: 'Aarav', text: 'So I don\\'t have to pick individual stocks?' },
        { sender: 'Meera', text: 'Exactly. A fund manager does it for you.' }
      ]}
    ]}
  ],
  quiz: [
    { q: "What represents ownership in a company?", options: ["Bond", "Stock", "REIT", "FD"], ans: 1 },
    { q: "Which offers instant diversification managed by professionals?", options: ["Mutual Fund", "Single Stock", "Gold", "Savings Account"], ans: 0 },
    { q: "When interest rates rise, existing bond prices usually:", options: ["Rise", "Fall", "Stay exactly same", "Double"], ans: 1 }
  ],
  tourSteps: [
    { target: '#sidebar', title: 'Navigation', text: 'Access all your financial tools from this unified sidebar.' },
    { target: '#tot-val', title: 'Dashboard', text: 'Real-time aggregation of your net worth across all linked brokers.' },
    { target: '#holdings-table', title: 'Smart Ledger', text: 'We parse emails, APIs, and statements into one single ledger.' },
    { target: '#theme-toggle', title: 'Visuals', text: 'Everything is carefully designed. Toggle dark mode here.' }
  ]
};
`;

// ---------------------------------------------------------
// 2. STYLES.CSS (Appending to existing)
// ---------------------------------------------------------
const stylesCssContent = `
/* Phase 3, 4, 5 Additions */

/* Feature Importance Bars */
.fi-bar-container { width: 100%; background: var(--bg-surface-hover); border-radius: 4px; height: 8px; overflow: hidden; margin-top: 4px; }
.fi-bar { height: 100%; background: var(--brand-accent); }

/* Chat / Dialogue */
.chat-container { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: var(--bg-surface-hover); border-radius: 12px; max-height: 400px; overflow-y: auto; }
.chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.4; animation: slideUp 0.2s ease-out; }
.chat-meera { align-self: flex-start; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-bottom-left-radius: 4px; }
.chat-aarav { align-self: flex-end; background: var(--brand-accent); color: #fff; border-bottom-right-radius: 4px; }
.typing-dot { display: inline-block; width: 6px; height: 6px; background: currentColor; border-radius: 50%; margin: 0 2px; animation: blink 1.4s infinite both; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }

/* Slider */
.range-slider { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: var(--border-color); outline: none; }
.range-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--brand-accent); cursor: pointer; }

/* Grid Layouts */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

/* Guided Tour Overlay */
#tour-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; }
.tour-highlight { position: relative; z-index: 9999 !important; box-shadow: 0 0 0 4px var(--brand-accent); border-radius: 4px; pointer-events: none; }
.tour-popup { position: fixed; z-index: 10000; background: var(--bg-surface); padding: 24px; border-radius: 12px; width: 320px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); display: none; transition: all 0.3s ease; }

/* Assistant Widget */
#assistant-widget { position: fixed; bottom: 24px; right: 24px; width: 320px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; transform: translateY(120%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); z-index: 9000; }
#assistant-widget.open { transform: translateY(0); }
.ast-header { padding: 16px; background: var(--brand-accent); color: #fff; font-weight: bold; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.ast-body { padding: 16px; height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background: var(--bg-app); }
.ast-footer { padding: 12px; background: var(--bg-surface); border-top: 1px solid var(--border-color); }
.chip { display: inline-block; padding: 6px 12px; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 16px; font-size: 12px; cursor: pointer; margin: 4px 2px; }
.chip:hover { background: var(--brand-accent-bg); color: var(--brand-accent-text); }
#ast-toggle-btn { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 28px; background: var(--brand-accent); color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 8999; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s; border: none; }
#ast-toggle-btn:hover { transform: scale(1.05); }

/* Time Machine Input */
.tm-select { width: 100%; padding: 10px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary); border-radius: 8px; margin-bottom: 16px;}
`;

// ---------------------------------------------------------
// 3. APP.JS (Overhaul with all Phase routes)
// ---------------------------------------------------------
const appJsContent = `
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("theme-toggle");
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    themeBtn.innerHTML = isDark ? 
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' : 
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  themeBtn.addEventListener("click", () => { isDark = !isDark; applyTheme(); });
  applyTheme();

  const content = document.getElementById("app-content");
  
  const routes = {
    "#/": { render: renderLogin, init: initLogin },
    "#/dashboard": { render: renderDashboard, init: initDashboard },
    "#/accounts": { render: renderAccounts, init: () => {} },
    "#/risk": { render: renderRisk, init: initRisk },
    "#/prediction": { render: renderPrediction, init: () => {} },
    "#/time-machine": { render: renderTimeMachine, init: initTimeMachine },
    "#/explore": { render: renderExplore, init: () => {} },
    "#/learn": { render: renderLearn, init: () => {} },
    "#/quiz": { render: renderQuiz, init: initQuiz },
    "#/practice": { render: renderPractice, init: initPractice }
  };

  function router() {
    const pathParts = (window.location.hash || "#/").split('?');
    const path = pathParts[0];
    
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === path);
    });

    content.innerHTML = '<div class="fade-in" style="opacity:0.5">Loading...</div>';
    
    setTimeout(() => {
      if (path.startsWith('#/learn/')) {
        const id = path.replace('#/learn/', '');
        content.innerHTML = \`<div class="fade-in">\${renderLesson(id)}</div>\`;
        initLesson(id);
      } else {
        const route = routes[path] || routes["#/dashboard"];
        content.innerHTML = \`<div class="fade-in">\${route.render()}</div>\`;
        if (route.init) route.init();
      }
    }, 150);
  }

  window.addEventListener("hashchange", router);
  router();
  initGlobalComponents();
});

// Format helpers
function formatCurrency(num) { return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function formatPct(num) { return (num > 0 ? "+" : "") + num.toFixed(2) + "%"; }

// ----- Phase 1/2: Dashboard/Login -----
function renderLogin() {
  return \`
    <div class="card wizard-card">
      <div class="progress-bar"><div class="progress-fill" id="wiz-progress" style="width: 20%"></div></div>
      <div id="step-1" class="wizard-step active">
        <h2 style="margin-bottom: 8px;">Enter your PAN</h2>
        <input type="text" id="pan-input" class="input-field" placeholder="ABCDE1234F" style="text-transform: uppercase; text-align: center; font-size: 20px;" maxlength="10">
        <button class="btn-primary" id="btn-s1" style="width: 100%; justify-content: center;">Continue</button>
        <button class="btn-ghost" onclick="window.location.hash='#/dashboard'" style="width: 100%; justify-content: center; margin-top: 12px; border: none;">Skip to demo</button>
      </div>
      <div id="step-2" class="wizard-step">
        <h2 style="margin-bottom: 8px;">Accounts Found</h2>
        <div style="text-align: left; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px;">
          \${window.AppData.brokers.map(b => \`<div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-color);"><div style="display:flex; align-items:center;"><div class="broker-chip" style="background-color: \${b.color}">\${b.name.substring(0,2).toUpperCase()}</div><span>\${b.name}</span></div></div>\`).join('').replace(/border-bottom: 1px solid var\\(--border-color\\);$/, '')}
        </div>
        <button class="btn-primary" id="btn-s4" style="width: 100%; justify-content: center;">Connect Accounts</button>
      </div>
      <div id="step-3" class="wizard-step">
        <h2 style="margin-bottom: 8px; color: var(--color-gain);">Securely Connected</h2>
        <p style="color: var(--text-secondary); font-size: 14px;">Redirecting...</p>
      </div>
    </div>
  \`;
}

function initLogin() {
  document.getElementById("btn-s1").onclick = () => {
    document.getElementById("step-1").classList.remove("active");
    document.getElementById("step-2").classList.add("active");
    document.getElementById("wiz-progress").style.width = "60%";
  };
  document.getElementById("btn-s4").onclick = () => {
    document.getElementById("step-2").classList.remove("active");
    document.getElementById("step-3").classList.add("active");
    document.getElementById("wiz-progress").style.width = "100%";
    setTimeout(() => { window.location.hash = "#/dashboard"; }, 1000);
  };
}

function renderDashboard() {
  const p = window.AppData.portfolio;
  return \`
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
      <div><h1 style="margin-bottom: 4px;">Unified Dashboard</h1><p style="color: var(--text-secondary); font-size: 13px;">Last synced: \${window.AppData.user.lastSynced}</p></div>
    </div>
    <div class="grid-3" style="margin-bottom:24px;">
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Total Value</div><div class="tabular-nums" style="font-size:24px;font-weight:800;">\${formatCurrency(p.totalValue)}</div></div>
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Today's Gain</div><div class="tabular-nums" style="font-size:24px;font-weight:800;color:var(--color-gain);">▲ \${formatCurrency(p.todayChange)}</div></div>
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Overall P&L</div><div class="tabular-nums" style="font-size:24px;font-weight:800;color:var(--color-gain);">▲ \${formatCurrency(p.overallChange)} (\${p.overallChangePct}%)</div></div>
    </div>
    <div class="card">
      <h3>Portfolio Growth</h3>
      <div class="chart-container" id="area-chart-box"></div>
    </div>
  \`;
}

function initDashboard() {
  drawAreaChart("1Y", "area-chart-box");
}

function renderAccounts() {
  return \`<h1>Connected Accounts</h1><div class="grid-3 mt-4">\${window.AppData.brokers.map(b => \`<div class="card"><h3 style="display:flex;align-items:center;gap:8px;"><div class="broker-chip" style="background-color: \${b.color}">\${b.name.substring(0,2).toUpperCase()}</div>\${b.name}</h3><div style="margin-top:16px"><span class="badge \${b.connected?'source-api':'source-statement'}">\${b.connected?'Live Connected':'Manual / Disconnected'}</span></div></div>\`).join('')}</div>\`;
}

// ----- Phase 3: Risk, Prediction, Time Machine -----
function renderRisk() {
  const r = window.AppData.riskProfile;
  return \`
    <h1>Risk Profile</h1>
    <p style="color:var(--text-secondary); margin-bottom:24px;">Pre-decided demo data.</p>
    
    <div class="grid-2">
      <div class="card">
        <h3 style="color:var(--text-muted); font-size:12px; text-transform:uppercase;">Overall Score</h3>
        <div style="font-size:48px; font-weight:900;" id="risk-score">\${r.score}<span style="font-size:16px;color:var(--text-muted);">/100</span></div>
        <div class="badge \${r.score > 60 ? 'badge-loss' : 'badge-gain'}" id="risk-cat">\${r.category}</div>
      </div>
      <div class="card">
        <h3 style="margin-bottom: 16px;">What-If Simulator</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Shift <span id="shift-val">0</span>% from Stocks to Bonds</p>
        <input type="range" min="0" max="30" value="0" class="range-slider" id="risk-slider">
        <div class="grid-2" style="margin-top:24px;">
          <div><div style="font-size:11px;color:var(--text-muted);">New Volatility</div><div style="font-weight:700;" id="sim-vol">\${(r.volatility*100).toFixed(1)}%</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">New Max Drawdown</div><div style="font-weight:700;" id="sim-dd">\${(r.maxDrawdown*100).toFixed(1)}%</div></div>
        </div>
      </div>
    </div>
  \`;
}

function initRisk() {
  const slider = document.getElementById("risk-slider");
  const r = window.AppData.riskProfile;
  slider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("shift-val").innerText = val;
    document.getElementById("risk-score").innerHTML = \`\${Math.round(r.score - val * 0.4)}<span style="font-size:16px;color:var(--text-muted);">/100</span>\`;
    document.getElementById("sim-vol").innerText = (r.volatility*100 - val*0.15).toFixed(1) + "%";
    document.getElementById("sim-dd").innerText = (r.maxDrawdown*100 - val*0.2).toFixed(1) + "%";
  });
}

function renderPrediction() {
  const d = window.AppData.predictionData;
  return \`
    <h1>Stock Insights (Prediction Demo)</h1>
    <p style="color:var(--text-secondary); margin-bottom:24px;">Illustrative sample results. Next-day direction is hard to predict.</p>
    <div class="grid-2">
      \${d.map(s => \`
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-weight:800;">\${s.symbol}</h3>
            <span class="badge \${s.prob > 50 ? 'badge-gain':'badge-loss'}">\${s.prob > 50 ? 'BULLISH' : 'BEARISH'} (\${s.prob}%)</span>
          </div>
          <div style="margin-top:16px; font-size:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Model Accuracy</span><span>\${s.accuracy}%</span></div>
            <div class="fi-bar-container"><div class="fi-bar" style="width:\${s.accuracy}%;"></div></div>
          </div>
        </div>
      \`).join('')}
    </div>
  \`;
}

function renderTimeMachine() {
  return \`
    <h1>Time Machine</h1>
    <div class="grid-2" style="margin-top:24px;">
      <div class="card">
        <label style="font-size:12px;font-weight:bold;">Asset</label>
        <select id="tm-asset" class="tm-select">
          \${window.AppData.timeMachineAssets.map(a => \`<option value="\${a.id}">\${a.name}</option>\`).join('')}
        </select>
        <label style="font-size:12px;font-weight:bold;">Investment Amount (₹)</label>
        <input type="number" id="tm-amount" class="tm-select" value="100000">
        <button class="btn-primary" id="tm-run" style="width:100%; justify-content:center;">Simulate</button>
      </div>
      <div class="card" id="tm-result">
        <h3 style="color:var(--text-muted);font-size:12px;">Final Value</h3>
        <div style="font-size:32px;font-weight:800;" id="tm-val">₹--</div>
        <div class="chart-container" id="tm-chart"></div>
      </div>
    </div>
  \`;
}

function initTimeMachine() {
  document.getElementById("tm-run").onclick = () => {
    const assetId = document.getElementById("tm-asset").value;
    const amount = parseInt(document.getElementById("tm-amount").value) || 100000;
    const asset = window.AppData.timeMachineAssets.find(a => a.id === assetId);
    
    let current = amount;
    const series = asset.series.map(mult => (amount * mult) / 100);
    
    document.getElementById("tm-val").innerText = formatCurrency(series[series.length-1]);
    
    // Draw chart
    const max = Math.max(...series);
    const min = Math.min(...series);
    let pts = "";
    series.forEach((v, i) => { pts += \`\${(i/(series.length-1))*100},\${100 - ((v-min)/(max-min))*100} \`; });
    document.getElementById("tm-chart").innerHTML = \`<svg viewBox="0 0 100 100" class="chart" preserveAspectRatio="none"><path class="chart-line" d="M \${pts.trim().split(' ').join(' L ')}"></path></svg>\`;
  };
}

// ----- Phase 4: Learn, Quiz -----
function renderExplore() { return '<h1>Explore Assets</h1><p class="mt-4">Demo placeholder for Explore grid.</p>'; }

function renderLearn() {
  return \`
    <h1>Learn</h1>
    <div class="grid-2" style="margin-top:24px;">
      \${window.AppData.lessons.map(l => \`
        <div class="card" style="cursor:pointer; transition: transform 0.2s;" onclick="window.location.hash='#/learn/\${l.id}'" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
          <div style="font-size:32px; margin-bottom:12px;">\${l.icon}</div>
          <h3>\${l.title}</h3>
          <p style="font-size:13px;color:var(--text-secondary);">\${l.subtitle}</p>
        </div>
      \`).join('')}
    </div>
  \`;
}

function renderLesson(id) {
  const lesson = window.AppData.lessons.find(l => l.id === id);
  if(!lesson) return 'Lesson not found.';
  return \`
    <button class="btn-ghost" style="margin-bottom:16px; border:none; padding:0;" onclick="window.location.hash='#/learn'">← Back to Learn</button>
    <h1>\${lesson.title}</h1>
    <p style="color:var(--text-secondary); margin-bottom:32px;">\${lesson.subtitle}</p>
    
    <div class="grid-2">
      <div class="chat-container" id="chat-box">
        <!-- Dialogue injected via initLesson -->
      </div>
      <div>
        \${lesson.content.map(c => {
          if(c.type === 'text') return \`<p style="margin-bottom:16px;">\${c.val}</p>\`;
          if(c.type === 'takeaway') return \`<div class="card" style="background:var(--brand-accent-bg); color:var(--brand-accent-text); border:none;"><strong>Takeaway:</strong> \${c.val}</div>\`;
          return '';
        }).join('')}
      </div>
    </div>
  \`;
}

function initLesson(id) {
  const lesson = window.AppData.lessons.find(l => l.id === id);
  const diag = lesson.content.find(c => c.type === 'dialogue')?.val;
  if(!diag) return;
  
  const box = document.getElementById("chat-box");
  let idx = 0;
  
  function nextBubble() {
    if(idx >= diag.length) return;
    const msg = diag[idx];
    const isMeera = msg.sender === 'Meera';
    
    // Typing indicator
    const typing = document.createElement("div");
    typing.className = \`chat-bubble \${isMeera ? 'chat-meera':'chat-aarav'}\`;
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
    
    setTimeout(() => {
      box.removeChild(typing);
      const bubble = document.createElement("div");
      bubble.className = \`chat-bubble \${isMeera ? 'chat-meera':'chat-aarav'}\`;
      bubble.innerHTML = \`<strong>\${msg.sender}</strong><br>\${msg.text}\`;
      box.appendChild(bubble);
      box.scrollTop = box.scrollHeight;
      idx++;
      setTimeout(nextBubble, 800); // Deterministic delay
    }, 600);
  }
  nextBubble();
}

function renderQuiz() {
  const q = window.AppData.quiz[0];
  return \`
    <h1>Knowledge Check</h1>
    <div class="card" style="margin-top:24px; max-width: 600px;">
      <h3 style="margin-bottom: 24px;">\${q.q}</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        \${q.options.map((opt, i) => \`<button class="btn-ghost" style="text-align:left; padding:16px;" onclick="alert('\${i===q.ans ? 'Correct!' : 'Incorrect. Try again.'}')">\${opt}</button>\`).join('')}
      </div>
    </div>
  \`;
}
function initQuiz() {}

function renderPractice() { return '<h1>Practice Trading</h1><p class="mt-4">Demo placeholder for Virtual Trading.</p>'; }
function initPractice() {}


// ----- Phase 5: Assistant & Tour -----
function initGlobalComponents() {
  // Assistant
  const btn = document.createElement("button");
  btn.id = "ast-toggle-btn";
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  document.body.appendChild(btn);

  const widget = document.createElement("div");
  widget.id = "assistant-widget";
  widget.innerHTML = \`
    <div class="ast-header" id="ast-header"><span>VaultIQ Assistant</span><span>▼</span></div>
    <div class="ast-body" id="ast-body">
      <div class="chat-bubble chat-meera">Hi! I can help you understand the prototype. Try a suggestion below:</div>
    </div>
    <div class="ast-footer">
      <div class="chip" onclick="window.astAsk('What is my risk score?')">What is my risk score?</div>
      <div class="chip" onclick="window.astAsk('How does a SIP grow?')">How does a SIP grow?</div>
    </div>
  \`;
  document.body.appendChild(widget);

  let astOpen = false;
  btn.onclick = () => { astOpen = true; widget.classList.add('open'); btn.style.display = 'none'; };
  document.getElementById("ast-header").onclick = () => { astOpen = false; widget.classList.remove('open'); btn.style.display = 'flex'; };

  window.astAsk = (q) => {
    const body = document.getElementById("ast-body");
    body.innerHTML += \`<div class="chat-bubble chat-aarav">\${q}</div>\`;
    setTimeout(() => {
      let ans = "In this prototype, I am a simulated assistant. " + (q.includes("risk") ? "Your score is Moderate (58)." : "A SIP grows through compounding!");
      body.innerHTML += \`<div class="chat-bubble chat-meera">\${ans} <br><br><span style="font-size:10px; opacity:0.7">Educational, not investment advice.</span></div>\`;
      body.scrollTop = body.scrollHeight;
    }, 600);
  };
}

// SVG helper
function drawAreaChart(period, containerId) {
  const container = document.getElementById(containerId);
  if(!container) return;
  const data = window.AppData.chartSeries[period] || window.AppData.chartSeries["1Y"];
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  let points = "";
  const w = 100, h = 100;
  data.forEach((val, i) => { points += \`\${(i / (data.length - 1)) * w},\${h - ((val - min) / (max - min)) * h} \`; });
  const pathD = \`M \${points.trim().split(" ").join(" L ")}\`;
  container.innerHTML = \`<svg class="chart" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="chart-area" d="\${pathD} L 100 100 L 0 100 Z"></path><path class="chart-line" d="\${pathD}"></path></svg>\`;
}
`;

fs.writeFileSync('prototype/data.js', dataJsContent);
fs.appendFileSync('prototype/styles.css', stylesCssContent);
fs.writeFileSync('prototype/app.js', appJsContent);

console.log("Files generated successfully.");
