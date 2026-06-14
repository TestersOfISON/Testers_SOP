# T24 Programming: Transition from TAFC to TAFJ

This video tutorial by Aaron from Mathisi Digital explains how to transition InfoBasic (JBC) subroutines and programs from the TAFC environment to the newer TAFJ environment.

## Key Concepts

*   **InfoBasic Support**: InfoBasic (JBC) is still fully supported in TAFJ. You don't need to rewrite all your existing code in pure Java. You can maintain your existing InfoBasic code with minor adjustments.
*   **Design Studio**: The recommended IDE for TAFJ development is Design Studio (an Eclipse-based IDE tailored for T24).

## Transitioning a Subroutine

To move an existing subroutine to TAFJ, you typically wrap it in a component.

1.  **Create a Component**: In Design Studio, create a new "Component folder structure". Name it using the product code and a specific name (e.g., `EB`, `MtdTraining`). This creates a component definition file.
2.  **Define the Method in Component**: Open the component definition file and define the subroutine as a public method. Specify the parameter types (IN/OUT) and indicate that it maps to a JBC program.
    ```text
    public method MTDGetAcctDetails(IN acct_id string, OUT details string)
    jbc : MTD.GetAcctDetails
    ```
3.  **Update Subroutine Code**: In your actual subroutine source code (`.b` file), you must add a `$PACKAGE` declaration at the top to associate it with the component you just created.
    ```basic
    $PACKAGE EB.MtdTraining
    ```
4.  **Compilation**: Upon saving, Design Studio will compile the subroutine and create a `.jar` file for the component (e.g., `EB_MtdTraining.jar`), which contains the compiled Java class files for your routine.

## Transitioning a Main Program

Main programs can often run with minimal changes, but you need to be aware of environment differences, especially regarding multi-company setups.

1.  **Multi-Company Context**: In TAFJ, if your program processes records belonging to different companies, you might need to explicitly load the company context before reading the record.
    ```basic
    IF company_code NE ID.COMPANY THEN CALL LOAD.COMPANY(company_code)
    ```
    *Note: `ID.COMPANY` requires inserting `I_COMMON`.*
2.  **Execution**: Programs can be executed directly from Design Studio or the command line using `tRun`.

## Leveraging TAFJ's New Syntax (Object-Oriented Properties)

While the old syntax of parsing dynamic arrays works, TAFJ introduces a cleaner, object-oriented syntax using packages and properties.

1.  **Using Packages**: Use the `USING` keyword to import packages instead of `$INSERT` for common variables where possible, or to import table definitions.
    ```basic
    USING EB.Local
    USING AC.AccountOpening
    ```
2.  **Calling Component Methods**: You can call subroutines defined in packages directly using dot notation instead of the `CALL` statement.
    ```basic
    * Old way: CALL MTD.GetRecord(...)
    * New way:
    rec = EB.Local.MTDGetRecord("F.ACCOUNT", acct_id, error)
    ```
3.  **Accessing Record Properties**: Instead of dealing with dynamic array positions (e.g., `rec<AC.SHORT.TITLE>`), you can use the generated class structures to access fields by property names. You use the `Read` method provided by the package.
    ```basic
    * Read the record
    rec = AC.AccountOpening.Account.Read(acct_id)
    
    * Access fields directly
    name = rec.AccountOpening.Account.ShortTitle
    currency = rec.AccountOpening.Account.Currency
    balance = rec.AccountOpening.Account.WorkingBalance
    ```
    This significantly improves code readability and maintainability by removing the reliance on array indexing.
