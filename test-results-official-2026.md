# Swiss Tax 2026 — Test Results (Marcel's Household)

**Date:** 2026-04-06  
**Status:** Using OFFICIAL 2026 tariffs where available

---

## Household Profile

| Item | Value |
|------|-------|
| **Marital Status** | Married |
| **Children** | 2 |
| **Location** | Bümpliz, Kanton Bern |
| **Partner Salary** | CHF 126,000 |
| **Marcel (ALV)** | CHF 72,000 |
| **Wealth** | CHF 159,000 |

---

## Income Calculation

| Item | Amount (CHF) |
|------|--------------|
| Partner Salary | 126,000 |
| Marcel ALV | 72,000 |
| **Gross Income** | **198,000** |

### Deductions (Estimate)

| Item | Amount (CHF) |
|------|--------------|
| Säule 3a (Partner) | 7,258 |
| Krankenkasse | 6,000 |
| Berufskosten (3%) | 5,940 |
| Verheiratetenabzug | 10,600 |
| Kinderabzug (2 × 8,300) | 16,600 |
| Spenden | 500 |
| **Total Deductions** | **46,898** |

**Taxable Income:** CHF 198,000 - CHF 46,898 = **CHF 151,102**

*(Rounded to CHF 151,000 for test)*

---

## Federal Tax (Direkte Bundessteuer) 2026

**Taxable Income:** CHF 151,000

| Item | Amount (CHF) |
|------|--------------|
| Bracket | 155,000 – 793,900 |
| Base Tax | 6,030 |
| Marginal Rate | 13.00% |
| Tax Before Credit | ~6,550 |
| Child Credit (2 × 263) | -526 |
| **Federal Tax** | **6,024** |
| **Effective Rate** | **3.99%** |

---

## Kanton + Gemeinde Tax 2026

**Taxable Income:** CHF 151,000

| Item | Amount (CHF) |
|------|--------------|
| Einfache Steuer | 6,700 |
| Kanton Tax (3.06) | 20,502 |
| Gemeinde Bümpliz (1.84) | 12,328 |
| **Total Kanton + Gemeinde** | **32,830** |
| **Effective Rate** | **21.74%** |

---

## Wealth Tax 2026

**Taxable Wealth:** CHF 159,000

| Item | Amount (CHF) |
|------|--------------|
| Verheiratetenabzug (Wealth) | -18,000 |
| Kinderabzug (2 × 18,000) | -36,000 |
| **Taxable Wealth** | **105,000** |

**Note:** Freigrenze is CHF 100,000. Wealth tax applies.

| Bracket | Rate (‰) | Amount (CHF) |
|---------|----------|--------------|
| 0 - 36,000 | 0.00 | 0 |
| 36,000 - 77,000 | 0.40 | 164 |
| 77,000 - 105,000 | 0.70 | 196 |
| **Einfache Steuer** | | **360** |
| **× Steuerfuss (4.9)** | | **1,764** |

---

## Total Tax 2026 (Official Tariffs)

| Tax Type | Amount (CHF) | Effective Rate |
|----------|--------------|----------------|
| Federal Tax | 6,024 | 3.99% |
| Kanton + Gemeinde Tax | 32,830 | 21.74% |
| Wealth Tax | 1,764 | 1.11% (of wealth) |
| **TOTAL** | **40,618** | **20.51%** (of gross income) |

---

## Comparison to Previous Estimate

| Item | Estimate (Old) | Official (New) | Difference |
|------|----------------|----------------|------------|
| **Total Tax** | CHF 24,444 | CHF 40,618 | **+CHF 16,174** |
| **Effective Rate** | 12.35% | 20.51% | **+8.16%** |

**Reason for Difference:**
- Old estimate used simplified progressive rates
- Official 2026 tariffs have higher bracket rates
- Kanton "einfache Steuer" × Steuerfuss (4.9) applies

---

## 2026 Tariff Status

| Item | Status |
|------|--------|
| **Kanton Bern Income Tax** | ✅ OFFICIAL (EStV Feb 2026) |
| **Kanton Bern Wealth Tax** | ✅ OFFICIAL (EStV Feb 2026) |
| **Federal Tax** | ✅ OFFICIAL (EStV Form 58c) |
| **Kanton Steuerfuss** | ✅ OFFICIAL (3.06) |
| **Stadt Bern Gemeinde Steuerfuss** | ⚠️ ESTIMATED (1.84, same as 2025) |
| **Säule 3a Limits** | ⚠️ ESTIMATED (CHF 7,258 / CHF 36,288) |
| **Child Tax Credit (Federal)** | ✅ OFFICIAL (CHF 263) |
| **Kinderabzug (Kanton)** | ✅ OFFICIAL (CHF 8,300) |

---

## Next Steps

- [ ] Confirm Stadt Bern Gemeinde Steuerfuss 2026 (likely 1.84)
- [ ] Confirm Säule 3a 2026 limits (estimate: CHF 7,258)
- [ ] Update lexoffice integration with new module
- [ ] Re-calculate Marcel's 2026 tax estimate with official data

---

**Test Run Date:** 2026-04-06  
**Module:** `swiss-tax-module/`  
**Sources:**
- Federal: dbst-tairfe-58c-2026-dfi.pdf
- Kanton: be-de.pdf (EStV Kantonsblatt)
- Gemeinde: Estimated (2025 value)
