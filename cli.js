#!/usr/bin/env node

// Calculate optimized Swiss tax 2026 with ALL deductions

const { SwissTaxCalculator } = require('./ch-calculator.js');
const config = require('./config-optimized.json');

console.log('='.repeat(80));
console.log('SWISS TAX OPTIMIZATION 2026 - Marcel Henkel');
console.log('='.repeat(80));
console.log();

const calculator = new SwissTaxCalculator(config.year);
const result = calculator.calculate(config);

console.log('📊 OPTIMIZED SCENARIO:');
console.log();
console.log('INCOME:');
console.log(`  Partner Employment:    CHF ${config.income.employment.partner.toLocaleString()}`);
console.log(`  ALV (Marcel):          CHF ${config.income.alv.toLocaleString()}`);
const totalGross = config.income.employment.partner + config.income.alv;
console.log(`  TOTAL GROSS INCOME:    CHF ${totalGross.toLocaleString()}`);
console.log();

console.log('DEDUCTIONS (ALL OPTIMIZATIONS APPLIED):');
console.log(`  Verheiratetenabzug:    CHF ${result.deductions.income.verheiratetenabzug.toLocaleString()} ✅ FIXED (was CHF 2,600)`);
console.log(`  Kinderabzug (2):       CHF ${result.deductions.income.kinderabzug.toLocaleString()}`);
console.log(`  Säule 3a Partner:      CHF ${config.deductions.saeule3a.partner.toLocaleString()}`);
console.log(`  Säule 3a Marcel:       CHF ${config.deductions.saeule3a.self.toLocaleString()} ⭐ NEW!`);
console.log(`  Total Säule 3a:        CHF ${result.deductions.income.saeule3a.toLocaleString()}`);
console.log(`  Pensionskasse Einkauf: CHF ${result.deductions.income.pensionskasseEinkauf.toLocaleString()} ⭐ NEW!`);
console.log(`  Krankenkasse:          CHF ${result.deductions.income.krankenkasse.toLocaleString()}`);
console.log(`  Berufskosten:          CHF ${result.deductions.income.berufskosten.toLocaleString()} ⭐ OPTIMIZED (15km commute)`);
console.log(`  Kinderbetreuung:       CHF ${result.deductions.income.kinderbetreuung.toLocaleString()} ⭐ NEW!`);
console.log(`  Spenden:               CHF ${result.deductions.income.spenden.toLocaleString()} ⭐ INCREASED`);
console.log(`  -----------------------`);
console.log(`  TOTAL INCOME DEDUCT:   CHF ${result.deductions.totalIncome.toLocaleString()}`);
console.log();

console.log('WEALTH:');
console.log(`  Bank Accounts:         CHF ${config.wealth.bank.toLocaleString()} (reduced by 3a)`);
console.log(`  Säule 3a:              CHF ${config.wealth.saeule3a.toLocaleString()} (tax-free!)`);
console.log(`  TOTAL GROSS WEALTH:    CHF ${result.wealth.gross.toLocaleString()}`);
console.log(`  Wealth Freibetrag:     CHF ${result.deductions.totalWealth.toLocaleString()}`);
console.log(`  TAXABLE WEALTH:        CHF ${result.wealth.taxable.toLocaleString()}`);
console.log();

console.log('TAX CALCULATION:');
console.log(`  Gross Income:          CHF ${totalGross.toLocaleString()}`);
console.log(`  Deductions:            CHF ${result.deductions.totalIncome.toLocaleString()}`);
console.log(`  Taxable Income:        CHF ${result.income.taxable.toLocaleString()}`);
console.log();
console.log(`  Federal Tax:           CHF ${result.taxes.federal.tax.toLocaleString()}`);
console.log(`  Kanton Tax:            CHF ${result.taxes.kanton.kanton.tax.toLocaleString()}`);
console.log(`  Gemeinde Tax:          CHF ${result.taxes.kanton.gemeinde.tax.toLocaleString()}`);
console.log(`  Wealth Tax:            CHF ${result.taxes.wealth.total.toLocaleString()}`);
console.log(`  -----------------------`);
console.log(`  TOTAL TAX:             CHF ${result.summary.totalTax.toLocaleString()}`);
console.log(`  Effective Rate:        ${result.summary.effectiveRate}`);
console.log();

// Calculate savings vs. baseline
const baselineTax = 42463;
const savings = baselineTax - result.summary.totalTax;
const savingsPercent = (savings / baselineTax * 100);

console.log('💰 SAVINGS:');
console.log(`  Baseline Tax:          CHF ${baselineTax.toLocaleString()}`);
console.log(`  Optimized Tax:         CHF ${result.summary.totalTax.toLocaleString()}`);
console.log(`  SAVINGS:               CHF ${savings.toLocaleString()} (${savingsPercent.toFixed(1)}% reduction!)`);
console.log();

console.log('✅ OPTIMIZATIONS APPLIED:');
console.log('  1. ✅ Verheiratetenabzug bug fixed (+CHF 8,000)');
console.log('  2. ⭐ Säule 3a Marcel opened (+CHF 36,288)');
console.log('  3. ⭐ Pensionskasse Einkauf Partner (+CHF 20,000)');
console.log('  4. ⭐ Kinderbetreuung claimed (+CHF 25,000)');
console.log('  5. ⭐ Commuting optimized (+CHF 1,170)');
console.log('  6. ⭐ Donations increased (+CHF 2,500)');
console.log('  TOTAL NEW DEDUCTIONS:  +CHF 92,958');
console.log();

console.log('='.repeat(80));
console.log('NEXT STEPS:');
console.log('1. Open Säule 3a account for Marcel (VIAC/Finpension)');
console.log('2. Contribute CHF 36,288 before Dec 31, 2026');
console.log('3. Check Pensionskasse Einkaufslücke (Partner)');
console.log('4. Verify actual Kinderbetreuung costs');
console.log('5. Measure actual commuting distance');
console.log('6. Generate TaxMe-Online export with optimized values');
console.log('='.repeat(80));
