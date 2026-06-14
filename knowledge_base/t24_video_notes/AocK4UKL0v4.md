# T24 Programming: Authorization Routines

## Overview
Authorization routines are invoked at the authorization stage of a transaction. They can be used to trigger custom actions (e.g., generating transaction advice, logging custom information) when a record is authorized.

## Steps to Implement an Authorization Routine
1. **Write, compile, and catalog a subroutine:**
   * Write the business logic in a basic subroutine (e.g., logging account details when an account is authorized).
   * Compile (`BASIC`) and catalog (`CATALOG`) the routine.
2. **Create an entry in EB.API:**
   * Create a new record in `EB.API` using the subroutine's name.
3. **Attach routine to a version:**
   * Go to the specific `VERSION` record (e.g., `ACCOUNT,MTD.SAVINGS`).
   * Add the routine name to the `AUTH.ROUTINE` field (typically field `64.x`).

## Example: Logging Account Details upon Authorization
* **Subroutine (`MTD.AuthLogAcDetails`):** Extracts fields such as `ID.NEW` (account number), mnemonic, short title, currency, and category from `R.NEW`. The current authorizer is fetched from the system common variable `OPERATOR`.
* **Logging:** It calls a custom logger routine (`MTD.Logger`) which writes the information to a local log folder (`MATHISI.LOG`), saving a file named `<account_number>.log`.
* **Workflow:**
   1. A user creates an account, leaving it in 'INAU' (unauthorized) status.
   2. Another user logs in and authorizes the account.
   3. The authorization routine automatically fires, logging the specified details to the log file.
