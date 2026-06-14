# T24 Version Routines: Input Routines

## Overview
Input routines in T24 are used for **cross-validation** (e.g., validating multiple fields at the same time or validating one field based on another). 
They are invoked *after* the standard field-level validation but *prior* to saving the record in `INAU` (unauthorized) status.

## Steps to Create and Attach an Input Routine
1. **Write, compile, and catalog a subroutine**
   - Use jBASE/T24 Basic to write the validation logic.
   - Example subroutine name: `MTD.FTInpSameCurr`
   - Compile using `BASIC` and catalog using `CATALOG`.
2. **Create an entry in `EB.API`**
   - Create a record in the `EB.API` application where the ID is the name of the subroutine.
   - Set the source type to `BASIC`.
3. **Attach the routine to a Version**
   - Open the Version record (e.g., `VERSION, FUNDS.TRANSFER,MTD.TEST`).
   - Navigate to field `63.x INPUT.ROUTINE` and input the name of the subroutine (e.g., `MTD.FTInpSameCurr`).

## Example: Validating Debit and Credit Currencies in Funds Transfer
The video demonstrates creating an input routine to ensure that a user can only perform a funds transfer if the **Debit Currency** and **Credit Currency** are the same.

### Subroutine Code (`MTD.FTInpSameCurr.b`)
```basic
    SUBROUTINE MTD.FTInpSameCurr

    $INSERT T24.BP I_COMMON
    $INSERT T24.BP I_EQUATE
    $INSERT T24.BP I_F.FUNDS.TRANSFER

    IF R.NEW(FT.DEBIT.CURRENCY) NE R.NEW(FT.CREDIT.CURRENCY) THEN
        AF = FT.CREDIT.CURRENCY
        ETEXT = "Debit and credit currencies not the same"
        CALL STORE.END.ERROR
    END

    RETURN
    END
```

### Key T24 Basic Variables and Methods Used
* **`R.NEW()`**: Used to access the current value of fields in the record being processed.
* **`AF`**: Application Field position variable. It positions the error on a specific field in the browser UI (in this case, `FT.CREDIT.CURRENCY`).
* **`ETEXT`**: Holds the error message string to be displayed.
* **`CALL STORE.END.ERROR`**: A core T24 subroutine that registers the error defined in `ETEXT` at the position defined by `AF` so it can be displayed to the user.

### Testing the Validation
1. Launch the version in the browser (or classic UI).
2. Enter a debit account with USD and credit account with GBP.
3. Validate the transaction.
4. The system throws an error on the Credit Currency field: `Debit and credit currencies not the same`.
