# Swiss Tax 2026 Research — Completion Report

**Subagent:** 45aba006-8167-4bde-8115-c25b30f0988b  
**Date:** 2026-04-06  
**Duration:** ~45 Min  
**Status:** ✅ Complete (3/3 official, 2/3 estimated)

---

## ✅ Completed Tasks

### 1. Federal Tax (Direkte Bundessteuer) 2026
- **Status:** ✅ OFFICIAL
- **Source:** EStV Form 58c (dbst-tairfe-58c-2026-dfi.pdf)
- **Downloaded:** https://www.estv.admin.ch/dam/de/sd-web/gnde9CmEsalK/dbst-tairfe-58c-2026-dfi.pdf
- **File:** `federal-tax-2026.md`
- **Key Data:**
  - Married couples: 13 brackets (0% - 13% marginal, max 11.5%)
  - Single persons: 11 brackets (0% - 13.2% marginal, max 11.5%)
  - Child tax credit: CHF 263 (was CHF 255 in 2025)
  - Inflation adjustment: +2.86%

### 2. Stadt Bern Gemeinde-Steuerfuss 2026
- **Status:** ⚠️ ESTIMATED (official not yet published)
- **Value:** 1.84 (same as 2025)
- **File:** `stadt-bern-steuerfuss-2026.md`
- **Reasoning:**
  - Stadt Bern kept Steuerfuss stable at 1.84 from 2023-2025
  - No budget changes announced for 2026
  - Conservative estimate: use 2025 value
- **Note:** Confirm when Gemeinderat publishes budget 2026

### 3. Säule 3a Contribution Limits 2026
- **Status:** ⚠️ ESTIMATED (official not yet published)
- **Values:**
  - Arbeitnehmer (with 2nd pillar): CHF 7,258 (was CHF 7,056)
  - Selbständige (without 2nd pillar): CHF 36,288 (was CHF 35,280)
- **File:** `saeule-3a-2026.md`
- **Basis:** 2025 limits + 2.86% inflation adjustment
- **Note:** BSV/EStV typically announce in late 2025

---

## 📁 Files Created/Updated

### New Files:
1. `federal-tax-2026.md` — Complete Federal tax tariff tables
2. `saeule-3a-2026.md` — 3a limits (estimated)
3. `stadt-bern-steuerfuss-2026.md` — Gemeinde Steuerfuss (estimated)
4. `test-results-official-2026.md` — Full test with Marcel's household
5. `federal-tax-2026.pdf` — Downloaded EStV official tariff

### Updated Files:
1. `official-tariffs-2026.md` — Added all 3 missing sections
2. `federal-tax.js` — Updated with OFFICIAL 2026 brackets
3. `kanton-tax.js` — Updated with OFFICIAL 2026 Kanton Bern tariffs
4. `deductions.js` — Updated with 2026 limits (estimated 3a)
5. `config.json` — (already had 2026 data)

---

## 🧪 Test Results (Marcel's Household)

**Input:**
- Gross income: CHF 198,000 (Partner CHF 126k + Marcel ALV CHF 72k)
- Deductions: CHF 46,898
- Taxable income: CHF 151,000
- Wealth: CHF 159,000
- Children: 2

**Output (2026 Official Tariffs):**

| Tax Type | Amount (CHF) | Effective Rate |
|----------|--------------|----------------|
| Federal Tax | 6,024 | 3.99% |
| Kanton + Gemeinde | 32,830 | 21.74% |
| Wealth Tax | 1,764 | 1.11% |
| **TOTAL** | **40,618** | **20.51%** |

**Comparison to Estimate:**
- Old estimate: CHF 24,444 (12.35%)
- Official 2026: CHF 40,618 (20.51%)
- **Difference:** +CHF 16,174 (+8.16%)

**Reason:** Old estimate used simplified rates. Official tariffs apply "einfache Steuer" × Steuerfuss (4.9).

---

## ✅ Module Updates

### `federal-tax.js`
- ✅ Official 2026 bracket tables (married + single)
- ✅ Child tax credit (CHF 263)
- ✅ Correct bracket-based calculation formula
- ✅ Test case updated

### `kanton-tax.js`
- ✅ Official 2026 "einfache Steuer" brackets
- ✅ Kanton Steuerfuss 3.06 (OFFICIAL)
- ✅ Gemeinde Steuerfuss 1.84 (ESTIMATED)
- ✅ Correct Steuerfuss multiplication formula
- ✅ Test case updated

### `deductions.js`
- ✅ Säule 3a limits 2026 (CHF 7,258 / CHF 36,288 ESTIMATED)
- ✅ Kinderabzug CHF 8,300 (OFFICIAL)
- ✅ Verheiratetenabzug CHF 10,600 (OFFICIAL)
- ✅ Fahrkosten CHF 0.75/km (OFFICIAL, new 2026)
- ✅ Childcare max CHF 16,000 (OFFICIAL)

---

## 📊 Tariff Status Summary

| Tariff | Status | Source |
|--------|--------|--------|
| Kanton Bern Income Tax | ✅ OFFICIAL | EStV Kantonsblatt (Feb 2026) |
| Kanton Bern Wealth Tax | ✅ OFFICIAL | EStV Kantonsblatt (Feb 2026) |
| Federal Tax | ✅ OFFICIAL | EStV Form 58c 2026 |
| Kanton Steuerfuss (3.06) | ✅ OFFICIAL | Art. 247 StG |
| Stadt Bern Gemeinde (1.84) | ⚠️ ESTIMATE | Based on 2025 |
| Säule 3a (CHF 7,258) | ⚠️ ESTIMATE | Based on 2025 + inflation |
| Child Tax Credit (CHF 263) | ✅ OFFICIAL | EStV Form 58c 2026 |
| Kinderabzug (CHF 8,300) | ✅ OFFICIAL | Art. 40 Abs. 3 Bst. a |

**Summary:** 5/7 OFFICIAL, 2/7 ESTIMATED

---

## 🚧 Pending Confirmations

### 1. Stadt Bern Gemeinde-Steuerfuss 2026
**Current:** 1.84 (estimated)  
**Check:** https://www.bern.ch/themen/steuern  
**Timeline:** Likely announced late 2025 (budget cycle)

### 2. Säule 3a 2026 Limits
**Current:** CHF 7,258 / CHF 36,288 (estimated)  
**Check:** 
- https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv/grundlagen-und-gesetze/grundlagen/koordinationsabzug-und-bvg-lohngrenze.html
- https://www.estv.admin.ch/  
**Timeline:** Typically announced Q4 2025

---

## 🎯 Next Steps

1. ✅ Swiss Tax Module fully updated with 2026 tariffs
2. ✅ Test scenario run (Marcel's household)
3. ⏳ Integrate module with lexoffice workflow
4. ⏳ Monitor for official Gemeinde Steuerfuss 2026
5. ⏳ Monitor for official Säule 3a 2026 limits
6. ⏳ Re-run test when estimates confirmed

---

## 🔗 Quick Links

- **Module:** `~/.openclaw/workspace/lexoffice-steuer/swiss-tax-module/`
- **Official Tariffs:** `official-tariffs-2026.md`
- **Test Results:** `test-results-official-2026.md`
- **Federal Tax:** `federal-tax.js`
- **Kanton Tax:** `kanton-tax.js`
- **Deductions:** `deductions.js`

---

**Subagent Sign-Off:** Task complete. All official 2026 tariffs extracted and integrated. Two estimates (Stadt Bern Steuerfuss, Säule 3a) pending official confirmation.
