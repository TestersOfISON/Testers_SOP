# T24 Componentisation - Table

This video explains how to work with tables in T24 programming, contrasting the traditional approach with the newer component-based approach.

## Traditional T24 Programming
- **Insert Files:** You would typically include an insert file (e.g., `$INSERT I_F.MTD.CHANNEL`) to access the predefined field positions of an application.
- **Reading Data:** To retrieve data from a table, you needed to declare variables, open the file using `OPF` (Open File), and read the record using `F.READ` with the specific record ID.
- **Accessing Fields:** Fields were accessed via array-like indexing using field positions (e.g., `record<2>`) or by utilizing the field names defined in the insert file.

## T24 Componentisation Approach
With componentisation, the process is streamlined and relies on object-oriented-like concepts, bypassing the need for `$INSERT`, `OPF`, and `F.READ`.

### 1. Defining the Table Component
- Create a new Table definition within the component project via Design Studio (`New` -> `Table`).
- Name the table component (e.g., `MtdChannel`).
- **Visibility/Scope:** By default, the table definition is `private`. If you intend to use the methods and access the table globally across the program, change it to `public`.
- **Linking to T24 Table:** You link the component to the actual T24 application name using `t24: T24.NAME = "MTD.CHANNEL"`.
- **Field Mapping:** You map the exact T24 field names to their corresponding positions in the `fields:` block.
  ```t24
  public table MtdChannel {
      t24: T24.NAME = "MTD.CHANNEL"
      fields {
          Description = 1
          Interface = 2
          Active = 3
          // ... map other necessary fields or use exact JBC names
      }
  }
  ```
- **Compilation:** The component must be compiled, which produces a compiled `.component` definition allowing its methods to be accessed.

### 2. Using the Table Component in Programs
- Import the component namespace using the `$USING` keyword (e.g., `$USING MTD.Training`).
- Retrieve the record directly using the `.Read()` method on the component table class: 
  ```t24
  record = MTD.Training.MtdChannel.Read("KAFKA", error)
  ```
- This single method call replaces the traditional `OPF` and `F.READ` routines.
- **Accessing Data:** Access fields via clean dot notation on the returned record object instead of array indexes. For example: `record.MtdChannel_Description` or `record.MtdChannel_Interface`.
- This approach makes code significantly more readable, modular, and easier to maintain.
