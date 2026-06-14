# T24 Fundamentals: How to use Browser User Interface

## Overview
This video provides a comprehensive tutorial on using the Temenos T24 Browser, the graphical user interface for end users. It contrasts the browser interface with the classic command-line interface, demonstrating how to perform various tasks such as user profile modifications, record authorization, and querying.

## Key Concepts and Actions

### Logging In
*   Access the T24 Browser via a web link using any standard browser (Chrome, Firefox, Safari, etc.).
*   Login requires a Username (Sign On Name) and Password.
*   The initial dashboard depends on the assigned user profile and role-based home pages.

### User Menu and Tools
*   **Help**: Access Temenos information and online help.
*   **Tools**: Options include:
    *   Change Password.
    *   Amend Preferences.
    *   Organize Favorites (creating abbreviations for frequently used commands).
    *   Switching Companies (useful for multi-company or multi-book setups, switching between different branches like Model Bank vs. MF Branch 1).
    *   Sign Off (Log out).

### Command Line / Action Box
*   Similar to the classic interface, the browser has a command line box to enter commands.
*   Example: Entering `USER L` lists all users in the system, similar to the command-line interface output.

### Working with Records
The video demonstrates working with user records (e.g., `USER AARON3`), highlighting various actions:
*   **Amend/Input Mode**: Used to modify record details (e.g., changing the Language field from 1 to 2).
*   **Validate**: Checks if the inputted data is valid before committing without saving changes.
*   **Commit**: Saves the changes. After committing, the record enters an **Unauthorized (INAU)** status.
*   **Hold**: Saves the changes on hold, allowing the user to return and modify the record later.
*   **View**: Opens the record in read-only mode (no modifications allowed).

### Authorizing and Deleting Actions
Once a record is in an unauthorized state (e.g., after modifying the language field):
*   It requires authorization by a different user (four-eyes principle).
*   If the original user wants to cancel the change before it is authorized, they can select the **Delete** action to remove the unauthorized changes and revert to the live record.

### Other Important Functions
*   **Verify**: Only available for certain functions and deals, verified records are listed distinctly (e.g., using `RECORD.LOCK L` to see locked records). It can be unlocked.
*   **Copy**: To create a similar record, users can copy an existing record (e.g., copying an existing user to create a new user like "Tim Smith") and change specific fields to save time.
*   **Reverse**: Used to reverse an authorized live record. Reversing a record also requires subsequent authorization from another user to be finalized.

### Enquiries and Searching
*   **List Live File / List Unauth File**: Used to see all live or unauthorized records for a specific application (e.g., listing all `USER` or `ACCOUNT` records).
*   **Search**: A powerful tool to filter records based on selection criteria (e.g., searching for `USER` records where `USER.NAME` contains "AARON" or where `PASSWORD.VALIDITY` is less than a specific date).
*   **Export**: Inquiry results can be printed locally or exported to formats such as CSV, HTML, XML, or PDF.

### Business Applications and Menus
*   Instead of using the command line, users can navigate the system through the hierarchical side menu.
*   For example, navigating to `Customer Relationship` -> `Corporate Customer` to create a new customer.
*   The browser interface offers a much more user-friendly form with grouped tabs (Further Details, Financial Details, Communication Details, KYC) compared to the raw text input of the classic interface. This represents the primary advantage of the browser UI for daily operational tasks.
