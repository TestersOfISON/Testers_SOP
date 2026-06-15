# T24 Componentisation - Table Component

This note covers the transition from traditional T24 programming (using `F.READ` and `$INSERT` files) to modern Component-based programming using T24 Table Components.

## 1. Traditional T24 Programming (Legacy Approach)

In the traditional approach, retrieving and manipulating data from an application required knowledge of field positions and involved several low-level calls:

1.  **Insert Files**: You had to include an insert file for the specific application to access field positions (e.g., `$INSERT I_F.MTD.CHANNEL`).
2.  **File Opening**: You had to open the file using `CALL OPF` which requires defining file name and descriptor variables.
3.  **Reading Records**: You used `CALL F.READ` to retrieve a record by its ID, passing the file descriptor, ID, record variable, and error variable.
4.  **Field Access**: Data was accessed using dynamic arrays and equated variables, e.g., `record<MtChannel_Description>`.

## 2. Modern T24 Component-based Programming

The component approach eliminates the need for `$INSERT`, `OPF`, and `F.READ` by abstracting them into a `Table` object.

### Creating a Table Component

1.  **Create Table Definition**: In your Design Studio/Eclipse, right-click the component package, select `New > Component > Table`.
2.  **Naming**: Name the table component identical to the application name (e.g., `MTD.CHANNEL`).
3.  **Structure**:
    ```basic
    public table MTD.CHANNEL {
        T24: MTD.CHANNEL
        fields {
            Description = 1
            Interface = 2
            Active = 3
        }
    }
    ```
4.  **Visibility**: By default, table scope is `private`. If the table needs to be accessed globally across different routines in the component, change the scope to `public`.
5.  **Linking**: The `T24: MTD.CHANNEL` line links the component table to the actual T24 application.
6.  **Mapping Fields**: The `fields {}` block maps user-friendly names to their numerical positions in the table. You can also map them explicitly to the JBC equated variable names in parentheses, though this is optional:
    ```basic
    Description(MT.CHN.DESCRIPTION) = 1
    Interface(MT.CHN.INTERFACE) = 2
    ```
7.  **Compile**: After defining the table, you must build/compile the component. This automatically generates the necessary wrapper methods (like `Read`, `ReadArchive`, `ReadHistory`, etc.).

### Using the Table Component in Code

Once compiled, you can easily use the component to read records and access fields.

1.  **Import Component**: Use the `$USING` directive to import your component:
    ```basic
    $USING MTD.Training
    ```
2.  **Read Record**: Call the generated `.Read()` method on the table component. This method acts as a wrapper around `F.READ` and directly returns the record object.
    ```basic
    // Syntax: Component.Table.Read(ID, Error)
    record = MTD.Training.MtdChannel.Read("KAFKA", err)
    ```
3.  **Error Handling**: Check if the error variable is populated to handle missing records.
4.  **Access Data**: Use simple dot notation to access fields by the names defined in your table component.
    ```basic
    CRT "Description: " : record.Description
    CRT "Interface  : " : record.Interface
    ```

### Advantages
- Cleaner, more readable code.
- No need for manual file opens (`OPF`).
- Object-oriented dot notation for field access instead of dynamic array extraction (`<>`).
- Abstraction of common data access routines (`Read`, `ReadHistory`, etc.).
