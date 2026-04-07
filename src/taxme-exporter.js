// taxme-exporter.js — TaxMe-Online Export
// Generate TaxMe-Online compatible JSON/CSV for Kanton Bern

class TaxMeExporter {
  constructor(year = 2026) {
    this.year = year;
  }

  /**
   * Export to TaxMe-Online JSON format
   * @param {Object} taxResult - Result from ch-calculator.js
   * @param {Object} rawInput - Original input data (for details)
   * @returns {Object} - TaxMe-Online compatible JSON
   */
  toJSON(taxResult, rawInput) {
    return {
      version: '2026.1',
      steuerperiode: this.year,
      
      // 1. Personal Data
      personalien: this._exportPersonalData(taxResult.household, rawInput),
      
      // 2. Income Section
      einkommen: this._exportIncome(taxResult, rawInput),
      
      // 3. Wealth Section
      vermoegen: this._exportWealth(taxResult, rawInput),
      
      // 4. Deductions Section
      abzuege: this._exportDeductions(taxResult.deductions, rawInput),
      
      // 5. Tax Summary (for verification)
      steuern: {
        bund: taxResult.taxes.federal.tax,
        kanton: taxResult.taxes.kanton.kanton.tax,
        gemeinde: taxResult.taxes.kanton.gemeinde.tax,
        vermoegenssteuer: taxResult.taxes.wealth.total,
        total: taxResult.summary.totalTax
      }
    };
  }

  /**
   * Export to CSV format (for manual import)
   * @param {Object} taxResult - Result from ch-calculator.js
   * @returns {String} - CSV data
   */
  toCSV(taxResult) {
    const rows = [];
    
    // Header
    rows.push('Section,Field,Value');
    
    // Income
    rows.push(`Income,Gross Income,${taxResult.income.gross}`);
    rows.push(`Income,Taxable Income,${taxResult.income.taxable}`);
    
    // Wealth
    rows.push(`Wealth,Gross Wealth,${taxResult.wealth.gross}`);
    rows.push(`Wealth,Taxable Wealth,${taxResult.wealth.taxable}`);
    
    // Taxes
    rows.push(`Tax,Federal Tax,${taxResult.taxes.federal.tax}`);
    rows.push(`Tax,Kanton Tax,${taxResult.taxes.kanton.kanton.tax}`);
    rows.push(`Tax,Gemeinde Tax,${taxResult.taxes.kanton.gemeinde.tax}`);
    rows.push(`Tax,Wealth Tax,${taxResult.taxes.wealth.total}`);
    rows.push(`Tax,Total Tax,${taxResult.summary.totalTax}`);
    
    return rows.join('\n');
  }

  /**
   * Personal data section
   * @private
   */
  _exportPersonalData(household, rawInput) {
    return {
      zivilstand: household.maritalStatus === 'married' ? 'verheiratet' : 'ledig',
      kinder: household.children || 0,
      wohnort: {
        kanton: household.location?.kanton || 'BE',
        gemeinde: household.location?.gemeinde || 'Bern',
        adresse: rawInput.address || {} // Optional
      },
      ahvNummer: rawInput.ahvNummer || null, // To be filled manually
      zpvNummer: rawInput.zpvNummer || null  // To be filled manually
    };
  }

  /**
   * Income section
   * @private
   */
  _exportIncome(taxResult, rawInput) {
    const income = rawInput.income;
    
    return {
      unselbstaendig: this._exportEmploymentIncome(income.employment),
      selbstaendig: this._exportSelfEmployedIncome(income.selfEmployed),
      kapitalertraege: income.investment || 0,
      uebrigeEinkuenfte: income.other || 0,
      bruttoEinkommen: taxResult.income.gross,
      steuerbaresEinkommen: taxResult.income.taxable
    };
  }

  /**
   * Employment income (Lohnausweis data)
   * @private
   */
  _exportEmploymentIncome(employment) {
    if (!employment) return [];
    
    return Object.entries(employment).map(([person, amount]) => ({
      person,
      bruttolohn: amount,
      ahvBeitraege: Math.round(amount * 0.0525), // Estimate: 5.25% AHV
      pensionskasse: null, // From Lohnausweis
      bvg: null,           // From Lohnausweis
      nbuv: null,          // From Lohnausweis
      nettolohn: amount    // Simplified
    }));
  }

  /**
   * Self-employed income (Geschäftsabschluss)
   * @private
   */
  _exportSelfEmployedIncome(selfEmployed) {
    if (!selfEmployed) return [];
    
    return Object.entries(selfEmployed).map(([person, amount]) => ({
      person,
      umsatz: amount,           // Revenue (simplified)
      ausgaben: 0,              // From EÜR
      gewinn: amount,           // Profit (simplified)
      ahvBeitraege: Math.round(amount * 0.0956) // Estimate: 9.56% AHV (self-employed)
    }));
  }

  /**
   * Wealth section
   * @private
   */
  _exportWealth(taxResult, rawInput) {
    const wealth = rawInput.wealth;
    
    return {
      bankkonten: [
        { typ: 'Sparkonto', betrag: wealth.bank || 0 }
      ],
      wertschriften: wealth.securities || 0,
      saeule3a: [
        { bank: 'TBD', betrag: wealth.saeule3a || 0 }
      ],
      pensionskasse: wealth.pensionskasse || 0,
      liegenschaften: wealth.realEstate || 0,
      schulden: wealth.debts || 0,
      bruttoVermoegen: taxResult.wealth.gross,
      steuerbaresVermoegen: taxResult.wealth.taxable
    };
  }

  /**
   * Deductions section
   * @private
   */
  _exportDeductions(deductions, rawInput) {
    return {
      saeule3a: deductions.income.saeule3a,
      pensionskasseEinkauf: deductions.income.pensionskasseEinkauf,
      krankenkasse: deductions.income.krankenkasse,
      schuldzinsen: deductions.income.schuldzinsen,
      berufskosten: deductions.income.berufskosten,
      spenden: deductions.income.spenden,
      verheiratetenabzug: deductions.income.verheiratetenabzug,
      kinderabzug: deductions.income.kinderabzug,
      kinderbetreuung: deductions.income.kinderbetreuung,
      totalAbzuege: deductions.totalIncome
    };
  }
}

module.exports = TaxMeExporter;

// Example usage:
if (require.main === module) {
  const { calculateSwissTax } = require('./ch-calculator.js');
  const exporter = new TaxMeExporter(2026);

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
    },
    ahvNummer: '756.XXXX.XXXX.XX', // Example
    zpvNummer: 'XXXX-XXXX-XXXX'    // Example
  };

  // Calculate taxes
  const taxResult = calculateSwissTax(testInput);

  // Export to JSON
  const jsonExport = exporter.toJSON(taxResult, testInput);
  console.log('TaxMe-Online JSON Export');
  console.log('========================\n');
  console.log(JSON.stringify(jsonExport, null, 2));

  // Export to CSV
  console.log('\n\nTaxMe-Online CSV Export');
  console.log('=======================\n');
  console.log(exporter.toCSV(taxResult));
}
