// deductions.js — Swiss Tax Deductions (Abzüge)
// Handles all income and wealth tax deductions for Kanton Bern

class SwissDeductions {
  constructor(year = 2026) {
    this.year = year;
    
    // Säule 3a limits (2026 ESTIMATE)
    // Source: Based on 2025 limits + inflation adjustment
    // Status: ESTIMATED (official limits not yet published)
    this.limits = {
      saeule3a: {
        withPK: 7258,      // Employee with Pensionskasse (2nd pillar)
        withoutPK: 36288   // Self-employed (20% of income, max)
      },
      berufskosten: {
        flatRate: 0.03,    // 3% of salary (standard deduction)
        min: 2000,         // Minimum CHF 2,000
        max: 4000          // Maximum CHF 4,000
      },
      fahrkosten: {
        max: 7000,         // Maximum CHF 7,000 (2026)
        perKm: 0.75        // CHF 0.75/km (car, 2026 NEW)
      },
      childcare: {
        maxPerChild: 16000 // CHF 16,000 per child under 14 (Kanton Bern)
      },
      kinderabzug: {
        perChild: 8300,    // CHF 8,300 per child (Art. 40 Abs. 3 Bst. a)
        externalEducation: 6400, // +CHF 6,400 if external education
        singleParent: 1300 // +CHF 1,300 if single parent
      },
      verheiratetenabzug: {
        general: 10600     // 5,300 × 2 (Art. 40 Abs. 1)
      },
      zweiverdiener: {
        max: 9500,         // Max CHF 9,500
        rate: 0.02         // 2% of combined earned income
      }
    };
  }

  /**
   * Calculate total income deductions
   * @param {Object} income - Income data
   * @param {Object} deductionData - Deduction inputs
   * @param {Object} household - Household info (marital status, children)
   * @returns {Object} - Breakdown of all deductions
   */
  calculateIncomeDeductions(income, deductionData, household) {
    const deductions = {};

    // 1. Säule 3a (Pillar 3a contributions)
    deductions.saeule3a = this._calculateSaeule3a(
      deductionData.saeule3a || {},
      income
    );

    // 2. Pensionskasse Einkauf (voluntary BVG purchase)
    deductions.pensionskasseEinkauf = deductionData.pensionskasseEinkauf || 0;

    // 3. Krankenkasse (health insurance premiums)
    deductions.krankenkasse = deductionData.krankenkasse || 0;

    // 4. Schuldzinsen (interest on debts, e.g., mortgage)
    deductions.schuldzinsen = deductionData.schuldzinsen || 0;

    // 5. Berufskosten (professional expenses)
    deductions.berufskosten = this._calculateBerufskosten(
      income.employment || {},
      deductionData.berufskosten
    );

    // 6. Spenden (donations)
    deductions.spenden = deductionData.spenden || 0;

    // 7. Verheiratetenabzug (married deduction)
    deductions.verheiratetenabzug = household.maritalStatus === 'married' 
      ? 10600  // Kanton Bern 2026: CHF 5,300 × 2 (Art. 40 Abs. 1) ✅ FIXED
      : 0;

    // 8. Kinderabzug (child deduction)
    deductions.kinderabzug = (household.children || 0) * 8000; // CHF 8k per child (estimate)

    // 9. Childcare costs (Kinderbetreuungskosten)
    deductions.kinderbetreuung = deductionData.kinderbetreuung || 0;

    // Total
    deductions.total = Object.values(deductions)
      .filter(v => typeof v === 'number')
      .reduce((sum, v) => sum + v, 0);

    return deductions;
  }

  /**
   * Calculate wealth deductions (only debts)
   * @param {Object} wealth - Wealth data
   * @returns {Object} - Wealth deductions
   */
  calculateWealthDeductions(wealth) {
    return {
      schulden: wealth.debts || 0, // Debts
      freibetrag: 50000,           // Married freibetrag (Kanton Bern estimate)
      total: (wealth.debts || 0) + 50000
    };
  }

  /**
   * Säule 3a calculation (with limits)
   * Handles separate limits for partner (with PK) and self (without PK)
   * @private
   */
  _calculateSaeule3a(contributions, income) {
    let total = 0;

    // Helper: determine if "self" has 2nd pillar or not
    // ALV recipients and self-employed (no BVG) get the higher limit
    const _hasSelfEmployment = () => {
      if (!income.selfEmployed) return false;
      if (typeof income.selfEmployed === 'number') return income.selfEmployed > 0;
      return Object.values(income.selfEmployed).reduce((s, v) => s + (v || 0), 0) > 0;
    };
    const _hasALV = () => {
      if (income.alv && income.alv > 0) return true;
      // ALV income is often passed via selfEmployed.self for ALV recipients
      // If there's self-employed income but no employment income for 'self',
      // treat as ohne 2. Säule
      return _hasSelfEmployment();
    };

    // Process each contributor key (partner, self, personA, personB, etc.)
    for (const [key, amount] of Object.entries(contributions)) {
      if (typeof amount !== 'number' || amount <= 0) continue;

      // Determine limit based on contributor type
      let limit;
      if (key === 'self') {
        // Self: check if ohne 2. Säule (ALV, self-employed)
        limit = _hasALV() ? this.limits.saeule3a.withoutPK : this.limits.saeule3a.withPK;
      } else {
        // Partner, personA, personB: default to withPK
        // (Assumes most named contributors have employment with BVG)
        limit = this.limits.saeule3a.withPK;
      }

      total += Math.min(amount, limit);
    }

    return total;
  }

  /**
   * Berufskosten (professional expenses)
   * @private
   */
  _calculateBerufskosten(employment, inputValue) {
    // If 'auto', calculate 3% of total employment income
    if (inputValue === 'auto') {
      const totalEmployment = Object.values(employment)
        .reduce((sum, v) => sum + (v || 0), 0);
      return Math.round(totalEmployment * this.limits.berufskosten.flatRate);
    }

    // Otherwise, use provided value
    return inputValue || 0;
  }

  /**
   * Get deduction summary for display
   */
  getSummary(income, deductionData, household, wealth) {
    const incomeDeductions = this.calculateIncomeDeductions(
      income, 
      deductionData, 
      household
    );
    const wealthDeductions = this.calculateWealthDeductions(wealth);

    return {
      income: incomeDeductions,
      wealth: wealthDeductions,
      totalIncome: incomeDeductions.total,
      totalWealth: wealthDeductions.total
    };
  }
}

module.exports = SwissDeductions;

// Example usage:
if (require.main === module) {
  const deductions = new SwissDeductions(2026);

  const testInput = {
    income: {
      employment: { partner: 126000, self: 0 },
      selfEmployed: { self: 72000 }
    },
    deductionData: {
      saeule3a: { partner: 7258, self: 0 },
      krankenkasse: 6000,
      berufskosten: 'auto',
      schuldzinsen: 0,
      spenden: 500,
      kinderbetreuung: 0
    },
    household: {
      maritalStatus: 'married',
      children: 2
    },
    wealth: {
      debts: 0
    }
  };

  const result = deductions.getSummary(
    testInput.income,
    testInput.deductionData,
    testInput.household,
    testInput.wealth
  );

  console.log('Swiss Tax Deductions (Kanton Bern 2026)');
  console.log('=========================================\n');
  console.log('Income Deductions:');
  console.log(`  Säule 3a:              CHF ${result.income.saeule3a.toLocaleString()}`);
  console.log(`  Krankenkasse:          CHF ${result.income.krankenkasse.toLocaleString()}`);
  console.log(`  Berufskosten:          CHF ${result.income.berufskosten.toLocaleString()}`);
  console.log(`  Spenden:               CHF ${result.income.spenden.toLocaleString()}`);
  console.log(`  Verheiratetenabzug:    CHF ${result.income.verheiratetenabzug.toLocaleString()}`);
  console.log(`  Kinderabzug:           CHF ${result.income.kinderabzug.toLocaleString()}`);
  console.log(`  ───────────────────────────────────────`);
  console.log(`  TOTAL:                 CHF ${result.totalIncome.toLocaleString()}\n`);

  console.log('Wealth Deductions:');
  console.log(`  Schulden (Debts):      CHF ${result.wealth.schulden.toLocaleString()}`);
  console.log(`  Freibetrag:            CHF ${result.wealth.freibetrag.toLocaleString()}`);
  console.log(`  ───────────────────────────────────────`);
  console.log(`  TOTAL:                 CHF ${result.totalWealth.toLocaleString()}`);
}
