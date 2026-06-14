# T24 Programming: Process SAVED-LISTS and Produce JSON in T24

This video tutorial demonstrates how to process a saved list in a Temenos T24 environment (TAFC) and extract customer information into a JSON format. 

## Key Concepts and Steps

1. **Processing Saved Lists:**
   - Saved lists (created using JQL and the `SAVELIST` command) can be processed using InfoBasic's built-in functions.
   - **`READLIST`**: Used to retrieve a previously stored list into a variable. 
     - Example: `READLIST account_list FROM list_name THEN ... ELSE ...`
   - **`READNEXT`**: Used within a `LOOP ... WHILE ... REPEAT` structure to iterate through the list and retrieve the next element.

2. **Handling Multi-Company Environments:**
   - In a multi-company environment, a combined list may contain records from different companies. The first 9 characters of the list item often represent the company code, followed by a comma and the account ID.
   - Example record format: `EU0010001,2000000054`
   - The script extracts the company code (`company_code = rec[1, 9]`) and the account ID (`acct_id = rec[11, 99]`).
   - Before reading an account record, the program checks if the current company matches the record's company code. If not, it switches to the appropriate company using a subroutine (e.g., `CALL LOAD.COMPANY(company_code)`).

3. **Producing JSON Data:**
   - A JSON object is constructed as a string in InfoBasic.
   - A separate subroutine (`MTD.GetAcctDetails.b`) is used to read the `F.ACCOUNT` file, extract fields like Short Title, Currency, and Working Balance, and format them into a JSON string.
   - The main program concatenates these individual JSON strings into a JSON array. 
   - It formats the output by initializing the array with a bracket `[`, appending each object separated by a comma, and finally replacing the trailing comma with the closing bracket `]`.

4. **Program Flow:**
   - Prompt the user to enter the list name.
   - Check if the list exists using `READLIST`. If not, stop the program.
   - Loop through the list using `READNEXT`.
   - For each record, extract company code and account ID.
   - Call the subroutine to get account details as a JSON string.
   - Append the string to the final JSON array variable.
   - Print the final JSON array.
