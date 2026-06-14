# T24 Subroutines: Build Routines for Smart Enquiries

**Video ID:** -GfRDN77W90
**Channel/Speaker:** Aaron from Mathisi Digital
**Topic:** How to create smart enquiries using build routines in T24.

## Overview
Build routines are a type of enquiry routine used to manipulate selection criteria in an enquiry programmatically. They are especially useful when selection criteria are complex, dynamic, or too long to fit in standard fixed selection fields.

## Build Routine Parameter Structure
A build routine accepts one dynamic array parameter (`ENQ.DATA`) which contains the selection criteria details. The dynamic array is structured as follows:
- `<1>` Name of the enquiry
- `<2>` Selection Field Names
- `<3>` Operands (e.g., 'EQ', 'LK')
- `<4>` Values

## Use Case & Assignment
**Task:** Create an enquiry to display a "List of current and savings accounts". The returned accounts must strictly belong to the following categories: `1001`, `1002`, `1003`, `1004`, `1005`, `1006`, `6001`, `6002`, `6003`, `6004`, `6005`, `6006`, `6007`.

**The Problem:**
- If left to the user, they might forget to include all categories or accidentally include the wrong ones in the selection criteria box.
- Using a fixed selection criteria (`FIXED.SELECTION`) directly in the enquiry record fails because the string of categories is too long, resulting in a "TOO MANY CHARACTERS" error.

**The Solution:**
Create a custom Build Routine to inject the selection criteria at runtime.

## Subroutine Example: `MTD.EnqBuildCurSavAc`
```basic
SUBROUTINE MTD.EnqBuildCurSavAc(ENQ.DATA)
* Build routine for selecting current and saving accounts
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_ENQUIRY.COMMON

    ENQ.DATA<2,1> = 'CATEGORY'
    ENQ.DATA<3,1> = 'EQ'
    ENQ.DATA<4,1> = '1001 1002 1003 1004 1005 1006 6001 6002 6003 6004 6005 6006 6007'

    RETURN
END
```

## Attaching the Build Routine
1. Open your enquiry record (e.g., `MTD.CUST.AC.LIST`).
2. Navigate to the `BUILD.ROUTINE` field (Field 12).
3. Enter the name of your compiled subroutine prefixed with an `@` symbol (e.g., `@MTD.EnqBuildCurSavAc`).
4. Save and authorize the enquiry.

## Result
When the enquiry is launched (in Classic or Browser), the system bypasses the need for the user to manually enter the complex category list. It automatically applies the criteria defined in the build routine, seamlessly returning only the required Current and Savings accounts.
