// kanton-tax.js — Kanton Bern + Gemeinde Tax
// Progressive cantonal tax + municipal multiplier (Steuerfuss)

class KantonTax {
  constructor(year = 2026) {
    this.year = year;
    
    // Kanton Bern "einfache Steuer" 2026 (OFFICIAL)
    // Source: EStV Kantonsblatt Bern (be-de.pdf)
    // Status: OFFICIAL (February 2026)
    // Note: These rates are for "einfache Steuer" — multiply by Steuerfuss!
    
    this.tariff = {
      married: [
        { from: 0,      to: 3300,     rate: 0.0155 },
        { from: 3300,   to: 6600,     rate: 0.0165 },
        { from: 6600,   to: 16400,    rate: 0.0285 },
        { from: 16400,  to: 32500,    rate: 0.0365 },
        { from: 32500,  to: 59400,    rate: 0.0380 },
        { from: 59400,  to: 86300,    rate: 0.0430 },
        { from: 86300,  to: 113200,   rate: 0.0485 },
        { from: 113200, to: 140100,   rate: 0.0520 },
        { from: 140100, to: 181800,   rate: 0.0570 },
        { from: 181800, to: 236100,   rate: 0.0585 },
        { from: 236100, to: 290400,   rate: 0.0595 },
        { from: 290400, to: 344700,   rate: 0.0620 },
        { from: 344700, to: 486000,   rate: 0.0640 },
        { from: 486000, to: Infinity, rate: 0.0650 }
      ],
      single: [
        { from: 0,      to: 3300,     rate: 0.0195 },
        { from: 3300,   to: 6600,     rate: 0.0290 },
        { from: 6600,   to: 16400,    rate: 0.0360 },
        { from: 16400,  to: 32500,    rate: 0.0415 },
        { from: 32500,  to: 59400,    rate: 0.0445 },
        { from: 59400,  to: 86300,    rate: 0.0500 },
        { from: 86300,  to: 113200,   rate: 0.0560 },
        { from: 113200, to: 140100,   rate: 0.0575 },
        { from: 140100, to: 167000,   rate: 0.0590 },
        { from: 167000, to: 193900,   rate: 0.0605 },
        { from: 193900, to: 231600,   rate: 0.0615 },
        { from: 231600, to: 318500,   rate: 0.0630 },
        { from: 318500, to: 470600,   rate: 0.0640 },
        { from: 470600, to: Infinity, rate: 0.0650 }
      ]
    };

    // Kanton Bern Steuerfuss 2026
    this.kantonSteuerfuss = 3.06; // OFFICIAL (Art. 247 StG)

    // Gemeinde Steuerfuss 2026 (estimated for Stadt Bern)
    // Source: Stadt Bern (stable since 2023)
    this.steuerfuss = {
      'Bern': 1.84,        // Stadt Bern (ESTIMATE: same as 2025)
      'Bümpliz': 1.84,     // Part of Stadt Bern
      'default': 1.70      // Average for other Bern municipalities
    };
  }

  /**
   * Calculate Kanton Bern tax ("einfache Steuer" × Steuerfuss)
   * @param {Number} taxableIncome - Taxable income (same as federal)
   * @param {String} maritalStatus - 'married' or 'single'
   * @param {String} gemeinde - Municipality name (e.g., 'Bern', 'Bümpliz')
   * @returns {Object} - Tax breakdown
   */
  calculate(taxableIncome, maritalStatus = 'married', gemeinde = 'Bern') {
    // 1. Calculate "einfache Steuer" (base Kanton tax)
    const einfacheSteuer = this._calculateEinfacheSteuer(taxableIncome, maritalStatus);
    
    // 2. Apply Kanton Steuerfuss
    const kantonTax = Math.round(einfacheSteuer * this.kantonSteuerfuss);
    
    // 3. Apply Gemeinde Steuerfuss
    const gemeindeSteuerfuss = this.steuerfuss[gemeinde] || this.steuerfuss['default'];
    const gemeindeTax = Math.round(einfacheSteuer * gemeindeSteuerfuss);

    // 4. Total Kanton + Gemeinde
    const totalSteuerfuss = this.kantonSteuerfuss + gemeindeSteuerfuss;
    const totalTax = kantonTax + gemeindeTax;

    return {
      taxableIncome: Math.round(taxableIncome),
      einfacheSteuer,
      kanton: {
        steuerfuss: this.kantonSteuerfuss,
        tax: kantonTax
      },
      gemeinde: {
        name: gemeinde,
        steuerfuss: gemeindeSteuerfuss,
        tax: gemeindeTax
      },
      total: totalTax,
      totalSteuerfuss,
      effectiveRate: taxableIncome > 0
        ? (totalTax / taxableIncome * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Calculate "einfache Steuer" (Kanton Bern base tax before multiplier)
   * @private
   */
  _calculateEinfacheSteuer(taxableIncome, maritalStatus) {
    const brackets = this.tariff[maritalStatus] || this.tariff.married;
    let totalTax = 0;

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.from) break;

      const taxableInBracket = Math.min(
        taxableIncome - bracket.from,
        bracket.to - bracket.from
      );

      totalTax += taxableInBracket * bracket.rate;
    }

    return Math.round(totalTax);
  }

  /**
   * Get available municipalities with Steuerfuss
   */
  getMunicipalities() {
    return this.steuerfuss;
  }
}

module.exports = KantonTax;

// Example usage:
if (require.main === module) {
  const kantonTax = new KantonTax(2026);

  // Test case: Marcel's household (Stadt Bern, Bümpliz)
  const taxableIncome = 168000; // After deductions
  const result = kantonTax.calculate(taxableIncome, 'married', 'Bümpliz');

  console.log('Kanton Bern Tax (+ Gemeinde) — 2026 OFFICIAL');
  console.log('=============================================\n');
  console.log(`Taxable Income:       CHF ${result.taxableIncome.toLocaleString()}`);
  console.log(`Einfache Steuer:      CHF ${result.einfacheSteuer.toLocaleString()}`);
  console.log(`Kanton Tax (${result.kanton.steuerfuss}):  CHF ${result.kanton.tax.toLocaleString()}`);
  console.log(`Gemeinde ${result.gemeinde.name} (${result.gemeinde.steuerfuss}): CHF ${result.gemeinde.tax.toLocaleString()}`);
  console.log(`───────────────────────────────────────────`);
  console.log(`TOTAL:                CHF ${result.total.toLocaleString()}`);
  console.log(`Effective Rate:       ${result.effectiveRate}`);
  console.log(`Total Steuerfuss:     ${result.totalSteuerfuss}\n`);
}
