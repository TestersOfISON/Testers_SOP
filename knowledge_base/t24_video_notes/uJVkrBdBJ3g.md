# T24 Programming - How visual studio code can boost your productivity | VS Code for T24 Developers
**Video ID:** uJVkrBdBJ3g
**Presenter:** Aaron from mathisi.io

## Overview
This video demonstrates how to use and configure Visual Studio Code (VS Code) to increase day-to-day productivity for T24 developers. Instead of writing code directly on the server via `JED`, developers can leverage VS Code's modern features such as syntax highlighting, IntelliSense, and code formatting.

## 1. VS Code Installation
- Download VS Code from [code.visualstudio.com](https://code.visualstudio.com/).
- Run the installer.
- Accept the license agreement.
- Leave the default options checked (especially "Add to PATH").
- Click **Install** and then **Finish** to launch the editor.

## 2. Working with VS Code
- **Explorer Panel (Top Left):** Used to open and create folders/files, and navigate the workspace.
- **Search Panel:** For finding/replacing text across files.
- **Source Control:** Built-in Git support for tracking commits and pushing changes.
- **Run and Debug:** For running scripts and debugging.
- **Extensions:** Used to install third-party plugins.
- **Opening a Folder:**
  - Method 1: Navigate via Command Line (`cd \path\to\folder`) and type `code .`
  - Method 2: From the menu, select **File > Open Folder** and choose the directory.

## 3. Configuration for T24 Development
To make VS Code understand InfoBasic/jBC syntax, you must install the **MV Basic** extension.

### Installing the Extension
1. Click the **Extensions** icon on the left sidebar.
2. Search for `MV Basic`.
3. Install the **MV Extensions** by *MV Basic*.

### Key Features of MV Basic Extension
- Syntax highlighting
- IntelliSense (auto-completion)
- Code folding
- Code formatting
- Go to / Peek definition
- Built-in documentation for JBC functions and statements (e.g., hovering over or typing `DATE()` displays its definition and usage).

### Configuring MV Basic Settings
After installing, you must configure the extension to work perfectly with T24 (jBASE):
1. Open settings (Go to `File > Preferences > Settings` or press `Ctrl + ,`).
2. Search for `MV Basic`.
3. Update the following key parameters:
   - **MV Basic: Indent:** Change the default indentation from `3` to `4`.
   - **MV Basic: Language Type:** Set this to `jBASE`.
   - **MV Basic: Use Camel Case:** **CRITICAL:** *Uncheck* this option. If left checked, the editor will automatically try to convert your fully capitalized InfoBasic keywords into CamelCase, which will cause compilation errors in T24.

By properly configuring VS Code, T24 developers can write InfoBasic code more comfortably, referencing documentation on the fly without leaving the editor.
