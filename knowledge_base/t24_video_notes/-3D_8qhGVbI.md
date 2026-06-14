# Visual Data Extraction: Mortgage Loan Calculator

## Concepts & Formulas
- **Mortgage Loan Calculator formula:**
  ```
  M = P * [ r(1 + r)^n / ((1 + r)^n - 1) ]
  ```
  Where:
  - `M` = total monthly mortgage payment
  - `P` = principal loan amount
  - `r` = monthly interest rate
  - `n` = number of payments

- **Loan Assessment Factors:**
  - Credit Score
  - Income
  - Expense
  - Other factors: The purpose of the loan, Down payment

- **Rules involved in loan assessment:**
  - DTI ratio (28/36 rule)
  - LTV ratio
  - 30%
  - 25%

- **Arithmetic Operations in T24 InfoBasic:**
  - Addition: `+`
  - Subtraction: `-`
  - Multiplication: `*`
  - Division: `/`
  - Exponent (Power): `**` or `^`
  - *Note:* `*` and `/` have higher precedence than `+` and `-`. Use `()` to override.

## InfoBasic Code
The video demonstrates building a routine `MTD.MortgageCalculator` step by step. Here is the final source code shown in the editor:

```infobasic
PROGRAM MTD.MortgageCalculator
* Program to calculate the total monthly mortgage payment:
* M = P * [ r(1 + r)^n / ((1 + r)^n - 1) ]
* where:
* M = total monthly mortgage payment
* P = principal loan amount
* r = monthly interest rate
* n = number of payments
* Developer: Aaron Niyonkima(mathisi.io)
* Date     : 03/10/2020
* Version  : 0.0.1

CRT @(-1)

PROMPT ''
CRT "Enter the loan amount EUR: "
INPUT loan_amount
CRT "Enter the annual interest rate: "
INPUT int_rate
CRT "Enter the loan period (in years): "
INPUT num_years

num_months_year = 12
percent = 100

PRECISION 7
r = int_rate / num_months_year / percent
n = num_years * num_months_year
P = loan_amount

M = P * ( r * ( 1 + r ) ^ n ) / ( ( 1 + r ) ^ n - 1 )
CRT "Your total monthly mortgage payment is EUR ": DROUND(M, 0)

END
```

## CLI / UI Execution
```text
jsh t24 ~ -->MTD.MortgageCalculator
Enter the loan amount EUR: 453000
Enter the annual interest rate: 5
Enter the loan period (in years): 30
Your total monthly mortgage payment is EUR 2432
jsh t24 ~ -->
```
