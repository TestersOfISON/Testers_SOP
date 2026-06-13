# Temenos T24 (Transact) Architecture & Development Notes

This document serves as a comprehensive technical reference for the architecture, frameworks, and programming constructs underpinning the Temenos T24 (Transact) Core Banking platform. 

---

## Core Architecture and Application Structure
Temenos T24 utilizes a multi-tiered, database-agnostic architecture designed for high availability, 24/7 processing, and massive extensibility.
*   **Presentation Tier (Channels):** Interfaces with external applications via the T24 Browser, mobile platforms, and APIs.
*   **Integration Layer:** Built around robust API gateways and message queues (JMS, IBM MQ). The primary structural integration component is OFS.
*   **Application Server Tier:** Processes business rules and workflows. It leverages a composable approach to independent banking capabilities.
*   **Persistence Tier:** Supports traditional hierarchical MultiValue databases (jBase) or relational databases (RDBMS) via a unified abstraction layer.

## Arrangement Architecture (AA)
The Arrangement Architecture (AA) is frequently described as the "Lego Set for Banking." It is a component-based framework replacing traditional, siloed T24 modules. It allows banks to define and launch highly customized products rapidly.

### Hierarchy of AA Components
1.  **Product Lines:** The base business domain (e.g., Lending, Deposits).
2.  **Property Classes:** Reusable core building blocks (e.g., Interest, Charges, Payment Schedule) housing business logic.
3.  **Properties:** Configured instances of Property Classes (e.g., 'Penalty Interest' vs 'Regular Interest').
4.  **Product Groups:** Collections of constraints standardizing how properties can be assembled.
5.  **Products:** The actual bank offerings crafted by combining Properties.
6.  **Arrangements:** An instantiated contract/agreement generated when a specific customer subscribes to a Product.

## TAFC vs TAFJ Frameworks
Temenos provides two primary runtime environments. Modernization efforts typically involve migrating from TAFC to TAFJ.
*   **TAFC (Temenos Application Framework C):** The legacy environment. It compiles jBC (InfoBasic) code down to C. It is tightly coupled to the jBASE MultiValue database environment.
*   **TAFJ (Temenos Application Framework Java):** The modern runtime. It executes T24 inside a standard Java Virtual Machine (JVM), enabling platform independence, cloud deployment, and integration with robust RDBMS backends (Oracle, SQL Server, Postgres). TAFJ supports CI/CD pipelines, Eclipse-based IDEs (Temenos Design Studio), and modern DevOps practices.

## JQL vs SQL in T24
The query language used depends heavily on the underlying framework.
*   **JQL (jBase Query Language):** The native querying tool for TAFC/jBase. Designed to navigate complex, nested MultiValue files containing fields, sub-values, and multi-values natively (e.g., `SSELECT`, `LIST`).
*   **SQL (Structured Query Language):** The standard for TAFJ environments running on RDBMS. Because T24 "flattens" or structures its multi-value data into relational tables or XML/CLOBs, SQL is used for analytics and direct DB interactions.

## Componentization and EQUATE
T24 development emphasizes modular, resilient code.
*   **Componentization:** The architectural move away from monolithic codefiles into specific "Table Components" and encapsulated microservices. It isolates business logic, reducing regression risks during upgrades.
*   **EQUATE (jBC/InfoBasic):** A critical programming standard used in T24 routines. Instead of hard-coding numeric array index references for database fields, developers use the `EQUATE` statement (often placed in `$INSERT I_COMMON` or `I_EQUATE` files). 
    *   *Example:* Assigning `EQU CUST.NAME TO 5` allows developers to reference the 5th position of the customer array intuitively via `CUST.NAME`.

## OFS (Open Financial Service)
OFS is the standard, universal gateway for all external systems to exchange data and execute transactions within T24.
*   **Request-Response Flow:** OFS intercepts external messages, validates them against T24's core business logic and versions, and returns structured responses.
*   **Formats:** Supports native OFS syntax (comma-separated strings) and XML.
*   **Security:** Bypassing OFS to write directly to the database is strictly prohibited in T24, ensuring full transaction integrity and audit trails.

## Subroutines and Java Hooks
Temenos provides robust extensibility points without altering the core product.

### Subroutines (jBC / InfoBasic)
*   **Usage:** Used natively in TAFC for calculations, string manipulations, and data transformations.
*   **Types:** Version routines (validation during user input), Enquiry routines (data mapping during reports), and IO routines (e.g., `F.READU`, `F.WRITE` for safe file locking and journal updates).
*   **Standardization:** Temenos provides built-in API subroutines like `CDD` (Calculate Date Difference) to avoid redundant logic.

### Java Hooks
*   **Usage:** The modern replacement for jBC routines in the TAFJ environment. Developers write custom Java classes extending standard Temenos base classes.
*   **L3 Development:** "Hooks" intercept execution at specific lifecycles points (e.g., `RecordLifecycle` base class).
*   **Types:** 
    1. *ID Routine Hook:* Validates record IDs.
    2. *Record Routine Hook:* Defaults values on record open.
    3. *Validate Routine Hook:* Cross-field input validation.
    4. *Auth Routine Hook:* Logic triggered upon record authorization.

## Close of Business COB SMS UTF

### COB (Close of Business)
The automated, multi-threaded batch processing engine executed at the end of the bank's day. It handles interest accruals, system rollovers, statement generation, and daily reporting.

### SMS (Security Management System)
*   **Meaning 1 (Core Application):** The Security Management System application in T24 that manages user profiles, access rights, role-based access control (RBAC), and user activity auditing.
*   **Meaning 2 (Delivery Carrier):** Short Message Service. Handled by the Delivery module (`DE.CARRIER`). Configured to format outbound SMS notifications (often via XML to an external gateway), strictly requiring UTF-8 encoding configurations to handle multi-language data cleanly.

### UTF (Unit Test Framework)
*   **Purpose:** A dedicated framework in the TAFJ ecosystem used by developers to write and automate unit tests for custom jBC subroutines.
*   **Mechanism:** Tests are saved with `.tut` extensions. The framework provides global methods for test parameterization, assertions, and execution.
*   **Stubs & Modifiers:** Supports "stubs" to safely simulate subroutine behavior without hitting live data, enforcing modern test-driven development (TDD) within core banking implementations.
