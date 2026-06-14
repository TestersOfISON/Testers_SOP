# T24 Application Architecture and Query Navigation: Manipulating SAVEDLISTS

Based on the analysis of the provided video tutorial, here are the comprehensive details regarding T24 application query structure, database interaction differences between architectural frameworks, and essential list manipulation navigation.

## 1. Application Structure and Core Architecture (TAFC vs TAFJ)

The T24 application relies on two primary foundational frameworks, which dictate how backend data is stored, queried, and manipulated:

*   **TAFC (Temenos Application Framework C)**: Utilizes a multidimensional database structure and relies on **JQL (jBASE Query Language)**.
*   **TAFJ (Temenos Application Framework Java)**: Utilizes a relational database management system (RDBMS) such as Microsoft SQL Server. Because of limitations in how JQL handles list combination in TAFJ, **SQL (Structured Query Language)** is often used directly. 
*   **Savedlists Directory**: In both environments, lists of records are persisted in a specialized directory known as `&SAVEDLISTS&`.

## 2. Essential Enquiries and Navigation in TAFC (JQL)

In a TAFC environment, terminal navigation and query building rely on JQL commands natively executed at the jsh prompt.

### Creating and Evaluating Lists
You can select data from application tables (e.g., `FBNK.ACCOUNT`) and use `EVAL` to construct customized string outputs:
```text
SELECT FBNK.ACCOUNT WITH CUSTOMER NE '' AND WORKING.BALANCE GT 0 SAMPLE 10 SAVING EVAL "CO.CODE : ',' : @ID"
```
*This selects 10 records with a non-empty customer and positive working balance, saving an evaluated string concatenating the company code and the record ID.*

### Saving and Viewing Lists
*   **Save List**: `SAVE.LIST <list_name>` (e.g., `SAVE.LIST BNK.ACCT.LIST`) saves the active selection to the database.
*   **View/Edit List**: `JED &SAVEDLISTS& <list_name>` opens the list in the jBASE Editor (JED) to allow users to verify the list contents and navigate the raw records.

### Combining Lists
To merge multiple saved lists in TAFC, use the `OR.LISTS` command:
```text
OR.LISTS BNK.ACCT.LIST EU1.ACCT.LIST SG1.ACCT.LIST
```
Once combined, a simple `SAVE.LIST COMBINED.ACCT.LIST` will store the union of these records.

## 3. Essential Enquiries and Navigation in TAFJ (SQL Server)

Because commands like `OR.LISTS` do not function the same way in TAFJ, developers interact directly with the database using SQL IDEs (like SQL Server Management Studio).

### Selecting and Creating Lists
Views correspond to T24 tables. The equivalent selection is performed using `SELECT TOP` and standard `WHERE` clauses:
```sql
SELECT TOP 10 [CO_CODE], [RECID] 
FROM V_FBNK_ACCOUNT 
WHERE WORKING_BALANCE > '0' AND CUSTOMER <> ''
```

### Combining and Sorting Lists
*   **Union**: To mimic the `OR.LISTS` functionality, use the SQL `UNION` operator to join queries from different companies (e.g., BNK, EU1, SG1).
*   **Order By**: Apply sorting using standard SQL: `ORDER BY [CO_CODE]`.

### Integrating SQL Results back to T24
To bridge the gap between SQL Server and T24's SAVEDLISTS navigation:
1.  Execute the query in SQL Server.
2.  Save the resulting grid as a **CSV (Comma Delimited)** file.
3.  Name the file exactly as the desired saved list (e.g., `ACCT.LIST`) and ensure it has **no file extension**.
4.  Copy this file manually into the TAFJ environment's `&SAVEDLISTS&` directory (e.g., `C:\Temenos\...\tafj\data\SAVEDLISTS`).
5.  The list can now be navigated and used in T24 routine execution.
