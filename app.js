/* ==========================================================================
   CHITTINEDI DINESH - PORTFOLIO INTERACTIVITY & LIVE DATA LAB
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // -------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light Mode)
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  
  // Read saved theme preference or system default
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update chart theme if chart exists
      updateChartColors(newTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Menu Drawer
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.style.display === 'block';
      mobileDrawer.style.display = isOpen ? 'none' : 'block';
    });

    // Close mobile drawer when clicking any link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Project Filter Tabs
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 4. Toast Notifications
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('dinesh435ch@gmail.com').then(() => {
        showToast('Email address copied: dinesh435ch@gmail.com');
      }).catch(() => {
        showToast('dinesh435ch@gmail.com');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Live Data Lab & Interactive Visualizer
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
          borderRadius: 6
        }]
      }
    },

    insurance: {
      title: "Actuarial Claims: Smoker vs Non-Smoker Demographics",
      subtitle: "Calculated claim variance across 1,300+ policy records in Excel.",
      badgeLabel: "Claim Variance",
      badgeVal: "+280% for Smokers",
      lang: "Excel Nested Formulas & Statistical DAX",
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
          borderRadius: 6
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
)
df = df[df['price_clean'].str.isnumeric()]
df['price_inr'] = df['price_clean'].astype(int)

# Group by RAM tiers to analyze median price and variance
ram_analysis = (
    df.groupby('ram_gb')['price_inr']
    .agg(['count', 'median', 'mean', 'std'])
    .reset_index()
    .rename(columns={'median': 'median_price_inr'})
)
print(ram_analysis)`,
      headers: ["RAM Tier", "Device Models", "Median Price (₹)", "Battery Avg (mAh)", "Segment"],
      rows: [
        ["4 GB", "340 models", "₹10,499", "4,850 mAh", "Budget Entry"],
        ["6 GB", "495 models", "₹16,999", "5,000 mAh", "Core Mid-Range"],
        ["8 GB", "420 models", "₹24,999", "5,000 mAh", "Upper Mid-Range"],
        ["12 GB", "185 models", "₹42,999", "4,700 mAh", "Flagship Tier"],
        ["16 GB", "60 models", "₹69,999", "4,800 mAh", "Ultra Enthusiast"]
      ],
      chartType: 'line',
      chartData: {
        labels: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'],
        datasets: [{
          label: 'Median Price (₹ INR)',
          data: [10499, 16999, 24999, 42999, 69999],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 6,
          pointBackgroundColor: '#10b981'
        }]
      }
    },

    coffee: {
      title: "Retail Footfall & Hourly Revenue Velocity Heatmap",
      subtitle: "Star schema transactional analytics built in Power BI.",
      badgeLabel: "Peak Hour",
      badgeVal: "8:00 AM (₹38.5k/hr)",
      lang: "DAX (Power BI Data Modeling)",
      code: `// Hourly Transaction Velocity Measure
Hourly Revenue = 
CALCULATE(
    SUM(Fact_Sales[Transaction_Amount]),
    USERELATIONSHIP(Fact_Sales[Transaction_Time_ID], Dim_Time[Time_ID])
)

// Peak Traffic Index
Peak_Index = 
VAR CurrentHourSales = [Hourly Revenue]
VAR AvgHourlySales = 
    AVERAGEX(
        ALLSELECTED(Dim_Time[Hour_of_Day]),
        [Hourly Revenue]
    )
RETURN
DIVIDE(CurrentHourSales, AvgHourlySales, 0)`,
      headers: ["Hour Window", "Hourly Rev (₹)", "Orders", "Top Category", "Staffing Req"],
      rows: [
        ["07:00 - 08:00 AM", "₹24,200", "145", "Espresso / Americano", "3 Baristas"],
        ["08:00 - 09:00 AM", "₹38,500", "230", "Latte / Cappuccino", "5 Baristas (Peak)"],
        ["09:00 - 10:00 AM", "₹31,000", "185", "Cold Brew / Pastries", "4 Baristas"],
        ["12:00 - 01:00 PM", "₹22,400", "130", "Paninis & Beverages", "3 Baristas"],
        ["02:00 - 03:00 PM", "₹28,600", "170", "Iced Coffee / Refreshers", "4 Baristas (Peak 2)"],
        ["05:00 - 06:00 PM", "₹19,800", "115", "Specialty Teas", "2 Baristas"]
      ],
      chartType: 'bar',
      chartData: {
        labels: ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'],
        datasets: [{
          label: 'Hourly Sales (₹ INR)',
          data: [24200, 38500, 31000, 18500, 15200, 22400, 19100, 28600, 24000, 16500, 19800, 14200],
          backgroundColor: '#8b5cf6',
          borderRadius: 6
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

    chartInstance = new Chart(ctx, {
      type: data.chartType,
      data: data.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: textColor, font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: isDark ? '#0e1526' : '#ffffff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#334155',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            bodyFont: { family: 'JetBrains Mono' }
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

    // Update Header
    document.getElementById('vizTitle').textContent = sc.title;
    document.getElementById('vizSubtitle').textContent = sc.subtitle;
    document.querySelector('.viz-badge-label').textContent = sc.badgeLabel;
    document.getElementById('vizStatVal').textContent = sc.badgeVal;

    // Update Code Pane
    document.getElementById('codeLangLabel').textContent = sc.lang;
    document.getElementById('codeSnippetText').textContent = sc.code;

    // Update Table Pane
    const thead = document.getElementById('summaryTableHead');
    const tbody = document.getElementById('summaryTableBody');

    thead.innerHTML = `<tr>${sc.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = sc.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');

    // Re-draw chart
    initChart(key);
  }

  // Setup Query Scenario Buttons
  const queryBtns = document.querySelectorAll('.query-btn');
  queryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      queryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scKey = btn.getAttribute('data-scenario');
      renderScenario(scKey);
    });
  });

  // Setup Lab Tabs (Viz vs Code vs Data)
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

  // Copy Snippet Button
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const code = document.getElementById('codeSnippetText').textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast('Code snippet copied to clipboard!');
      });
    });
  }

  // Initial Scenario Render
  renderScenario('alos');

  // -------------------------------------------------------------------------
  // 6. Case Study Deep Dive Modal Data & Logic
  // -------------------------------------------------------------------------
  const caseStudies = {
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

# Standardize RAM and Price columns
def clean_hardware_specs(df):
    # Strip ₹ symbol and commas from price
    df['price_inr'] = df['price'].str.replace(r'[₹,]', '', regex=True).astype(float)
    
    # Extract numeric RAM in GB
    df['ram_gb'] = df['specs'].str.extract(r'(\d+)\s*GB\s*RAM', flags=re.IGNORECASE).astype(float)
    
    # Extract battery capacity in mAh
    df['battery_mah'] = df['specs'].str.extract(r'(\d{4,5})\s*mAh', flags=re.IGNORECASE).astype(float)
    
    # Median imputation grouped by manufacturer
    df['battery_mah'] = df.groupby('brand')['battery_mah'].transform(lambda x: x.fillna(x.median()))
    return df`
    },

    insurance: {
      category: "Advanced Excel",
      tagClass: "excel-pill",
      title: "Health Insurance Billing & Actuarial Risk Factor Modeling",
      github: "https://github.com/dinesh-ch3/excel-project",
      overview: "In-depth actuarial analysis of 1,300+ medical insurance records examining how lifestyle, demographic variables, and health metrics impact claim payouts and underwriting solvency.",
      problem: "Insurance underwriting requires precise risk-weight adjustments. Inaccurate grouping of smoker statuses and regional healthcare cost disparities created mispriced risk pools.",
      approach: [
        "Applied Excel Data Validation rules and conditional formatting to detect and flag corrupted billing rows.",
        "Formulated nested dynamic lookup formulas (INDEX/MATCH, XLOOKUP, SUMIFS, AVERAGEIFS) to segment claims across age, BMI tiers, and smoking status.",
        "Engineered dynamic Pivot Tables and scenario tables modeling underwriter loss ratios under varied deductible scenarios."
      ],
      metrics: [
        { num: "1,300+", desc: "Policyholder claim records audited" },
        { num: "~280%", desc: "Higher average claims accrued by smokers" },
        { num: "0 Errors", desc: "Validation rules preventing formula reference errors" }
      ],
      snippetTitle: "Excel Dynamic Modeling Formulas",
      snippet: `// Dynamic Smoker Risk Multiplier
=XLOOKUP(E2, tbl_smoker_lookup[Status], tbl_smoker_lookup[RiskFactor], 1.0)

// Conditional Actuarial Assessment Tier
=IFS(
    AND(D2="yes", C2>30), "High Risk - Smoker / Obese Tier 3",
    AND(D2="yes", C2<=30), "Elevated Risk - Smoker Tier 2",
    AND(D2="no", C2>30), "Moderate Risk - Non-Smoker / High BMI",
    TRUE, "Standard Baseline Risk Tier 1"
)`
    },

    "powerbi-coffee": {
      category: "Power BI & BI",
      tagClass: "powerbi-pill",
      title: "Coffee Shop Chain Executive Revenue & Operations Dashboard",
      github: "https://github.com/dinesh-ch3/power-bi_project",
      overview: "Commercial business intelligence reporting system for a fictional multi-branch coffee chain. Built to empower franchise executives with visibility into daily sales velocities, product affinity trends, and peak hour labor demand.",
      problem: "Raw transactional point-of-sale logs were siloed, making it difficult for management to identify low-margin product lines or synchronize barista staffing with customer surges.",
      approach: [
        "Built an end-to-end ETL flow in Power Query: unpivoted columns, cleaned time stamps, and removed incomplete transactions.",
        "Modeled a Star Schema connecting Fact_Sales with Dim_Product, Dim_Store, Dim_Customer, and Dim_Date.",
        "Authored custom DAX measures for Year-over-Year (YoY) revenue, basket size, and average order value (AOV)."
      ],
      metrics: [
        { num: "3 Stores", desc: "Franchise locations consolidated into single BI model" },
        { num: "15+", desc: "Custom DAX calculated measures created" },
        { num: "32%", desc: "Morning peak sales concentration identified" }
      ],
      snippetTitle: "Custom DAX Sales Velocity & YoY Measures",
      snippet: `// Total Revenue DAX Measure
Total Revenue = SUMX(Fact_Sales, Fact_Sales[Quantity] * Fact_Sales[Unit_Price])

// Prior Year Revenue (Time Intelligence)
Revenue Prior Year = 
CALCULATE(
    [Total Revenue],
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

// YoY Revenue Growth %
YoY Growth % = 
DIVIDE(
    [Total Revenue] - [Revenue Prior Year],
    [Revenue Prior Year],
    0
)`
    },

    tata: {
      category: "Corporate Simulation",
      tagClass: "corporate-pill",
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
        { num: "Verified", desc: "Accredited performance simulation" }
      ],
      snippetTitle: "Executive Recommendation Summary",
      snippet: `// Strategic Tier Framework:
Tier 1 (1-30 Days Arrears): Automated WhatsApp/SMS nudge with dynamic 1-click UPI repayment link.
Tier 2 (31-60 Days Arrears): Interactive voice bot with flexible installment restructuring options.
Tier 3 (61-90 Days Arrears): Senior collector intervention with personalized settlement parameters.
Tier 4 (90+ Days Default): Secondary recovery pipeline or collateral remediation.`
    }
  };

  const modalBackdrop = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(projectId) {
    const cs = caseStudies[projectId];
    if (!cs || !modalBody || !modalBackdrop) return;

    modalBody.innerHTML = `
      <div class="modal-header-meta">
        <span class="category-pill ${cs.tagClass}">${cs.category}</span>
      </div>
      <h2 class="modal-title">${cs.title}</h2>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="compass"></i> Executive Overview</div>
        <p class="modal-text">${cs.overview}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="alert-circle"></i> The Problem & Challenges</div>
        <p class="modal-text">${cs.problem}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="layers"></i> Analytical Architecture & Methodology</div>
        <ul class="skill-items-list">
          ${cs.approach.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-metrics-row">
        ${cs.metrics.map(m => `
          <div class="modal-metric-box">
            <div class="modal-metric-num">${m.num}</div>
            <div class="modal-metric-desc">${m.desc}</div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i data-lucide="code"></i> ${cs.snippetTitle}</div>
        <pre class="modal-code-block"><code>${escapeHtml(cs.snippet)}</code></pre>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-top: 2rem;">
        <a href="${cs.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i data-lucide="github"></i> View GitHub Repository
        </a>
        <button class="btn btn-outline" id="modalDismissBtn">Close</button>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons({ root: modalBody });
    }

    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
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

  // Open case study triggers
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
