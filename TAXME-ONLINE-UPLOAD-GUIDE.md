# TaxMe-Online Upload Guide - Kanton Bern 2026

**For:** Marcel Henkel  
**Tax Year:** 2026  
**Platform:** TaxMe-Online (BE-Login with AGOV)  
**Generated:** 2026-04-06

---

## 1. Before You Start

### Required Documents (Belege)
- ✅ Lohnausweis (Partner) - CHF 126,000
- ✅ ALV Bescheinigung (Self) - CHF 72,000
- ✅ Säule 3a Bescheinigung - CHF 7,258
- ✅ Krankenkasse Jahresrechnung - CHF 6,000
- ✅ Bankkonten Jahresauszug (Dec 31, 2026) - CHF 159,000
- ⚠️ AHV Number (both spouses)
- ⚠️ ZPV Number

### Login
1. Go to: https://www.taxme-online.ch/
2. Select **Kanton Bern**
3. Login with **BE-Login** (AGOV access)
4. Select tax period: **2026**

---

## 2. Personal Data (Personalien)

| Field | Value |
|-------|-------|
| Zivilstand | Verheiratet |
| Kinder | 2 |
| Wohnort Kanton | Bern (BE) |
| Wohnort Gemeinde | Bümpliz |
| Taxpayer Name | Marcel Henkel |
| Partner Name | [Enter partner's name] |
| AHV Number (Self) | [Enter from ID] |
| AHV Number (Partner) | [Enter from ID] |

**⚠️ Action:** Fill AHV numbers manually from official ID documents.

---

## 3. Income Section (Einkommen)

### 3.1 Employment Income (Unselbständige Erwerbstätigkeit)

**Partner's Employment:**
- **Bruttolohn:** CHF 126,000
- **Upload:** Lohnausweis (from employer)
- **TaxMe Field:** "Lohn aus unselbständiger Erwerbstätigkeit"

**Self (ALV):**
- **Bruttolohn:** CHF 72,000
- **Upload:** ALV Bescheinigung (from RAV)
- **TaxMe Field:** "Arbeitslosenentschädigung (ALV)"

### 3.2 Investment Income (Kapitalerträge)
- **Amount:** CHF 0
- **Upload:** None required

### 3.3 Other Income (Übrige Einkünfte)
- **Amount:** CHF 0

**Gross Income Total:** CHF 198,000

---

## 4. Wealth Section (Vermögen)

### 4.1 Bank Accounts (Bankkonten)
- **Amount:** CHF 159,000
- **Upload:** Bank statement dated Dec 31, 2026
- **TaxMe Field:** "Guthaben bei Banken und Sparkassen"

### 4.2 Securities (Wertschriften)
- **Amount:** CHF 0

### 4.3 Säule 3a
- **Amount:** CHF 0 (balance at Dec 31, 2026)
- **Upload:** Säule 3a statement (if any)

### 4.4 Pensionskasse (BVG)
- **Amount:** CHF 0
- **Upload:** Pensionskasse statement (from employer)

### 4.5 Real Estate (Liegenschaften)
- **Amount:** CHF 0

### 4.6 Debts (Schulden)
- **Amount:** CHF 0

**Gross Wealth Total:** CHF 159,000

---

## 5. Deductions Section (Abzüge)

### 5.1 Säule 3a Contributions (Einzahlungen)
- **Partner:** CHF 7,258
- **Self:** CHF 0
- **Upload:** Säule 3a payment confirmation
- **TaxMe Field:** "Einzahlungen Säule 3a"

### 5.2 Health Insurance (Krankenkasse)
- **Amount:** CHF 6,000
- **Upload:** Annual premium invoice
- **TaxMe Field:** "Krankenkassenprämien"

### 5.3 Married Deduction (Verheiratetenabzug)
- **Amount:** CHF 2,600 (automatic)
- **TaxMe Field:** Auto-populated

### 5.4 Child Deduction (Kinderabzug)
- **Children:** 2
- **Amount:** CHF 16,000 (automatic: 2 × CHF 8,000)
- **TaxMe Field:** Auto-populated

### 5.5 Professional Expenses (Berufskosten)
- **Type:** Auto (Pauschalabzug)
- **Amount:** CHF 3,780 (automatic: 3% of employment income)
- **TaxMe Field:** "Berufskosten Pauschalabzug"
- **Alternative:** Can itemize if actual expenses > 3%

### 5.6 Donations (Spenden)
- **Amount:** CHF 500
- **Upload:** Donation receipts
- **TaxMe Field:** "Spenden"

### 5.7 Childcare (Kinderbetreuung)
- **Amount:** CHF 0
- **Upload:** None

**Total Deductions:** CHF 36,138

---

## 6. Section-by-Section Mapping (CSV → TaxMe)

Use the generated CSV (`marcel-taxme-2026.csv`) as a reference:

| CSV Section | CSV Field | TaxMe Section | TaxMe Field |
|-------------|-----------|---------------|-------------|
| Income | Gross Income | Einkommen | Total (calculated) |
| Income | Taxable Income | Einkommen | Steuerbares Einkommen |
| Wealth | Gross Wealth | Vermögen | Total (calculated) |
| Wealth | Taxable Wealth | Vermögen | Steuerbares Vermögen |
| Tax | Federal Tax | Steuern | Bundessteuer |
| Tax | Kanton Tax | Steuern | Kantonssteuer |
| Tax | Gemeinde Tax | Steuern | Gemeindesteuer |
| Tax | Wealth Tax | Steuern | Vermögenssteuer |
| Tax | Total Tax | Steuern | Gesamtsteuer |

---

## 7. Validation Steps

After entering all data, verify:

1. **Taxable Income:** CHF 161,862
2. **Taxable Wealth:** CHF 109,000
3. **Federal Tax:** CHF 6,922
4. **Kanton Tax:** CHF 21,711
5. **Gemeinde Tax:** CHF 13,055
6. **Wealth Tax:** CHF 775
7. **Total Tax:** CHF 42,463 (21.45% effective rate)

**⚠️ If numbers don't match:**
- Check Gemeinde selection (must be "Bümpliz" or "Stadt Bern")
- Verify Steuerfuss: Kanton 3.06, Gemeinde 1.84
- Check marital status and children count
- Ensure all deductions are entered correctly

---

## 8. Common Pitfalls

### ❌ Wrong Gemeinde
- **Problem:** Selected "Bern" instead of "Bümpliz"
- **Fix:** Bümpliz is part of Stadt Bern → same Steuerfuss (1.84)

### ❌ Missing Lohnausweis Upload
- **Problem:** Tax cannot be finalized without proof
- **Fix:** Upload PDF from employer

### ❌ Säule 3a Confusion
- **Einzahlung (Contribution):** CHF 7,258 → Deduction
- **Guthaben (Balance):** CHF 0 (not in config) → Wealth

### ❌ Berufskosten Too High
- **Problem:** Entered commuting distance incorrectly
- **Fix:** Use "Pauschalabzug" (3% of income) unless itemizing

### ❌ AHV Number Format
- **Format:** 756.XXXX.XXXX.XX
- **Check:** Must match official AHV card

---

## 9. Upload Workflow

**Recommended order:**

1. **Login** → Select 2026
2. **Personal Data** → Enter AHV, names, address
3. **Income** → Upload Lohnausweis + ALV
4. **Wealth** → Upload bank statements
5. **Deductions** → Upload Säule 3a + Krankenkasse
6. **Review** → Check tax calculation
7. **Submit** → Confirm and send

**Timeline:**
- Entry: ~30 minutes
- Upload: ~10 minutes
- Review: ~5 minutes
- **Total: ~45 minutes**

---

## 10. After Submission

1. **Receipt:** Download PDF confirmation
2. **Timing:** Processing ~4-6 weeks
3. **Payment:** Quarterly bills (Q1, Q2, Q3, Year-end adjustment)
4. **Appeal:** If tax too high, submit "Einsprache" within 30 days

---

## 11. Questions & Support

**TaxMe-Online Support:**
- Email: support@taxme-online.ch
- Phone: +41 31 XXX XX XX
- Hours: Mon-Fri 08:00-17:00

**Kanton Bern Steueramt:**
- Website: https://www.be.ch/steuern
- Email: steueramt@fin.be.ch
- Phone: +41 31 633 61 11

---

## 12. Changelog

**2026-04-06:**
- Initial guide created
- Based on official 2026 tariffs
- Bug fixed in `ch-calculator.js` (line 154)
- Exports generated: JSON, CSV, MD

---

**✅ Success Criteria:**
- [ ] All Belege uploaded
- [ ] Tax calculation matches report (CHF 42,463)
- [ ] Submission confirmation received
- [ ] PDF receipt saved

**🚀 You're ready to file!**

---

*Generated by Swiss Tax Module - Official 2026 Tariffs*
