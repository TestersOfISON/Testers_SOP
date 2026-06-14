# T24 Programming Series | Multi-Value in Temenos T24 - Part 1
**Video ID:** rpsSI7pG7nc
**Presenter:** Aaron from mathisi.io

## Overview
This video introduces the concept of **Multi-Value** databases, which form the backbone of the Temenos T24 architecture. It compares the multi-value approach to traditional relational databases to highlight its advantages in flexibility and performance.

## Relational Databases vs. Multi-Value
- **Relational Databases (RDBMS):** 
  - Storing complex, hierarchical data (e.g., a customer with multiple past employers, and each employer having multiple office addresses) requires creating several normalized tables.
  - You would need a `Customer` table, an `Employer` table, an `Address` table, and join tables (like `Customer_Employers`).
  - Retrieving this data requires complex `JOIN` queries across all these tables, which can impact performance.
- **Multi-Value Databases (T24):**
  - T24 eschews this complexity. Instead of spreading data across many tables, it stores all related information within a *single record* in a single table (e.g., the `CUSTOMER` application).
  - This is achieved using Multi-Value and Sub-Value fields.

## Anatomy of a T24 Record
A single record in T24 is made up of fields. These fields can be categorized into three types based on their capacity:

### 1. Single Value Fields
- These fields can only hold one piece of information at a time.
- Examples shown in the video:
  - `52 CLS.CPARTY`
  - `60 TITLE` (e.g., "MR")
  - `61 GIVEN.NAMES` (e.g., "AARON")

### 2. Multi-Value Fields
- These fields can hold multiple pieces of information. They are represented with a dot (`.`) and an index number.
- Example: A customer with two past employers.
  - `70.1 EMPLOYMENT.STAT` (Value: EMPLOYED)
  - `70.2 EMPLOYMENT.STAT` (Value: SELF-EMPLOYED)
  - `71.1 OCCUPATION` (Value: HEAD OF IT OPERATIONS)
  - `71.2 OCCUPATION` (Value: TELEMEDICINE PROJECT ADMIN)

### 3. Sub-Value Fields
- An extension of multi-value fields. A single multi-value entry can itself contain multiple sub-values, adding another layer to the hierarchy.
- Example: The first employer has two different office addresses.
  - `74.1.1 EMPLOYERS.AD` (Address 1 for Employer 1)
  - `74.1.2 EMPLOYERS.AD` (Address 2 for Employer 1)
  - `74.2.1 EMPLOYERS.AD` (Address 1 for Employer 2)

## Advantages of Multi-Value in T24
- **Efficiency:** You can grab a single customer record and instantly have access to their entire history (employers, addresses, statuses) without any `JOIN` statements.
- **Flexibility:** It makes the T24 system highly competitive, as it naturally aligns with complex financial data structures.
- **Simplicity in Code:** As a developer, once you read the record into a dynamic array, all hierarchical data is right there in memory, ready to be extracted using field, value, and sub-value markers.
