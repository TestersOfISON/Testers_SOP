# Perfect Test Coverage Matrix and Acceptance Criteria Examples

## Example 1: WF-8211 Validations for APPLICATION.ID in guarantees

### Acceptance Criteria
1. **AA ID Acceptance:** The APPLICATION.ID field within the COLLATERAL application (Code 100) must successfully accept valid Arrangement Architecture (AA) Deposit IDs.
2. **Strict Limit Enforcement:** The system must rigorously enforce a maximum allocation limit of exactly 100% (Procentaj garantie) for a single collateral deposit.
3. **Multi-Loan Allocation:** Credit Administrators must be able to link multiple target loan IDs (Cod Contract (ID)) to a single collateral deposit, provided the cumulative guarantee percentage does not exceed 100%.
4. **Hard Error Validation:** Any attempt to allocate a cumulative percentage greater than 100% across one or multiple loans must trigger a hard blocking error upon validation/submission.

### Test Coverage Matrix
| Scenario ID | Scenario Type | Action / Input | Expected Result |
|---|---|---|---|
| TC-01 | Positive | Input valid AA ID and allocate 100% to a single loan. | PASS: System accepts the linkage and routes the record to INAU. |
| TC-02 | Positive | Input valid AA ID and allocate < 100% (e.g., 60%) to a single loan. | PASS: System accepts the partial linkage. |
| TC-03 | Positive | Allocate cumulative 100% across multiple loans (e.g., 50% to Loan A, 50% to Loan B). | PASS: System calculates the total accurately and accepts the linkages. |
| TC-04 | Negative | Attempt to allocate > 100% (e.g., 101%) to a single loan. | BLOCKED: System triggers a hard error and prevents submission. |
| TC-05 | Negative | Attempt to allocate cumulative > 100% across multiple loans (e.g., 60% to Loan A, 50% to Loan B). | BLOCKED: System calculates the overallocation, triggers a hard error, and prevents submission. |
| TC-06 | Negative | Input an invalid or non-existent AA ID into the APPLICATION.ID field. | BLOCKED: System rejects the ID and prompts a validation error. |

## Example 2: WF-7955 Conversion of Term Deposit to Collateral Deposit

### Acceptance Criteria
- **Like-for-Like UI Filtering:** Standard deposits MUST only display .TENOR target products. Negotiated deposits MUST only display .NEG target products. Cross-conversion is strictly blocked.
- **Field Defaults & Editability:** The conversion screen must automatically default to exactly "Cu prelungire si fara capitalizare". The user must be able to manually edit this to other values prior to submission.
- **Financial Parameter Locking:** Standard deposits must strictly lock the interest rate, maturity, and tenor. Negotiated deposits must unlock the interest field to become editable.
- **Ledger Detachment:** The ledger category must completely detach from standard retail and update to <Target_Category> (either <new_cash_category> or <new_non-cash_category>).

### Test Coverage Matrix
1. **UI Logic - Product Filtering (Standard)**
   - Action: Open the new conversion version for a Standard deposit.
   - Expected Assertion: The target product dropdown ONLY displays .TENOR products. .NEG products are blocked/hidden.
2. **UI Logic - Product Filtering (Negotiated)**
   - Action: Open the new conversion version for a Negotiated deposit.
   - Expected Assertion: The target product dropdown ONLY displays .NEG products. .TENOR products are blocked/hidden.
3. **Field Defaults - Rollover & Capitalisation**
   - Action: Open the conversion version for any active deposit.
   - Expected Assertion: The fields default exactly to: "Cu prelungire si fara capitalizare".
4. **Field Editability - Parameter Override**
   - Action: Change the default to "Fara prelungire si fara capitalizare" and commit.
   - Expected Assertion: The system accepts the manual change, and the resulting AA Arrangement reflects the newly selected parameters.
5. **E2E Conversion - PF/PJ/PRE Standard Cash**
   - Action: Convert a Standard deposit to the respective .COLLCASH.TENOR product.
   - Expected Assertion: Category updates to <new_cash_category>. Interest, maturity, and tenor remain completely locked.
6. **E2E Conversion - PF/PJ/PRE Standard Non-Cash**
   - Action: Convert a Standard deposit to the respective .COLLNONCASH.TENOR product.
   - Expected Assertion: Category updates to <new_non-cash_category>. Parameters remain completely locked.
7. **E2E Conversion - PF/PJ/PRE Negotiated Cash**
   - Action: Convert a Negotiated deposit to the respective .COLLCASH.NEG product.
   - Expected Assertion: Category updates to <new_cash_category>. The Interest field becomes unlocked and allows manual editing.
8. **Financial Integrity - Value Date Preservation**
   - Action: Authorize any E2E conversion scenario.
   - Expected Assertion: The historical Value Date is strictly preserved to maintain the active interest curve.
9. **Financial Integrity - Accrual Carryover**
   - Action: Authorize any E2E conversion scenario.
   - Expected Assertion: The Accrued Interest is carried over into the new AA product without applying early-withdrawal penalties.
