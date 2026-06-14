# T24 Programming - Componentisation Properties

## Overview
This video explains how to use and define properties within T24 TafJ components. Properties allow you to set, store, and access component-level values from within your subroutines or external programs based on their defined scope.

## Key Concepts

*   **Properties:** Variables defined at the component level that can be accessed and modified.
*   **Scope Modifiers:**
    *   `public`: The property and its methods are accessible from anywhere, including programs outside the component.
    *   `private`: The property and its methods are accessible only from within the component itself.
*   **Access Modifiers:**
    *   `readwrite`: Allows both getting and setting the property value.
    *   `read`: Allows only getting the property value.
    *   `write`: Allows only setting the property value.
*   **Automatic Getter/Setter Generation:** When a property is defined (e.g., `Age`), TafJ automatically generates getter and setter methods (`getAge` and `setAge`) depending on the specified access modifiers.

## Demonstration

### 1. Defining a Public Read/Write Property
In the component definition file (e.g., `MTD.Training`), you can define a property like so:
```java
public property readwrite Age
```
This automatically gives you access to `MTD.Training.setAge()` and `MTD.Training.getAge()`.

### 2. Setting and Getting Properties from a Program
In an external program (e.g., `TestGreeting`), you can prompt the user for input and use the setter method:
```basic
$USING MTD.Training
PROMPT "How old are you? "
INPUT age
MTD.Training.setAge(age)
CRT MTD.Training.getAge()
```

### 3. Accessing Properties from a Subroutine
Inside a subroutine that belongs to the component, you can retrieve the value using the getter method without needing to pass it as a parameter:
```basic
age = MTD.Training.getAge()
msg = "Hello " : name : "! You are " : age : " years old."
```

### 4. Restricting Access (Public Write / Private Read)
You can define separate scopes for reading and writing. For instance, if you want external programs to be able to set a property, but only internal subroutines to read it:
```java
public property write Age
private property read Age
```
If an external program attempts to call `MTD.Training.getAge()` after this change, it will result in a compilation error (`getAge forbidden access : private`). However, internal subroutines can still call `getAge()` successfully.
