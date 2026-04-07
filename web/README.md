# Swiss Tax Dashboard

Interactive web-based tax calculator for Kanton Bern 2026.

## Features

### Main Metrics
- Total Tax (Federal + Kanton + Gemeinde + Wealth)
- Effective Rate (Tax / Gross Income)
- Taxable Income (After deductions)
- Potential Savings (Baseline vs. Optimized)

### Visualizations
- **Tax Breakdown** — Stacked bar chart (4 tax types)
- **Optimization Comparison** — Table with 3 scenarios
- **Canton Comparison** — Multi-canton table

### Interactive Tools
- **Scenario Calculator** — Sliders for all deductions
  - Säule 3a: CHF 0 - 36,288
  - Pensionskasse Einkauf: CHF 0 - 50,000
  - Kinderbetreuung: CHF 0 - 32,000
  - Commuting: 0 - 50 km
  - Spenden: CHF 0 - 10,000
- **Live Calculation** — Tax updates as you adjust sliders

### Export Formats
- JSON (TaxMe-Online compatible)
- CSV (spreadsheet import)
- Markdown (human-readable)

## Usage

### Local Server
```bash
cd web
python3 -m http.server 8080
# Opens http://localhost:8080
```

### Custom Data
Edit `data.json` to use your own tax scenario:

```json
{
  "scenarios": [
    {
      "name": "Your Scenario",
      "result": {
        "income": { "gross": 198000, "taxable": 95904 },
        "taxes": { "federal": 13773, "kanton": 19220, ... }
      }
    }
  ]
}
```

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Charts:** Native CSS (lightweight, no external dependencies)
- **Style:** Financial Times visual vocabulary
- **Responsive:** Mobile-friendly (min-width: 320px)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance
- Initial load: < 500ms
- Chart render: < 100ms
- Slider update: < 50ms (live recalculation)

## Data Privacy
All calculations happen **client-side**. No data is sent to external servers.

Demo data is anonymized and does not represent real individuals.
