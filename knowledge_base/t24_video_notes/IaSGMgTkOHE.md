# Video Notes: Temenos T24 Open Financial Service (OFS)

**Video ID:** IaSGMgTkOHE
**Speaker:** Aaron from mathisi digital

## Overview
- **What is OFS?** Open Financial Service (OFS) is the standard gateway for integrating or interfacing with the Temenos T24 core banking system.
- It operates on a **request-response** basis.

## Message Formats
There are two primary formats for OFS messages:
1. **Native OFS format:** A simple, comma-separated string format (the focus of this tutorial).
2. **XML format:** Primarily used by browsers.

## Message Syntax
There are two main types of OFS requests sent to T24: **Transactions** and **Enquiries**. Both generally consist of 4 to 5 comma-separated parts.

### 1. Transaction Request
Used to create, modify, or interact with records. The syntax components include:
- **Operation:** The T24 application name (e.g., `ACCOUNT`, `CUSTOMER`).
- **Options:** Includes the version, function (e.g., `I` for Input, `C` for see, `D` for delete), and the process type (e.g., `PROCESS` to commit the transaction, `VALIDATE` to only validate without committing).
- **User Information:** Includes the sign-on name, password, and optionally the company code (separated by `/`).
- **Transaction ID:** The specific ID of the record. If left blank (just a comma) for new records, T24 can auto-generate an ID if auto-ID is configured.
- **Request Data:** The actual data to be sent, formatted as comma-separated pairs of Field Name and Value (e.g., `CUSTOMER::=111217, CATEGORY::=1001`).

**Example Request:**
`ACCOUNT,MTD.NEW.AC/I/PROCESS,AARON02/123456,41041,CUSTOMER::=111217,CATEGORY::=1001,CURRENCY::=EUR,ACCOUNT.TITLE.1::=AARON EUR CA`
**Example Response:** Success returns the ID followed by `//1` (e.g., `41041//1`).

### 2. Enquiry Request
Used to query or retrieve data from the system. The syntax components include:
- **Operation:** This is always `ENQUIRY.SELECT`.
- **Options:** This is typically left blank for enquiries (meaning two consecutive commas `,,` in the string).
- **User Information:** Sign-on name and password.
- **Enquiry Name:** The ID/name of the specific enquiry to run (e.g., `MTD.AC.BALANCE`).
- **Request Data (Selection Criteria):** Used to filter the data (e.g., `@ID:EQ=40274`).

**Example Request:**
`ENQUIRY.SELECT,,AARON02/123456,MTD.AC.BALANCE,@ID:EQ=40274`

## Executing OFS Messages in T24 (jsh)
To test and post OFS messages directly in the T24 environment:
- Open a `jsh` (jBASE shell) prompt.
- Enter the command: `tSS <OFS_SOURCE_NAME>` (e.g., `tSS BALOFS`).
- Once inside the prompt, paste the OFS string. The system will process it and return the response message indicating success, failure, or the queried data.

## Integration Example (Python/Flask)
Aaron demonstrated a real-world integration using a Python Flask application connected to a PostgreSQL database.
- The web app holds basic customer data but lacks real-time balance information.
- It leverages a custom function `get_balance_from_t24` that generates an OFS Enquiry Request.
- It sends the request to the T24 server using a TCP/OFS client, parses the response to extract the balance, and seamlessly serves it back through the API.
