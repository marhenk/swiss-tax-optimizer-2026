# Swiss Tax Optimizer Dashboard

Interactive tax calculation dashboard for Kanton Bern 2026.

**Live Demo:** [https://marhenk.github.io/swiss-tax-optimizer-2026/](https://marhenk.github.io/swiss-tax-optimizer-2026/)

## Features

### Main Metrics
- Total Tax (Federal + Kanton + Gemeinde + Wealth)
- Effective Rate (Tax / Gross Income)
- Taxable Income (After deductions)
- Potential Savings (Baseline vs. Optimized)

### Scenarios
- **Baseline** — Current situation (no optimizations)
- **Conservative** — Add Marcel Säule 3a only (CHF 36,288)
- **Full Optimized** — All 6 optimizations (CHF 41,637 savings!)

### Visualizations
- Tax Breakdown (Federal, Kanton, Gemeinde, Wealth)
- Optimization Comparison Table
- Canton Comparison (Bern, Zürich, Zug, Basel-Stadt)

### Pages
- **Dashboard** (`swiss-tax.html`) — Overview with current scenario
- **Calculator** (`swiss-tax-calculator.html`) — Interactive scenario builder
- **Export** (`swiss-tax-export.html`) — TaxMe-Online export formats (JSON/CSV/Markdown)

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Charts:** Native CSS (no external dependencies for GitHub Pages)
- **Style:** Financial Times visual vocabulary
- **Responsive:** Mobile-friendly (min-width: 320px)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Privacy
All calculations happen **client-side**. No data is sent to external servers.

Demo data is anonymized and does not represent real individuals.

[← Back to repository](https://github.com/marhenk/swiss-tax-optimizer-2026)
