// ch-calculator.js — Swiss Tax Calculator (Main Orchestrator)
// Coordinates federal, kanton, gemeinde, and wealth tax calculations

const SwissDeductions = require('./deductions.js');
const FederalTax = require('./federal-tax.js');
const KantonTax = require('./kanton-tax.js');
const WealthTax = require('./wealth-tax.js');

class SwissTaxCalculator {
  constructor(year = 2026) {
    this.year = year;
    this.deductions = new SwissDeductions(year);
    this.federalTax = new FederalTax(year);
    this.kantonTax = new KantonTax(year);
    this.wealthTax = new WealthTax(year);
  }

  /**
   * Calculate complete Swiss tax (federal + kanton + gemeinde + wealth)
   * @param {Object} input - Complete input data
   * @returns {Object} - Comprehensive tax breakdown
   */
  calculate(input) {
    // 1. Calculate gross income
    const grossIncome = this._calculateGrossIncome(input.income);

    // 2. Calculate deductions
    const deductionsSummary = this.deductions.getSummary(
      input.income,
      input.deductions,
      input.household,
      input.wealth
    );

    // 3. Calculate taxable income
    const taxableIncome = Math.max(0, grossIncome - deductionsSummary.totalIncome);

    // 4. Calculate federal tax
    const federal = this.federalTax.calculate(
      taxableIncome,
      input.household.maritalStatus
    );

    // 5. Calculate kanton + gemeinde tax
    const kanton = this.kantonTax.calculate(
      taxableIncome,
      input.household.maritalStatus,
      input.household.location?.gemeinde || 'Bern'
    );

    // 6. Calculate wealth tax
    const wealth = this.wealthTax.calculate(
      input.wealth,
      input.household.maritalStatus,
      input.household.location?.gemeinde || 'Bern'
    );

    // 7. Calculate totals
    const totalIncomeTax = federal.tax + kanton.total;
    const totalWealthTax = wealth.total;
    const totalTax = totalIncomeTax + totalWealthTax;

    return {
      year: this.year,
      household: input.household,
      income: {
        gross: Math.round(grossIncome),
        deductions: deductionsSummary.totalIncome,
        taxable: taxableIncome
      },
      wealth: {
        gross: wealth.grossWealth,
        deductions: deductionsSummary.totalWealth,
        taxable: wealth.taxableWealth
      },
      taxes: {
        federal: federal,
        kanton: kanton,
        wealth: wealth
      },
      summary: {
        totalIncomeTax: totalIncomeTax,
        totalWealthTax: totalWealthTax,
        totalTax: totalTax,
        effectiveRate: grossIncome > 0
          ? (totalTax / grossIncome * 100).toFixed(2) + '%'
          : '0%'
      },
      deductions: deductionsSummary
    };
  }

  /**
   * Calculate gross income from all sources
   * @private
   */
  _calculateGrossIncome(income) {
    let total = 0;

    // Employment income
    if (income.employment) {
      total += Object.values(income.employment).reduce((sum, v) => sum + (v || 0), 0);
    }

    // Self-employed income
    if (income.selfEmployed) {
      total += Object.values(income.selfEmployed).reduce((sum, v) => sum + (v || 0), 0);
    }

    // Investment income
    total += income.investment || 0;

    // Other income
    total += income.other || 0;

    return total;
  }

  /**
   * Generate human-readable report
   */
  generateReport(result) {
    const lines = [];
    
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`     SWISS TAX REPORT ${result.year}`);
    lines.push(`     Kanton ${result.household.location?.kanton || 'BE'} — ${result.household.location?.gemeinde || 'Bern'}`);
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('');

    lines.push('HOUSEHOLD INFORMATION');
    lines.push('─────────────────────────────────────────────────────────');
    lines.push(`  Marital Status:     ${result.household.maritalStatus}`);
    lines.push(`  Children:           ${result.household.children || 0}`);
    lines.push('');

    lines.push('INCOME');
    lines.push('─────────────────────────────────────────────────────────');
    lines.push(`  Gross Income:       CHF ${result.income.gross.toLocaleString()}`);
    lines.push(`  Deductions:         CHF ${result.income.deductions.toLocaleString()}`);
    lines.push(`  Taxable Income:     CHF ${result.income.taxable.toLocaleString()}`);
    lines.push('');

    lines.push('WEALTH');
    lines.push('─────────────────────────────────────────────────────────');
    lines.push(`  Gross Wealth:       CHF ${result.wealth.gross.toLocaleString()}`);
    lines.push(`  Deductions:         CHF ${result.wealth.deductions.toLocaleString()}`);
    lines.push(`  Taxable Wealth:     CHF ${result.wealth.taxable.toLocaleString()}`);
    lines.push('');

    lines.push('TAX CALCULATION');
    lines.push('─────────────────────────────────────────────────────────');
    lines.push(`  Federal Tax:        CHF ${result.taxes.federal.tax.toLocaleString()}`);
    lines.push(`  Kanton Tax:         CHF ${result.taxes.kanton.kanton.tax.toLocaleString()}`);
    lines.push(`  Gemeinde Tax:       CHF ${result.taxes.kanton.gemeinde.tax.toLocaleString()}`);
    lines.push(`  Wealth Tax:         CHF ${result.taxes.wealth.total.toLocaleString()}`);
    lines.push('  ───────────────────────────────────────────────────────');
    lines.push(`  TOTAL TAX:          CHF ${result.summary.totalTax.toLocaleString()}`);
    lines.push(`  Effective Rate:     ${result.summary.effectiveRate}`);
    lines.push('');

    lines.push('═══════════════════════════════════════════════════════════');

    return lines.join('\n');
  }
}

/**
 * Standalone calculate function (for CLI/exports)
 */
function calculateSwissTax(input) {
  const calculator = new SwissTaxCalculator(input.year || 2026);
  return calculator.calculate(input);
}

module.exports = { SwissTaxCalculator, calculateSwissTax };

// Example usage:
if (require.main === module) {
  const testInput = {
    year: 2026,
    household: {
      maritalStatus: 'married',
      children: 2,
      location: { kanton: 'BE', gemeinde: 'Bümpliz' }
    },
    income: {
      employment: { partner: 126000 },
      selfEmployed: { self: 72000 },
      investment: 0,
      other: 0
    },
    wealth: {
      bank: 159000,
      securities: 0,
      saeule3a: 0,
      pensionskasse: 0,
      realEstate: 0,
      debts: 0
    },
    deductions: {
      saeule3a: { partner: 7258, self: 0 },
      pensionskasseEinkauf: 0,
      krankenkasse: 6000,
      schuldzinsen: 0,
      berufskosten: 'auto',
      spenden: 500,
      kinderbetreuung: 0
    }
  };

  const result = calculateSwissTax(testInput);
  const calculator = new SwissTaxCalculator(2026);
  
  console.log(calculator.generateReport(result));
  console.log('');
  console.log('DEDUCTION BREAKDOWN');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`  Säule 3a:              CHF ${result.deductions.income.saeule3a.toLocaleString()}`);
  console.log(`  Krankenkasse:          CHF ${result.deductions.income.krankenkasse.toLocaleString()}`);
  console.log(`  Berufskosten:          CHF ${result.deductions.income.berufskosten.toLocaleString()}`);
  console.log(`  Spenden:               CHF ${result.deductions.income.spenden.toLocaleString()}`);
  console.log(`  Verheiratetenabzug:    CHF ${result.deductions.income.verheiratetenabzug.toLocaleString()}`);
  console.log(`  Kinderabzug:           CHF ${result.deductions.income.kinderabzug.toLocaleString()}`);
}
