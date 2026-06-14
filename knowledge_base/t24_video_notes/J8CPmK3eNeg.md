# T24 Video Notes: Temenos Enterprise Framework Architecture (TEFA) - Events attached to ISA Services

## Video Overview
The video provides a detailed walk-through of the Temenos Enterprise Framework Architecture (TEFA), focusing on the Integration Framework (IF). Specifically, it demonstrates how to attach inbound integration events to TSA (Temenos Service Agent) services. This integration allows for initial loading or close-of-business/online services to publish messages outside of T24.

## Core Architecture and Tooling
- **Eclipse-based Integration Studio:** The development environment used for building integration events, flow editors, and defining joins.
- **Integration Framework (IF):** The core framework in T24 that manages the definition, selection, and formatting of messages to be exported.
- **Fiorano ESB Middleware:** The enterprise service bus used to poll T24 for integration events and route the XML messages to other components or queues.
- **T24 Application Structure:** The video shows how T24 tables (like `ACCOUNT` and `DEPT.ACCT.OFFICER`) are accessed and selected for specific fields.

## Event Creation and Configuration
- **Exit Point Definition:** Integration events can be linked to T24 Versions, Applications, or TSA Services. In this walkthrough, a TSA Service (`AC.ALL.ACCOUNTS.SERVICE`) is selected as the exit point.
- **Flow Definition:**
  - Base application is selected (e.g., `ACCOUNT`).
  - Specific fields can be added to the flow enrichment (e.g., `@ID`, `ACCOUNT.OFFICER`, etc.).
- **Join Builder (Enrichments):** Allows for enriching the message by joining related T24 tables without writing extra T24 code.
  - Example shown: Joining the `ACCOUNT` table's `ACCOUNT.OFFICER` field to the `DEPT.ACCT.OFFICER` table to fetch the `NAME` field.
  - These joins are configured graphically in Eclipse and become part of the flow definition.

## T24 Service Code Structure
The TSA Service (`AC.ALL.ACCOUNTS.SERVICE`) consists of simple boilerplate T24 basic routines:
- **LOAD Routine (`AC.ALL.ACCOUNTS.SERVICE.LOAD`):** Runs once per thread. In the example, it has no business logic and simply contains a `RETURN` statement.
- **SELECT Routine (`AC.ALL.ACCOUNTS.SERVICE.SELECT`):** Runs once each time the TSA is run. It is responsible for building the list of IDs to be processed.
  - Example Logic: Selects all accounts matching a specific currency (`GBP` - Great British Pounds) and calls `BATCH.BUILD.LIST`.
- **RECORD Routine (`AC.ALL.ACCOUNTS.SERVICE`):** Executed once for each selected record (Account ID).
  - It receives the ID as a parameter.
  - The integration framework hooks into this routine, so each time an ID is processed, an enriched event is generated and inserted into the Integration Events Interface table.

## Execution and Navigation Flow
1. **T24 Browser:**
   - Navigate to the **Service Manager (TSM)** and set its status to **Start**.
   - Navigate to the specific TSA Job (**BNK/AC.ALL.ACCOUNTS.SERVICE**) and set its status to **Start**.
2. **Command Prompt / Server Backend:**
   - Execute the service manager: `START.TSM -DEBUG` (Starts the TSM and allocates agents).
   - Execute a TSA agent: `tSA 2` (Starts thread #2 to process the job).
3. **Fiorano ESB Studio:**
   - The T24 Inbound Adapter component polls T24 for new integration events.
   - It retrieves the event metadata for the specified TSA job.
   - The messages are routed to a display component where the outputted XML structure can be analyzed.
   - Each message corresponds to an account and contains the fields defined in the Eclipse Flow editor.
