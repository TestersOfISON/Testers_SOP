# Lending Fundamentals: Loan Applications Assessment Rules

**Presenter:** Aaron Niyonjima (Mathisi Digital)

## Key Concepts

This tutorial covers the foundational rules for evaluating loan applications, specifically focusing on how banks assess repayment capacity using the **28/36 Rule**.

### 1. Core Assessment Factors
Banks evaluate loan applications based on three main criteria:
*   **Credit History:** A history of repaying loans on time.
*   **Income:** A measure of incoming cash flow.
*   **Expenses:** Existing financial obligations.

### 2. The 28/36 Rule (Gross Income)
This rule uses gross income (income before tax) to determine safe borrowing limits.

*   **28% - Expense-to-Income Ratio (ETI):**
    *   No more than 28% of your gross monthly income should be spent on housing/mortgage payments.
    *   *Example:* For a gross monthly income of €10,000, the maximum mortgage payment is €2,800.

*   **36% - Debt-to-Income Ratio (DTI):**
    *   Your total monthly debt payments (including the prospective mortgage, existing car loans, credit cards, etc.) must not exceed 36% of your gross monthly income.
    *   *Example:* If your gross income is €10,000, your total debt payments should not exceed €3,600.
    *   *Note:* While 36% is the recommended standard, some banks may stretch this limit up to 43% depending on other factors.

### 3. Conservative Rules (Net Income)
Alternative, more conservative rules calculate limits based on **Net Income**:
*   **30% Rule:** Total loan payments should not exceed 30% of your net income.
*   **25% Rule:** Total loan payments should not exceed 25% of your net income.

---

## Practical Session: InfoBasic DTI Calculator

The video demonstrates how to implement a Debt-to-Income ratio calculator using InfoBasic (jBASE).

### Program Structure
1.  **Initialization:** Uses `CRT @(-1)` to clear the terminal screen.
2.  **User Input:** Uses `PROMPT` to set the input prompt string and `INPUT` to collect variables:
    *   `gross_monthly_income`
    *   `total_monthly_debt_pyt`
3.  **Calculation:**
    *   `dti = total_monthly_debt_pyt / gross_monthly_income`
    *   Calculates the percentage: `dti * 100`
4.  **Evaluation & Output:**
    *   Prints the calculated DTI ratio percentage.
    *   Implements an `IF ... THEN ... ELSE` conditional block to check if `dti LE 0.36`.
    *   **Pass:** "You are eligible for another loan."
    *   **Fail:** "You have reached your maximum borrowing capacity."
5.  **Refactoring:**
    *   The hardcoded `0.36` is extracted into a variable `standard_dti = 0.36`.
    *   The program calculates the upper borrowing limit by multiplying `gross_monthly_income * standard_dti`.

### Execution Steps
The code (`DTICalculator.b`) is compiled and executed in the jsh shell:
*   **Compile:** `BASIC MATHISI.BP DTICalculator.b`
*   **Catalog:** `CATALOG MATHISI.BP DTICalculator.b`
*   **Run:** `DTICalculator` (tests the script with different income and debt values).
