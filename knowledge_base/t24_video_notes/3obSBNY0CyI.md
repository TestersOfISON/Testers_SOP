# T24 TAFJ Programming: How to use Temenos UnitTest Framework

This video covers the usage of the Temenos Unit Test Framework (UTF) in TAFJ development.

## Unit Testing Basics
- **Unit Test**: Typically automated tests written and run by software developers to ensure that a section of an application (known as the "unit") meets its design and behaves as intended.
- In T24 terminology, a "unit" is typically a subroutine.
- The framework allows developers to test if a subroutine produces the correct, expected results for given inputs.

## Creating a Unit Test
The video demonstrates testing a subroutine named `MTD.GetAcctDetails`, which takes an `account_id` and returns account `details` as a JSON object.

### Steps to create the test:
1. **Create the Test Case File**: In Design Studio, create a new "T24 routine / component testcase". The generated file will have a `.tut` extension (e.g., `TestGetAcctDetails.tut`), not `.b`.
2. **Define the Target**: Set the target to the full package and method name of the subroutine being tested.
   ```basic
   UTF.setTarget("EB.MtdTraining.MTDGetAcctDetails")
   ```
3. **Set the Description**: Add a description for the test case using `UTF.setDescription()`.

## Setting up Test Data
Unit tests should not affect the actual database. The framework provides a way to set up dummy records in memory.
1. Define a dummy ID and initialize an empty record.
2. Populate the necessary fields (e.g., `ShortTitle`, `Currency`, `WorkingBalance`) in the dummy record.
3. Use `UTF.setRecord()` to set the dummy record for a specific file.
   ```basic
   UTF.setRecord("F.ACCOUNT", id, record)
   ```

## Running the Test and Assertions
1. **Add Parameters**: Add the necessary input and return parameters to the target routine before running it.
   ```basic
   UTF.addParam(id)
   UTF.addParam(details)
   ```
2. **Run the Test**: Execute the subroutine using `UTF.runTest()`.
3. **Define Expected Results**: Define the expected output (e.g., a specific JSON string).
4. **Assert Equality**: Use an assertion method like `UTF.assertEquals()` to verify that the actual result matches the expected result.
   ```basic
   UTF.assertEquals(details, expected)
   ```

## Executing the Test
- To execute the test in Design Studio, right-click the `.tut` file and select **Run as -> BASIC UnitTest**.
- The UTF Results view will show whether the test succeeded or failed. 
- If a test fails (e.g., due to a mismatch in expected strings or formatting), the framework will detail the exact difference between the expected and actual values.
