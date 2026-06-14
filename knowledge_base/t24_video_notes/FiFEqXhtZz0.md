# Temenos T24 Security Management System

## Objectives
- Learn SMS (Security Management System) Applications
- Understand SMS User-related fields
- Implement SMS: User Profile and Menu

## Definition of Information Security
The protection of information and information systems from unauthorized access, use, disclosure, disruption, modification, or destruction in order to provide confidentiality, integrity, and availability.

## SMS Applications
T24 has a dedicated module called Security Management System (SMS). Some of the key applications include:
- **SIGN.ON**: Responsible for authenticating a user into T24.
- **SIGN.OFF**: Used to log out of the system.
- **PASSWORD**: Allows users to change their password, change company, and deactivate their profile.
- **USER**: Used for managing user profiles (e.g., creating users).
- **USER.SMS.GROUP**: Where roles and privileges are defined.
- **SIGN.ON.RESET**: Used to reset user profiles.
- **PASSWORD.RESET**: Used by the security officer to reset a user's password.
- **PROTOCOL**: Keeps logs of everything done in T24 (who did what, when, and from which terminal).
- **ACTIVITY**: Shows the active users currently logged into the system.

## Password Policy (SPF)
Password policies are defined in the System Parameter File (SPF) application: `SPF` -> `SYSTEM`.
- **Field 48 (Password Repetition)**: Defines the number of different passwords a user must input before they can repeat an old one.
- **Field 55 (Password Minimum Length)**: Enforces the minimum number of characters required for a password.
- Other fields can enforce requirements for uppercase letters, lowercase letters, numbers, and special characters.

## Menus
- `HELPTEXT.MENU`
- `HELPTEXT.MAINMENU`

## Practice Exercise
**Goal**: Create a menu for a domestic operations officer with the following privileges:
- **Funds transfer** - Full except Auth
- **Accounts** - View List Print in USD only and category 1001 & 14020
- **Customer** - View List Print
- **Run enquiries** - STMT.ENT.BOOK

### Implementation Steps
1. **Create the Menu (`HELPTEXT.MENU`)**
   - Create sub-menus for Funds Transfer, Accounts, Customer, and Enquiries.
   - Example parent menu: `DOM.OPS.MENU` with items pointing to the relevant applications.
2. **Create the Role (`USER.SMS.GROUP`)**
   - Application: `SMS.GROUP`
   - Define allowed applications (`FUNDS.TRANSFER`, `ACCOUNT`, `CUSTOMER`, `ENQUIRY.SELECT`).
   - Define function restrictions (e.g., for `FUNDS.TRANSFER`, exclude the 'A' function to prevent authorization).
   - Define field-level or data restrictions (e.g., for `ACCOUNT`, restrict to currency `USD` and categories `1001` and `14020`).
3. **Create the User Profile (`USER`)**
   - Application: `USER`
   - Define Username, Password, allowed companies, and attach the User SMS Group (Role).
   - Set the Initial Application to the custom menu created earlier (`DOM.OPS.MENU`). When the user logs in, they will only see and have access to this custom menu.
