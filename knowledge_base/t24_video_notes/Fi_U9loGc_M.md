# T24 Programming: Use of EQUATE to improve your code

## What is EQUATE?
- The `EQUATE` (or `EQU`) statement in InfoBasic is used to declare a symbol equivalent to a literal, variable, or simple expression.
- **Syntax:** `EQU{ATE} symbol TO expression`
- It is useful for replacing hard-coded position numbers (like array indexes) with readable names, making code more maintainable.

## Example Usage
In T24, transactions or records often have multiple fields (e.g., Currency at position 1, Amount at position 2). 
Instead of writing `txn<1>` for Currency, you can define:
```infobasic
EQU Currency TO 1
EQU Amount TO 2
EQU CrDr TO 3
EQU Details TO 4
```
Then you can use `txn<Currency>` instead of `txn<1>`, significantly improving code readability.

## Best Practices
- **Externalizing EQUATEs:** Instead of declaring `EQUATE` statements directly in every program or subroutine, create a separate insert file (e.g., `I_Transaction`).
- Place the insert file in your source folder (e.g., `MATHISI.BP`).
- Use the `$INSERT` keyword to include this file in any subroutine or program that requires these definitions:
```infobasic
$INSERT MATHISI.BP I_Transaction
```
- **Benefits:** If the structure of the record changes (e.g., a `Reference` field is added at position 1, shifting all other fields by one), you only need to update the mapped index positions in the single `I_Transaction` insert file. After recompiling, all dependent subroutines and programs will automatically apply the new structure without requiring error-prone manual code changes in every file.
