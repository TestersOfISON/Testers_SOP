# T24 Programming - Getting Started with InfoBasic (jbc)
**Video ID:** 8GelgjznopE
**Presenter:** Aaron from mathisi.io

## Overview
This video introduces the very first steps in T24 programming using InfoBasic (the programming language for the T24 core banking system). It demonstrates the complete lifecycle of creating, pushing, compiling, cataloging, and running a simple "Hello World" program.

## Core Steps in T24 Programming
1. **Write:** Write your program on a client computer (e.g., using Visual Studio Code).
2. **Push:** Transfer the source code to the T24 server, specifically into a `.BP` folder. This can be done via Git, FTP, or direct copy-pasting.
3. **Compile:** Compile the source code using the `BASIC` command.
4. **Catalog:** Catalog the compiled program using the `CATALOG` command to make it executable.
5. **Run:** Execute the program from the JShell prompt.

## Connecting and Setting Up JShell
- Connect to the T24 development server via Telnet.
- Access the **JShell** (`jsh`) prompt by typing `BK` at the classic T24 login menu.

## Writing the Program (Client Side)
1. Create a local directory (e.g., `mkdir t24`, then `cd t24`).
2. Open in VS Code: `code .`
3. Create a source file with the `.b` extension (e.g., `HelloProg.b`), which denotes an InfoBasic program.
4. **Syntax:**
   ```basic
   PROGRAM HelloProg
   CRT "Hello there!"
   END
   ```
   - **First Line:** Must start with a keyword like `PROGRAM`, `SUBROUTINE`, or `FUNCTION`. Most T24 development uses `SUBROUTINE`.
   - **Body:** Contains the logic. `CRT` is used to output text to the terminal. All InfoBasic keywords must be uppercase.
   - **Last Line:** Must be `END`.

## Server-Side Operations (JShell)
### 1. Creating a Directory
- Source files on the T24 server are stored as records inside a directory structure treated as a file.
- Command: `CREATE-FILE MATHISI.BP TYPE=UD`
  - `TYPE=UD` specifies that it's a directory (treated as a file where records are source files).

### 2. Pushing / Editing the Source Code
- Use the **JED** editor to create/edit the file on the server:
  ```sh
  JED MATHISI.BP HelloProg.b
  ```
- Paste the code copied from VS Code.
- **JED Commands:**
  - `Ctrl + V`: Format/indent the code.
  - `Esc`: Enter command mode.
  - `FI`: Save and exit.
  - `EX`: Exit without saving.

### 3. Compiling
- Command: `BASIC MATHISI.BP HelloProg.b`
- Output will indicate "compiled successfully".

### 4. Cataloging
- Command: `CATALOG MATHISI.BP HelloProg.b`
- Output will indicate "object cataloged successfully".

### 5. Running
- Command: Simply type the program name (without extension).
  ```sh
  HelloProg
  ```
- Output: `Hello there!` will be printed to the terminal.

## Additional Resources
- GitHub Repo: [github.com/mathisi-io/t24dev](https://github.com/mathisi-io/t24dev)
- Website: [mathisi.io](https://mathisi.io)
