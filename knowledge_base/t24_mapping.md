# Temenos T24 Migration Guidelines: MM to AA (Mock Data)

## 1. Overview
This document outlines the core structural and functional mappings required when migrating the Money Market (MM) module to the Arrangement Architecture (AA) module in Temenos T24 for Libra Bank.

## 2. Interest Accrual Rules
*   **MM Context:** Interest accrual was historically driven by the `LD.SCHEDULE.DEFINE` application.
*   **AA Mapping:** In AA, interest accruals are governed directly by the `AA.PRD.DES.INTEREST` property class.
*   **Critical QA Check:** When validating migration, ensure that the `DAY.BASIS` parameter perfectly maps. For instance, an `A 360/360` basis in MM must explicitly map to the equivalent property within AA without fallback to system defaults.

## 3. Penalty Processing
*   **MM Context:** Penalty rates on overdue contracts were tracked in the `L.PENALTY.RATE` local reference field.
*   **AA Mapping:** AA utilizes the `AA.PRD.DES.CHARGE` property class to handle all penalty calculations.
*   **Critical QA Check:** Validate that the exact penalty delta (e.g., +2.00%) from MM is recreated as a tier or margin adjustment in AA. If a manual penalty rate was applied in MM, an AA override property must be successfully instantiated on the migration date.

## 4. Statement Generation
*   **MM Context:** Statements were triggered by the batch process `EOD.MM.STATEMENTS`.
*   **AA Mapping:** Statements are activity-driven. `LENDING-ISSUE-BILL` or `DEPOSIT-ISSUE-STATEMENT` activities must be linked to the scheduled dates migrated from MM.
*   **Critical QA Check:** Ensure the migrated next statement date matches exactly between the legacy system and the AA schedule property.

## 5. Security & Authorization
*   **MM Context:** Used `MM.MONEY.MARKET` application for input and authorization.
*   **AA Mapping:** Uses `AA.ARRANGEMENT.ACTIVITY` (AAA) for all transactions.
*   **Critical QA Check:** User profiles with authorization limits on MM deals must be correctly translated to AAA activity limits. Validate that users can no longer access `MM.MONEY.MARKET` directly after the cutover date.

## 6. Guarantee Synchronization (LBK.ACTUALIZARE.CASH.COLL)
*   **Context:** The `LBK.ACTUALIZARE.CASH.COLL` routine synchronizes active guarantees with their underlying AA/MM deposits.
*   **Rules:** Do NOT liquidate active collateral. Do NOT set `WORKING.BALANCE = 0` for active records.
*   **Sync Triggers:** Must extract the following triggers if they occur:
    *   **Rollovers:** Update `MATURITY.DATE = NEW.DATE`.
    *   **Capitalization:** Update `AMOUNT = NEW.AMOUNT`.
    *   **Rate Changes:** Update `INTEREST.RATE = NEW.RATE`.
*   **Critical QA Check:** Validate that synchronization accurately updates fields without zeroing out active balances. Testing must explicitly cover the 3 sync triggers across all segments (15-execution matrix).
