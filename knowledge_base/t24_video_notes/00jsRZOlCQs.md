# T24 Programming - Reading Files in Info basic (jBC)

**Presenter:** Aaron from Mathisi Digital

## Overview
This video covers how to work with text files (non-binary files like `.csv`, `.txt`, `.json`, `.xml`, etc.) in Info basic (jBC) for T24 development. 

## 3 Steps for Reading a File
Reading text files in info basic is done in 3 core steps:
1. **Open file** using `OPENSEQ`
2. **Read file** (one line at a time) using `READSEQ`
3. **Close file** using `CLOSESEQ`

## Code Example

Here is a simple program demonstrated in the video to read a CSV file named `transaction.csv` located in `../bnk.interface/EBANK.IN`:

```basic
PROGRAM MTD.ReadFile

dir = '../bnk.interface/EBANK.IN'
filename = 'transaction.csv'

OPENSEQ dir, filename TO ptr THEN
    LOOP
        READSEQ line FROM ptr ELSE BREAK
        CRT line
    REPEAT
END ELSE CRT 'Failed to open ': filename

CLOSESEQ ptr

END
```

### Explanation
* **OPENSEQ:** Takes two arguments: the directory path (`dir`) and the file name (`filename`). It returns a file pointer/descriptor (`ptr`). If the file does not exist, the file pointer will be null, and it jumps to the `ELSE` statement block, printing "Failed to open".
* **LOOP / REPEAT:** Used to create a continuous loop to read through the file.
* **READSEQ:** Reads a single line from the file pointer (`ptr`) and stores it in the `line` variable. If it cannot read anything (e.g., end of file), it triggers the `ELSE BREAK` to exit the loop, preventing an infinite loop.
* **CRT:** Prints the content to the screen. In a real-world scenario, you can replace this with custom logic (e.g., appending to an array or posting a transaction).
* **CLOSESEQ:** Always remember to close the file pointer at the end of operations to release system resources.

## T24 Commands Demonstrated
* `JED <dir> <filename>` - Used to create or edit the Basic program.
* `FI` - Save the file and exit the editor.
* `B` or `BASIC <dir> <filename>` - Compiles the basic program.
* `C` or `CATALOG <dir> <filename>` - Catalogs the program.
* Executing the program is simply done by typing its cataloged name into the T24 prompt.

## Additional Resources
Documentation for this lesson is hosted at [github.com/mathisi-io](https://github.com/mathisi-io) under their T24 documentation section.
