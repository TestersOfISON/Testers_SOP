# T24 Programming: Calling a Java Method from Infobasic (CALLJ)

This video tutorial explains how to call a Java class method from an Infobasic (T24) program using the `CALLJ` statement.

## 1. Creating the Java Application
The process starts with creating a simple Java application.
- A `Greeting` class is created in the package `io.mathisi.test`.
- The class includes a method `hello(String name)` which returns a greeting string (`"Hello " + name`).
- The code is compiled using the Java compiler: `javac io/mathisi/test/Main.java`

## 2. Creating a JAR File
To use the Java class in T24, it needs to be packaged into a `.jar` file.
- A `manifest.txt` file is created containing `Main-Class: io.mathisi.test.Main`.
- The JAR file is built using the command line: 
  `jar cvfm calljtest.jar manifest.txt io\mathisi\test\*.class`
- The resulting `.jar` file is copied to the T24 server and its reference must be added to the CLASSPATH (e.g., by adding a `<resource-root>` entry in the JBoss configuration if applicable).

## 3. Creating the Infobasic Program
The `CALLJ` statement in T24 is used to interact with the Java method.

**Syntax:**
```basic
CALLJ class_name, method_name, param SETTING ret ON ERROR err_statement
```

**Example Program:**
```basic
PROGRAM TestCallJ

class_name = "io.mathisi.test.Greeting"
method_name = "hello"
param = "Anne Smith"

CALLJ class_name, method_name, param SETTING ret ON ERROR
    err = SYSTEM(0)
    CRT "Error code : " : err
    RETURN
END

CRT ""
CRT "Received from java : " : ret
```

## 4. Error Handling (`SYSTEM(0)`)
When `CALLJ` encounters an error, the T24 variable `SYSTEM(0)` can be used to retrieve the specific error code. The video lists the following error codes:
* **1** - Fatal error creating thread
* **2** - Cannot create JVM
* **3** - Cannot find class
* **4** - Unicode conversion error
* **5** - Cannot find method
* **6** - Cannot find object constructor
* **7** - Cannot instantiate object

The video demonstrates inducing these errors, such as providing a wrong class name to trigger an `Error code 3` or a non-existent method to trigger `Error code 5`.

## 5. Compiling and Running in T24
The T24 program is then compiled, cataloged, and executed:
- `BASIC MATHISI.BP TestCallJ.b`
- `CATALOG MATHISI.BP TestCallJ.b`
- Execution command: `TestCallJ`
- Final Output: `Received from java Hello Anne Smith`
