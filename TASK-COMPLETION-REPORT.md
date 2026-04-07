# Task Completion Report: Swiss Tax CLI Bug Fix + TaxMe-Online Export

**Date:** 2026-04-06  
**Task:** Fix bug in `ch-calculator.js` + Generate TaxMe-Online exports for Marcel  
**Status:** ✅ COMPLETE  
**Time:** ~18 minutes

---

## 1. Bug Fixed

**File:** `/home/marcel/.openclaw/workspace/lexoffice-steuer/swiss-tax-module/ch-calculator.js`

**Problem (Line 154):**
```javascript
lines.push(`  Kanton Tax:         CHF ${result.taxes.kanton.kanton.baseTax.toLocaleString()}`);
```

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'toLocaleString')
```

**Root Cause:**  
The `kanton` object returned by `kanton-tax.js` has the structure:
```javascript
{
  kanton: {
    steuerfuss: 3.06,
    tax: 21711  // ← Correct property name
  },
  gemeinde: { ... }
}
```

**Fix Applied:**  
Changed `baseTax` → `tax` in both:
- `ch-calculator.js` (line 154)
- `taxme-exporter.js` (lines 29 + 57)

**Test Result:**
```bash
$ node generate-marcel-exports.js
✓ No errors
✓ Tax calculation: CHF 42,463
```

---

## 2. TaxMe-Online Exports Generated

### 2.1 JSON Export (`marcel-taxme-2026.json`)
**Purpose:** API integration / automation  
**Location:** `swiss-tax-module/exports/marcel-taxme-2026.json`  
**Size:** 1.6 KB  
**Format:** TaxMe-Online compatible structure

**Includes:**
- Personal data (marital status, children, location)
- Income breakdown (employment, ALV)
- Wealth details (bank, Säule 3a)
- Deductions (Säule 3a, Krankenkasse, married/child deductions)
- Tax summary (Federal, Kanton, Gemeinde, Wealth)

### 2.2 CSV Export (`marcel-taxme-2026.csv`)
**Purpose:** Manual TaxMe-Online entry  
**Location:** `swiss-tax-module/exports/marcel-taxme-2026.csv`  
**Size:** 267 bytes  
**Format:** Simple 3-column CSV

**Sample:**
```csv
Section,Field,Value
Income,Gross Income,198000
Tax,Federal Tax,6922
Tax,Total Tax,42463
```

### 2.3 Markdown Report (`marcel-taxme-2026.md`)
**Purpose:** Human-readable summary  
**Location:** `swiss-tax-module/exports/marcel-taxme-2026.md`  
**Size:** 2.1 KB  

**Includes:**
- Tax summary with breakdown
- Income & wealth details
- Deductions applied
- Upload checklist

### 2.4 Upload Guide (`TAXME-ONLINE-UPLOAD-GUIDE.md`)
**Purpose:** Step-by-step TaxMe-Online filing instructions  
**Location:** `swiss-tax-module/TAXME-ONLINE-UPLOAD-GUIDE.md`  
**Size:** 6.7 KB  

**Sections:**
1. Required documents (Belege)
2. Personal data entry
3. Income section mapping
4. Wealth section mapping
5. Deductions section mapping
6. CSV → TaxMe field mapping
7. Validation steps (verify CHF 42,463)
8. Common pitfalls
9. Upload workflow (~45 min)
10. After submission
11. Support contacts

---

## 3. Tax Calculation Summary (2026)

**Household:**
- Marital Status: Married
- Children: 2
- Location: Bümpliz (Kanton Bern)

**Income:**
- Partner Employment: CHF 126,000
- ALV (Self): CHF 72,000
- **Gross Income:** CHF 198,000
- **Taxable Income:** CHF 161,862

**Wealth:**
- Bank Accounts: CHF 159,000
- **Taxable Wealth:** CHF 109,000

**Deductions:**
- Verheiratetenabzug: CHF 2,600
- Kinderabzug (2×): CHF 16,000
- Säule 3a (Partner): CHF 7,258
- Krankenkasse: CHF 6,000
- Berufskosten: CHF 3,780
- Spenden: CHF 500
- **Total:** CHF 36,138

**Tax Breakdown:**
- Federal Tax: CHF 6,922 (4.28%)
- Kanton Tax: CHF 21,711
- Gemeinde Tax: CHF 13,055
- Wealth Tax: CHF 775
- **TOTAL:** CHF 42,463 (21.45%)

---

## 4. Files Modified/Created

**Modified (Bug Fix):**
1. `ch-calculator.js` — Line 154 (`baseTax` → `tax`)
2. `taxme-exporter.js` — Lines 29 + 57 (`baseTax` → `tax`)

**Created (Exports):**
1. `generate-marcel-exports.js` — Export generator script
2. `exports/marcel-taxme-2026.json` — JSON export
3. `exports/marcel-taxme-2026.csv` — CSV export
4. `exports/marcel-taxme-2026.md` — Markdown report
5. `TAXME-ONLINE-UPLOAD-GUIDE.md` — Upload guide

---

## 5. Success Criteria

✅ CLI runs without errors  
✅ All 3 export formats generated  
✅ Numbers match test results (CHF 42,463)  
✅ Upload guide clear and actionable  

---

## 6. Next Steps for Marcel

1. **Review Exports:** Check `swiss-tax-module/exports/`
2. **Gather Belege:**
   - Lohnausweis (Partner, CHF 126k)
   - ALV Bescheinigung (Self, CHF 72k)
   - Säule 3a Bescheinigung (CHF 7,258)
   - Krankenkasse Jahresrechnung (CHF 6k)
   - Bankkonten Auszug (Dec 31, 2026)
3. **Login to TaxMe-Online:** BE-Login with AGOV
4. **Upload:** Follow `TAXME-ONLINE-UPLOAD-GUIDE.md` (~45 min)
5. **Verify:** Total tax should be CHF 42,463
6. **Submit:** Download PDF confirmation

---

## 7. Technical Notes

**Official Tariffs Used:**
- Federal: 2026 EStV tariff (married)
- Kanton Bern: 2026 official rates (Art. 247 StG)
- Kanton Steuerfuss: 3.06
- Gemeinde Steuerfuss (Bümpliz): 1.84

**Data Source:**
- `config.json` — Marcel's household config
- `kanton-tax.js` — Official 2026 tariffs
- `federal-tax.js` — Official 2026 tariffs
- `wealth-tax.js` — Kanton Bern wealth tax

**Validation:**
- Test run: `node generate-marcel-exports.js`
- No errors, clean output
- Tax total: CHF 42,463 (consistent across all formats)

---

## 8. Lessons Learned

**Bug Pattern:**  
Always check return structure of tax calculators before accessing nested properties.

**Export Design:**  
Three formats serve different needs:
- JSON → Automation
- CSV → Manual entry
- Markdown → Human review

**Documentation:**  
Upload guide should be prescriptive, not descriptive. Tell the user exactly what to do.

---

**✅ Task Complete. All deliverables ready.**
