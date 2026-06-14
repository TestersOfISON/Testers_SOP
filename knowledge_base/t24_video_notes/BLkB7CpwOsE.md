# T24 Business Training: Funds Transfer, SWIFT, and Delivery

This video provides an overview of the Funds Transfer (FT) module in Temenos T24, including its integration with SWIFT, the Delivery module, and Standing Orders.

## 1. Funds Transfer (FT) Module
The FT module is used to process payments internally within the bank or externally to other banks.
*   **SWIFT Support**: T24 supports SWIFT transactions out of the box without requiring additional modules.
*   **Multi-Currency**: Supports local and foreign currency transfers with automatic conversion based on system settings and custom exchange rates.

## 2. Payment Types
There are three main types of payments that can be processed using the FT module:
*   **Internal Transfers**: Payments between accounts within the same bank (e.g., Customer to Customer, Customer to Internal, or Internal to Internal).
*   **External Transfers (Inwards and Outwards)**:
    *   *Domestic/Local Clearing*: Transactions routed through a local clearing house.
    *   *International Transfers*: Transactions routed through correspondent banks via the SWIFT network. If banks lack a direct relationship, the transfer may hop through multiple correspondent banks.
*   **Bank's Own Payments**: Payments made from the bank's internal accounts to pay its own bills (e.g., to a supplier).

## 3. Parameter Files (Configuration)
The FT module requires configuration through various tables:
*   **FT.CHARGE.TYPE**: Used for configuring flat-fee charges (e.g., a fixed $100 fee for account closure).
*   **FT.COMMISSION.TYPE**: Used for configuring percentage-based commission fees. Fees can vary based on the transfer amount (e.g., 0.25% up to 100k, 0.5% up to 250k, etc.).
*   **FT.TXN.TYPE.CONDITION**: Holds default conditions and validation rules for specific transaction types (e.g., `AC` for internal transfers, `OT03` for outward telex/SWIFT payments). This table determines whether the transaction requires a flat fee or a commission and sets forwarding/backdating limits (e.g., up to 5 working days).

## 4. SWIFT & Delivery Module
Because there is no dedicated "SWIFT module", T24 handles SWIFT through the combined use of the FT and Delivery modules.
*   **FT Module**: Books the transaction and handles the accounting.
*   **Delivery Module**: Formats the transaction data into standard SWIFT message types (e.g., MT103, MT202).
*   **Delivery Tables**:
    *   `DE.FORMAT.SWIFT`: Defines the message structure (e.g., mapping T24 fields like Sender Reference to SWIFT Tag 20).
    *   `DE.MAPPING`: Maps specific FT transaction types to specific SWIFT message formats.
    *   `DE.O.HEADER`: Stores formatted outward messages ready for the SWIFT network to pick up.
    *   `DE.I.HEADER`: Stores incoming messages waiting to be processed by T24.

## 5. Standing Orders (STO)
Standing Orders are a feature of the FT module used for automating recurring or condition-based transfers.
*   **Fixed Payments**: Recurring payments of the same amount on the same date.
*   **Direct Debits**: Payments for invoices where the amount may vary.
*   **Sweep Accounts**: Sweeping excess balances to another account (e.g., moving end-of-week balances from a local branch to the central bank).
*   **Fund Management**: Transferring funds based on predefined balance thresholds (e.g., if a branch account balance exceeds 500k, transfer the excess to the head office).
*   **Bulk Standing Orders**: Executing multiple payments simultaneously, such as a company paying employee salaries (payroll processing) on a specific date.
