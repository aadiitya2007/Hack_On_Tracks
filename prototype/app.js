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
    "#/": renderLogin,
    "#/dashboard": renderDashboard,
    "#/accounts": renderAccounts,
    "#/risk": renderRisk
  };

  function router() {
    let path = window.location.hash || "#/";
    
    // Update nav active states
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === path);
    });

    // Render page
    content.innerHTML = '<div class="fade-in">Loading...</div>'; // Tiny skeleton flash
    
    setTimeout(() => {
      const renderFn = routes[path] || renderDashboard;
      content.innerHTML = `<div class="fade-in">${renderFn()}</div>`;
    }, 150); // 150ms structural transition
  }

  window.addEventListener("hashchange", router);
  router(); // Initial load
});

// Format helpers
function formatCurrency(num) {
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Pages
function renderLogin() {
  return `
    <div class="card" style="max-w: 400px; margin: 64px auto; text-align: center;">
      <h2 style="margin-bottom: 16px;">Welcome to VaultIQ</h2>
      <p style="color: var(--text-secondary); margin-bottom: 32px; font-size: 14px;">PROTOTYPE MODE - Simulated Demo</p>
      <button class="btn-primary" onclick="window.location.hash='#/dashboard'" style="width: 100%; justify-content: center;">Skip to Dashboard</button>
    </div>
  `;
}

function renderDashboard() {
  const p = window.AppData.portfolio;
  return `
    <h1 style="margin-bottom: 8px;">Dashboard</h1>
    <p style="color: var(--text-secondary); margin-bottom: 32px; font-size: 14px;">Last synced: ${window.AppData.user.lastSynced}</p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px;">
      <div class="card">
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Total Portfolio Value</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800;">${formatCurrency(p.totalValue)}</div>
      </div>
      <div class="card">
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Today's Gain</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800; color: var(--color-gain);">▲ ${formatCurrency(p.todayChange)}</div>
      </div>
      <div class="card">
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Overall P&L</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800; color: var(--color-gain);">▲ ${formatCurrency(p.overallChange)} (${p.overallChangePct}%)</div>
      </div>
    </div>
  `;
}

function renderAccounts() {
  return `<h1>Accounts</h1><p style="margin-top: 16px; color: var(--text-secondary);">Phase 2</p>`;
}

function renderRisk() {
  return `<h1>Risk Profile</h1><p style="margin-top: 16px; color: var(--text-secondary);">Phase 3</p>`;
}
