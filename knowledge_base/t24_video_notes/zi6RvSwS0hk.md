# T24 Programming: How to Convert Enquiry Field Using Routine

This video tutorial by Mathisi Digital explains how to use Conversion Routines in Temenos T24 to manipulate data before displaying it in an Enquiry.

## What is a Conversion Routine?
Conversion routines are used to manipulate data in fields before displaying them to the user in the enquiry.

### Steps to Use Conversion Routines:
1. Write, compile, and catalog the subroutine.
2. Attach the subroutine to the field `CONVERSION 18.x.1` in the Enquiry.

## Example Scenario:
The assignment is to create an enquiry to display a "List of Transactions" with the following format: Reference, Type, Debit Account, Debit Currency, Debit Amount.

When querying transactions, sometimes the Debit Amount field is empty because only the Credit Amount was specified during the transaction booking. However, the `AMOUNT.DEBITED` field contains the debit amount along with its currency (e.g., `USD 1975.40`). We want to display the currency in the 'Debit Currency' column and only the numerical amount in the 'Debit Amount' column. 

### Solution:
We can use a conversion routine to remove the currency string from the `AMOUNT.DEBITED` field.

#### 1. Modify the Enquiry to use `AMOUNT.DEBITED`
In the enquiry (e.g., `MTD.FT.LIST`), change the field mapped to 'Debit Amount' to use `AMOUNT.DEBITED` instead of `DEBIT.AMOUNT`.

#### 2. Create the Conversion Routine
Create a new subroutine (e.g., `MTD.EnqConvFTDebitAmount.b`) with the following code:

```basic
SUBROUTINE MTD.EnqConvFTDebitAmount
*-----------------------------------------------------------------------------
* Conversion routine to remove currency code from FT>AMOUNT.DEBITED
*-----------------------------------------------------------------------------
$INSERT I_COMMON
$INSERT I_EQUATE
$INSERT I_ENQUIRY.COMMON
$INSERT I_F.FUNDS.TRANSFER

* Get the debit currency from the record
debit_currency = R.RECORD<FT.DEBIT.CURRENCY>

* Remove the debit currency from the O.DATA (the output data of the field)
O.DATA = CHANGE(O.DATA, debit_currency, '')

RETURN
END
```

* `I_ENQUIRY.COMMON` holds common variables used in enquiries, including `O.DATA` which stores the extracted value for the field.
* The `CHANGE` function is used to replace the occurrence of the currency with an empty string, effectively leaving only the amount.

#### 3. Compile and Catalog the Subroutine
Save the code and compile it using jBASE commands.

#### 4. Attach the Routine to the Enquiry
Open the Enquiry record (e.g., `ENQUIRY, I MTD.FT.LIST`). Go to the field configuration for `AMOUNT.DEBITED` and set the `CONVERSION` field (field `18.x.1`) to `@MTD.EnqConvFTDebitAmount`. Note the `@` prefix is used to indicate a local subroutine.

Upon launching the enquiry again, the 'Debit Amount' column will correctly display only the numerical amount, with the currency successfully removed by the conversion routine.
