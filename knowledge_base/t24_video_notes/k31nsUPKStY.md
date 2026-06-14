# T24 Programming: Data Formatting (FMT, ICONV & OCONV)

**Video ID:** `k31nsUPKStY`  
**Channel:** mathisi digital (Aaron)  

## Summary
This video demonstrates how to format unformatted comma-separated data (CSV) in InfoBasic / T24 into structured, aligned, and human-readable output using functions like `FMT`, `ICONV`, and `OCONV`.

## Key Concepts

### 1. Reading and Preparing Data
- The demonstration starts by reading a file named `transactions.csv` using `EB.MtdTraining.ReadFile`.
- The number of records is determined using `DCOUNT(transaction_data, @FM)`.
- The data is transformed by replacing commas with Field Markers (`@FM`) using the `CHANGE` function:
  ```basic
  rec = CHANGE(data<idx>, ',', @FM)
  ```

### 2. FMT (Formatting Data)
The `FMT` function is heavily utilized to ensure uniform sizing, alignment, and formatting.

- **Serial Numbers (SN):** Formatting to a consistent length of 3 digits with leading zeroes.
  ```basic
  FMT(rec<...Sn>, 'R%3')
  ```
  - `R` = Right aligned
  - `%3` = Pad with zeroes to size 3

- **Amount Formatting:** Formatting large numerical amounts with commas for thousands and a fixed number of decimal places.
  ```basic
  FMT(rec<...Amount>, 'R#14,2')
  ```
  - `R` = Right aligned
  - `#14` = Fix string length to 14 spaces (padding with space if necessary)
  - `,2` = Add a comma separator for thousands, and resolve to 2 decimal places.

- **Account Formatting:** Demonstrates string formatting by slicing the account number string and re-arranging it with hyphens. (e.g., displaying `R#3-R#5-R#4`).

### 3. Date Formatting (ICONV & OCONV)
T24 handles dates internally in a different format than how it presents them to users.

- **ICONV (Internal Conversion):** Used to convert a string date (e.g., `20220102`) into the T24 internal date format.
  ```basic
  internal_date = ICONV(rec<...Date>, 'D')
  ```

- **OCONV (Output Conversion):** Used to convert the internal date into a user-friendly string format (e.g., `02 JAN 2022`).
  ```basic
  display_date = OCONV(internal_date, 'D')
  ```

## Conclusion
The combination of `FMT`, `ICONV`, and `OCONV` allows developers to process rigid text formats (like raw CSV dumps) into clean, tabular visual outputs for the user within a T24 application.
