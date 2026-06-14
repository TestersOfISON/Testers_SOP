# T24 Programming Series | Multi-Value & Subroutines (Part 2)
**Video ID:** -EjU-vYpy1c
**Presenter:** Aaron from mathisi.io

## Overview
This video continues the discussion on Multi-Value databases in T24, transitioning from theory to practice. It demonstrates how to write a professional subroutine to extract multi-valued and sub-valued data from a customer record and pass it to a calling program.

## Core Concepts Covered

### 1. The Need for Custom Subroutines
- Instead of repeatedly opening files and reading records in your main program, it is a best practice to encapsulate database interactions within a subroutine.
- The subroutine handles the `OPF` (Open File) and `F.READ` (File Read) commands and returns the extracted fields as dynamic arrays.

### 2. Required $INSERT Statements
Every T24 program or subroutine must include certain system inserts to function correctly:
```basic
$INSERT I_COMMON
$INSERT I_EQUATE
$INSERT I_F.CUSTOMER  ;* Needed when interacting with the CUSTOMER table
```
- `I_COMMON` and `I_EQUATE` define core system variables and delimiters.
- `I_F.CUSTOMER` provides the equated names for all fields in the `CUSTOMER` application (e.g., mapping `EB.CUS.EMPLOYMENT.STATUS` to field 70), ensuring you don't have to hardcode field index numbers.

### 3. File Operations in T24
- **Opening a File:**
  ```basic
  fn_cust = 'F.CUSTOMER'
  f_cust = ''
  CALL OPF(fn_cust, f_cust)
  ```
- **Reading a Record:**
  ```basic
  CALL F.READ(fn_cust, cust_id, cust_rec, f_cust, err)
  ```
  - `fn_cust`: File name.
  - `cust_id`: The ID of the record.
  - `cust_rec`: The dynamic array where the record's contents are stored.
  - `f_cust`: The file pointer.
  - `err`: Stores any error that occurs during the read.

### 4. Extracting Multi-Value Data
Once the record is read into `cust_rec`, multi-value fields are extracted using the field names provided by the insert file:
```basic
employment_status = cust_rec<EB.CUS.EMPLOYMENT.STATUS>
occupation = cust_rec<EB.CUS.OCCUPATION>
employers_name = cust_rec<EB.CUS.EMPLOYERS.NAME>
employers_addr = cust_rec<EB.CUS.EMPLOYERS.ADD>
```
These extractions are inherently dynamic arrays containing all the values, multi-values (separated by `VM`), and sub-values (separated by `SM`) for that customer.

### 5. Calling the Subroutine
In the main execution program, you invoke the subroutine and pass the required parameters:
```basic
CALL MTD.CustEmployDetails(cust_id, employment_status, occupation, employers_name, employers_addr)
```

### 6. Formatting System Delimiters for Display
- When you print a dynamic array directly, system delimiters (like Value Markers and Sub-Value Markers) may print as unreadable control characters.
- Use the `FMT()` function with `'MCP'` to format the string and make these markers visible.
  ```basic
  CRT FMT(employment_status, 'MCP')
  ```
- This replaces the internal control characters with visible representations, aiding in debugging and visualization.
