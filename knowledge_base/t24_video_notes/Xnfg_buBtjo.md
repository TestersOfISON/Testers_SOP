# T24 Programming: Control Flow (Conditions and Loops)

## Overview
The video explains the three main types of control structures in InfoBasic (jBASE) used in T24 programming:
1. **Sequential**: The default execution flow from top to bottom.
2. **Selection (Conditional)**: Used for decision making.
   - `IF` Statement
   - `CASE` Statement
3. **Repetition (Loop)**: Used to execute a block of code multiple times.
   - `FOR...NEXT`
   - `LOOP...REPEAT`

## Conditional Statements
### IF Statement
Used to execute a block of code if a specific condition is met. It can also include `ELSE IF` and `ELSE` branches.
```basic
IF cust_residence EQ 'US' THEN
    CRT "Customer is from US"
END ELSE IF cust_residence EQ 'LU' THEN
    CRT "Customer is from LU"
END ELSE
    CRT "Customer is from another region"
END
```

### CASE Statement
Often used instead of multiple `IF...ELSE IF` conditions for better readability when evaluating multiple conditions sequentially.
```basic
BEGIN CASE
    CASE cust_residence EQ 'US'
        CRT "Customer is from US"
    CASE cust_residence EQ 'LU'
        CRT "Customer is from LU"
    CASE cust_residence EQ 'RW'
        CRT "Customer is from RW"
END CASE
```

## Loops
Loops allow executing a block of code repeatedly.

### FOR...NEXT
Typically used when the number of iterations is known in advance, such as iterating over a counted dynamic array.
```basic
num_rec = DCOUNT(customers, @FM)
FOR i = 1 TO num_rec
    cust_id = customers<i>
    * Process cust_id
NEXT i
```

### LOOP...REPEAT
Commonly used in combination with the `REMOVE` statement to extract elements from a dynamic array sequentially until the list is exhausted.
```basic
LOOP
    REMOVE cust_id FROM customers SETTING pos
WHILE cust_id : pos
    * Process cust_id
REPEAT
```
- `REMOVE` extracts the next value up to a system delimiter (like `@FM`, `@VM`, or `@SM`) and updates the `pos` variable.
- `pos` evaluates to `0` when the end of the dynamic array is reached, which makes the `WHILE` condition false and exits the loop.

## Practical Examples and Functions
- **Dynamic Arrays**: The video demonstrates converting a comma-separated string into a field-mark-separated dynamic array using the `CHANGE` function: `CHANGE(',', @FM, customers)`.
- **Counting**: The `DCOUNT` function counts the number of elements in a string separated by a specific delimiter (e.g., `@FM`).
- **Subroutine Call**: Showing how to call an external subroutine to fetch data: `CALL MTD.CustomerDetails(cust_id, cust_name, cust_residence)`.
- **Compiling & Cataloging**: Using `BASIC` to compile and `CATALOG` to register the program in the jSHELL (`jsh`) so it can be executed.
