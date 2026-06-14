# Architectural Notes: T24 Integration Framework and Fiorano ESB

## Overview
This document details the Temenos Enterprise Frameworks Architecture (TEFA) and its usage of the Integration Framework (IF) in conjunction with the Fiorano Enterprise Service Bus (ESB), based on a video demonstration. The core focus is on codeless integration, message flow, and system architecture without custom JBC code.

## 1. T24 Application Structure & Integration Studio
The design-time activities are handled via **Integration Studio**, which is delivered as an Eclipse plugin (or Visual Studio plugin). It defines how events are captured and formatted when exiting T24.

### Integration Project Structure
A `T24 Integration Project` creates the following directory structure:
- `events`
- `flows`
- `log`
- `schemas`

### Event Definition
Events dictate the trigger mechanisms within T24.
- **Exit Points**: Define when the event is triggered.
  - **Version**: e.g., `FUNDS.TRANSFER,NEW`
  - **Application**: Triggers regardless of the version used.
  - **Component Service**: e.g., `PaymentEnhancementService`.
- **Triggers**: For a Version, events can be emitted at different stages:
  - `INPUT.ROUTINE`
  - `AUTH.ROUTINE`

### Flow Definition
A **Flow** defines the schema/format of the message that leaves T24 at runtime.
- **Fields & Enrichments**: Fields are selected from a standard selection record. 
- **Enrichments**: Allow combining data translated across one or multiple T24 tables (e.g., extracting `DEBIT.CCY.NEG.AMT` from a Standard Selection record).
- Publishing the flow generates a standard XML Schema that describes the format of the outgoing message.

### T24 Flow Catalog
The T24 integration catalog consists of two primary tables:
1. `IF.EXIT.POINTS`: Links the event to the specific application/version and identifies the linked flow.
2. `IF.INTEGRATION.FLOW.CATALOG`: Contains the field definitions, custom XML-friendly names, and the generated XML schema.

## 2. Fiorano ESB Middleware Architecture
Fiorano eStudio is an Eclipse-based middleware environment focused on creating **Event Processes** through drag-and-drop components on a service palette.

### Key Components
- **T24InboundAdapter**: Acts from the perspective of the ESB. It is "inbound" to the ESB, meaning it receives messages *from* T24.
  - **Connection Types**: Connects via TAFC Agent, TAFJ, or Component Web Services (CWS).
  - **Enterprise Metadata Discovery**: The adapter queries T24's flow catalog and discovers available event schemas (like the `T24-FundsTransfer` schema) dynamically.
- **Transformation (XSLT)**: Transforms the standard T24 XML message into an external schema/format required by third-party systems using drag-and-drop graphical mappers.
- **Content-Based Routing (CBR)**: Routes messages conditionally based on XPath evaluation of the XML content. (e.g., routing an FT to an SMTP email alert component if the amount exceeds 100,000 USD).
- **Other Palette Services**: Displays, Feeder (to mock input), SMTP, FTP, Database connectivity (e.g., MySQL lookups), and JMS/MQ connectivity.

## 3. Financial Event Side Effects & Complex Routing
A single business event in T24 (like committing a `FUNDS.TRANSFER`) results in exactly one transaction and one emitted message. 
This message is transformed and routed externally in the middleware without custom T24 routines. The external routing can simultaneously update:
- Payment Gateways
- Back Office & Front Office Systems
- Risk Management Systems
- Data Warehouses
- General Ledger

Enrichments can be done directly in the ESB using Web Service requests or DB lookups (e.g., querying a MySQL DB for a customer's risk profile) before routing the transaction to final endpoints.

## 4. Inbound to T24 (`T24OutboundAdapter`)
The `T24OutboundAdapter` is responsible for sending data *from* the ESB *into* T24.
- **Request Types**:
  - Single OFS
  - Batch OFS
  - Single OFSML
  - Batch OFSML
  - Service XML (Custom XML converted to OFS under the hood).
- **Process Flow**: An external trigger (like reading a flat CSV file with Forex deals) is parsed, transformed via XSLT into the schema expected by T24 (using the metadata discovery tool pointing to the `FOREX` application), and injected into T24 via the adapter. T24 then processes the OFS and returns a response/transaction ID, which the ESB can further display or log.

## 5. Architectural Summary & ESB Agnostic Strategy
The T24 Integration Framework promotes a highly decoupled architecture:
- **Codeless Integration**: No JBC (jBASE Basic) code is written to handle external interfaces.
- **One-to-One Mapping**: 1 Business Event = 1 Transaction = 1 Message.
- **Externalized Logic**: Transformation and routing logic reside completely outside of T24, ensuring core banking performance is unimpacted.
- **ESB Agnostic Strategy**: While demonstrated with Fiorano, TEFA supports an Enterprise Stack Strategy accommodating:
  - Microsoft BizTalk Adapter
  - IBM WebSphere Message Broker
  - Oracle Service Bus
  - Open Stack / Fiorano (Clients without an existing ESB)
