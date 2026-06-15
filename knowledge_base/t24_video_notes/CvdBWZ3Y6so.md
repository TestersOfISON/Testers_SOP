# T24 Programming: jBC Functions vs jBC Statements

This note covers the differences between using functions and statements in InfoBasic (jBC), specifically demonstrated through the `CHANGE` command.

## Overview
In jBC, certain operations can be performed using either a function or a statement. The primary difference lies in whether the operation **mutates the original variable** or **returns a new value** while leaving the original intact.

### Example Scenario
We have a phone number formatted with dot delimiters, and we want to change the dots to hyphens.
```basic
phone = "352.629.564.890"
```

---

## 1. Using CHANGE as a Function
When used as a function, `CHANGE` returns a new modified value. It **does not mutate** the original variable.

**Syntax & Example:**
```basic
phone1 = CHANGE(phone, ".", "-")
```
- **Argument 1:** The variable to search in (`phone`).
- **Argument 2:** The string to find (`"."`).
- **Argument 3:** The string to replace it with (`"-"`).

**Result:**
- `phone1` contains the new value: `"352-629-564-890"`
- `phone` (the original variable) remains unchanged: `"352.629.564.890"`

**Use Case:** Use the function approach when you need to retain the original variable's value for later use.

---

## 2. Using CHANGE as a Statement
When used as a statement, `CHANGE` applies the replacement directly to the target variable. It **mutates** the original variable.

**Syntax & Example:**
```basic
CHANGE "." TO "-" IN phone
```
- **"what_to_replace"**: `"."`
- **TO "replace_with"**: `"-"`
- **IN variable**: `phone`

**Result:**
- `phone` is updated in place and now contains: `"352-629-564-890"`

**Use Case:** Use the statement approach when you no longer need the original value and want to modify the variable directly. It is typically faster and requires less memory since no new variable is created.
