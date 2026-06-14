# T24 BUSINESS TRAINING: How to configure T24 CU & AC applications

## Overview
This video provides advanced training on the T24 business area, focusing on the setup and configuration of two fundamental applications: **Customer (CU)** and **Account (AC)**. It covers the essential parameter tables required to prepare the system for use.

## 1. Customer Application
The Customer application records and maintains all static information related to customers (individuals, corporates, or other entities having a relationship with the bank).

### Key Tables for Customer Configuration:
*   **Country**: Contains all country codes (ISO format). It usually comes pre-configured, but you can add missing countries.
*   **Sector**: Holds economic sector information, crucial for reporting, especially Central Bank reports. The list is typically provided by the Central Bank.
*   **Target**: Primarily used for marketing purposes to differentiate and target specific customer groups (e.g., Private Client, High Net Worth).
*   **Language**: Defines languages available in the system for communication (e.g., English, French, German, Spanish). You can add local languages (e.g., Kinyarwanda) to use for system messages or customer communication.
*   **Tax**: Holds the Tax Identification Number (TIN) information. It is essential for producing tax reports (like CRS reports).

## 2. Account Application
The Account application holds financial data related to customer and bank accounts.

*   **Customer Accounts**: These must always be linked to a Customer ID. A customer can have multiple accounts.
*   **Internal Accounts**: These belong to the bank itself (e.g., cash, vault, suspense accounts). They are **not** linked to a customer and cannot have a customer ID.

### Key Aspects and Tables for Account Configuration:
*   **Currency**: Maintains exchange rates (buying, selling, mid-rate) for different currencies the bank deals with. Maintained by the Treasury department.
*   **Department Account Officer (DAO)**: Maintains the list of Relationship Managers or Account Managers responsible for managing customer accounts.

#### Category
The `CATEGORY` table is critical for parameterization. Account types are strictly defined by number ranges:
*   **Customer Accounts (1000 - 9999)**
    *   1000 series: Current Accounts
    *   2000 series: Vostro Accounts
    *   3000 series: Loan Accounts
    *   6000 series: Savings Accounts
*   **Internal Accounts (10000 - 19999)**
    *   10000 series: Cash Accounts
    *   14000 series: Suspense Accounts (Crucial to open suspense accounts in this correct range to avoid incorrect reporting).
*   **Forex Categories**: 20000 series
*   **LD & MM (Loans & Deposits, Money Market)**: 21000 series
*   **Profit & Loss (P&L) Accounts (50000 - 64000)**
    *   Expenses (e.g., salaries, bonuses) are typically in the 60000 series.

**Key Takeaway**: When creating a new category, it must be localized within the correct range to ensure accurate reporting and system behavior.

## Parameter Tables
These tables define rules for interest calculation, capitalization, and statement generation.

*   **CONDITION.PRIORITY**: Defines a hierarchy of conditions. For example, Priority 1 could be `ACCOUNT>CATEGORY`, Priority 2 `CUSTOMER>SECTOR`, Priority 3 `CUSTOMER>RESIDENCE`. This means category-level conditions take precedence over sector-level conditions.
*   **ACCT.GEN.CONDITION**: Applies general conditions to accounts based on the priorities defined in `CONDITION.PRIORITY`.
*   **GROUP.CAPITALISATION**: Defines the frequency of interest capitalization (e.g., monthly, quarterly, semi-annually).
*   **GROUP.DEBIT.INT** & **GROUP.CREDIT.INT**: Defines rules for calculating debit and credit interest.
    *   Specifies if an account type receives interest (e.g., Current accounts might have 0% interest, while Savings accounts have a specific rate).
    *   Defines the base days for calculation (e.g., 366/366).
    *   Defines balance type (e.g., Daily Balance, Minimum Balance).
    *   Defines calculation type:
        *   **Level**: A single percentage rate applied.
        *   **Band**: Different rates applied depending on the amount ranges.
*   **STMT.GEN.CONDITION**: Defines the rules for generating account statements (e.g., Daily, Monthly, Quarterly). It also configures settings like whether to produce a statement if there has been no movement on the account.
*   **ACCOUNT.STATEMENT**: Overrides general statement conditions at the individual account level. Each account will have an entry here to define its specific statement requirements.
