// federal-tax.js — Swiss Federal Tax (Direkte Bundessteuer)
// Progressive taxation for natural persons (Privatpersonen)

class FederalTax {
  constructor(year = 2026) {
    this.year = year;
    
    // Federal tax tariff 2026 (OFFICIAL EStV Form 58c)
    // Source: dbst-tairfe-58c-2026-dfi.pdf
    // Status: OFFICIAL (April 2026)
    
    // Child tax credit (applied after calculation)
    this.childTaxCredit = 263; // CHF per child (2026)
    
    this.tariff = {
      married: [
        { from: 0,      to: 33100,   baseTax: 0,       rate: 0.0000 },
        { from: 33100,  to: 43500,   baseTax: 34,      rate: 0.0100 },
        { from: 43500,  to: 57900,   baseTax: 138,     rate: 0.0200 },
        { from: 57900,  to: 79100,   baseTax: 327,     rate: 0.0300 },
        { from: 79100,  to: 85000,   baseTax: 929,     rate: 0.0400 },
        { from: 85000,  to: 108700,  baseTax: 1165,    rate: 0.0500 },
        { from: 108700, to: 130500,  baseTax: 2251,    rate: 0.0600 },
        { from: 130500, to: 138400,  baseTax: 3658,    rate: 0.0700 },
        { from: 138400, to: 141500,  baseTax: 4290,    rate: 0.0800 },
        { from: 141500, to: 144300,  baseTax: 4569,    rate: 0.0900 },
        { from: 144300, to: 148300,  baseTax: 4821,    rate: 0.1000 },
        { from: 148300, to: 152400,  baseTax: 5221,    rate: 0.1100 },
        { from: 152400, to: 155000,  baseTax: 5692,    rate: 0.1200 },
        { from: 155000, to: 793900,  baseTax: 6030,    rate: 0.1300 },
        { from: 793900, to: Infinity, baseTax: 89087,  rate: 0.1150 }
      ],
      single: [
        { from: 0,      to: 18500,   baseTax: 0,       rate: 0.0000 },
        { from: 18500,  to: 38000,   baseTax: 25.41,   rate: 0.0077 },
        { from: 38000,  to: 53400,   baseTax: 180.84,  rate: 0.0088 },
        { from: 53400,  to: 61300,   baseTax: 490.56,  rate: 0.0264 },
        { from: 61300,  to: 76200,   baseTax: 710.01,  rate: 0.0297 },
        { from: 76200,  to: 82100,   baseTax: 1152.50, rate: 0.0594 },
        { from: 82100,  to: 94900,   baseTax: 1502.95, rate: 0.0660 },
        { from: 94900,  to: 120600,  baseTax: 2347.75, rate: 0.0880 },
        { from: 120600, to: 150400,  baseTax: 4301.35, rate: 0.1100 },
        { from: 150400, to: 186000,  baseTax: 7119.55, rate: 0.1320 },
        { from: 186000, to: Infinity, baseTax: 11815.55, rate: 0.1150 }
      ]
    };
  }

  /**
   * Calculate federal tax (EStV bracket formula)
   * @param {Number} taxableIncome - Taxable income (Reineinkommen) after deductions
   * @param {String} maritalStatus - 'married' or 'single'
   * @param {Number} children - Number of children (for tax credit)
   * @returns {Object} - Tax breakdown
   */
  calculate(taxableIncome, maritalStatus = 'married', children = 0) {
    const brackets = this.tariff[maritalStatus] || this.tariff.married;
    
    // Find the applicable bracket
    let bracket = brackets[0];
    for (const b of brackets) {
      if (taxableIncome >= b.from && taxableIncome < b.to) {
        bracket = b;
        break;
      }
      if (taxableIncome >= b.from) bracket = b; // Last bracket (Infinity)
    }

    // Calculate: Base Tax + (Income - Bracket Start) × Marginal Rate
    const taxableInBracket = taxableIncome - bracket.from;
    const taxBeforeCredit = Math.round(bracket.baseTax + (taxableInBracket * bracket.rate));
    
    // Apply child tax credit
    const childCredit = children * this.childTaxCredit;
    const totalTax = Math.max(0, taxBeforeCredit - childCredit);

    return {
      taxableIncome: Math.round(taxableIncome),
      taxBeforeCredit,
      childCredit,
      tax: totalTax,
      effectiveRate: taxableIncome > 0 
        ? (totalTax / taxableIncome * 100).toFixed(2) + '%'
        : '0%',
      bracket: {
        from: bracket.from,
        to: bracket.to,
        baseTax: bracket.baseTax,
        marginalRate: (bracket.rate * 100).toFixed(2) + '%'
      }
    };
  }

  /**
   * Get tariff table for display
   */
  getTariff(maritalStatus = 'married') {
    return this.tariff[maritalStatus];
  }
}

module.exports = FederalTax;

// Example usage:
if (require.main === module) {
  const federalTax = new FederalTax(2026);

  // Test case: Marcel's household
  // Gross income: CHF 126k (partner) + CHF 72k (Marcel) = CHF 198k
  // Deductions: ~CHF 30k (estimate)
  // Taxable income: CHF 168k
  // Children: 2

  const taxableIncome = 168000;
  const result = federalTax.calculate(taxableIncome, 'married', 2);

  console.log('Swiss Federal Tax (Direkte Bundessteuer) — 2026 OFFICIAL');
  console.log('========================================================\n');
  console.log(`Taxable Income:       CHF ${result.taxableIncome.toLocaleString()}`);
  console.log(`Bracket:              CHF ${result.bracket.from.toLocaleString()} – ${result.bracket.to === Infinity ? '∞' : result.bracket.toLocaleString()}`);
  console.log(`Base Tax:             CHF ${result.bracket.baseTax.toLocaleString()}`);
  console.log(`Marginal Rate:        ${result.bracket.marginalRate}`);
  console.log(`Tax Before Credit:    CHF ${result.taxBeforeCredit.toLocaleString()}`);
  console.log(`Child Credit (2):     CHF ${result.childCredit.toLocaleString()}`);
  console.log(`Final Federal Tax:    CHF ${result.tax.toLocaleString()}`);
  console.log(`Effective Rate:       ${result.effectiveRate}\n`);
}
