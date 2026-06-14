# T24 Programming: Subroutines and Functions

## Subroutines
- Declared using the `SUBROUTINE` keyword.
- They can have both incoming and outgoing parameters specified within the parentheses.
- The `RETURN` statement is used to return control, but it does not return a value directly. Instead, output parameters are modified directly.

**Example Subroutine:**
```basic
SUBROUTINE CalculateDti(gross_income, total_debts, dti)
dti = total_debts / gross_income
RETURN
END
```

**Calling a Subroutine:**
- Subroutines cannot be invoked directly from the jShell. They must be called from another program or subroutine.
- Use the `CALL` keyword.
```basic
CALL CalculateDti(gross_income, total_debts, dti)
```

## Functions
- Declared using the `FUNCTION` keyword.
- They only take incoming parameters.
- The `RETURN` statement must include the value to be returned.

**Example Function:**
```basic
FUNCTION DTI(gross_income, total_debts)
RETURN total_debts / gross_income
END
```

**Using a Function:**
- Functions cannot be invoked directly from the jShell.
- Before using a function in a program, it must be declared at the top using the `DEFFUN` keyword.
- The function is then called by its name, passing the required arguments, and its result can be assigned to a variable or used in an expression.
```basic
DEFFUN DTI()
val = DTI(gross_income, total_debts)
```

## Practical Example
```basic
PROGRAM TestDTI
DEFFUN DTI()

gross_income = 12000
total_debts = 3452

* Calling a subroutine
CALL CalculateDti(gross_income, total_debts, dti)
CRT "DTI from Subr is ": dti

* Using a function
dti2 = DTI(gross_income, total_debts)
CRT "DTI from func is ": dti2

END
```
