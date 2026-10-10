document.addEventListener("DOMContentLoaded", () => {
  // Theme init
  const themeBtn = document.getElementById("theme-toggle");
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    themeBtn.innerHTML = isDark ? 
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' : 
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  
  themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme();
  });
  applyTheme();

  // Router
  const content = document.getElementById("app-content");
  
  const routes = {
    "#/": { render: renderLogin, init: initLogin },
    "#/dashboard": { render: renderDashboard, init: initDashboard },
    "#/accounts": { render: () => `<h1>Accounts</h1><p class="text-secondary mt-4">Phase 3</p>`, init: ()=>{} },
    "#/risk": { render: () => `<h1>Risk Profile</h1><p class="text-secondary mt-4">Phase 3</p>`, init: ()=>{} }
  };

  function router() {
    let path = window.location.hash || "#/";
    
    // Update nav active states
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === path);
    });

    content.innerHTML = '<div class="fade-in" style="opacity:0.5">Loading...</div>';
    
    setTimeout(() => {
      const route = routes[path] || routes["#/dashboard"];
      content.innerHTML = `<div class="fade-in">${route.render()}</div>`;
      if (route.init) route.init();
    }, 150);
  }

  window.addEventListener("hashchange", router);
  router(); // Initial load
});

// Format helpers
function formatCurrency(num) {
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatPct(num) {
  return (num > 0 ? "+" : "") + num.toFixed(2) + "%";
}

// ----------------------------------------------------
// LOGIN / ONBOARDING (Phase 2)
// ----------------------------------------------------
function renderLogin() {
  return `
    <div class="card wizard-card">
      <div class="progress-bar"><div class="progress-fill" id="wiz-progress" style="width: 20%"></div></div>
      
      <!-- Step 1 -->
      <div id="step-1" class="wizard-step active">
        <h2 style="margin-bottom: 8px;">Enter your PAN</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">To fetch your registered broker accounts</p>
        <input type="text" id="pan-input" class="input-field" placeholder="ABCDE1234F" style="text-transform: uppercase; text-align: center; font-size: 20px; letter-spacing: 2px;" maxlength="10">
        <button class="btn-primary" id="btn-s1" style="width: 100%; justify-content: center; margin-top: 8px;">Continue</button>
        <button class="btn-ghost" onclick="window.location.hash='#/dashboard'" style="width: 100%; justify-content: center; margin-top: 12px; border: none;">Skip to demo</button>
      </div>

      <!-- Step 2 -->
      <div id="step-2" class="wizard-step">
        <h2 style="margin-bottom: 8px;">Verify OTP</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">Enter any 6 digits sent to your Aadhaar linked mobile</p>
        <input type="text" class="input-field tabular-nums" placeholder="------" style="text-align: center; font-size: 24px; letter-spacing: 8px;" maxlength="6">
        <p id="otp-timer" style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Resend in 30s</p>
        <button class="btn-primary" id="btn-s2" style="width: 100%; justify-content: center;">Verify</button>
      </div>

      <!-- Step 3 -->
      <div id="step-3" class="wizard-step">
        <h2 style="margin-bottom: 8px;">Aadhaar Consent</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">Allow VaultIQ to access your financial registry</p>
        <label class="checkbox-label">
          <input type="checkbox" id="chk-consent">
          <span>I authorize VaultIQ to fetch my account statements via Account Aggregator. We never store your Aadhaar number.</span>
        </label>
        <button class="btn-primary" id="btn-s3" style="width: 100%; justify-content: center;" disabled>I Agree</button>
      </div>

      <!-- Step 4 -->
      <div id="step-4" class="wizard-step">
        <h2 style="margin-bottom: 8px;">Accounts Found</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">We found these accounts linked to your PAN</p>
        <div style="text-align: left; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px;">
          ${window.AppData.brokers.map(b => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center;">
                <div class="broker-chip" style="background-color: ${b.color}">${b.name.substring(0,2).toUpperCase()}</div>
                <span style="font-size: 14px; font-weight: 500;">${b.name}</span>
              </div>
              <span class="badge ${b.connected ? 'source-api' : 'source-statement'}">${b.connected ? 'Ready' : 'Manual'}</span>
            </div>
          `).join('').replace(/border-bottom: 1px solid var\(--border-color\);$/, '')}
        </div>
        <button class="btn-primary" id="btn-s4" style="width: 100%; justify-content: center;">Connect Accounts</button>
      </div>

      <!-- Step 5 -->
      <div id="step-5" class="wizard-step">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-gain-bg); color: var(--color-gain); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 style="margin-bottom: 8px; color: var(--color-gain);">Securely Connected</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">Redirecting to your unified dashboard...</p>
      </div>
    </div>
  `;
}

function initLogin() {
  const s1 = document.getElementById("step-1");
  const s2 = document.getElementById("step-2");
  const s3 = document.getElementById("step-3");
  const s4 = document.getElementById("step-4");
  const s5 = document.getElementById("step-5");
  const bar = document.getElementById("wiz-progress");

  let timer;

  document.getElementById("btn-s1").onclick = () => {
    s1.classList.remove("active"); s2.classList.add("active"); bar.style.width = "40%";
    let time = 30;
    timer = setInterval(() => {
      time--;
      document.getElementById("otp-timer").innerText = `Resend in ${time}s`;
      if(time <= 0) clearInterval(timer);
    }, 1000);
  };
  document.getElementById("btn-s2").onclick = () => {
    clearInterval(timer);
    s2.classList.remove("active"); s3.classList.add("active"); bar.style.width = "60%";
  };
  
  const chk = document.getElementById("chk-consent");
  const btn3 = document.getElementById("btn-s3");
  chk.onchange = () => { btn3.disabled = !chk.checked; };
  
  btn3.onclick = () => {
    s3.classList.remove("active"); s4.classList.add("active"); bar.style.width = "80%";
  };
  document.getElementById("btn-s4").onclick = () => {
    s4.classList.remove("active"); s5.classList.add("active"); bar.style.width = "100%";
    setTimeout(() => { window.location.hash = "#/dashboard"; }, 1500);
  };
}

// ----------------------------------------------------
// DASHBOARD (Phase 2)
// ----------------------------------------------------
function renderDashboard() {
  const p = window.AppData.portfolio;
  
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
      <div>
        <h1 style="margin-bottom: 4px;">Unified Dashboard</h1>
        <p style="color: var(--text-secondary); font-size: 13px;">Last synced: <span id="sync-time">${window.AppData.user.lastSynced}</span></p>
      </div>
      <button class="btn-primary" id="btn-simulate-trade" style="background-color: var(--color-stocks);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Simulate Trade
      </button>
    </div>
    
    <div class="dashboard-grid">
      <!-- Left Col -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Top Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="card" style="padding: 20px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Total Value</div>
            <div id="tot-val" class="tabular-nums" style="font-size: 24px; font-weight: 800;">${formatCurrency(p.totalValue)}</div>
          </div>
          <div class="card" style="padding: 20px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Today's Gain</div>
            <div id="tot-today" class="tabular-nums" style="font-size: 24px; font-weight: 800; color: var(--color-gain);">▲ ${formatCurrency(p.todayChange)}</div>
          </div>
          <div class="card" style="padding: 20px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Overall P&L</div>
            <div id="tot-overall" class="tabular-nums" style="font-size: 24px; font-weight: 800; color: var(--color-gain);">▲ ${formatCurrency(p.overallChange)} <span style="font-size: 14px">(${p.overallChangePct}%)</span></div>
          </div>
        </div>

        <!-- Area Chart -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 15px;">Portfolio Growth</h3>
            <div class="tabs" id="chart-tabs" style="margin-bottom: 0; border: none; padding: 0;">
              <button class="tab" data-period="1M">1M</button>
              <button class="tab" data-period="6M">6M</button>
              <button class="tab active" data-period="1Y">1Y</button>
              <button class="tab" data-period="ALL">All</button>
            </div>
          </div>
          <div class="chart-container" id="area-chart-box"></div>
        </div>

        <!-- Alert -->
        <div class="alert-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div><strong>Duplicate Holding Detected:</strong> RELIANCE is held in both Zerodha and Groww.</div>
        </div>

        <!-- Holdings Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <table class="data-table" id="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th class="right-align">Qty</th>
                <th class="right-align">Avg Price</th>
                <th class="right-align">LTP</th>
                <th class="right-align">P&L</th>
                <th style="text-align: center;">Source</th>
              </tr>
            </thead>
            <tbody>
              ${renderHoldingsRows(window.AppData.holdings)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Col -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card">
          <h3 style="font-size: 15px; margin-bottom: 24px;">Asset Allocation</h3>
          <div class="chart-container" id="donut-chart-box" style="height: 180px; margin-bottom: 24px;"></div>
          <div>
            ${window.AppData.assetAllocation.map(a => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 10px; height: 10px; border-radius: 2px; background: ${a.color}"></div>
                  <span style="color: var(--text-secondary);">${a.name}</span>
                </div>
                <strong class="tabular-nums">${formatCurrency(a.value)}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHoldingsRows(holdings) {
  return holdings.map(h => {
    const brokerColor = window.AppData.brokers.find(b => b.name === h.broker)?.color || '#333';
    const pl = (h.ltp - h.avgPrice) * h.quantity;
    const plPct = ((h.ltp - h.avgPrice) / h.avgPrice) * 100;
    const isGain = pl >= 0;
    const plClass = isGain ? 'text-gain' : 'text-loss';
    
    let sourceClass = 'source-api';
    if(h.source === 'Statement') sourceClass = 'source-statement';
    if(h.source === 'Mail Sync') sourceClass = 'source-mail';

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center;">
            <div class="broker-chip" title="${h.broker}" style="background-color: ${brokerColor}">${h.broker.substring(0,2).toUpperCase()}</div>
            <div>
              <div style="font-weight: 700;">${h.symbol}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${h.name}</div>
            </div>
          </div>
        </td>
        <td class="right-align tabular-nums">${h.quantity}</td>
        <td class="right-align tabular-nums">${h.avgPrice.toFixed(2)}</td>
        <td class="right-align tabular-nums">${h.ltp.toFixed(2)}</td>
        <td class="right-align tabular-nums">
          <div style="color: var(--color-${isGain?'gain':'loss'}); font-weight: 600;">${isGain?'▲':'▼'} ${formatCurrency(Math.abs(pl))}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${formatPct(plPct)}</div>
        </td>
        <td style="text-align: center;"><span class="badge ${sourceClass}">${h.source}</span></td>
      </tr>
    `;
  }).join('');
}

function initDashboard() {
  drawAreaChart("1Y");
  drawDonutChart();

  // Tabs logic
  document.querySelectorAll("#chart-tabs .tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll("#chart-tabs .tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      drawAreaChart(e.target.dataset.period);
    });
  });

  // Simulate Trade Logic
  const btnSimulate = document.getElementById("btn-simulate-trade");
  let simulated = 0;
  btnSimulate.addEventListener("click", () => {
    if (simulated >= 3) { alert("Maximum demo trades simulated."); return; }
    
    // 1. Add mock holding
    const tbody = document.querySelector("#holdings-table tbody");
    const mockRowData = { id: 99+simulated, symbol: "ITC", name: "ITC Limited", assetClass: "Stocks", broker: "Upstox", quantity: 100, avgPrice: 420.00, ltp: 450.50, source: "Live API" };
    window.AppData.holdings.push(mockRowData);
    
    const tr = document.createElement("tr");
    tr.className = "new-row";
    tr.innerHTML = renderHoldingsRows([mockRowData]);
    tbody.prepend(tr);
    
    // 2. Update totals with animation (Count up mock)
    const newTotal = window.AppData.portfolio.totalValue + (100 * 450.50);
    const el = document.getElementById("tot-val");
    el.classList.add("flash-up");
    el.innerText = formatCurrency(newTotal);
    window.AppData.portfolio.totalValue = newTotal;

    // 3. Update Sync time
    const d = new Date();
    document.getElementById("sync-time").innerText = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + " (Just now)";

    simulated++;
    setTimeout(() => el.classList.remove("flash-up"), 500);
  });
}

// ----------------------------------------------------
// SVG CHART UTILS (Phase 2)
// ----------------------------------------------------
function drawAreaChart(period) {
  const container = document.getElementById("area-chart-box");
  const data = window.AppData.chartSeries[period];
  
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  
  // Create path
  let points = "";
  const w = 100, h = 100;
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((val - min) / (max - min)) * h;
    points += `${x},${y} `;
  });

  const pathD = `M ${points.trim().split(" ").join(" L ")}`;
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  container.innerHTML = `
    <svg class="chart" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="chart-area" d="${areaD}"></path>
      <path class="chart-line" d="${pathD}"></path>
    </svg>
  `;
}

function drawDonutChart() {
  const container = document.getElementById("donut-chart-box");
  const data = window.AppData.assetAllocation;
  
  const total = data.reduce((sum, a) => sum + a.value, 0);
  let cumulative = 0;
  
  let svgContent = "";
  
  // Math for SVG arcs
  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  data.forEach((asset) => {
    const pct = asset.value / total;
    const startX = getCoordinatesForPercent(cumulative)[0];
    const startY = getCoordinatesForPercent(cumulative)[1];
    
    cumulative += pct;
    const endX = getCoordinatesForPercent(cumulative)[0];
    const endY = getCoordinatesForPercent(cumulative)[1];
    
    const largeArcFlag = pct > 0.5 ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`
    ].join(' ');

    svgContent += `<path d="${pathData}" fill="none" stroke="${asset.color}" stroke-width="0.3" class="fade-in" style="animation-delay: ${cumulative*0.5}s"/>`;
  });

  container.innerHTML = `
    <svg viewBox="-1.2 -1.2 2.4 2.4" style="transform: rotate(-90deg); width: 100%; height: 100%;">
      ${svgContent}
    </svg>
  `;
}
