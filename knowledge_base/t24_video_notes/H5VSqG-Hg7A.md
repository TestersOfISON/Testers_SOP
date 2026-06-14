# T24 Subroutines - Validation Routine

This video explains how to create and attach validation subroutines to versions in Temenos T24. Validation routines are used to validate user inputs at the field level and can also default values.

## Steps to Implement Validation Routines

1. **Write, compile, and catalog a subroutine:**
   - Create a Basic program to implement the validation logic.
   - Compile and catalog the subroutine in T24.

2. **Create an entry in `EB.API`:**
   - Add a record in the `EB.API` application with the name of the subroutine.
   - Set the source type to `BASIC`.

3. **Attach routine to a version:**
   - Open the target version (e.g., `ACCOUNT,MTD.SAVINGS`).
   - In field `58.x VALIDATION.FLD`, enter the name of the field to be validated.
   - In field `59.x VALIDATION.RTN`, enter the name of the validation routine.

4. **(Optional) Enable Hot Field Validation (for browsers):**
   - Hot field validation triggers the routine immediately when the user navigates away from the field.
   - In field `13.x FIELD.NO`, find the relevant field.
   - In field `42.x.1 ATTRIBS`, add the value `HOT.FIELD`.

## Practical Examples

### 1. Validating User Input
- **Scenario:** Restrict the `CATEGORY` field in a savings account version to only accept savings categories (codes starting with 6, e.g., 6000 - 6999).
- **Implementation:**
  - The routine evaluates the last user input stored in the common variable `COMI`.
  - It checks if `COMI` matches the pattern `"6"3N` (the digit 6 followed by 3 numeric characters).
  - If the input is invalid, it sets `ETEXT = "AC-CATEG.NOT.SAVINGS"` to trigger an error message and prevent the user from committing the record.

### 2. Defaulting Field Values
- **Scenario:** Automatically generate and populate a unique code (`MNEMONIC`) based on the selected customer.
- **Implementation:**
  - A validation routine is attached to the `CUSTOMER` field.
  - The routine executes when the customer code is entered (using hot field validation).
  - It generates a random string of 4 letters and appends the customer code.
  - It checks if the `MNEMONIC` field `R.NEW(AC.MNEMONIC)` is empty. If so, it updates the field with the generated code.
