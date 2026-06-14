# Temenos T24 Application Architecture Notes: AA Loans and Deposits

## 1. T24 Application Structure & Core Architecture
The video showcases the Temenos T24 **Arrangement Architecture (AA)**, a highly modular and parameterized framework used to build and manage retail banking products, specifically focusing on Loans and Deposits operations.

### Core Architectural Principles:
*   **Modular Product Builder:** Products in AA are constructed using "Shared Conditions" and specific properties. Examples of shared conditions include Eligibility, Customer Restrictions (min/max age, gender, nationality), Initial Deposit, and Lending Restrictions. 
*   **Sequential Process Workflows:** T24 UI enforces strict data validation and sequential progression, especially during Origination. For instance, mandatory fields must be validated before progressing, and the system restricts backward navigation after committing certain stages.
*   **Separation of Duties (Maker/Checker):** The architecture strictly implements the maker-checker principle. Almost all actions (booking, payoff, reversal, top-up) require an initial "Commit" (Input) followed by a separate "Authorization" step from an authorized user (via "Find Unauthorised" enquiries).
*   **Exception Handling and Overrides:** Manual interventions, such as unauthorized overdrafts during repayment or maturity dates falling on non-working days, automatically trigger system warnings. These require explicit override acceptance (`Accept Overrides`) before the transaction can be committed.
*   **Master Arrangement ID (AA ID):** Every product instance is tracked via a unique Master Arrangement ID (e.g., `AA18123Y9W9`), serving as the primary key for all subsequent activities, operations, and enquiries.

## 2. Navigation & User Interface Flow
T24 utilizes a Role-Based Menu system to navigate through credit and deposit operations. 

### Key Navigation Paths:
*   **Loan Operations Hub:** `Credit Operations -> Loans AA`
    *   *Sub-menus:* Limits, Collateral, Loan Simulations, Loan Origination, Loan Without Origination, Loan Operations, Overdraft Products, Loan Enquiries.
*   **Deposit Operations Hub:** `Account Operations -> Deposits -> Deposits AA`
*   **Authorizations:** `Credit Operations -> Credits Authorisation`

### Essential Enquiries:
*   **Find Arrangement by Company:** The primary enquiry used to view active loan details, balances, financial summaries, and repayment schedules.
*   **Find Unauthorised Loans / Reversals:** Crucial enquiries used by Authorizers to locate transactions pending approval.
*   **View Account Statement:** Found under `Customer Services -> Account Enquiries`. Used to verify transactions, debit/credit entries, and closing balances post-operation.
*   **View Deposits by Branch:** Used to retrieve a list of active deposit contracts for maintenance or redemption.

## 3. Comprehensive Workflow Details

### A. Loan Arrangement Booking
T24 handles loan booking through two distinct architectural flows:

1.  **Loan Origination (Multi-stage Workflow):**
    *   Used for processing new applications requiring full vetting.
    *   **Stages:** Application Input -> Guarantor Input -> Credit Checking -> Collateral Input -> Credit Scoring -> Credit Assessment -> Review and Approval -> Offer Production -> Loan Creation.
    *   *Note:* The aggregate score from the Credit Scoring stage dictates the Credit Assessment stage where authorized personnel Approve, Decline, or Hold the application.

2.  **Loan Without Origination (Single-page Form):**
    *   Used when credit scoring and eligibility checks have already been completed externally or for trusted customers.
    *   All conditions (Term Amount, Interest Condition, Repayment Schedule, Settlement Pay-In/Pay-Out Instructions) are consolidated and inputted on a single form before committing.

3.  **Group Loans:**
    *   Initiated by setting the Customer Type to `Group` and providing a Group ID.
    *   The system automatically populates an application details table with all members belonging to that Group ID, allowing customized terms and amounts for each sub-allocation.

### B. Core Loan Operations
*   **Disbursement:** Can be automated post-creation or triggered manually via `Loan Operations -> Individual Loan Disbursement`. Disbursement methods include Funds Transfer (FT), Cash, or Cheque.
*   **Manual Repayment:** Processed via `Loan Payment Operations (FT)`. Requires specifying the debit account (which can be different from the customer's primary account) and credit amount.
*   **Loan Top-Up & Payoff:** 
    *   These actions are handled by initiating a **"New Activity"** on an existing Arrangement.
    *   For Top-ups, the user selects the "Change Term/Amount" activity to adjust the commitment details.
*   **Loan Reversal:**
    *   Reversals are tightly controlled. The user must find the specific AA ID, navigate to `Reverse AA Activity`, select the specific target transaction from the Activity Log, initiate the reversal, and then wait for an Authorizer to approve the "Unauthorised AA Reversal".
*   **Loan Simulation:**
    *   T24 provides a dedicated Simulation tool allowing users to execute "what-if" scenarios (e.g., simulated payoff or top-up) without impacting the live database. The simulated activity is stored in a separate file and can be viewed to analyze financial impacts.

### C. Deposit Architecture (AA Deposits)
*   **Creation:** Handled under `Deposits AA -> New Arrangement`. 
    *   The process involves selecting the deposit product (e.g., NPF Fixed Deposit), assigning Primary/Other Officers, inputting the commitment amount and term/maturity date, adjusting interest rates if necessary, and defining the Settlement Instructions (Pay-in/Pay-out accounts).
*   **Redemption (Liquidation):**
    *   To liquidate a deposit, the user navigates to `Deposit Reports -> View Deposits by Branch`, locates the specific deposit, selects `Redeem Deposit`, inputs the Redemption Date, and commits for authorization.
