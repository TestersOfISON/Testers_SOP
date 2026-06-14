# Temenos T24 AA (Arrangement Architecture) Module

This video provides an introduction to the Temenos T24 Arrangement Architecture (AA) module, focusing on its fundamentals, the product lifecycle, and how to create or amend products using the AA Product Builder.

## 1. Fundamentals of T24 Arrangement Architecture

The AA module is built upon several hierarchical components.

### Product Lines and Property Classes
*   **Product Lines (`AA.PRODUCT.LINE`)** and **Property Classes (`AA.PROPERTY.CLASS`)** are the fundamental building blocks of the AA module.
*   These are strictly defined and maintained by **Temenos**. Financial institutions cannot modify them, except for the description.
*   A **Product Line** (e.g., Accounts, Deposits, Lending) is constructed by assembling different **Property Classes**.
*   A **Property Class** (e.g., Account, Interest, Charge, Customer) acts as a reusable high-level component that contains specific **Attributes** and **Actions**. The same Property Class can be used across multiple Product Lines.

### Product Groups and Properties
*   **Product Groups (`AA.PRODUCT.GROUP`)** are subsets of Product Lines. They are used to group similar products together.
*   **Properties (`AA.PROPERTY`)** are named instances or types of Property Classes.
*   Unlike Product Lines and Property Classes, Product Groups and Properties **can be created and modified by the bank**.
*   Banks create Product Groups from the Temenos-defined Product Lines. A Product Group will have a number of properties associated with it.
*   Banks do not sell Product Groups directly to customers; they use them to organize products.

### Products and Product Conditions
*   **Products** represent the lowest level of the product hierarchy and are the actual items sold to customers.
*   A Product belongs to a Product Group and inherits its properties.
*   At this level, the bank creates **Product Conditions**. These conditions define the default values for each property associated with the product.
*   Product Conditions also specify if a property is **negotiable** and set the associated **restrictions** (e.g., minimum and maximum limits for an interest rate). If a condition is marked as non-negotiable, it cannot be changed when creating an arrangement for a customer.
*   Every property within a product must have a corresponding Product Condition.

### Arrangements and Arrangement Conditions
*   An **Arrangement** is the actual contract or agreement created in the system between the financial institution and a specific client for a particular product (e.g., opening a specific Current Account for John Doe).
*   It incorporates all the negotiated **Arrangement Conditions** based on the rules defined in the Product Conditions.

### Activity Classes
*   Activity classes define the system behavior when a specific activity is triggered or run on an arrangement.
*   The ID structure for an activity class is typically: `PRODUCT.LINE-PROCESS-PROPERTY.CLASS`.
*   Examples: `LENDING-APPLY.RATE-INTEREST`, `LENDING-CAPITALISE-INTEREST`.

## 2. Product Life-Cycle in AA

Every product in the AA module goes through a three-stage lifecycle:

1.  **Design:** This is where the product is created. All the properties and product conditions (default values, negotiability, restrictions) are defined.
2.  **Proof:** This stage validates the design. The system checks if all defined conditions and rules are correct and consistent. No errors must be present to proceed.
3.  **Publish:** Once successfully proofed, the product is published to the Product Catalog, making it available to be sold to customers.

If an existing product is modified (e.g., changing the default interest rate), it re-enters the **Design** stage, must be **Proofed** again, and then re-**Published**.

## 3. Practical Session: Using AA Product Builder

The video demonstrates how to use the T24 Product Builder (found under the Admin Menu) to manage these components.

*   **Viewing Components:** You can drill down from Product Lines to see the mandatory and optional Property Classes assigned to them.
*   **Mandatory Property Classes:** When creating a Product Group or Product, any Property Class marked as "Mandatory" at the Product Line level (e.g., the 'Accounting' class for the 'Accounts' product line) *must* be included. It cannot be removed.
*   **Creating a New Product Group:** The demonstration shows creating a new Product Group by copying an existing one (e.g., "MTD Current Accounts") and modifying its properties.
*   **Creating a New Product:** A new product (e.g., "MTD Current Account Normal") is created under a Product Group.
    *   **Inheritance:** The new product can be set to inherit properties from a parent product (e.g., a "Standard" current account definition). This avoids redefining all conditions.
    *   **Overriding Conditions:** Specific conditions can be overridden. For example, setting an `ELIGIBILITY` condition (Customer Age > 18) and a specific `CHARGE` (Management Fee of $3).
    *   **Tracking:** Conditions can be set to "Tracking" (changes to the product definition affect existing arrangements) or "Non-Tracking".
*   **Proofing and Publishing:** The video shows the process of taking the newly created product through the "Proof" stage and finally "Publishing" it to make it visible in the Product Catalog. It highlights that a child product cannot be proofed if its parent product has not been proofed/published yet.
