#!/usr/bin/env node
// Generate TaxMe-Online exports for Marcel (2026)

const fs = require('fs');
const path = require('path');
const { calculateSwissTax } = require('./ch-calculator.js');
const TaxMeExporter = require('./taxme-exporter.js');

// Load Marcel's config
const configPath = path.join(__dirname, 'config.json');
const marcelConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('Swiss Tax Calculator - Export Generator');
console.log('═══════════════════════════════════════\n');

// Calculate taxes
console.log('Calculating taxes...');
const taxResult = calculateSwissTax(marcelConfig);

// Display summary
console.log('\nTax Summary:');
console.log(`  Total Tax:    CHF ${taxResult.summary.totalTax.toLocaleString()}`);
console.log(`  Federal:      CHF ${taxResult.taxes.federal.tax.toLocaleString()}`);
console.log(`  Kanton:       CHF ${taxResult.taxes.kanton.kanton.tax.toLocaleString()}`);
console.log(`  Gemeinde:     CHF ${taxResult.taxes.kanton.gemeinde.tax.toLocaleString()}`);
console.log(`  Wealth:       CHF ${taxResult.taxes.wealth.total.toLocaleString()}`);
console.log(`  Effective:    ${taxResult.summary.effectiveRate}\n`);

// Create exporter
const exporter = new TaxMeExporter(2026);

// 1. Generate JSON export
console.log('Generating JSON export...');
const jsonExport = exporter.toJSON(taxResult, marcelConfig);
const jsonPath = path.join(__dirname, 'exports', 'marcel-taxme-2026.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
console.log(`✓ Saved: ${jsonPath}`);

// 2. Generate CSV export
console.log('Generating CSV export...');
const csvExport = exporter.toCSV(taxResult);
const csvPath = path.join(__dirname, 'exports', 'marcel-taxme-2026.csv');
fs.writeFileSync(csvPath, csvExport);
console.log(`✓ Saved: ${csvPath}`);

// 3. Generate Markdown report
console.log('Generating Markdown report...');
const mdReport = generateMarkdownReport(taxResult, marcelConfig);
const mdPath = path.join(__dirname, 'exports', 'marcel-taxme-2026.md');
fs.writeFileSync(mdPath, mdReport);
console.log(`✓ Saved: ${mdPath}`);

console.log('\n✅ All exports generated successfully!\n');
console.log('Next steps:');
console.log('  1. Review exports in swiss-tax-module/exports/');
console.log('  2. Login to TaxMe-Online (BE-Login with AGOV)');
console.log('  3. Use CSV for manual entry or JSON for automation');
console.log('  4. Upload Belege (Lohnausweis, Säule 3a, etc.)');

/**
 * Generate human-readable Markdown report
 */
function generateMarkdownReport(taxResult, config) {
  const lines = [];
  
  lines.push('# Swiss Tax Return 2026 - Marcel Henkel\n');
  lines.push(`**Generated:** ${new Date().toISOString().split('T')[0]}\n`);
  lines.push('---\n');
  
  lines.push('## Summary\n');
  lines.push(`- **Total Tax:** CHF ${taxResult.summary.totalTax.toLocaleString()} (${taxResult.summary.effectiveRate})`);
  lines.push(`- **Taxable Income:** CHF ${taxResult.income.taxable.toLocaleString()}`);
  lines.push(`- **Taxable Wealth:** CHF ${taxResult.wealth.taxable.toLocaleString()}\n`);
  
  lines.push('---\n');
  
  lines.push('## Tax Breakdown\n');
  lines.push('### Federal Tax');
  lines.push(`- **Amount:** CHF ${taxResult.taxes.federal.tax.toLocaleString()}`);
  lines.push(`- **Effective Rate:** ${taxResult.taxes.federal.effectiveRate}\n`);
  
  lines.push('### Kanton Bern Tax');
  lines.push(`- **Einfache Steuer:** CHF ${taxResult.taxes.kanton.einfacheSteuer.toLocaleString()}`);
  lines.push(`- **Kanton Steuerfuss:** ${taxResult.taxes.kanton.kanton.steuerfuss}`);
  lines.push(`- **Kanton Tax:** CHF ${taxResult.taxes.kanton.kanton.tax.toLocaleString()}\n`);
  
  lines.push('### Gemeinde Bümpliz Tax');
  lines.push(`- **Gemeinde Steuerfuss:** ${taxResult.taxes.kanton.gemeinde.steuerfuss}`);
  lines.push(`- **Gemeinde Tax:** CHF ${taxResult.taxes.kanton.gemeinde.tax.toLocaleString()}\n`);
  
  lines.push('### Wealth Tax');
  lines.push(`- **Amount:** CHF ${taxResult.taxes.wealth.total.toLocaleString()}\n`);
  
  lines.push('---\n');
  
  lines.push('## Income Details\n');
  lines.push(`- **Gross Income:** CHF ${taxResult.income.gross.toLocaleString()}`);
  lines.push(`  - Partner Employment: CHF ${config.income.employment.partner.toLocaleString()}`);
  lines.push(`  - ALV (Self): CHF ${config.income.selfEmployed.self.toLocaleString()}`);
  lines.push(`- **Total Deductions:** CHF ${taxResult.income.deductions.toLocaleString()}`);
  lines.push(`- **Taxable Income:** CHF ${taxResult.income.taxable.toLocaleString()}\n`);
  
  lines.push('---\n');
  
  lines.push('## Wealth Details\n');
  lines.push(`- **Gross Wealth:** CHF ${taxResult.wealth.gross.toLocaleString()}`);
  lines.push(`  - Bank Accounts: CHF ${config.wealth.bank.toLocaleString()}`);
  lines.push(`  - Securities: CHF ${config.wealth.securities.toLocaleString()}`);
  lines.push(`  - Säule 3a: CHF ${config.wealth.saeule3a.toLocaleString()}`);
  lines.push(`- **Debts:** CHF ${config.wealth.debts.toLocaleString()}`);
  lines.push(`- **Taxable Wealth:** CHF ${taxResult.wealth.taxable.toLocaleString()}\n`);
  
  lines.push('---\n');
  
  lines.push('## Deductions Applied\n');
  const ded = taxResult.deductions.income;
  lines.push(`- **Verheiratetenabzug:** CHF ${ded.verheiratetenabzug.toLocaleString()}`);
  lines.push(`- **Kinderabzug (2 children):** CHF ${ded.kinderabzug.toLocaleString()}`);
  lines.push(`- **Säule 3a (Partner):** CHF ${ded.saeule3a.toLocaleString()}`);
  lines.push(`- **Krankenkasse:** CHF ${ded.krankenkasse.toLocaleString()}`);
  lines.push(`- **Berufskosten:** CHF ${ded.berufskosten.toLocaleString()}`);
  lines.push(`- **Spenden:** CHF ${ded.spenden.toLocaleString()}`);
  lines.push(`- **Total Deductions:** CHF ${taxResult.deductions.totalIncome.toLocaleString()}\n`);
  
  lines.push('---\n');
  
  lines.push('## TaxMe-Online Upload Checklist\n');
  lines.push('- [ ] Login to TaxMe-Online (BE-Login with AGOV)');
  lines.push('- [ ] Select tax year 2026');
  lines.push('- [ ] Upload Lohnausweis (Partner - CHF 126,000)');
  lines.push('- [ ] Upload ALV Bescheinigung (Self - CHF 72,000)');
  lines.push('- [ ] Upload Säule 3a Bescheinigung (CHF 7,258)');
  lines.push('- [ ] Upload Krankenkasse Jahresrechnung (CHF 6,000)');
  lines.push('- [ ] Upload Bankkonten Auszug (CHF 159,000)');
  lines.push('- [ ] Enter deductions manually from CSV');
  lines.push('- [ ] Verify tax calculation matches this report');
  lines.push('- [ ] Submit return\n');
  
  lines.push('---\n');
  lines.push('*Generated by Swiss Tax Module (Official 2026 Tariffs)*\n');
  
  return lines.join('\n');
}
