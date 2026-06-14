# T24 Application Architecture and Temenos Design Studio Notes

This document contains comprehensive architectural details about the T24 application structure, core architecture, essential enquiries, and navigation, extracted from the instructional video on Temenos (R) Design Studio.

## 1. Core Architecture
Temenos redesigned its core banking system from a C language runtime to a Java runtime. This new Java-based framework is known as **TAFJ** (T-A-F-J). This transition opened the floodgates for open-source development, enabling the integration of various utilities and applications within the T24 ecosystem.

### Framework Layers
The T24 architecture consists of several layered frameworks:
- **User Interface**
- **Interaction Framework**
- **Component Framework** (Banking Transactions)
- **Platform Framework** (Platform Resources)
- **Data Framework** (Read Only / Read Write)
- **Models / Design Framework**
- Layers are also categorized by tier: Back, Middle, Front, and Integration.

### Temenos Design Studio
- **Platform:** Built on top of the open-source **Eclipse IDE**.
- **Project Management:** Uses **Maven** for comprehensive project management, providing build lifecycle frameworks and automating project build infrastructure using a standard directory layout.
- **Source Control:** Incorporates Eclipse's 3rd-party capabilities for source control management, issue tracking, and packaging.
- **Language:** Source code is written in the **T24 JBC language**, which compiles into Java object code. Developers can also write T24 components directly in Java.

### Included Designers
The suite includes various designers for different architectural components:
- **JBC Designer:** Writing, validating, and compiling JBC code.
- **Menu Designer:** Designing T24 menus.
- **Query Designer:** Designing reports and lists (Enquiries).
- **Screen Designer:** Designing versions of forms, data input forms, composite screens, and tabs.
- **Web Service Designer** and **Integration Designer**.

## 2. T24 Application Structure and Navigation
The Design Studio (based on Eclipse) provides a standardized layout for development:

- **Package Explorer (Left Pane):** Used for viewing all projects, directories, subdirectories, and server properties.
- **Editor Window (Center Pane):** The main workspace where multiple types of editors (like the JBC Editor) can be opened to write code.
- **Properties and Views (Bottom Pane):** Displays server properties, problems, console output, and error logs.

### Setting Up a Project
1. **Creation:** Navigate to `File > New > Project > Design Studio > Design Studio Template Projects`.
2. **Template Selection:** A typical default template is `t24-packager-tafj`.
3. **Configuration:** 
   - Ensure server properties are correct (e.g., Host: `localhost`, ws-port: `9089`, Username: `INPUTT`, Authorizer: `AUTHOR`).
   - The connection state in the Server view must show as **Active**.
4. **TAFJ Mode:** The project must be toggled into TAFJ mode (`Right-click project > Toggle TAFJ project nature`) to enable code creation.

### Writing Source Code
- Source code is typically organized under a specific folder inside `src`, conventionally named `SOURCE.BP` (Basic Programs).
- Code files are suffixed with `.b` (e.g., `HELLO.b`).
- The **JBC Editor** provides features like syntax formatting and pre-defined **Macros** (e.g., `SELECT`, `OPEN/FILE`, `READ.RECORD`) to speed up routine programming tasks.
- Saving the code file automatically attempts to compile it into Java Object Code. The compiled `.class` files are deployed to the T24 environment.

## 3. Essential Enquiries (Creating an Enquiry)
Enquiries in T24 are used to generate lists, reports, or queries against the database. The video demonstrates the creation of a simple account list enquiry (`AC.LIST`):

1. **Initialization:** `Right-click project > New > New Enquiry`.
2. **Details:** Specify the Enquiry Name (e.g., `AC.LIST`) and the Application it queries (e.g., `ACCOUNT`).
3. **Header:** Define a user-facing header (e.g., "LIST OF CURRENT ACCOUNTS").
4. **Field Selection:** Add available fields to the enquiry output (e.g., `ACCOUNT.NO`, `ACCOUNT.TITLE.1`, `CURRENCY`, `CATEGORY`).
5. **Data Selection:** 
   - **Predefined Selection (Fixed):** Filters that the end-user cannot change. For instance, filtering `CATEGORY` to only show values `Between 1000 and 1003`.
   - **Custom Selection:** Filters that the end-user can interact with. For instance, allowing selection by `CURRENCY` where the operand is `Equals` and providing dropdown options like `USD` or `GBP`.
6. **Deployment:** Save the enquiry, then deploy it by right-clicking the enquiry file in the Package Explorer and selecting `Design Studio > Generate Code`.
7. **Execution in T24:** 
   - Log into the T24 web interface via the browser.
   - Enter `ENQ AC.LIST` in the command prompt.
   - Use the custom selection screen to filter (if any) and execute the query to view the dynamically generated list.

## 4. Future Enhancements
Design Studio is positioned as the focal point for all T24 design work. Future capabilities aim to cover:
- Form delivery advices and deal slips.
- Rules engine designing.
- Comprehensive end-to-end component creation previously handled directly within the older T24 interfaces.
