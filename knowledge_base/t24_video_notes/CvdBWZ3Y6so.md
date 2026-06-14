# Difference between jBC Functions and jBC Statements

**Author**: Erwan (Mathisi Digital)  
**Video ID**: CvdBWZ3Y6so  

## Overview
This video explains the difference between using a command as a function versus as a statement in jBC (InfoBasic), using the `CHANGE` operation as an example.

## Key Concepts

### jBC Function
*   **Example**: `phone1 = CHANGE(phone, ".", "-")`
*   **Behavior**: When used as a function, `CHANGE` returns a new value without mutating the original variable. 
*   **Use Case**: This is ideal when you need to retain the original value of the variable (e.g., `phone`) while using the modified value for another purpose (e.g., storing it in `phone1`).

### jBC Statement
*   **Example**: `CHANGE "." TO "-" IN phone`
*   **Behavior**: When used as a statement, `CHANGE` mutates the original variable directly. The value inside `phone` is permanently updated.
*   **Use Case**: This approach is often faster and should be used when you no longer need the original value and want to modify it in place.

## Summary
*   **Functions** return new values and do not modify the original variable.
*   **Statements** modify the variable directly (mutate in place).
