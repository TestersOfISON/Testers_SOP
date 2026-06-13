# T24 Sensitive Logic (Client Overrides)
> **CONFIDENTIALITY NOTICE:** This file contains exact client specification logic, user story overrides, and sensitive banking execution flows. It is strictly sandboxed for Local RAG parsing and MUST NOT be loaded into the Oracle Cloud Chatbot.

## WF-8185 - Automated Services for Guarantee Updates- LBK.SOLDARE.GARANTII
*   **Routine Action:** Liquidates guarantees after the liquidation of the attached loans or deposits.
*   **Conditions:** Must select all guarantees where `VAL.EVAL.INT > 0` AND there are no active LD (Loans) or PD (Deposits) records attached.
*   **Updates:** 
    *   `NOMINAL.VALUE = 0`
    *   `VAL.EVAL.INT = 0`
    *   `EXPIRY.DATE = TODAY`
*   **Matrix Rule:** Since this is a liquidation closure, testing must ensure that all balances evaluate precisely to zero. Include Positive, Negative, and Edge Case locks across PF, PJ, and PRE.

## WF-8178 - Automated Services for Guarantee Updates - LBK.ACTUALIZARE.CASH.COLL
*   **Routine Action:** Synchronizes active guarantees with their underlying AA/MM deposits.
*   **Conditions:** Guarantees that have an attached MM (`APPLICATION.ID`) and where `VAL.EVAL.INT > 0`.
*   **Updates / Sync Triggers:**
    *   **Rollovers:** `MATURITY.DATE = NEW.DATE`
    *   **Capitalization:** `AMOUNT = NEW.AMOUNT`
    *   **Rate Changes:** `INTEREST.RATE = NEW.RATE`
*   **WARNING - LIQUIDATION OVERRIDE:** Do NOT liquidate active collateral. Do NOT set `WORKING.BALANCE = 0`.
*   **Matrix Rule:** Testing must explicitly duplicate execution across all 3 sync triggers across all 3 customer segments (PF, PJ, PRE), resulting in a minimum 15-execution matrix including bypass flows.

## WF-8171 - Liquidation restriction for collateral deposits
*   **Routine Action:** A real-time UI restriction (Override) preventing manual liquidation of deposits guaranteeing an active loan.
*   **Conditions:** The user attempts a PAYOFF or CLOSE activity on an AA collateral deposit that is actively guaranteeing a loan (associated via collateral code 100).
*   **Updates / Sync Triggers:** Throws a Supervisor Override error preventing immediate liquidation.
*   **Matrix Rule:** Negative Flow means the deposit does NOT guarantee a loan, so the transaction is allowed. Edge Case means testing the Supervisor Override mechanism.
