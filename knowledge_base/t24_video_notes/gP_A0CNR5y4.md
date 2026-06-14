# T24 Programming: How to create and use custom fields

**Presenter:** Aaron from mathisi digital

This video explains how to create custom fields in Temenos T24 and attach them to existing applications using `LOCAL.TABLE` and `LOCAL.REF.TABLE`. It also demonstrates how to access these custom fields in local development routines.

## Overview
T24 provides two applications for custom fields:
1. **LOCAL.TABLE**: Used to define the custom field.
2. **LOCAL.REF.TABLE**: Used to attach the defined field to an existing T24 application.

> **Note:** Before creating any local field, ensure there is no core field that already meets your requirements to avoid abusing the local field functionality.

## Practical Example: SMS Alert Subscription Field

**Goal:** Create a custom field to track whether a customer has subscribed to SMS alerts for a specific account.

**Field Specifications:**
- **Name**: `SMS.ALERT`
- **Length & Data Type**: 1 Alpha character
- **Possible Values**: `Y` (Yes) or empty (Not subscribed)

### Step 1: Create the Field in LOCAL.TABLE
1. Open the `LOCAL.TABLE` application (command: `LOCAL.TABLE`).
2. Provide a numeric ID (e.g., `3000`).
3. Fill in the details:
   - **Description**: `SMS.ALERT`
   - **Short Name**: `SMS.ALERT` (Important: This is the name used in local development)
   - **Maximum Char**: `1`
   - **Char Type**: `A` (Alpha)
   - **Vetting Table**: `Y` (This restricts the input to 'Y' or empty).
4. Commit the record. The field is now created.

### Step 2: Attach the Field to the ACCOUNT Application
1. Open the `LOCAL.REF.TABLE` application (command: `LOCAL.REF.TABLE`).
2. Use the ID of the target application, which is `ACCOUNT`.
3. Expand the list of attached fields and add a new entry.
4. Set the field value to the newly created short name: `SMS.ALERT`.
5. Commit the record. This rebuilds the dictionary for the `ACCOUNT` application.
6. The `SMS.ALERT` field is now available in the `ACCOUNT` application (e.g., as field `20.2`). You can view it using `ACCOUNT L L`.

### Step 3: Accessing the Field in Local Development

To use the custom field in a local routine, you need to find its position dynamically.

1. **Use `GET.LOC.REF` Routine**:
   T24 provides a core routine `GET.LOC.REF` to find the position of a local reference field.
   
   **Syntax:**
   ```basic
   CALL GET.LOC.REF(APPLICATION.NAME, FIELD.SHORT.NAME, FIELD.POS)
   ```
   - `APPLICATION.NAME`: The name of the application (e.g., `'ACCOUNT'`).
   - `FIELD.SHORT.NAME`: The short name of the field (e.g., `'SMS.ALERT'`).
   - `FIELD.POS`: The variable that will store the returned position.

2. **Extract the Value**:
   Once you have the position, you can extract the field's value from the local reference array of the record.
   
   **Example Implementation:**
   ```basic
   * Get the position of SMS.ALERT in the ACCOUNT application
   CALL GET.LOC.REF('ACCOUNT', 'SMS.ALERT', posn)
   
   * Fetch the value from the account record's local reference field
   sms_alert = acc_rec<AC.LOCAL.REF, posn>
   
   * Logic based on the value
   IF sms_alert NE 'Y' THEN RETURN ;* Do not send SMS if not subscribed
   
   * ... Proceed to send SMS ...
   ```

By following these steps, you can dynamically read the value of custom fields without hardcoding their positions, making your code robust against dictionary rebuilds and field additions.
