# T24 Programming: Creating a Logger in jBC

## Overview
Writing text files (like txt, csv, log files, etc.) in Info Basic (jBC) is done in 3 main steps:
1. **Open file** using `OPENSEQ`
2. **Write data** to a file using `WRITESEQ`
3. **Close file** using `CLOSESEQ`

## Detailed Steps & Code Examples

### 1. Opening a File
To open a file and get a file pointer, use `OPENSEQ`. If the file doesn't exist, it will be created.

```basic
OPENSEQ '../bnk.log', log_file TO file_ptr THEN NULL
```
- `../bnk.log`: The directory path where the log file is stored.
- `log_file`: The name of the file to open.
- `file_ptr`: The pointer variable used to reference the opened file.
- `THEN NULL`: Empty block indicating no specific action is needed if the open is successful (as opposed to handling an `ELSE` condition).

### 2. Formatting Log File Names and Entries (Date and Time)
Log files usually need timestamping. You can use jBC functions `DATE()` and `TIME()` along with `OCONV` to format them.

```basic
* Format Date (T24 Format 'DG')
log_file = 'test_' : OCONV(DATE(), 'DG') : '.log'

* Format Time (Hours, Minutes, Seconds 'MTS')
log_line = OCONV(TIME(), 'MTS') : ' | ' : data
```

### 3. Writing Data to a File
Use `WRITESEQ` to write strings to the file using the file pointer. For log files, it's critical to use the `APPEND` keyword so previous logs aren't overwritten.

```basic
WRITESEQ log_line APPEND TO file_ptr ELSE 
    error = 'ERROR: Failed to write to ' : log_file
    RETURN
END
```
- `APPEND`: Appends the new line at the end of the file instead of overwriting the file.
- `ELSE`: Executes if the write operation fails, allowing you to handle the error.

### 4. Closing a File
Once the write operation is complete, close the file pointer using `CLOSESEQ` to free resources.

```basic
CLOSESEQ file_ptr
```

## Summary Example
A complete subroutine to log a message might look like this:

```basic
SUBROUTINE MX.Logger(data, error)
    error = ''
    log_file = 'test_' : OCONV(DATE(), 'DG') : '.log'
    
    OPENSEQ '../bnk.log', log_file TO file_ptr THEN NULL
    
    log_line = OCONV(TIME(), 'MTS') : ' | ' : data
    
    WRITESEQ log_line APPEND TO file_ptr ELSE
        error = 'ERROR: Failed to write to ' : log_file
    END
    
    CLOSESEQ file_ptr
    RETURN
END
```
