# T24 Query Languages: JQL & SQL - How to create and manipulate SAVEDLISTS

This video tutorial by Mathisi Digital explains how to create and manipulate saved lists (SAVEDLISTS) in Temenos T24 using both TAFC (with JQL) and TAFJ (with SQL Server).

## 1. Creating and Combining Saved Lists in TAFC (JQL)

### Creating a Saved List
In TAFC, you can use JQL to select records and save the resulting list.
- **Select Records**: Use the `SELECT` command.
  Example: `SELECT FBNK.ACCOUNT WITH CUSTOMER NE '' AND WORKING.BALANCE GT 0 SAMPLE 10 SAVING EVAL "CO.CODE : ',' : @ID"`
  This selects 10 sample accounts that have a customer and a positive working balance, and evaluates their company code concatenated with the record ID.
- **Save the List**: Once records are selected, use the `SAVE.LIST` or `SAVE-LIST` command.
  Example: `>SAVE.LIST BNK.ACCT.LIST`

### Combining Saved Lists
If you have created multiple saved lists, you can combine them using the `OR-LISTS` command.
- **Command Syntax**: `>OR-LISTS [List1] [List2] [List3]`
  Example: `>OR-LISTS BNK.ACCT.LIST EU1.ACCT.LIST SG1.ACCT.LIST`
- After selecting from multiple lists, you can save the combined result as a new list using `SAVE.LIST`.

### Viewing a Saved List
To view the contents of a saved list, use the `JED` or `CT` editor.
- Example: `JED &SAVEDLISTS& BNK.ACCT.LIST`

## 2. Creating and Combining Saved Lists in TAFJ (SQL Server)

In TAFJ, JQL has limitations, so SQL Server queries are often used to achieve similar results.

### Querying Data in SQL Server Management Studio
- **Select Records**: Write a standard SQL query targeting the underlying views of T24 files.
  Example:
  ```sql
  SELECT TOP 10 [CO_CODE], [RECID]
  FROM V_FBNK_ACCOUNT
  WHERE WORKING_BALANCE > '0' AND CUSTOMER <> ''
  ```
- **Combining Queries**: Use the `UNION` operator to combine the result sets of multiple SQL queries into one.
  Example:
  ```sql
  SELECT TOP 10 ...
  UNION
  SELECT TOP 4 ...
  UNION
  SELECT TOP 6 ...
  ORDER BY CO_CODE
  ```

### Saving the Result as a T24 SAVEDLIST
1. **Export Results**: Run the combined query and export the results to a CSV or text file.
2. **Format**: Remove column headers and ensure the file has no extension or a `.list` extension (e.g., `ACCT.LIST`) as plain text.
3. **Copy to Saved Lists Directory**: Copy this text file directly into the server's directory where T24 saved lists are stored (e.g., `...\Data\T24\UD\&SAVEDLISTS&\`).
4. **Access in T24**: The list is now available to be used by T24 programs and routines.

## Conclusion
The tutorial demonstrates the foundational steps for selecting, combining, and saving account lists in both TAFC and TAFJ environments. The next video in the series will cover manipulating these saved lists programmatically via a jBC (T24 Basic) program.
