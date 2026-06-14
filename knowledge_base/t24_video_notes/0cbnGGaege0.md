# T24 Componentisation with Design Studio

This video tutorial by mathisi digital demonstrates how to work with components in T24 using Design Studio.

## Prerequisites
- A blank workspace in Design Studio.

## 1. Create a TAFJ Project
- Create a new **General Project** (e.g., `TAFJ Proj`).
- Right-click the project and select **Toggle TAFJ Nature**.
- Ensure **TAFJ_HOME** is configured correctly.
- Import the configuration file using an existing `tafj.properties` file.
- The wizard will set up references to `t24lib` and classes.
- Test the database connection to ensure it connects successfully.

## 2. Create a T24 Component
- Right-click the TAFJ project and select **New > T24 Component Folder Structure** (recommended over `T24 routine component` as it provides a structured setup).
- Define a **Module** name (e.g., `MTD`). A module can contain multiple components.
- Define a **Component** name under the module (e.g., `Training`).

### Component Folder Structure
- **definition**: Contains the component definition file (e.g., `MTD.Training.component`). This file defines the artifacts (routines, tables, functions) for the component.
  - The compiled JAR will be named `MTD_Training.jar`.
- **data**: To store T24 records or other data.
- **source**: Contains the source code.
  - **Private**: Typically for source codes, subroutines, and functions.
  - **Public**: Typically for programs or files that are not subroutines.
  - *(Note: The Private/Public categorization is a convention, not strictly enforced for compilation unless explicitly configured).*
- **test**: To store unit tests.

## 3. Define a Subroutine in the Component
- In the component definition file (e.g., `MTD.Training.component`), define a method:
  - `public`: Accessible from other components/modules.
  - `module`: Accessible from other components within the same module.
  - `private`: Accessible only within the same component.
- Example method definition:
  ```
  public method Greeting(IN name, OUT message) {
      jBC: MTD.Greeting
  }
  ```
  - This maps the method `Greeting` to the jBC artifact `MTD.Greeting`.

## 4. Create the jBC Subroutine
- Right-click the `Private` folder and select **New > jBC Routine from Template**.
- Select **Subroutine** and name it `MTD.Greeting`.
- Add the package declaration to link it to the component:
  ```basic
  $PACKAGE MTD.Training
  ```
- Define the subroutine with parameters matching the component definition:
  ```basic
  SUBROUTINE MTD.Greeting(name, msg)
      IF name NE '' THEN
          msg = "Hello " : name : "!"
      END ELSE
          msg = "Hello!"
      END
      RETURN
  ```

## 5. Test the Component
- Create a test program under the `Public` folder.
- Use the `$USING` keyword to import the component module:
  ```basic
  PROGRAM TestGreeting
  $USING MTD.Training

  MTD.Training.Greeting("John", message)
  CRT message
  ```
- Run the program to verify the output (e.g., `Hello John!`).
