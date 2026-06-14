# Navigation Through Classic Interface in T24

This video is a tutorial on the T24 Fundamentals, specifically focusing on navigating through the Classic User Interface.

## Agenda
1. Access to jshell
2. Login to T24
3. Layout of the interface
4. Commands and Keyboard Shortcut Keys
5. Working with Multi-Valued fields
6. Functions
7. Useful tips

## 1. Access to jshell & 2. Login to T24
- Connect to the server using telnet or SSH (e.g., `telnet matsrv01`).
- Login with OS credentials (username `t24`, and password).
- At the `START GLOBUS Y/N=` prompt, select `N` or just press `Enter` to go to the jshell prompt.
- Select the terminal type using `ETS` and then invoke the application using `EX`.
- Provide T24 username and password to log in.
- To log out of T24 and return to jshell, use `LO` or `BK`.

## 3. Layout of the interface
- **Instruction bar**: Displays instructions like "AWAITING APPLICATION".
- **Action box**: Where you enter actions, applications, or functions.
- **Details and functions**: Displays the record details, multi-valued fields, and sub-values.
- **Record Id**: Unique identification of a record.
- **Application description and function name**: Displays the application in use and the current function.

## 4. Commands and Keyboard Shortcut Keys
- **Move to the Next**: `CTRL+F+ENTER` or `F3`
- **Go to the Previous**: `CTRL+B+ENTER` or `F2`
- **Commit / Validate**: `CTRL+V+ENTER` or `F5`
- **Quit w/t saving**: `CTRL+U+ENTER` or `ESC`
- **Move to the last**: `CTRL+E+ENTER` or `F4`
- **Move to a specific field**: Type the field number (e.g., `3` or `4.1`) and press `ENTER`.

## 5. Working with Multi-Valued fields
- **Extend multi valued field above**: `<`
- **Extend multi valued field below**: `>`
- **Extend sub valued field above**: `(`
- **Extend sub valued field below**: `)`
- **Delete multi/sub value**: `-`

## 6. Functions
- `S` - View (Read-only mode)
- `I` - Input (Create or modify a record)
- `A` - Authorize (Approve an unauthorized record)
- `D` - Delete (Delete an unauthorized record)
- `C` - Copy (Copy a record to create a new one)
- `R` - Reverse (Reverse a live record, moves it to history)
- `V` - Verify (Verify an active locked record)
- `L` - List live records (e.g., `USER L` lists all users)
- `E` - List exceptions (List unauthorized records)
- Search history: `L ; L` or `L;L` (e.g., `FT L ; L`)

## 7. Useful tips
- **Display help**: Type `?` in the action box to get help regarding a field.
- **List records of linked table**: Use `!` to see linked applications.
- **Customizing your terminal**: You can modify your terminal settings using `VOC` (e.g., `JED VOC ETS1`) to change to terminals like `ANSI-COLOUR` to make the UI colorful.
