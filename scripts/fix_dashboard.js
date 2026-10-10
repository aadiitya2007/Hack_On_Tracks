const fs = require('fs');
let code = fs.readFileSync('prototype/app.js', 'utf8');

const donutChartCode = `
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
    const pathData = [\`M \${startX} \${startY}\`, \`A 1 1 0 \${largeArcFlag} 1 \${endX} \${endY}\`].join(' ');
    svgContent += \`<path d="\${pathData}" fill="none" stroke="\${asset.color}" stroke-width="0.3" class="fade-in" style="animation-delay: \${cumulative*0.5}s"/>\`;
  });
  container.innerHTML = \`<svg viewBox="-1.2 -1.2 2.4 2.4" style="transform: rotate(-90deg); width: 100%; height: 100%;">\${svgContent}</svg>\`;
}
`;

// Insert the donut chart code at the end
code += donutChartCode;

// Fix renderDashboard to include Right Col (Donut Chart)
const rightColHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card">
          <h3 style="font-size: 15px; margin-bottom: 24px;">Asset Allocation</h3>
          <div class="chart-container" id="donut-chart-box" style="height: 180px; margin-bottom: 24px;"></div>
          <div>
            \${window.AppData.assetAllocation.map(a => \`
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 10px; height: 10px; border-radius: 2px; background: \${a.color}"></div>
                  <span style="color: var(--text-secondary);">\${a.name}</span>
                </div>
                <strong class="tabular-nums">\${formatCurrency(a.value)}</strong>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>
    </div>
  \`;
`;

code = code.replace(/<\/div>\s*<\/div>\s*`;\s*}/, rightColHTML + '}');
code = code.replace(/drawAreaChart\("1Y", "area-chart-box"\);/, 'drawAreaChart("1Y", "area-chart-box"); drawDonutChart();');

fs.writeFileSync('prototype/app.js', code);
