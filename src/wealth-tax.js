// wealth-tax.js — Swiss Wealth Tax (Vermögenssteuer)
// Kanton + Gemeinde only (no federal wealth tax)

class WealthTax {
  constructor(year = 2026) {
    this.year = year;
    
    // Kanton Bern wealth tax rates (simplified)
    // Source: Kanton Bern Steuergesetz
    // Note: These are ESTIMATES — replace with official rates!
    this.rates = {
      married: {
        freibetrag: 50000,  // Exemption threshold (married)
        rate: 0.0025        // 0.25% (0.25 permille, estimate)
      },
      single: {
        freibetrag: 25000,  // Exemption threshold (single)
        rate: 0.0025        // 0.25%
      }
    };

    // Steuerfuss (municipal multiplier) for Gemeinde
    // Same as Kanton income tax (Stadt Bern: 1.84)
    this.steuerfuss = {
      'Bern': 1.84,
      'Bümpliz': 1.84,
      'default': 1.70
    };
  }

  /**
   * Calculate wealth tax
   * @param {Object} wealth - Wealth breakdown
   * @param {String} maritalStatus - 'married' or 'single'
   * @param {String} gemeinde - Municipality name
   * @returns {Object} - Tax breakdown
   */
  calculate(wealth, maritalStatus = 'married', gemeinde = 'Bern') {
    // 1. Calculate total gross wealth
    const grossWealth = this._calculateGrossWealth(wealth);

    // 2. Subtract debts (Schulden)
    const netWealth = grossWealth - (wealth.debts || 0);

    // 3. Apply Freibetrag (exemption)
    const config = this.rates[maritalStatus] || this.rates.married;
    const taxableWealth = Math.max(0, netWealth - config.freibetrag);

    // 4. Calculate Kanton base tax
    const kantonTax = Math.round(taxableWealth * config.rate);

    // 5. Apply Gemeinde multiplier
    const multiplier = this.steuerfuss[gemeinde] || this.steuerfuss['default'];
    const gemeindeTax = Math.round(kantonTax * multiplier);

    return {
      grossWealth: Math.round(grossWealth),
      debts: Math.round(wealth.debts || 0),
      netWealth: Math.round(netWealth),
      freibetrag: config.freibetrag,
      taxableWealth: Math.round(taxableWealth),
      kanton: {
        rate: config.rate,
        tax: kantonTax
      },
      gemeinde: {
        name: gemeinde,
        steuerfuss: multiplier,
        tax: gemeindeTax
      },
      total: kantonTax + gemeindeTax,
      effectiveRate: netWealth > 0
        ? ((kantonTax + gemeindeTax) / netWealth * 100).toFixed(4) + '%'
        : '0%'
    };
  }

  /**
   * Calculate gross wealth from components
   * @private
   */
  _calculateGrossWealth(wealth) {
    return (
      (wealth.bank || 0) +
      (wealth.securities || 0) +
      (wealth.saeule3a || 0) +
      (wealth.pensionskasse || 0) +
      (wealth.realEstate || 0)
    );
  }

  /**
   * Get wealth breakdown for display
   */
  getWealthBreakdown(wealth) {
    const components = {
      bank: wealth.bank || 0,
      securities: wealth.securities || 0,
      saeule3a: wealth.saeule3a || 0,
      pensionskasse: wealth.pensionskasse || 0,
      realEstate: wealth.realEstate || 0,
      debts: -(wealth.debts || 0)
    };

    components.total = Object.values(components)
      .reduce((sum, v) => sum + v, 0);

    return components;
  }
}

module.exports = WealthTax;

// Example usage:
if (require.main === module) {
  const wealthTax = new WealthTax(2026);

  // Test case: Marcel's household
  const wealth = {
    bank: 159000,        // From credit module
    securities: 0,
    saeule3a: 0,         // To be filled from bank statements
    pensionskasse: 0,    // Partner's PK statement
    realEstate: 0,       // Renting
    debts: 0             // No mortgage or loans
  };

  const result = wealthTax.calculate(wealth, 'married', 'Bümpliz');

  console.log('Swiss Wealth Tax (Vermögenssteuer) — 2026');
  console.log('===========================================\n');
  
  const breakdown = wealthTax.getWealthBreakdown(wealth);
  console.log('Wealth Breakdown:');
  console.log(`  Bank Accounts:       CHF ${breakdown.bank.toLocaleString()}`);
  console.log(`  Securities:          CHF ${breakdown.securities.toLocaleString()}`);
  console.log(`  Säule 3a:            CHF ${breakdown.saeule3a.toLocaleString()}`);
  console.log(`  Pensionskasse:       CHF ${breakdown.pensionskasse.toLocaleString()}`);
  console.log(`  Real Estate:         CHF ${breakdown.realEstate.toLocaleString()}`);
  console.log(`  Debts:               CHF ${breakdown.debts.toLocaleString()}`);
  console.log(`  ───────────────────────────────────────`);
  console.log(`  Net Wealth:          CHF ${result.netWealth.toLocaleString()}\n`);

  console.log('Tax Calculation:');
  console.log(`  Freibetrag:          CHF ${result.freibetrag.toLocaleString()}`);
  console.log(`  Taxable Wealth:      CHF ${result.taxableWealth.toLocaleString()}`);
  console.log(`  Kanton Base Tax:     CHF ${result.kanton.tax.toLocaleString()}`);
  console.log(`  Gemeinde (${result.gemeinde.name}): CHF ${result.gemeinde.tax.toLocaleString()} (Steuerfuss ${result.gemeinde.steuerfuss})`);
  console.log(`  ───────────────────────────────────────`);
  console.log(`  TOTAL:               CHF ${result.total.toLocaleString()}`);
  console.log(`  Effective Rate:      ${result.effectiveRate}`);
}
