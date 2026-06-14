# T24 Subroutines - Auto New Content

This video tutorial demonstrates how to create and use "Auto New Content" subroutines in Temenos T24. These routines are used to automatically populate the content of a field when a record is opened.

## Requirements Example
- The bank wants the account `MNEMONIC` to be automatically generated and populated for all newly created accounts using the version `ACCOUNT,MTD.NEW.AC`.
- The format of the mnemonic must be: `AAAA0000AA` (4 letters, 4 numbers, 2 letters).

## Steps to Implement Auto New Content Routine

### 1. Create a Subroutine
- Write a simple routine to calculate the desired field value.
- Example subroutine name: `MTD.AcRandMnemonic`
- The routine uses custom functions like `RND$LETTERS()` and `RND$NUMBERS()` to generate the random string.
- The generated value is assigned to `R.NEW(AF)` if it is currently empty. `AF` holds the current field position defined in the version.
- Compile and catalog the subroutine using `BASIC` and `CATALOG` commands.

### 2. Create an Entry in PGM.FILE
- Application: `PGM.FILE`
- Create a record with the exact same name as the subroutine (`MTD.AcRandMnemonic`).
- `TYPE`: `S` (Subroutine)
- `PRODUCT`: `EB`
- `APPL.FOR.SUB`: `ACCOUNT` (Restricts the subroutine to the ACCOUNT application).

### 3. Attach the Routine to the Version
- Open the version (e.g., `ACCOUNT,MTD.NEW.AC`) in input mode.
- Add/Update the field `AUTOM.FIELD.NO` and set it to the name of the field to be populated (e.g., `MNEMONIC`).
- Add/Update the field `AUT.NEW.CONTENT` and set it to the subroutine name prefixed with `@` (e.g., `@MTD.AcRandMnemonic`).
- Commit and authorize the version record.

### 4. Verification
- Open the version to create a new record.
- The specified field (e.g., `MNEMONIC`) will automatically be populated with the generated value.
- The routine is configured to not overwrite an existing value if the field is already populated or if the record is being amended.
