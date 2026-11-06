/* ==========================================================================
   DINESH CHITTINEDI - PORTFOLIO INTERACTIVITY & LIVE LAB
   Modern Web Development & Data Analytics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Brand SVGs for icons
  const BRAND_SVGS = {
    github: `<svg class="btn-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    linkedin: `<svg class="btn-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24"/></svg>`
  };

  function renderBrandLogos(root = document) {
    root.querySelectorAll('i[data-lucide="github"]').forEach(el => {
      const span = document.createElement('span');
      span.innerHTML = BRAND_SVGS.github;
      el.replaceWith(span.firstElementChild);
    });
    root.querySelectorAll('i[data-lucide="linkedin"]').forEach(el => {
      const span = document.createElement('span');
      span.innerHTML = BRAND_SVGS.linkedin;
      el.replaceWith(span.firstElementChild);
    });
  }

  renderBrandLogos(document);

  if (window.lucide) {
    lucide.createIcons();
  }

  // -------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light)
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateChartColors(newTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Palette Accent Switcher
  // -------------------------------------------------------------------------
  const paletteButtons = document.querySelectorAll('[data-palette-choice]');
  const savedPalette = localStorage.getItem('palette') || 'lime';
  htmlRoot.setAttribute('data-palette', savedPalette);

  function syncPaletteButtons(activePalette) {
    paletteButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-palette-choice') === activePalette);
    });
  }

  syncPaletteButtons(savedPalette);

  paletteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-palette-choice');
      htmlRoot.setAttribute('data-palette', choice);
      localStorage.setItem('palette', choice);
      syncPaletteButtons(choice);

      if (typeof currentScenarioKey !== 'undefined' && currentScenarioKey) {
        initChart(currentScenarioKey);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. Hero Workstation Tabs & Interactive Component
  // -------------------------------------------------------------------------
  const heroTabBtns = document.querySelectorAll('.terminal-tab-btn');
  const heroBadge = document.getElementById('heroTabBadge');
  const heroBodies = {
    component: document.getElementById('heroTabBodyComponent'),
    sql: document.getElementById('heroTabBodySql'),
    telemetry: document.getElementById('heroTabBodyTelemetry')
  };

  heroTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      heroTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-hero-tab');
      Object.keys(heroBodies).forEach(k => {
        if (heroBodies[k]) {
          heroBodies[k].style.display = k === targetTab ? 'block' : 'none';
        }
      });

      if (heroBadge) {
        if (targetTab === 'component') heroBadge.textContent = 'LIVE STATE';
        else if (targetTab === 'sql') heroBadge.textContent = 'SQL ENGINE';
        else if (targetTab === 'telemetry') heroBadge.textContent = 'TELEMETRY';
      }
    });
  });

  // Interactive Hospital Dept Capacity Toggle
  const deptData = {
    icu: { beds: "17 / 40", pct: "42.5%", lat: "3.8 ms", status: "Optimal Load" },
    cardiology: { beds: "38 / 50", pct: "76.0%", lat: "4.1 ms", status: "Elevated Flow" },
    surgery: { beds: "48 / 60", pct: "80.0%", lat: "4.5 ms", status: "High Demand" },
    ortho: { beds: "23 / 70", pct: "32.8%", lat: "3.2 ms", status: "Surplus Capacity" }
  };

  const hicBedsVal = document.getElementById('hicBedsVal');
  const hicOccupancyVal = document.getElementById('hicOccupancyVal');
  const hicLatencyVal = document.getElementById('hicLatencyVal');
  const hicStatusText = document.getElementById('hicStatusText');
  const hicProgressFill = document.getElementById('hicProgressFill');
  const deptBtns = document.querySelectorAll('.hic-dept-btn');

  deptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const dept = btn.getAttribute('data-dept');
      const d = deptData[dept];
      if (d) {
        if (hicBedsVal) hicBedsVal.textContent = d.beds;
        if (hicOccupancyVal) hicOccupancyVal.textContent = d.pct;
        if (hicLatencyVal) hicLatencyVal.textContent = d.lat;
        if (hicStatusText) hicStatusText.textContent = d.status;
        if (hicProgressFill) hicProgressFill.style.width = d.pct;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Mobile Menu Drawer
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  function updateMobileMenuIcon(isOpen) {
    if (!mobileMenuBtn) return;
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenuBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) {
      lucide.createIcons({ root: mobileMenuBtn });
    }
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.style.display === 'block';
      mobileDrawer.style.display = isOpen ? 'none' : 'block';
      updateMobileMenuIcon(!isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
        updateMobileMenuIcon(false);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Project Filter Tabs
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const category = card.getAttribute('data-category') || '';
          if (category.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. Toast Notification & Copy Helpers
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg = 'Copied to clipboard!') {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(successMsg))
        .catch(() => fallbackCopyText(text, successMsg));
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) showToast(successMsg);
      else showToast(text);
    } catch (err) {
      showToast(text);
    }
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyTextToClipboard('dinesh435ch@gmail.com', 'Email copied: dinesh435ch@gmail.com');
    });
  }

  // -------------------------------------------------------------------------
  // 7. Live Data Lab & Interactive Visualizer
  // -------------------------------------------------------------------------
  const scenarios = {
    alos: {
      title: "Hospital Average Length of Stay (ALOS) by Department",
      subtitle: "SQL CTE & window metrics across 10,000+ inpatient admissions.",
      badgeLabel: "Highest ALOS",
      badgeVal: "ICU: 7.4 Days",
      lang: "SQL (PostgreSQL / MySQL)",
      code: `-- Department Capacity & ALOS Query
WITH DeptSummary AS (
  SELECT 
    department,
    COUNT(patient_id) AS total_admissions,
    ROUND(AVG(DATEDIFF(discharge_date, admission_date)), 1) AS alos_days,
    ROUND(SUM(CASE WHEN discharge_date IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS current_occupancy_pct
  FROM healthcare_records
  WHERE admission_date >= '2025-01-01'
  GROUP BY department
)
SELECT 
  department,
  total_admissions,
  alos_days,
  current_occupancy_pct,
  DENSE_RANK() OVER (ORDER BY alos_days DESC) AS alos_rank
FROM DeptSummary
ORDER BY alos_days DESC;`,
      headers: ["Department", "Admissions", "ALOS (Days)", "Bed Occupancy", "Status"],
      rows: [
        ["Intensive Care Unit (ICU)", "1,240", "7.4", "94.2%", "Critical Load"],
        ["Surgery & Post-Op", "2,180", "5.8", "86.5%", "High Demand"],
        ["Cardiology", "1,890", "4.6", "78.0%", "Stable"],
        ["Orthopedics", "1,650", "3.9", "72.4%", "Optimal"],
        ["Pediatrics", "1,420", "2.8", "65.1%", "Capacity Surplus"],
        ["General Medicine", "2,840", "3.2", "81.0%", "Balanced"]
      ],
      chartType: 'bar',
      chartData: {
        labels: ['ICU', 'Surgery', 'Cardiology', 'Orthopedics', 'Pediatrics', 'General Med'],
        datasets: [{
          label: 'ALOS (Days)',
          data: [7.4, 5.8, 4.6, 3.9, 2.8, 3.2],
          backgroundColor: '#38bdf8',
          borderRadius: 8
        }]
      }
    },

    insurance: {
      title: "Actuarial Claims: Smoker vs Non-Smoker Demographics",
      subtitle: "Calculated claim variance across 1,300+ policy records in Excel.",
      badgeLabel: "Claim Variance",
      badgeVal: "+280% for Smokers",
      lang: "Excel Dynamic Formulas & DAX",
      code: `// Excel Dynamic Matrix Formula for Smoker vs Non-Smoker Variance
=LET(
    smoker_avg, AVERAGEIFS(tbl_claims[charges], tbl_claims[smoker], "yes"),
    nonsmoker_avg, AVERAGEIFS(tbl_claims[charges], tbl_claims[smoker], "no"),
    variance_pct, (smoker_avg - nonsmoker_avg) / nonsmoker_avg,
    variance_pct
)

// DAX Metric for Power BI Data Model:
Claim Variance % = 
VAR SmokerClaims = CALCULATE(AVERAGE(Claims[Charges]), Claims[Smoker] = "Yes")
VAR NonSmokerClaims = CALCULATE(AVERAGE(Claims[Charges]), Claims[Smoker] = "No")
RETURN
DIVIDE(SmokerClaims - NonSmokerClaims, NonSmokerClaims, 0)`,
      headers: ["Risk Cohort", "Sample Size", "Avg BMI", "Avg Annual Claim", "Risk Multiplier"],
      rows: [
        ["Smokers (Age 18-35)", "142", "29.8", "$24,560", "3.1x Baseline"],
        ["Smokers (Age 36-50)", "98", "31.2", "$34,820", "3.8x Baseline"],
        ["Smokers (Age 51-64)", "85", "32.6", "$41,200", "4.2x Baseline"],
        ["Non-Smokers (Age 18-35)", "380", "28.4", "$7,820", "1.0x Baseline"],
        ["Non-Smokers (Age 36-50)", "340", "29.1", "$9,150", "1.1x Baseline"],
        ["Non-Smokers (Age 51-64)", "255", "30.4", "$12,400", "1.4x Baseline"]
      ],
      chartType: 'bar',
      chartData: {
        labels: ['18-35 Smokers', '18-35 Non-Smokers', '36-50 Smokers', '36-50 Non-Smokers', '51-64 Smokers', '51-64 Non-Smokers'],
        datasets: [{
          label: 'Avg Annual Claim ($ USD)',
          data: [24560, 7820, 34820, 9150, 41200, 12400],
          backgroundColor: ['#f43f5e', '#10b981', '#f43f5e', '#10b981', '#f43f5e', '#10b981'],
          borderRadius: 8
        }]
      }
    },

    smartphone: {
      title: "Smartphone Market: Price Elasticity Across RAM Capacities",
      subtitle: "Pandas multivariate data cleaning across 1,500+ device specs.",
      badgeLabel: "Primary Driver",
      badgeVal: "RAM (r = 0.82)",
      lang: "Python (Pandas & Seaborn)",
      code: `import pandas as pd
import numpy as np

# Load and clean multi-source device specifications
df = pd.read_csv('smartphones_raw.csv')

# Clean INR currency column (remove symbols, commas, cast to int)
df['price_clean'] = (
    df['price']
    .astype(str)
    .str.replace(r'[₹,]', '', regex=True)
    .str.strip()
    .astype(float)
)

# Extract numeric RAM capacity in GB
df['ram_gb'] = df['specs'].str.extract(r'(\d+)\s*GB\s*RAM').astype(float)

# Calculate median price & IQR dispersion per RAM tier
summary = df.groupby('ram_gb')['price_clean'].agg(
    median_price='median',
    p25=lambda x: np.percentile(x, 25),
    p75=lambda x: np.percentile(x, 75)
).reset_index()

print(summary)`,
      headers: ["RAM Tier", "Device Models", "Median Price (₹)", "Price Range (IQR)", "Correlation"],
      rows: [
        ["4 GB", "312", "₹11,499", "₹9,999 - ₹13,499", "Baseline"],
        ["6 GB", "428", "₹16,999", "₹14,999 - ₹19,999", "r = 0.64"],
        ["8 GB", "510", "₹24,999", "₹21,999 - ₹29,999", "r = 0.82"],
        ["12 GB", "215", "₹42,999", "₹36,999 - ₹54,999", "r = 0.89"],
        ["16 GB+", "45", "₹72,499", "₹64,999 - ₹89,999", "r = 0.94"]
      ],
      chartType: 'bar',
      chartData: {
        labels: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB+'],
        datasets: [{
          label: 'Median Retail Price (₹ INR)',
          data: [11499, 16999, 24999, 42999, 72499],
          backgroundColor: '#38bdf8',
          borderRadius: 8
        }]
      }
    },

    coffee: {
      title: "Coffee Chain: Hourly Transaction Velocity & Revenue Peaks",
      subtitle: "Star-schema transactional modeling across 50,000+ point-of-sale entries.",
      badgeLabel: "Peak Hour",
      badgeVal: "8:00 AM - 10:00 AM",
      lang: "Power BI DAX & M Code",
      code: `// DAX Measure: Hourly Revenue Velocity
Hourly Sales Velocity = 
VAR CurrentHour = SELECTEDVALUE(DimTime[Hour])
VAR TotalHourlyRev = CALCULATE(
    SUM(FactSales[TotalAmount]),
    FILTER(FactSales, RELATED(DimTime[Hour]) = CurrentHour)
)
RETURN TotalHourlyRev

// Peak Inflow % Index
Hourly Share % = 
DIVIDE(
    [Hourly Sales Velocity],
    CALCULATE(SUM(FactSales[TotalAmount]), ALL(DimTime[Hour])),
    0
)`,
      headers: ["Time Window", "Hourly Trans", "Avg Basket Size", "Revenue Share", "Staffing Rec"],
      rows: [
        ["06:00 - 08:00", "420", "$4.80", "8.2%", "2 Baristas"],
        ["08:00 - 10:00 (Rush)", "1,450", "$6.40", "32.6%", "5 Baristas (Peak)"],
        ["10:00 - 12:00", "890", "$5.90", "18.4%", "3 Baristas"],
        ["12:00 - 14:00 (Lunch)", "980", "$8.20", "22.1%", "4 Baristas"],
        ["14:00 - 17:00", "560", "$5.10", "12.5%", "2 Baristas"],
        ["17:00 - 20:00", "310", "$4.60", "6.2%", "2 Baristas"]
      ],
      chartType: 'bar',
      chartData: {
        labels: ['6-8 AM', '8-10 AM (Peak)', '10-12 PM', '12-2 PM (Lunch)', '2-5 PM', '5-8 PM'],
        datasets: [{
          label: 'Revenue Share (%)',
          data: [8.2, 32.6, 18.4, 22.1, 12.5, 6.2],
          backgroundColor: '#38bdf8',
          borderRadius: 8
        }]
      }
    }
  };

  let chartInstance = null;
  let currentScenarioKey = 'alos';

  function initChart(scenarioKey) {
    const ctx = document.getElementById('liveChart');
    if (!ctx) return;

    const data = scenarios[scenarioKey];
    if (!data) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    const activePalette = htmlRoot.getAttribute('data-palette') || 'lime';
    const accentColors = {
      lime: '#38bdf8',
      coral: '#10b981',
      purple: '#c084fc'
    };
    const currentAccent = accentColors[activePalette] || '#38bdf8';

    const clonedChartData = JSON.parse(JSON.stringify(data.chartData));
    clonedChartData.datasets.forEach(ds => {
      if (typeof ds.backgroundColor === 'string') {
        ds.backgroundColor = currentAccent;
      }
    });

    chartInstance = new Chart(ctx, {
      type: data.chartType,
      data: clonedChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: textColor, font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: isDark ? '#0a0f1d' : '#ffffff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#334155',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            bodyFont: { family: 'JetBrains Mono', size: 12 }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  function updateChartColors(theme) {
    if (!chartInstance) return;
    const isDark = theme !== 'light';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    if (chartInstance.options.scales.x) {
      chartInstance.options.scales.x.grid.color = gridColor;
      chartInstance.options.scales.x.ticks.color = textColor;
    }
    if (chartInstance.options.scales.y) {
      chartInstance.options.scales.y.grid.color = gridColor;
      chartInstance.options.scales.y.ticks.color = textColor;
    }
    chartInstance.update();
  }

  function renderScenario(key) {
    const sc = scenarios[key];
    if (!sc) return;

    currentScenarioKey = key;

    const vizTitle = document.getElementById('vizTitle');
    const vizSubtitle = document.getElementById('vizSubtitle');
    const vizBadgeLabel = document.querySelector('.viz-badge-label');
    const vizStatVal = document.getElementById('vizStatVal');

    if (vizTitle) vizTitle.textContent = sc.title;
    if (vizSubtitle) vizSubtitle.textContent = sc.subtitle;
    if (vizBadgeLabel) vizBadgeLabel.textContent = sc.badgeLabel;
    if (vizStatVal) vizStatVal.textContent = sc.badgeVal;

    const codeLangLabel = document.getElementById('codeLangLabel');
    const codeSnippetText = document.getElementById('codeSnippetText');
    if (codeLangLabel) codeLangLabel.textContent = sc.lang;
    if (codeSnippetText) codeSnippetText.textContent = sc.code;

    const thead = document.getElementById('summaryTableHead');
    const tbody = document.getElementById('summaryTableBody');
    if (thead) thead.innerHTML = `<tr>${sc.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    if (tbody) tbody.innerHTML = sc.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');

    initChart(key);
  }

  const queryBtns = document.querySelectorAll('.query-btn');
  queryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      queryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scKey = btn.getAttribute('data-scenario');
      renderScenario(scKey);
    });
  });

  // Lab Tab Controls
  const labTabs = document.querySelectorAll('.lab-tab');
  const tabPanes = {
    viz: document.getElementById('pane-viz'),
    code: document.getElementById('pane-code'),
    data: document.getElementById('pane-data')
  };

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      labTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) tabPanes[k].classList.remove('active');
      });
      if (tabPanes[target]) {
        tabPanes[target].classList.add('active');
      }
    });
  });

  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const code = document.getElementById('codeSnippetText').textContent;
      copyTextToClipboard(code, 'Code snippet copied to clipboard!');
    });
  }

  renderScenario('alos');

  // -------------------------------------------------------------------------
  // 8. Case Study Deep Dive Modal Data & Logic
  // -------------------------------------------------------------------------
  const caseStudies = {
    hospitalUI: {
      category: "React.js • SQL • CSS3",
      tagClass: "react-pill",
      title: "Hospital Records & Patient Management Interface",
      github: "https://github.com/dinesh-ch3/hospital-management-ui",
      demo: "hospital-management-ui/",
      overview: "Production administrative healthcare dashboard engineered with React.js and structured relational MySQL queries. Designed to manage 10,000+ patient records with dynamic client-side pagination, multi-criteria filtering, debounced live search, real-time departmental bed occupancy tracking, and zero external CSS libraries.",
      problem: "Healthcare operators frequently deal with bulky client-side datasets exceeding 10,000 records. Off-the-shelf UI component libraries add significant runtime bundle overhead, while unoptimized filtering and relational queries cause UI lag and degraded frame rates.",
      approach: [
        "Engineered an administrative dashboard to manage 10,000+ patient records with dynamic client-side pagination, multi-criteria filtering, and live search.",
        "Integrated structured relational SQL queries to track patient admissions, departmental bed occupancy, and visit timelines with low query latency (< 5ms).",
        "Constructed reusable table, modal, and alert components with zero external CSS libraries, reducing runtime stylesheet overhead."
      ],
      metrics: [
        { num: "10,000+", desc: "Patient records managed with client-side indexing" },
        { num: "< 5 ms", desc: "Relational SQL query execution latency" },
        { num: "0 KB", desc: "External CSS library overhead (100% pure CSS3)" }
      ],
      snippetTitle: "Departmental Bed Occupancy SQL Analytics & Relational Tracking",
      snippet: `-- Track bed occupancy and capacity utilization across clinical departments
SELECT 
    d.name AS Department,
    d.total_beds AS Total_Beds,
    COUNT(CASE WHEN a.status IN ('Admitted', 'ICU Care') THEN 1 END) AS Occupied_Beds,
    (d.total_beds - COUNT(CASE WHEN a.status IN ('Admitted', 'ICU Care') THEN 1 END)) AS Available_Beds,
    ROUND(
        (COUNT(CASE WHEN a.status IN ('Admitted', 'ICU Care') THEN 1 END) * 100.0) / d.total_beds, 
        1
    ) AS Occupancy_Rate_Pct
FROM departments d
LEFT JOIN admissions a ON d.dept_id = a.dept_id
GROUP BY d.dept_id, d.name, d.total_beds
ORDER BY Occupancy_Rate_Pct DESC;`
    },

    hospital: {
      category: "SQL & Power BI",
      tagClass: "sql-pill",
      title: "Hospital Patient Admissions & Operational Performance Intelligence",
      github: "https://github.com/dinesh-ch3/sql-project",
      overview: "Clinical performance audit across 10,000+ patient records. The hospital network faced capacity bottlenecks, prolonged lengths of stay (ALOS) in critical wards, and uncoordinated weekend discharges. The objective was to build a clean relational data model and executive dashboard to guide hospital bed allocation.",
      problem: "Disparate healthcare logs contained duplicated patient entries, inconsistent timestamp formats, doctor name anomalies, and missing discharge statuses that inflated bed occupancy calculations by ~14%.",
      approach: [
        "Ingested raw clinical datasets into MySQL, executing normalization passes to remove suffixes, null names, and anomalous dates.",
        "Authored Common Table Expressions (CTEs) and Window Functions to compute admission volumes, Average Length of Stay (ALOS), and multi-department flow rates.",
        "Integrated the cleaned SQL view directly into Power BI, formulating DAX measures for bed occupancy turnover and predictive admission spike alerts."
      ],
      metrics: [
        { num: "10,000+", desc: "Inpatient records cleaned and modeled" },
        { num: "14%", desc: "Data redundancy eliminated via SQL CTEs" },
        { num: "4.8 Days", desc: "Average Length of Stay (ALOS) baseline established" }
      ],
      snippetTitle: "SQL Normalization & Deduplication Logic",
      snippet: `-- Deduplicate patient records based on discharge chronology
WITH RankedDischarges AS (
  SELECT 
    patient_id,
    name,
    admission_date,
    discharge_date,
    department,
    doctor,
    ROW_NUMBER() OVER(
      PARTITION BY name, admission_date 
      ORDER BY discharge_date DESC
    ) as row_num
  FROM healthcare_dataset
  WHERE name IS NOT NULL
)
DELETE FROM healthcare_dataset
WHERE patient_id IN (
  SELECT patient_id FROM RankedDischarges WHERE row_num > 1
);`
    },

    smartphone: {
      category: "Python & Pandas",
      tagClass: "python-pill",
      title: "Smartphone Pricing & Hardware Specification Market Analysis",
      github: "https://github.com/dinesh-ch3/pandas-project",
      overview: "Comprehensive market segmentation and pricing elasticity analysis across 1,500+ smartphone models. Evaluated hardware attributes (RAM, storage, battery capacity, camera resolution) to isolate the determinants of retail price premiums.",
      problem: "Raw web-scraped specification data contained messy currency strings (₹), commas, varying unit definitions (e.g., '128 GB' vs '128GB ROM'), and heavy missing values in battery and secondary camera attributes.",
      approach: [
        "Engineered automated cleaning pipelines with Pandas: regex extraction of RAM, storage, and battery capacities into numeric types.",
        "Handled missing values using category-based median imputation and removed synthetic pricing outliers.",
        "Conducted multivariate Pearson correlation and regression modeling using Seaborn heatmaps to quantify feature contributions."
      ],
      metrics: [
        { num: "1,500+", desc: "Smartphone specifications standardized" },
        { num: "r = 0.82", desc: "Correlation coefficient between RAM tier & pricing" },
        { num: "100%", desc: "Currency formatting errors resolved" }
      ],
      snippetTitle: "Pandas Data Cleaning & Price Normalization",
      snippet: `import pandas as pd
import re

def clean_hardware_specs(df):
    df['price_inr'] = df['price'].str.replace(r'[₹,]', '', regex=True).astype(float)
    df['ram_gb'] = df['specs'].str.extract(r'(\d+)\s*GB\s*RAM', flags=re.IGNORECASE).astype(float)
    df['battery_mah'] = df['specs'].str.extract(r'(\d+)\s*mAh', flags=re.IGNORECASE).astype(float)
    df['ram_gb'] = df['ram_gb'].fillna(df.groupby('brand')['ram_gb'].transform('median'))
    return df`
    },

    insurance: {
      category: "Advanced Excel",
      tagClass: "excel-pill",
      title: "Health Insurance Billing & Actuarial Risk Factor Modeling",
      github: "https://github.com/dinesh-ch3/excel-project",
      overview: "Statistical risk audit on 1,300+ healthcare policyholder billing records in Microsoft Excel. Evaluated demographic attributes, smoking status, and regional factors to build predictive actuarial variance models.",
      problem: "Underwriting teams lacked granular actuarial visibility into demographic risk multipliers, relying on flat regional averages that underpriced high-risk policyholders.",
      approach: [
        "Constructed nested formulas (XLOOKUP, INDEX/MATCH, SUMIFS, COUNTIFS) to segment claims across age brackets and BMI indices.",
        "Engineered dynamic Pivot Tables with multi-layer slicers to compute age-adjusted claim variance ratios.",
        "Created an automated premium adjustment model identifying smoking status as the primary cost driver (~280% higher average claim)."
      ],
      metrics: [
        { num: "1,300+", desc: "Policyholder claim records audited" },
        { num: "~280%", desc: "Claim cost escalation for smokers" },
        { num: "100%", desc: "Excel lookup formula automation" }
      ],
      snippetTitle: "Dynamic Actuarial Lookup Formula",
      snippet: `=LET(
    smoker_avg, AVERAGEIFS(tbl_claims[charges], tbl_claims[smoker], "yes"),
    nonsmoker_avg, AVERAGEIFS(tbl_claims[charges], tbl_claims[smoker], "no"),
    variance_pct, (smoker_avg - nonsmoker_avg) / nonsmoker_avg,
    variance_pct
)`
    },

    coffee: {
      category: "Power BI & DAX",
      tagClass: "powerbi-pill",
      title: "Coffee Shop Chain Executive Revenue & Operations Dashboard",
      github: "https://github.com/dinesh-ch3/power-bi-project",
      overview: "Commercial business intelligence dashboard engineered in Power BI for a multi-store coffee retail brand. Extracted and transformed raw point-of-sale transactional datasets into an actionable executive reporting system.",
      problem: "Store managers struggled with inefficient staff scheduling during erratic morning peaks, resulting in order backlogs and lost peak-hour sales.",
      approach: [
        "Architected a dimensional star-schema data model connecting sales fact tables with store, product, and time dimensions.",
        "Authored custom DAX measures for Year-over-Year (YoY) revenue velocity, transaction frequency, and average ticket size.",
        "Generated interactive hourly velocity heatmaps and KPI alert cards to optimize barista shift planning."
      ],
      metrics: [
        { num: "50,000+", desc: "Point-of-sale transactions analyzed" },
        { num: "32.6%", desc: "Daily revenue concentrated in 8-10 AM peak" },
        { num: "Star Schema", desc: "Enterprise dimensional data architecture" }
      ],
      snippetTitle: "Hourly Velocity DAX Measure",
      snippet: `Hourly Sales Velocity = 
VAR CurrentHour = SELECTEDVALUE(DimTime[Hour])
VAR TotalHourlyRev = CALCULATE(
    SUM(FactSales[TotalAmount]),
    FILTER(FactSales, RELATED(DimTime[Hour]) = CurrentHour)
)
RETURN TotalHourlyRev`
    },

    tata: {
      category: "Corporate Simulation",
      tagClass: "sql-pill",
      title: "GenAI Powered Delinquency Modeling & Collections Strategy",
      github: "https://github.com/dinesh-ch3",
      overview: "Corporate project simulation with Tata & Forage evaluating delinquent retail loan portfolios. Designed risk prioritization models and AI-assisted customer outreach strategies to maximize debt recovery while reducing operating costs.",
      problem: "Traditional debt collection relies on blunt call-center outreach, which exhausts operational budget on low-probability recovery accounts while neglecting high-yield early-stage arrears.",
      approach: [
        "Analyzed borrower repayment histories to map default probability across 30, 60, and 90+ day delinquency buckets.",
        "Segmented borrowers into risk-propensity matrix and mapped optimal contact channels (SMS, automated WhatsApp, voice, escalation).",
        "Created an executive slide deck and formal business summary detailing expected recovery rate improvements."
      ],
      metrics: [
        { num: "4 Buckets", desc: "Delinquency risk cohorts categorized" },
        { num: "Oct 2026", desc: "Tata & Forage simulation completed" },
        { num: "Verified", desc: "Accredited corporate simulation" }
      ],
      snippetTitle: "Executive Recommendation Summary",
      snippet: `// Strategic Tier Framework:
Tier 1 (1-30 Days Arrears): Automated WhatsApp/SMS nudge with dynamic 1-click UPI repayment link.
Tier 2 (31-60 Days Arrears): Interactive voice bot with flexible installment restructuring options.
Tier 3 (61-90 Days Arrears): Senior collector intervention with personalized settlement parameters.
Tier 4 (90+ Days Default): Secondary recovery pipeline or collateral remediation.`
    },

    bcgx: {
      category: "Corporate Simulation",
      tagClass: "python-pill",
      title: "PowerCo Customer Churn Prediction & Price Sensitivity Analysis",
      github: "https://github.com/dinesh-ch3",
      overview: "Data science corporate simulation with BCG X & Forage investigating SME customer churn for PowerCo, a major energy utility facing market deregulation and competitor discounting.",
      problem: "PowerCo experienced high customer churn suspected to be driven by price sensitivity, but lacked empirical statistical evidence and predictive models to identify at-risk customers before contract expiration.",
      approach: [
        "Framed business hypotheses and performed exploratory data analysis across 16,000+ enterprise client records with skewed energy consumption metrics.",
        "Engineered key predictive indicators including trailing 12-month price differentials across peak/off-peak energy bands and contract maturity ratios.",
        "Trained a Random Forest classification model with hyperparameter tuning to evaluate feature importances and predict churn probabilities.",
        "Delivered an executive slide deck and strategic memo advising leadership against blanket price cuts in favor of targeted retention incentives for high-risk accounts."
      ],
      metrics: [
        { num: "16K+", desc: "Enterprise client records analyzed" },
        { num: "Nov 2026", desc: "BCG X & Forage simulation completed" },
        { num: "Verified", desc: "Official Certificate of Completion" }
      ],
      snippetTitle: "Executive Summary & Model Insights",
      snippet: `// BCG X PowerCo Churn Analysis Findings:
1. Price sensitivity is NOT the sole driver of churn; net margin and consumption volatility hold higher predictive weight.
2. Blanket 20% discount is cost-prohibitive across all clients.
3. Recommendation: Deploy targeted retention offers only to clients with >0.60 churn propensity score, preserving margin while recovering 35%+ of at-risk gross revenue.`
    }
  };

  const modalBackdrop = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  let lastFocusedElement = null;

  function openModal(projectId) {
    const cs = caseStudies[projectId];
    if (!cs || !modalBody || !modalBackdrop) return;

    lastFocusedElement = document.activeElement;

    modalBody.innerHTML = `
      <div class="modal-header-meta">
        <span class="category-pill ${cs.tagClass}">${cs.category}</span>
      </div>
      <h2 class="modal-title" id="modalTitle">${cs.title}</h2>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="compass"></i> Executive Overview</div>
        <p class="modal-text">${cs.overview}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="alert-circle"></i> The Problem & Challenges</div>
        <p class="modal-text">${cs.problem}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="layers"></i> Architecture & Methodology</div>
        <ul class="skill-items-list">
          ${cs.approach.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-metrics-row">
        ${cs.metrics.map(m => `
          <div class="modal-metric-box">
            <span class="modal-metric-num">${m.num}</span>
            <span class="modal-metric-desc">${m.desc}</span>
          </div>
        `).join('')}
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="code"></i> ${cs.snippetTitle}</div>
        <pre class="modal-code-block"><code>${escapeHtml(cs.snippet)}</code></pre>
      </div>

      <div class="modal-action-footer">
        ${cs.demo ? `<a href="${cs.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i data-lucide="external-link"></i> Launch Live Web App
        </a>` : ''}
        <a href="${cs.github}" target="_blank" rel="noopener noreferrer" class="btn ${cs.demo ? 'btn-secondary' : 'btn-primary'}" aria-label="View GitHub Repository">
          <i data-lucide="github"></i>
          <span>View GitHub Repository</span>
        </a>
        <button class="btn btn-outline" id="modalDismissBtn">Close</button>
      </div>
    `;

    renderBrandLogos(modalBody);
    if (window.lucide) {
      lucide.createIcons({ root: modalBody });
    }

    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }

  document.querySelectorAll('.open-case-study').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openModal(proj);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

});
