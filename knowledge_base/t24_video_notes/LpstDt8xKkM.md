# T24 TAFJ Development: Component Properties

This note summarizes technical details about Component Properties in T24 TAFJ Development, based on the tutorial video.

## Overview of Properties
Properties in T24 TAFJ components are used to define common variables or values that can be accessed or modified within subroutines or outside the component, depending on their defined scope.

## Creating Properties
Properties are defined in the component definition file using the following syntax:
`[scope_modifier] property [access_type] [PropertyName]`

Example:
```basic
public property readwrite Age
```

## Access Types
You can specify the allowed access to the property using one of the following keywords:
*   **`readwrite`**: The property value can be both set (written) and retrieved (read).
*   **`read`**: The property is read-only. Its value can be retrieved, but not modified.
*   **`write`**: The property is write-only. Its value can be set, but not retrieved.

## Automatic Methods (Getters and Setters)
When a property is defined, the system automatically generates corresponding getter and setter methods based on the property name and access type.
For a property named `Age`:
*   The setter method is automatically created as `setAge(value)`.
*   The getter method is automatically created as `getAge()`.

## Scope Modifiers (Public vs. Private)
*   **`public`**: The property and its associated methods are accessible from outside the component (e.g., from external test programs or other components).
    *   Example: A test program can call `MTD.Training.setAge(age)` and `MTD.Training.getAge()`.
*   **`private`**: The property and its associated methods are only accessible from within the subroutines that belong to the component.
    *   If an external program attempts to access a private property method (e.g., calling `getAge()` on a private read property), a compilation error will occur: `forbidden access : private`.

## Mixed Scopes for Read and Write
It is possible to define different access scopes for reading and writing the same property.
Example:
```basic
public property write Age
private property read Age
```
In this configuration:
*   External programs can set the property using the `setAge()` method because write access is public.
*   Only internal subroutines within the component can read the property using the `getAge()` method because read access is private. An external attempt to use `getAge()` will fail during compilation.

## Usage in Subroutines
Internal subroutines within the component can access properties using the getter and setter methods (e.g., `MTD.Training.getAge()`) without the need to pass these values as parameters to the subroutines.
