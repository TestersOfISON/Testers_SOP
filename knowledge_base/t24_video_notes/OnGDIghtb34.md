# T24 Video Analysis: Automated Loan Creation & Authorization

## 1. Overview
- **Goal:** Automate a T24 loan project using the RAFT framework.
- **Testing Tools:** Eclipse IDE, Java, TestNG, Selenium WebDriver (ChromeDriver), ExtentReports.
- **Workflow:** Two-step T24 process consisting of (1) creating a loan account with 'input' credentials and (2) authorizing the loan account with 'authorizer' credentials. This successfully demonstrates the T24 4-eyes principle.

## 2. Core Architecture & Application Structure
- **T24 Release:** Model Bank R15.
- **Interface:** T24 Web Browser Interface accessed via the standard `BrowserServlet`.
  - **URL Pattern:** `http://[host]:[port]/[Environment]/servlet/BrowserServlet` (e.g., `http://10.20.0.20:8085/TMBDEV/servlet/BrowserServlet`).
- **Core Module:** `LD` (Loans and Deposits).
- **Security Principle:** Segregation of duties (Maker-Checker / 4-eyes principle). A single transaction requires input by one user (e.g., `NOVINPUT01`) and authorization by another.

## 3. Essential Enquiries & Applications
- **Loan Input Application/Version:** `LD,LOANS.AND.DEPOSITS,BRIDGE,UIE.SCH`
  - Used for the creation and initial input of the loan details.
- **Loan Authorization Application/Version:** `LD,LOANS.AND.DEPOSITS,LOAN.AUTH,ALL`
  - Used by the authorizer to review and approve the pending transaction.
- **Unauthorised Loans List (Enquiry):** `List of Unauthorised Corporate, Discounted & Loans under Commitment`
  - Used to fetch transactions sitting in the `INAU` (Input Unauthorised) status waiting for authorization.

## 4. UI Navigation & Interaction Flow

### A. Loan Creation (Maker Flow)
1. **Login:** Authenticate using Maker credentials (`NOVINPUT01`).
2. **Handle Alerts:** Acknowledge system prompts (e.g., browser dialog "YOUR MAINTENANCE FEES ARE OVERDUE 20160810").
3. **Navigation Path:**
   - `User Menu` > `Corporate Operations` > `Loans` > `Create Loan` > `Corporate Loan`
4. **Data Entry:**
   - **Customer Id:** 111921 (Resolves to ABC SINGAPORE)
   - **Currency:** SGD
   - **Loan Amount:** 1,000.00
   - **Loan Start Date / Value Date / Maturity Date:** E.g., 23 APR 2015 to 23 APR 2016
   - **Loan Product:** CONSTRUN (Construction)
   - **Interest Settings:** Interest Type (FIXED), Interest Rate (3.00), Interest Basis (366/360)
   - **Liquidation Mode:** SEMI-AUTOMATIC
5. **Commit:** Submit the record.
6. **Overrides:** Accept any system overrides (e.g., Warnings for limits or missing data displayed in red).
7. **Result:** Transaction is saved with a status of `I_IN` (Input) and a Transaction Reference is generated (e.g., `LD15113017N3`).

### B. Loan Authorization (Checker Flow)
1. **Login:** Authenticate using Checker credentials.
2. **Handle Alerts:** Acknowledge system prompts.
3. **Navigation Path:**
   - `User Menu` > `Corporate Operations` > `Loans` > `Authorise Loans` > `Authorise/Delete Corporate, Discounted & Loans under Commitment`
4. **Action:**
   - The system executes the enquiry to show un-authorized loans.
   - The user selects the specific Transaction Ref (`LD15113017N3`) from the result list.
   - The authorization version `LD,LOANS.AND.DEPOSITS,LOAN.AUTH,ALL` opens.
   - Click the **Authorise** action button.
5. **Result:** Transaction completes, and the status is updated to `A` (Authorised).

## 5. Automation Artifacts & Test Logs
- The test logic is orchestrated as a TestNG Suite with tests like `T24Test` (Input Phase) and `T24Auth` (Authorization Phase).
- **ExtentReports:** Generates an HTML dashboard showing test steps, execution times, and environment variables (Java Version, OS, Browser).
- **TestRunner Logs Capture Specific UI Hooks:**
  - `Environment Configuration Ready`
  - `Navigating to url...`
  - `Username entered`, `Password entered`, `Sign in clicked`
  - Exact menu clicks: `Corporate Operation clicked`, `Create Loan clicked`, `Corporate Loan clicked`.
  - Commit sequence: `commit clicked`, `Accept clicked`.
  - `AuthoriseButton clicked`
