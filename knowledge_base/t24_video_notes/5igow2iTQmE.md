# T24 Tips and Tricks: Enquiry Field Conversion and Calculation

This video tutorial from Mathisi Digital covers advanced techniques for manipulating fields in Temenos T24 Enquiries without the need for custom I-Descriptor routines or external conversion routines. Specifically, it demonstrates how to extract linked descriptions and concatenate multiple fields purely through configuration.

## 1. Field Conversion: Fetching Linked Descriptions
Instead of writing a custom routine, you can use the native **Link (`L`)** conversion function to fetch related descriptions directly from another application. 

**Scenario:** An Enquiry based on the `ACCOUNT` application has a `CATEGORY` field (which holds the numeric ID). We want to retrieve and display the actual text description of this category.
*   **Field Name:** `CATEG.NAME`
*   **Operation:** `CATEGORY`
*   **Conversion:** `L CATEGORY,DESCRIPTION`
*   **Explanation:** The `L` prefix indicates a Link conversion. It tells the system to link the value of the `CATEGORY` field to the `CATEGORY` application and extract its corresponding `DESCRIPTION` record.

## 2. Calculation: Concatenating Fields
You can combine multiple fields or static text into a single column using the `CALC` (or abbreviated `C`) operation, which borrows from InfoBasic's native concatenation syntax using the colon (`:`).

**Scenario:** We want a single column to display the Category ID and Category Name separated by a space (e.g., `1001 Current Account`) instead of two separate columns.

**Step 2a: Create a static Space field**
*   **Field Name:** `SPACE`
*   **Operation:** `" "` (Double quotes containing a single space)
*   **Explanation:** This creates a static field holding a space. Ensure this column is set not to display independently.

**Step 2b: Concatenate Category ID with the Space**
*   **Field Name:** `CATEG.SPACE`
*   **Operation:** `C CATEGORY : SPACE` (or `CALC CATEGORY : SPACE`)
*   **Explanation:** The `C` stands for calculate. It concatenates the numeric `CATEGORY` field and the static `SPACE` field using the colon (`:`), which is the InfoBasic concatenation operator.

**Step 2c: Concatenate the final string**
*   **Field Name:** `CATEG.SPACE.NAME`
*   **Operation:** `C CATEG.SPACE : CATEG.NAME`
*   **Explanation:** This combines the intermediate `CATEG.SPACE` field with the previously derived `CATEG.NAME` (the description). The final result is displayed as a unified column in the enquiry output.

### Summary
These native configuration steps allow T24 administrators and developers to build complex output columns directly within the `ENQUIRY` application, avoiding the performance and maintenance overhead of external programming routines.
