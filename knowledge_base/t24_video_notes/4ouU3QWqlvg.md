# T24 Programming: How to create a logger in jBC

**Video ID:** 4ouU3QWqlvg
**Channel/Presenter:** Mathisi Digital / Aaron
**Topic:** Writing text files in InfoBasic (jBC) - Creating a logger

## Overview
This tutorial covers how to write to text files in jBC (InfoBasic), specifically focusing on creating a simple logging utility. Writing text files in InfoBasic involves three main steps:

1. **Open the file** using `OPENSEQ`
2. **Write data** to the file using `WRITESEQ`
3. **Close the file** using `CLOSESEQ`

## Creating a Logger
The video demonstrates building a subroutine `MX.Logger` that takes `data` and `err` as parameters. It writes the `data` string to a log file on the T24 server.

### 1. Opening the Log File
To write to a log file, you first need to open it and obtain a file pointer. If the file doesn't exist, `OPENSEQ` handles creating it.

```basic
log_file = 'test_' : OCONV(DATE(), 'DG') : '.log'
OPENSEQ '../bnk.log', log_file TO file_ptr THEN NULL
```

### 2. Formatting the Log Line
A typical log entry includes a timestamp. The tutorial uses the `TIME()` function, converted to a human-readable format (`MTS` for Hours, Minutes, Seconds).

```basic
log_line = OCONV(TIME(), 'MTS') : ' | ' : data
```

### 3. Writing Data
Use `WRITESEQ` to write the formatted log line to the file. The `APPEND` keyword ensures the new log entry is added to the end of the file without overwriting previous entries.

```basic
WRITESEQ log_line APPEND TO file_ptr ELSE err = 'ERROR: Failed to write to ' : log_file
```

### 4. Closing the File
Once the write operation is complete, it's crucial to close the file pointer to release system resources.

```basic
CLOSESEQ file_ptr
```

## Summary
The complete logging subroutine efficiently handles setting up the log file path, opening the file, formatting the log entry with a timestamp, appending the data, and securely closing the pointer.
