
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
        content.innerHTML = `<div class="fade-in">${renderLesson(id)}</div>`;
        initLesson(id);
      } else {
        const route = routes[path] || routes["#/dashboard"];
        content.innerHTML = `<div class="fade-in">${route.render()}</div>`;
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
  return `
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
          ${window.AppData.brokers.map(b => `<div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-color);"><div style="display:flex; align-items:center;"><div class="broker-chip" style="background-color: ${b.color}">${b.name.substring(0,2).toUpperCase()}</div><span>${b.name}</span></div></div>`).join('').replace(/border-bottom: 1px solid var\(--border-color\);$/, '')}
        </div>
        <button class="btn-primary" id="btn-s4" style="width: 100%; justify-content: center;">Connect Accounts</button>
      </div>
      <div id="step-3" class="wizard-step">
        <h2 style="margin-bottom: 8px; color: var(--color-gain);">Securely Connected</h2>
        <p style="color: var(--text-secondary); font-size: 14px;">Redirecting...</p>
      
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
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
      <div><h1 style="margin-bottom: 4px;">Unified Dashboard</h1><p style="color: var(--text-secondary); font-size: 13px;">Last synced: ${window.AppData.user.lastSynced}</p></div>
    </div>
    <div class="grid-3" style="margin-bottom:24px;">
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Total Value</div><div class="tabular-nums" style="font-size:24px;font-weight:800;">${formatCurrency(p.totalValue)}</div></div>
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Today's Gain</div><div class="tabular-nums" style="font-size:24px;font-weight:800;color:var(--color-gain);">▲ ${formatCurrency(p.todayChange)}</div></div>
      <div class="card p-5"><div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Overall P&L</div><div class="tabular-nums" style="font-size:24px;font-weight:800;color:var(--color-gain);">▲ ${formatCurrency(p.overallChange)} (${p.overallChangePct}%)</div></div>
    </div>
    <div class="card">
      <h3>Portfolio Growth</h3>
      <div class="chart-container" id="area-chart-box"></div>
    </div>
  `;
}

function initDashboard() {
  drawAreaChart("1Y", "area-chart-box"); drawDonutChart();
}

function renderAccounts() {
  return `<h1>Connected Accounts</h1><div class="grid-3 mt-4">${window.AppData.brokers.map(b => `<div class="card"><h3 style="display:flex;align-items:center;gap:8px;"><div class="broker-chip" style="background-color: ${b.color}">${b.name.substring(0,2).toUpperCase()}</div>${b.name}</h3><div style="margin-top:16px"><span class="badge ${b.connected?'source-api':'source-statement'}">${b.connected?'Live Connected':'Manual / Disconnected'}</span></div></div>`).join('')}</div>`;
}

// ----- Phase 3: Risk, Prediction, Time Machine -----
function renderRisk() {
  const r = window.AppData.riskProfile;
  return `
    <h1>Risk Profile</h1>
    <p style="color:var(--text-secondary); margin-bottom:24px;">Pre-decided demo data.</p>
    
    <div class="grid-2">
      <div class="card">
        <h3 style="color:var(--text-muted); font-size:12px; text-transform:uppercase;">Overall Score</h3>
        <div style="font-size:48px; font-weight:900;" id="risk-score">${r.score}<span style="font-size:16px;color:var(--text-muted);">/100</span></div>
        <div class="badge ${r.score > 60 ? 'badge-loss' : 'badge-gain'}" id="risk-cat">${r.category}</div>
      </div>
      <div class="card">
        <h3 style="margin-bottom: 16px;">What-If Simulator</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Shift <span id="shift-val">0</span>% from Stocks to Bonds</p>
        <input type="range" min="0" max="30" value="0" class="range-slider" id="risk-slider">
        <div class="grid-2" style="margin-top:24px;">
          <div><div style="font-size:11px;color:var(--text-muted);">New Volatility</div><div style="font-weight:700;" id="sim-vol">${(r.volatility*100).toFixed(1)}%</div></div>
          <div><div style="font-size:11px;color:var(--text-muted);">New Max Drawdown</div><div style="font-weight:700;" id="sim-dd">${(r.maxDrawdown*100).toFixed(1)}%</div></div>
        </div>
      </div>
    </div>
  `;
}

function initRisk() {
  const slider = document.getElementById("risk-slider");
  const r = window.AppData.riskProfile;
  slider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("shift-val").innerText = val;
    document.getElementById("risk-score").innerHTML = `${Math.round(r.score - val * 0.4)}<span style="font-size:16px;color:var(--text-muted);">/100</span>`;
    document.getElementById("sim-vol").innerText = (r.volatility*100 - val*0.15).toFixed(1) + "%";
    document.getElementById("sim-dd").innerText = (r.maxDrawdown*100 - val*0.2).toFixed(1) + "%";
  });
}

function renderPrediction() {
  const d = window.AppData.predictionData;
  return `
    <h1>Stock Insights (Prediction Demo)</h1>
    <p style="color:var(--text-secondary); margin-bottom:24px;">Illustrative sample results. Next-day direction is hard to predict.</p>
    <div class="grid-2">
      ${d.map(s => `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-weight:800;">${s.symbol}</h3>
            <span class="badge ${s.prob > 50 ? 'badge-gain':'badge-loss'}">${s.prob > 50 ? 'BULLISH' : 'BEARISH'} (${s.prob}%)</span>
          </div>
          <div style="margin-top:16px; font-size:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Model Accuracy</span><span>${s.accuracy}%</span></div>
            <div class="fi-bar-container"><div class="fi-bar" style="width:${s.accuracy}%;"></div></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTimeMachine() {
  return `
    <h1>Time Machine</h1>
    <div class="grid-2" style="margin-top:24px;">
      <div class="card">
        <label style="font-size:12px;font-weight:bold;">Asset</label>
        <select id="tm-asset" class="tm-select">
          ${window.AppData.timeMachineAssets.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
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
  `;
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
    series.forEach((v, i) => { pts += `${(i/(series.length-1))*100},${100 - ((v-min)/(max-min))*100} `; });
    document.getElementById("tm-chart").innerHTML = `<svg viewBox="0 0 100 100" class="chart" preserveAspectRatio="none"><path class="chart-line" d="M ${pts.trim().split(' ').join(' L ')}"></path></svg>`;
  };
}

// ----- Phase 4: Learn, Quiz -----
function renderExplore() { return '<h1>Explore Assets</h1><p class="mt-4">Demo placeholder for Explore grid.</p>'; }

function renderLearn() {
  return `
    <h1>Learn</h1>
    <div class="grid-2" style="margin-top:24px;">
      ${window.AppData.lessons.map(l => `
        <div class="card" style="cursor:pointer; transition: transform 0.2s;" onclick="window.location.hash='#/learn/${l.id}'" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
          <div style="font-size:32px; margin-bottom:12px;">${l.icon}</div>
          <h3>${l.title}</h3>
          <p style="font-size:13px;color:var(--text-secondary);">${l.subtitle}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderLesson(id) {
  const lesson = window.AppData.lessons.find(l => l.id === id);
  if(!lesson) return 'Lesson not found.';
  return `
    <button class="btn-ghost" style="margin-bottom:16px; border:none; padding:0;" onclick="window.location.hash='#/learn'">← Back to Learn</button>
    <h1>${lesson.title}</h1>
    <p style="color:var(--text-secondary); margin-bottom:32px;">${lesson.subtitle}</p>
    
    <div class="grid-2">
      <div class="chat-container" id="chat-box">
        <!-- Dialogue injected via initLesson -->
      </div>
      <div>
        ${lesson.content.map(c => {
          if(c.type === 'text') return `<p style="margin-bottom:16px;">${c.val}</p>`;
          if(c.type === 'takeaway') return `<div class="card" style="background:var(--brand-accent-bg); color:var(--brand-accent-text); border:none;"><strong>Takeaway:</strong> ${c.val}</div>`;
          return '';
        }).join('')}
      </div>
    </div>
  `;
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
    typing.className = `chat-bubble ${isMeera ? 'chat-meera':'chat-aarav'}`;
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
    
    setTimeout(() => {
      box.removeChild(typing);
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${isMeera ? 'chat-meera':'chat-aarav'}`;
      bubble.innerHTML = `<strong>${msg.sender}</strong><br>${msg.text}`;
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
  return `
    <h1>Knowledge Check</h1>
    <div class="card" style="margin-top:24px; max-width: 600px;">
      <h3 style="margin-bottom: 24px;">${q.q}</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${q.options.map((opt, i) => `<button class="btn-ghost" style="text-align:left; padding:16px;" onclick="alert('${i===q.ans ? 'Correct!' : 'Incorrect. Try again.'}')">${opt}</button>`).join('')}
      </div>
    </div>
  `;
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
  widget.innerHTML = `
    <div class="ast-header" id="ast-header"><span>VaultIQ Assistant</span><span>▼</span></div>
    <div class="ast-body" id="ast-body">
      <div class="chat-bubble chat-meera">Hi! I can help you understand the prototype. Try a suggestion below:</div>
    </div>
    <div class="ast-footer">
      <div class="chip" onclick="window.astAsk('What is my risk score?')">What is my risk score?</div>
      <div class="chip" onclick="window.astAsk('How does a SIP grow?')">How does a SIP grow?</div>
    </div>
  `;
  document.body.appendChild(widget);

  let astOpen = false;
  btn.onclick = () => { astOpen = true; widget.classList.add('open'); btn.style.display = 'none'; };
  document.getElementById("ast-header").onclick = () => { astOpen = false; widget.classList.remove('open'); btn.style.display = 'flex'; };

  window.astAsk = (q) => {
    const body = document.getElementById("ast-body");
    body.innerHTML += `<div class="chat-bubble chat-aarav">${q}</div>`;
    setTimeout(() => {
      let ans = "In this prototype, I am a simulated assistant. " + (q.includes("risk") ? "Your score is Moderate (58)." : "A SIP grows through compounding!");
      body.innerHTML += `<div class="chat-bubble chat-meera">${ans} <br><br><span style="font-size:10px; opacity:0.7">Educational, not investment advice.</span></div>`;
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
  data.forEach((val, i) => { points += `${(i / (data.length - 1)) * w},${h - ((val - min) / (max - min)) * h} `; });
  const pathD = `M ${points.trim().split(" ").join(" L ")}`;
  container.innerHTML = `<svg class="chart" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="chart-area" d="${pathD} L 100 100 L 0 100 Z"></path><path class="chart-line" d="${pathD}"></path></svg>`;
}

function drawDonutChart() {
  const container = document.getElementById("donut-chart-box");
  if(!container) return;
  const data = window.AppData.assetAllocation;
  const total = data.reduce((sum, a) => sum + a.value, 0);
  let cumulative = 0;
  let svgContent = "";
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
    const pathData = [`M ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`].join(' ');
    svgContent += `<path d="${pathData}" fill="none" stroke="${asset.color}" stroke-width="0.3" class="fade-in" style="animation-delay: ${cumulative*0.5}s"/>`;
  });
  container.innerHTML = `<svg viewBox="-1.2 -1.2 2.4 2.4" style="transform: rotate(-90deg); width: 100%; height: 100%;">${svgContent}</svg>`;
}
