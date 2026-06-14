# T24 Architecture and Infobasic Programming Notes

## Overview
This document contains architectural details and programming concepts extracted from the "T24 Programming Series: Infobasic - Introduction" tutorial. The focus is on the fundamental building blocks of T24 customization using Infobasic.

## 1. Infobasic Application Structure

### Program Structure
*   **Program Definition:** Every Infobasic program must begin with the `PROGRAM` keyword followed by the program name.
*   **Program Termination:** The program must explicitly end with the `END` keyword.
*   **Structure:**
    ```basic
    PROGRAM ProgramName
       * Program logic goes here
       CRT "Hello World"
    END
    ```

### Compilation and Execution Workflow
The development lifecycle in the T24 terminal (`jsh`) involves a strict sequence:
1.  **Edit:** Use the editor (e.g., `JED`) to write the code in a specific directory (e.g., `MATHISI.BP`).
    *   `JED MATHISI.BP ProgramName.b`
2.  **Compile:** The source code must be compiled into object code.
    *   `BASIC MATHISI.BP ProgramName.b`
3.  **Catalog:** The compiled code must be cataloged to make it globally available and executable within the environment.
    *   `CATALOG MATHISI.BP ProgramName.b`
4.  **Run:** Execute the program by calling its name directly.
    *   `ProgramName.b`

### Essential Enquiries & Commands
*   `CRT`: The primary command for outputting data to the terminal screen.
*   `CRT @(-1)`: A specific command sequence used to clear the terminal screen before printing new output.

## 2. Core Architecture: Variables & Data Types

Infobasic employs a dynamic, weakly-typed approach to variables.

### Variables
*   **No Explicit Declaration:** There are no keywords like `var`, `let`, or `int` required to declare a variable. Variables are created upon initialization.
*   **Infinite Size:** By default, variables are not constrained by fixed memory sizes (like 32-bit or 64-bit integers). They dynamically expand based on the allocated memory.
*   **Runtime Typing:** The data type of a variable is determined and assigned at runtime based on the value it holds.
*   **Mutability:** All variables are mutable; their values can be changed at any point in the program.

### Supported Data Types
1.  **Strings**
2.  **Numbers**
3.  **Dynamic Arrays**
4.  **Dimensioned Arrays**

## 3. String Operations

Strings are central to T24 data manipulation.

*   **Definition:** Strings can be enclosed in double quotes (`"..."`), single quotes (`'...'`), or backslashes (`\...`).
*   **Concatenation:** The colon operator `:` is used to join strings and variables together.
    *   `CRT "My name is " : name`
*   **Slicing (Substrings):** Extracts a portion of a string.
    *   `string[start_index, length]`
    *   Indices are 1-based.
    *   Negative indices can be used to count from the end of the string.
*   **Built-in Functions:**
    *   `UPCASE(string)`: Converts the string to uppercase.
    *   `DOWNCASE(string)`: Converts the string to lowercase.
    *   `STR(string, count)`: Duplicates the given string a specified number of times.

## 4. Numbers and Arithmetic

*   Numbers are handled naturally without explicit type definition.
*   Standard arithmetic operators (`+`, `-`, `*`, `/`) function as expected.
*   Numbers can be concatenated with strings directly in `CRT` statements.

## 5. Multi-Value Architecture (Arrays)

T24 heavily utilizes a multi-value database model, represented in Infobasic through Dynamic and Dimensioned Arrays.

### Dynamic Arrays
Dynamic arrays are single strings where data elements (fields, values, sub-values) are separated by specific system delimiters (e.g., Field Marker - FM, Value Marker - VM).
*   **Structure:** Ideal for handling variable-length lists or records (like a row in a CSV file).
*   **Access:** Elements are accessed using angle brackets `< >`.
    *   `employee<1>` retrieves the first field of the `employee` dynamic array.
*   **Conversion:** The `CONVERT` statement is crucial for transforming external data formats into dynamic arrays.
    *   `CONVERT "*" TO FM IN loan_request` (Converts asterisks to Field Markers).

### Dimensioned Arrays (Matrices)
Dimensioned arrays are structured grids (matrices or vectors) that require explicit sizing before use.
*   **Declaration:** Must be defined using the `DIM` keyword.
    *   `DIM arr(rows, columns)` (e.g., `DIM arr(2, 3)`)
*   **Access:** Elements are accessed using parentheses `( )`.
    *   `arr(row, column)` (e.g., `arr(1, 2)`)
*   **MATBUILD:** A powerful command to construct a dimensioned array from a dynamic array based on a specific delimiter.
    *   `MATBUILD dimensioned_array FROM dynamic_array USING delimiter`
    *   Example: `MATBUILD arr2 FROM arr USING CHAR(32)`

## 6. Control Flow & Navigation

### Loops
*   **FOR...NEXT Loops:** Commonly used for iterating through known sequences, especially when processing Dimensioned Arrays.
    ```basic
    FOR row = 1 TO rows
        FOR col = 1 TO cols
            CRT arr(row, col)
        NEXT col
    NEXT row
    ```

## 7. Code Documentation (Comments)
Infobasic supports several ways to add comments to the code:
*   `*` (Asterisk): Often used at the beginning of a line.
*   `!` (Exclamation mark)
*   `REM` (Remark)
*   Comments can be placed inline after code statements.
