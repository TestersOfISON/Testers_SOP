# T24 Architecture Notes: Smart Enquiries & Build Routines

## 1. Overview
This document contains architectural details, code snippets, and UI navigation flows extracted from the video "T24 Programming - How to create smart Enquiries - Build routines" by Mathisi Digital. It covers how to use Build Routines to dynamically manipulate selection criteria for enquiries in the Temenos T24 core banking system.

## 2. Core Architecture: Enquiry Routines
Enquiries in T24 are used to extract and display data. Sometimes, the standard fixed selection criteria on an enquiry cannot handle complex or excessively long conditions (e.g., passing a very long list of category codes will result in a "TOO MANY CHARACTERS" error). To bypass this, **Build Routines** are used.

### Build Routine Characteristics
- Build routines manipulate the selection criteria of an enquiry *before* the data is fetched.
- They accept **one dynamic array as a parameter** (often named `ENQ.DATA`).
- This parameter acts as both an INWARD and OUTWARD parameter.

### Dynamic Array Structure (`ENQ.DATA`)
The dynamic array contains the parts of the Selection Criteria Box:
- **`<1>`**: Name of the enquiry
- **`<2>`**: Selection Field Names (e.g., `CATEGORY`)
- **`<3>`**: Operands (e.g., `EQ`)
- **`<4>`**: Values (e.g., `1001 1002 1003...`)

By modifying positions 2, 3, and 4 in this array within a subroutine, developers can dynamically inject selection criteria that exceed standard UI limitations.

## 3. Implementation Steps
1. **Write, compile, and catalog** the subroutine using standard jBASE / T24 programming practices.
2. **Attach the subroutine** to the enquiry record. This is done by adding the subroutine's name to the `BUILD.ROUTINE` field (Field `12.x`) of the `ENQUIRY` application.

## 4. Code Snippet: Build Routine
The following subroutine injects a long list of Categories to filter the enquiry to show only "Current and Savings Accounts".

```jbase
SUBROUTINE MTD.EnqBuildCurSavAc(ENQ.DATA)
* Build routine for selecting current and saving accounts
* Developer: Aaron Niyonzima (aaron@mathisi.io)
* Date: 27/12/2020
* Version: 0.0.1

$INSERT I_COMMON
$INSERT I_EQUATE
$INSERT I_ENQUIRY.COMMON

* Injecting the Field Name
ENQ.DATA<2,1> = 'CATEGORY'

* Injecting the Operand
ENQ.DATA<3,1> = 'EQ'

* Injecting the Values (space-separated list of categories)
ENQ.DATA<4,1> = '1001 1002 1003 1004 1005 1006 6001 6002 6003 6004 6005 6006 6007'

RETURN
END
```

## 5. UI Navigation Flows

### T24 Classic (Terminal Interface)
1. **Launch Enquiry**: Type `ENQ MTD.CUST.AC.LIST` and press Enter. This launches the enquiry directly in the terminal, displaying the resulting list.
2. **Modify Enquiry Record**: Type `ENQUIRY,I MTD.CUST.AC.LIST`.
   - Navigate to field `12.1 BUILD.ROUTINE`.
   - Enter the compiled subroutine name: `MTD.EnqBuildCurSavAc`.
   - Commit the transaction.

### T24 Browser (Web UI)
1. **Launch Enquiry**: Type `ENQ MTD.CUST.AC.LIST` in the command box.
2. **Selection Box**: A "Selection Criteria Box" appears before the results are displayed. It allows the user to manually enter filters (e.g., `CURRENCY equals USD`).
3. **Execution**: Clicking "Find" triggers the enquiry. The attached build routine intercepts the execution, applies the hardcoded categories, and then fetches the data.
4. **Results**: The resulting grid only displays rows matching the criteria injected by the routine (in this case, savings and current accounts), effectively bypassing manual entry limits and human error.

## 6. Limitations Addressed
- **Character Limits**: Standard `FIXED.SELECTION` fields in the `ENQUIRY` record throw a "TOO MANY CHARACTERS" error if the input string is too long. Build routines programmatically bypass this limit.
- **Human Error**: Relying on users to enter exhaustive lists of categories every time they run an enquiry is risky. Hardcoding standard filters into a routine guarantees consistency.
