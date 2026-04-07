# Federal Tax (Direkte Bundessteuer) 2026

**Source:** EStV Form 58c (dbst-tairfe-58c-2026-dfi.pdf)  
**Status:** OFFICIAL  
**Effective:** Tax year 2026

---

## 1. Single Persons Tariff (Alleinstehende)

| Taxable Income Bracket (CHF) | Base Tax (CHF) | Marginal Rate |
|------------------------------|----------------|---------------|
| 0 – 18,500 | 0.00 | 0% |
| 18,500.01 – 38,000 | 25.41 | 0.77% |
| 38,000.01 – 53,400 | 180.84 | 0.88% |
| 53,400.01 – 61,300 | 490.56 | 2.64% |
| 61,300.01 – 76,200 | 710.01 | 2.97% |
| 76,200.01 – 82,100 | 1,152.50 | 5.94% |
| 82,100.01 – 94,900 | 1,502.95 | 6.60% |
| 94,900.01 – 120,600 | 2,347.75 | 8.80% |
| 120,600.01 – 150,400 | 4,301.35 | 11.00% |
| 150,400.01 – 186,000 | 7,119.55 | 13.20% |
| Over 186,000 | 11,815.55 | **11.50%** (max) |

---

## 2. Married Couples & Single-Parent Families (Verheiratete und Einelternfamilien)

| Taxable Income Bracket (CHF) | Base Tax (CHF) | Marginal Rate |
|------------------------------|----------------|---------------|
| 0 – 33,100 | 0.00 | 0% |
| 33,100.01 – 43,500 | 34.00 | 1.00% |
| 43,500.01 – 57,900 | 138.00 | 2.00% |
| 57,900.01 – 79,100 | 327.00 | 3.00% |
| 79,100.01 – 85,000 | 929.00 | 4.00% |
| 85,000.01 – 108,700 | 1,165.00 | 5.00% |
| 108,700.01 – 130,500 | 2,251.00 | 6.00% |
| 130,500.01 – 138,400 | 3,658.00 | 7.00% |
| 138,400.01 – 141,500 | 4,290.00 | 8.00% |
| 141,500.01 – 144,300 | 4,569.00 | 9.00% |
| 144,300.01 – 148,300 | 4,821.00 | 10.00% |
| 148,300.01 – 152,400 | 5,221.00 | 11.00% |
| 152,400.01 – 155,000 | 5,692.00 | 12.00% |
| 155,000.01 – 793,900 | 6,030.00 | 13.00% |
| Over 793,900 | 89,087.00 | **11.50%** (max) |

**Note:** Top marginal rate capped at 11.5% for very high incomes.

---

## 3. Federal Deductions (Tax Credits)

### Child / Dependent Person Tax Credit
- **Amount:** CHF 263 per child/dependent (2026)
- **Change from 2025:** +CHF 8 (was CHF 255)
- **Applied to:** Final tax amount (not from income)

### Verheiratetenabzug (Married Deduction)
- Built into the Married Couples tariff (higher brackets = lower effective tax)

---

## 4. Changes 2025 → 2026

| Item | 2025 | 2026 |
|------|------|------|
| Income brackets | Lower thresholds | **Increased** (inflation adjustment) |
| Child tax credit | CHF 255 | **CHF 263** |
| Marginal rates | Same structure | Same structure |

**Purpose:** Combat "kalte Progression" (cold progression / bracket creep)

---

## 5. Implementation Notes

**Tax calculation:**
1. Apply deductions to gross income → taxable income
2. Look up bracket in table above
3. Calculate: `Base Tax + (Taxable Income - Bracket Start) × Marginal Rate`
4. Subtract child tax credit (CHF 263 × number of children)

**Example (Married, CHF 100k taxable income):**
- Falls in bracket: 85,000.01 – 108,700
- Base tax: CHF 1,165
- Additional: (100,000 - 85,000) × 5% = CHF 750
- **Total Federal Tax:** CHF 1,915
- With 2 children: CHF 1,915 - (2 × 263) = **CHF 1,389**

---

**Source file:** `federal-tax-2026.pdf`  
**Downloaded:** 2026-04-06  
**URL:** https://www.estv.admin.ch/dam/de/sd-web/gnde9CmEsalK/dbst-tairfe-58c-2026-dfi.pdf
