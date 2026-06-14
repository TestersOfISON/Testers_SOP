# T24 Programming: Calling Java Forex Service in TAFJ

This video demonstrates how to create a Java service for Forex currency conversion and how to call this Java service from a T24 InfoBasic program within the TAFJ environment using Design Studio.

## 1. Creating the Java Forex Service
- **Project Setup**: A Java Maven project is created (using the `maven-archetype-quickstart`).
- **Converter Class**: A `Converter` class is created to handle the core logic. It takes `ccyFrom`, `ccyTo`, and `amount`. It includes a `getRate()` method (which in this example returns hardcoded rates for EUR, USD, GBP, RWF) and a `convert()` method that performs the calculation. It returns `-1` if the rate is not found.
- **Service Wrapper**: A `ForexService` class is created to act as the interface for T24. It contains a `convert(String params)` method.
  - The `params` string is expected to be delimited (e.g., using `;`), like `USD;EUR;1000`.
  - The method splits the string, extracts the source currency, destination currency, and amount.
  - It handles basic validation (e.g., checking if the delimiter is present).
  - It instantiates the `Converter` class, calls its `convert()` method, and returns a formatted string with the result or an error message (e.g., "Exchange rate not found").
- **Building the JAR**: The project is built into a JAR file including dependencies using Maven (`mvn clean compile assembly:single`).

## 2. Calling the Java Service from T24 (TAFJ)
- **Design Studio**: The development is done in T24 Design Studio, an Eclipse-based IDE for T24.
- **InfoBasic Program**: A basic program (e.g., `MTD.FOREX.b`) is created to interact with the Java service.
- **Input Collection**: The program uses `PROMPT` and `INPUT` statements to collect the source currency, destination currency, and amount from the user interactively.
- **Parameter Preparation**: The inputs are concatenated into a single string separated by the expected delimiter (`;`).
- **The `CALLJ` Statement**: The core of the integration is the `CALLJ` statement, which invokes the Java method.
  ```basic
  class_name = "io.mathisi.api.ForexService"
  method_name = "convert"
  param = ccy_from : ";" : ccy_to : ";" : amount
  
  CALLJ class_name, method_name, param SETTING ret ON ERROR
      err = SYSTEM(0)
      CRT "Error code: " : err
      RETURN
  END
  
  CRT "Received from Java: " : ret
  ```
- **Execution**: The program is compiled and run within Design Studio. It successfully prompts for input, passes the data to the Java service, receives the converted amount, and prints it to the console. It also demonstrates handling cases where the exchange rate is not defined in the Java logic.

## Summary
The video provides a clear, step-by-step guide on creating a Java library and exposing its functionality to T24 basic programs using the `CALLJ` interface in a TAFJ environment.
