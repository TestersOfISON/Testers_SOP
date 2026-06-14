# Temenos T24 AA Module - Arrangement Architecture

## Objectives
1. Fundamentals of T24 Arrangement Architecture
2. Product life-cycle in AA
3. Create new Products or amend existing ones using AA Product Builder

## Core Architecture and Application Structure
The AA (Arrangement Architecture) module in Temenos T24 uses a multi-layered, component-based structure to build and manage financial products.

### 1. Product Lines and Property Classes (Top Level)
* **Product Lines** (`AA.PRODUCT.LINE`) and **Property Classes** (`AA.PROPERTY.CLASS`) are the fundamental building blocks of the architecture.
* Defined and maintained exclusively by Temenos. Financial institutions cannot create new ones or modify their structure (only the descriptions can be amended).
* **Product Line:** Represents a high-level category of products (e.g., Accounts, Deposits, Lending). A product line is composed of different property classes.
* **Property Class:** A reusable component that contains `ATTRIBUTES` and `ACTIONS`. A property class can be used across multiple product lines (e.g., the `ACCOUNT` or `INTEREST` property classes are used in both Accounts and Deposits product lines).

### 2. Product Groups and Properties (Middle Level)
* **Product Groups** (`AA.PRODUCT.GROUP`): These are subsets of Product Lines. They group different products with similar properties. Example: Under the "Accounts" product line, there might be product groups for "Current Accounts" and "Savings Accounts". Banks do not sell product groups.
* **Properties** (`AA.PROPERTY`): These are named types of Property Classes.
* Created and modified by the bank (financial institution).
* A Product Group has a number of properties associated with it. When creating a product group, mandatory property classes defined in the product line *must* be included. Optional property classes can be added as needed.

### 3. Products and Product Conditions (Bottom Level)
* **Product**: The lowest level of the hierarchy and what is actually sold to the customer.
* **Product Conditions**: Define the default values and business rules for the arrangement (e.g., default interest rate, maintenance fees, age restrictions).
* Conditions also specify what is negotiable (and the permitted negotiation range/restrictions) and what is non-negotiable.
* Each Property within a Product must have a corresponding Product Condition.

### 4. Arrangements and Arrangement Conditions
* An **Arrangement** is the actual contractual agreement created between the financial institution and the client when a product is sold (e.g., a specific customer's Current Account).
* It inherits the conditions from the Product but can have specific negotiated values applied (if allowed by the Product Conditions).

### 5. Activity Classes
* **Activity Class** relates to the Property class (`@ID: PRODUCT.LINE-PROCESS-PROPERTY.CLASS`). Example: `LENDING-APPLY.RATE-INTEREST`, `LENDING-CAPITALISE-INTEREST`.
* It defines the system behavior when a certain activity is run (e.g., how interest is capitalized for a lending product vs. a deposit product).

## Product Life-Cycle
Products in AA go through a strict three-stage life-cycle:
1. **Design**: Defining all properties and product conditions (default values, restrictions).
2. **Proof**: Validating the design to ensure all conditions are correct and no errors exist.
3. **Publish**: Pushing the product to the Product Catalog, making it available for users to sell to customers.
*Modifying an existing product requires it to go back through the Design -> Proof -> Publish cycle. Product conditions can also have different tracking states (e.g., Tracking vs. Non-Tracking) which dictate whether changes affect existing arrangements or only new ones.*

## Application Navigation and Enquiries
The video demonstrates navigating the T24 Browser Interface to manage AA products.
* **Navigation Path:** `Admin Menu` -> `Product Builder` -> `Products`.
* **T24 Product Browser:** This interface provides columns for `Product Lines`, `Product Groups`, and `Products`. 
    * Users can drill down from a Product Line to see associated Product Groups and Property Classes.
    * Users can drill down from a Product Group to see child Products.
* **Product Catalog:** Once published, products appear in the Product Catalog where users can simulate or create new arrangements.
    * **Navigation Path:** `User Menu` -> `Product Catalog`.
* **Commands/Enquiries:**
    * `AA.PRODUCT.DESIGN,CHARGE`: Used to view/design charge property conditions.
    * `AA.PRODUCT.DESIGN,FACILITY`: Used to view/design facility property conditions.

## Product Creation Workflow (Demonstration)
1. **Create Product Group:** Groups are often created by duplicating standard Temenos groups (e.g., copying standard Current Accounts). Mandatory property classes (e.g., `ACCOUNTING`) cannot be removed.
2. **Create Parent Product:** Set up a top-level product to define shared conditions (e.g., `MTD.CURRENT.PAR.STD`). This product is marked as "Inheritance Only" so it cannot be sold directly.
3. **Create Child Product:** Create a product (e.g., `MTD.CURRENT.NORMAL`) that extends the parent product. It inherits all properties and conditions but allows specific overrides (e.g., setting an Account Maintenance Fee of $3.00, or limiting Currency to USD/EUR/GBP).
4. **Proof & Publish:** The new product is proofed for errors. Once successfully proofed, it is published to make it available in the Product Catalog.

## Future Topics Highlighted
* T24 Core Banking System Navigation (classic vs. browser interface)
* High-level introduction to T24 modules:
    * Open Financial Services (OFS)
    * Customer (CU)
    * Funds Transfer (FT)
    * Loans and Deposits (LD)
    * Arrangement Architecture (AA)
* T24 Administration
* Integration with Python, Java, JavaScript (Socket Programming, CALLJ, consuming APIs)
