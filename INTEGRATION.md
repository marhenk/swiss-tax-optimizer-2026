# Swiss Tax Module — Integration Guide

## Overview

The Swiss Tax Module extends the Lexoffice-Steuer system with Swiss tax calculation and TaxMe-Online export capability. It runs alongside the German tax (EÜR) and credit modules.

---

## Quick Start

```bash
# 1. Configure your household data
vim swiss-tax-module/config.json

# 2. Calculate taxes
node swiss-tax-cli.js calculate

# 3. Export for TaxMe-Online
node swiss-tax-cli.js export --format json
```

---

## Architecture

```
lexoffice-steuer/
├── swiss-tax-module/          # ← NEW
│   ├── ch-calculator.js       # Main orchestrator
│   ├── federal-tax.js         # Direkte Bundessteuer
│   ├── kanton-tax.js          # Kanton Bern + Gemeinde
│   ├── wealth-tax.js          # Vermögenssteuer
│   ├── deductions.js          # All Abzüge
│   ├── taxme-exporter.js      # TaxMe-Online JSON/CSV
│   ├── config.json            # Household configuration
│   └── exports/               # Generated export files
├── swiss-tax-cli.js           # ← NEW CLI entry point
├── test-swiss-tax.js          # ← NEW test suite
├── credit-module/             # Existing (reused)
├── shared/                    # Existing (reused)
└── bank-statement-parser.js   # Existing (reused)
```

---

## Shared Module Reuse

### From German Tax Module:
| Module | Swiss Usage |
|--------|-------------|
| `bank-statement-parser.js` | Parse bank statements for wealth + deductions |
| `shared/transaction-classifier.js` | Classify private vs. business transactions |
| `ocr-processor.js` | OCR receipts (Krankenkasse, Spenden, etc.) |

### From Credit Module:
| Module | Swiss Usage |
|--------|-------------|
| `credit-module/equity-tracker.js` | Wealth calculation (Vermögen) |
| `credit-module/income-analyzer.js` | Multi-year income averaging |
| `credit-module/debt-tracker.js` | Schulden for wealth tax deduction |

---

## Configuration

Edit `swiss-tax-module/config.json`:

```json
{
  "year": 2026,
  "household": {
    "maritalStatus": "married",     // "married" | "single"
    "children": 2,
    "location": {
      "kanton": "BE",
      "gemeinde": "Bümpliz"         // Affects Steuerfuss
    }
  },
  "income": {
    "employment": { "partner": 126000 },
    "selfEmployed": { "self": 72000 },
    "investment": 0
  },
  "wealth": {
    "bank": 159000,
    "securities": 0,
    "saeule3a": 0,
    "pensionskasse": 0,
    "realEstate": 0,
    "debts": 0
  },
  "deductions": {
    "saeule3a": { "partner": 7258, "self": 0 },
    "krankenkasse": 6000,
    "berufskosten": "auto",          // "auto" = 3% of salary, or CHF amount
    "spenden": 500,
    "schuldzinsen": 0,
    "pensionskasseEinkauf": 0,
    "kinderbetreuung": 0
  }
}
```

---

## CLI Commands

```bash
# Full tax calculation report
node swiss-tax-cli.js calculate

# Detailed breakdown with brackets
node swiss-tax-cli.js preview

# Export for TaxMe-Online
node swiss-tax-cli.js export --format json
node swiss-tax-cli.js export --format csv

# Show current configuration
node swiss-tax-cli.js configure

# DE vs CH comparison (planned)
node swiss-tax-cli.js compare
```

---

## Programmatic Usage

```javascript
const { calculateSwissTax } = require('./swiss-tax-module/ch-calculator');

const result = calculateSwissTax({
  year: 2026,
  household: { maritalStatus: 'married', children: 2, location: { kanton: 'BE', gemeinde: 'Bern' } },
  income: { employment: { partner: 126000 }, selfEmployed: { self: 72000 } },
  wealth: { bank: 159000 },
  deductions: { saeule3a: { partner: 7258 }, krankenkasse: 6000, berufskosten: 'auto' }
});

console.log(result.summary.totalTax);       // Total tax (CHF)
console.log(result.summary.effectiveRate);   // Effective rate (%)
```

---

## Tax Calculation Logic

### Three-Tier Income Tax:
1. **Bundessteuer** (Federal): Progressive 0–11.5%, married/single tariffs
2. **Kantonssteuer** (Kanton Bern): Progressive, separate tariff
3. **Gemeindesteuer**: Kantonssteuer × Steuerfuss (Stadt Bern: ~1.84)

### Wealth Tax (Kanton + Gemeinde only):
```
Gross Wealth - Schulden - Freibetrag = Taxable Wealth × Rate
```

### Supported Deductions:
| Deduction | 2026 Limit |
|-----------|------------|
| Säule 3a (with PK) | CHF 7,258 |
| Säule 3a (self-employed) | CHF 36,288 |
| Krankenkasse | Actual premiums |
| Berufskosten | 3% of salary or itemized |
| Verheiratetenabzug | CHF 2,600 |
| Kinderabzug | CHF 8,000/child |
| PK Einkauf | Actual amount |
| Schuldzinsen | Actual amount |
| Spenden | Actual amount |

---

## TaxMe-Online Workflow

1. **Calculate** → `node swiss-tax-cli.js calculate`
2. **Export** → `node swiss-tax-cli.js export --format json`
3. **Login** → https://www.belogin.directories.be.ch/taxme-npo/login/steklogin.jsf
4. **Fill form** using exported data as reference
5. **Upload** documents (Lohnausweis, Krankenkasse, etc.)
6. **Submit** (Freigabe)

---

## Known Limitations

1. **Tariff tables are estimates** — Replace with official EStV/Kanton Bern rates when published
2. **No direct TaxMe-Online API** — Export is reference data, not auto-upload
3. **ALV income classification** — Treated as self-employed; verify if ALV is taxed differently
4. **EUR→CHF conversion** — Not yet automated for cross-border income
5. **Kirchensteuer** — Not included (varies by confession)

---

## Test Suite

```bash
node test-swiss-tax.js
# Expected: 26 passed, 0 failed
```

Three test scenarios:
1. **Marcel household** — Married, 2 kids, CHF 198k income, CHF 159k wealth
2. **Single self-employed** — CHF 80k income, CHF 50k wealth
3. **High-income couple** — CHF 355k income, CHF 720k net wealth

---

## Future Enhancements

- [ ] Official 2026 tariff tables (Federal + Kanton Bern)
- [ ] Kirchensteuer calculation
- [ ] EUR→CHF auto-conversion (ECB rates)
- [ ] TaxMe-Online API integration (if available)
- [ ] Lohnausweis PDF parser (OCR)
- [ ] Web UI (`/swiss-tax` dashboard)
- [ ] DE vs CH tax comparison tool
