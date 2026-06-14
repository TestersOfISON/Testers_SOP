# T24 Programming Series | Complete Training - Introduction
**Video ID:** _Kw9Rc39z1c
**Presenter:** Aaron from mathisi.io

## Overview
This is a nearly 50-minute comprehensive introduction to the fundamentals of InfoBasic (the programming language for Temenos T24). It covers variables, data types, strings, numbers, dynamic arrays, dimensioned arrays, and various built-in functions.

## 1. Variables and Data Types
- **No Declaration Required:** Unlike many other languages, InfoBasic does not use keywords like `var`, `let`, or `int` to declare variables. You simply assign a value to initialize it.
- **Dynamic Typing:** Data types (Strings, Numbers, Dynamic Arrays, Dimensioned Arrays) are assigned dynamically at runtime.
- **Infinite Size:** Variables have virtually infinite size, constrained only by system memory.

## 2. Strings & Operations
### Defining Strings
Strings can be defined using three different enclosures:
- Double quotes: `"John Doe"`
- Single quotes: `'John Doe'`
- Backslashes: `\John Doe\`

### String Concatenation
Use the colon `:` operator to concatenate strings.
```basic
CRT "My name is " : name : " and I work for " : company
```

### String Slicing
You can slice strings by specifying the starting index and length in square brackets `[start, length]`.
*Note: InfoBasic uses 1-based indexing.*
- `address[1, 2]`: Grabs the first 2 characters.
- `address[5, 21]`: Grabs 21 characters starting from index 5.
- `company[-3, 1]`: Negative indices count from the right. Grabs the 3rd character from the right.

### Useful String Functions
- `UPCASE(str)`: Converts to uppercase.
- `DOWNCASE(str)`: Converts to lowercase.
- `STR(str, count)`: Duplicates the string `count` times.
- `LEN(str)`: Gets the length of the string.
- `COUNT(str, substr)`: Counts occurrences of `substr` in `str`.

## 3. Numbers and Mathematics
Numbers are handled seamlessly and can be manipulated using standard arithmetic operations (`+`, `-`, `*`, `/`).
- Example: `age = 24`, `age_next_year = age + 1`
- `INT()` function truncates a numeric value to an integer.

## 4. Arrays
Arrays in InfoBasic are split into two major types: Dynamic Arrays and Dimensioned Arrays.

### Dynamic Arrays
- Under the hood, a dynamic array is simply a single string formatted with specific system delimiters (Field Markers `FM`, Value Markers `VM`, Sub-Value Markers `SM`).
- Elements are accessed using angle brackets `< >`.
  ```basic
  customer_name = loan_request<2>
  ```
- **CONVERT Statement:** You can convert an arbitrary delimiter (like a CSV comma or star) into an internal system delimiter.
  ```basic
  CONVERT "*" TO FM IN loan_request
  ```

### Dimensioned Arrays
- Function exactly like matrices or multidimensional arrays in other languages.
- Must be declared upfront using the `DIM` keyword.
  ```basic
  DIM my_array(2, 3)  ;* 2 rows, 3 columns
  ```
- Accessed using parentheses `( )`.
  ```basic
  my_array(1, 1) = "Value"
  ```
- **MATBUILD:** Converts a Dimensioned Array into a Dynamic Array.
  ```basic
  MATBUILD dyn_arr FROM my_array USING FM
  ```
- **MATPARSE:** Converts a Dynamic Array into a Dimensioned Array.
  ```basic
  MATPARSE my_array FROM dyn_arr USING FM
  ```

## 5. Other Important Syntax & Built-ins
- **Comments:** 
  - Full line comments start with an asterisk `*` or an exclamation mark `!`.
  - Inline comments use a semicolon and asterisk `;*` or an exclamation mark.
  - The `REM` keyword is also used to signify a remark.
- **Terminal Control:** 
  - `CRT @(-1)` clears the screen.
- **Dates:** 
  - `DATE()` function returns the internal system date (days since Dec 31, 1967).
  - Use `OCONV(DATE(), "D")` to format the internal date into a readable string.
- **Formatting (FMT):**
  - Used to format output strings (e.g., masking or adding specific delimiters).
