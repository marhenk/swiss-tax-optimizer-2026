#!/usr/bin/env node
// Generate TaxMe-Online exports for Marcel (2026 OPTIMIZED)

const fs = require('fs');
const path = require('path');
const { calculateSwissTax } = require('./ch-calculator.js');
const TaxMeExporter = require('./taxme-exporter.js');

// Load Marcel's OPTIMIZED config
const configPath = path.join(__dirname, 'config-optimized.json');
const marcelConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('Swiss Tax Calculator - OPTIMIZED Export Generator');
console.log('═════════════════════════════════════════════════════\n');

// Calculate taxes
console.log('Calculating OPTIMIZED taxes...');
const taxResult = calculateSwissTax(marcelConfig);

// Display summary
console.log('\nOPTIMIZED Tax Summary:');
console.log(`  Total Tax:    CHF ${taxResult.summary.totalTax.toLocaleString()}`);
console.log(`  Federal:      CHF ${taxResult.taxes.federal.tax.toLocaleString()}`);
console.log(`  Kanton:       CHF ${taxResult.taxes.kanton.kanton.tax.toLocaleString()}`);
console.log(`  Gemeinde:     CHF ${taxResult.taxes.kanton.gemeinde.tax.toLocaleString()}`);
console.log(`  Wealth:       CHF ${taxResult.taxes.wealth.total.toLocaleString()}`);
console.log(`  Effective:    ${taxResult.summary.effectiveRate}`);
console.log(`\n  SAVINGS vs baseline CHF 42,463: CHF ${(42463 - taxResult.summary.totalTax).toLocaleString()} (${((42463 - taxResult.summary.totalTax) / 42463 * 100).toFixed(1)}%)\n`);

// Create exporter
const exporter = new TaxMeExporter(2026);

// 1. Generate JSON export
console.log('Generating OPTIMIZED JSON export...');
const jsonExport = exporter.toJSON(taxResult, marcelConfig);
const jsonPath = path.join(__dirname, 'exports', 'marcel-taxme-2026-OPTIMIZED.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
console.log(`✓ Saved: ${jsonPath}`);

// 2. Generate CSV export
console.log('Generating OPTIMIZED CSV export...');
const csvExport = exporter.toCSV(taxResult);
const csvPath = path.join(__dirname, 'exports', 'marcel-taxme-2026-OPTIMIZED.csv');
fs.writeFileSync(csvPath, csvExport);
console.log(`✓ Saved: ${csvPath}`);

// 3. Generate Markdown report
console.log('Generating OPTIMIZED Markdown report...');
const mdReport = generateMarkdownReport(taxResult, marcelConfig);
const mdPath = path.join(__dirname, 'exports', 'marcel-taxme-2026-OPTIMIZED.md');
fs.writeFileSync(mdPath, mdReport);
console.log(`✓ Saved: ${mdPath}`);

console.log('\n✓ All OPTIMIZED exports generated successfully!');
console.log('\nNext steps:');
console.log('1. Open Säule 3a account for Marcel');
console.log('2. Verify Pensionskasse Einkauf availability');
console.log('3. Confirm Kinderbetreuung costs');
console.log('4. Upload OPTIMIZED exports to TaxMe-Online\n');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Generate Markdown Report
// ─────────────────────────────────────────────────────────────────────────────
function generateMarkdownReport(result, config) {
  const totalGross = config.income.employment.partner + config.income.alv;
  
  return `# Swiss Tax Return 2026 - OPTIMIZED - Marcel Henkel

**Generated:** ${new Date().toISOString().split('T')[0]}  
**Status:** OPTIMIZED (all deductions applied)  
**Location:** Bern, Kanton Bern

---

## Income

| Source | Amount |
|--------|--------|
| Partner Employment | CHF ${config.income.employment.partner.toLocaleString()} |
| ALV (Marcel) | CHF ${config.income.alv.toLocaleString()} |
| **Total Gross Income** | **CHF ${totalGross.toLocaleString()}** |

---

## Deductions (OPTIMIZED)

| Deduction | Amount | Status |
|-----------|--------|--------|
| Verheiratetenabzug | CHF ${result.deductions.income.verheiratetenabzug.toLocaleString()} | ✅ FIXED |
| Kinderabzug (2) | CHF ${result.deductions.income.kinderabzug.toLocaleString()} | ✅ |
| Säule 3a (Partner) | CHF ${config.deductions.saeule3a.partner.toLocaleString()} | ✅ |
| Säule 3a (Marcel) | CHF ${config.deductions.saeule3a.self.toLocaleString()} | ⭐ NEW! |
| Pensionskasse Einkauf | CHF ${result.deductions.income.pensionskasseEinkauf.toLocaleString()} | ⭐ NEW! |
| Krankenkasse | CHF ${result.deductions.income.krankenkasse.toLocaleString()} | ✅ |
| Berufskosten | CHF ${result.deductions.income.berufskosten.toLocaleString()} | ⭐ OPTIMIZED |
| Kinderbetreuung | CHF ${result.deductions.income.kinderbetreuung.toLocaleString()} | ⭐ NEW! |
| Spenden | CHF ${result.deductions.income.spenden.toLocaleString()} | ⭐ INCREASED |
| **Total Deductions** | **CHF ${result.deductions.totalIncome.toLocaleString()}** | |

---

## Taxable Income

| Item | Amount |
|------|--------|
| Gross Income | CHF ${totalGross.toLocaleString()} |
| - Deductions | CHF ${result.deductions.totalIncome.toLocaleString()} |
| **Taxable Income** | **CHF ${result.income.taxable.toLocaleString()}** |

---

## Wealth

| Item | Amount |
|------|--------|
| Bank Accounts | CHF ${config.wealth.bank.toLocaleString()} |
| Säule 3a | CHF ${config.wealth.saeule3a.toLocaleString()} (tax-free!) |
| **Gross Wealth** | **CHF ${result.wealth.gross.toLocaleString()}** |
| - Freibetrag | CHF ${result.deductions.totalWealth.toLocaleString()} |
| **Taxable Wealth** | **CHF ${result.wealth.taxable.toLocaleString()}** |

---

## Tax Calculation

| Tax Type | Amount |
|----------|--------|
| Federal Tax | CHF ${result.taxes.federal.tax.toLocaleString()} |
| Kanton Tax | CHF ${result.taxes.kanton.kanton.tax.toLocaleString()} |
| Gemeinde Tax (Bern, 1.84) | CHF ${result.taxes.kanton.gemeinde.tax.toLocaleString()} |
| Wealth Tax | CHF ${result.taxes.wealth.total.toLocaleString()} |
| **Total Tax** | **CHF ${result.summary.totalTax.toLocaleString()}** |
| **Effective Rate** | **${result.summary.effectiveRate}** |

---

## Savings vs. Baseline

| Metric | Amount |
|--------|--------|
| Baseline Tax | CHF 42,463 |
| Optimized Tax | CHF ${result.summary.totalTax.toLocaleString()} |
| **Savings** | **CHF ${(42463 - result.summary.totalTax).toLocaleString()} (${((42463 - result.summary.totalTax) / 42463 * 100).toFixed(1)}%)** |

---

## Optimizations Applied

1. ✅ **Verheiratetenabzug bug fixed** (+CHF 8,000)
2. ⭐ **Säule 3a Marcel opened** (+CHF 36,288)
3. ⭐ **Pensionskasse Einkauf** (+CHF 20,000)
4. ⭐ **Kinderbetreuung claimed** (+CHF 25,000)
5. ⭐ **Commuting optimized** (+CHF 1,170)
6. ⭐ **Donations increased** (+CHF 2,500)

**Total new deductions:** +CHF 92,958

---

## Action Plan

### Immediate:
- [ ] Verify actual Kinderbetreuung costs (CHF 25,000 assumed)
- [ ] Measure actual commuting distance (15km assumed)
- [ ] Fix Verheiratetenabzug in tax module (done!)

### Before Dec 31, 2026:
- [ ] Open Säule 3a account for Marcel (VIAC/Finpension)
- [ ] Transfer CHF 36,288 to Säule 3a
- [ ] Request Pensionskasse statement (Partner)
- [ ] Execute Pensionskasse Einkauf (CHF 20,000 if gap exists)
- [ ] Donate CHF 3,000 (vs. CHF 500 baseline)

### Filing:
- [ ] Upload OPTIMIZED exports to TaxMe-Online
- [ ] Verify all values match
- [ ] Submit return

---

**Generated by Swiss Tax Module v2026**  
**Config:** \`config-optimized.json\`
`;
}
