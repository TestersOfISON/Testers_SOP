# Multithreading and Service in Temenos T24

This video tutorial covers how to create multi-threaded routines in the Temenos T24 Core Banking System, how to configure them as online services, and how to add them to the Close of Business (COB) process.

## Objectives
* Create multi-threaded routines in T24.
* Create and run an online service in T24.
* Add a service to the COB process.

## Multi-Threaded Routines Structure
To create a multi-threaded routine, you need to structure your code into four specific parts. `BATCH.JOB.CONTROL` uses this structure to split and manage the threads simultaneously.

1. **`<RTN.NAME>.LOAD`**: Performs initialization and file opening.
2. **`<RTN.NAME>.SELECT`**: Prepares a file containing all the IDs to be processed by the job.
3. **`<RTN.NAME>`**: The main job routine that receives one argument (the ID of the record to be processed).
4. **`I_<RTN.NAME>.COMMON`**: An insert file containing all shared initialized variables (common area).

## Steps to Implement Multithreading and Services

### 1. Create Multi-threaded Routines
* Split your single routine into the `<RTN.NAME>.LOAD`, `<RTN.NAME>.SELECT`, `<RTN.NAME>`, and `I_<RTN.NAME>.COMMON` routines.
* In the `.COMMON` insert file, define the common variables using the `COMMON` keyword (e.g., `COMMON /<RTN.NAME>/ ...`). Include this insert file in all subroutines.
* In the `.LOAD` routine, open necessary files and initialize variables.
* In the `.SELECT` routine, use `EB.READLIST` to fetch the records to be processed and call `BATCH.BUILD.LIST` to supply the list of keys to the job.
* Compile and catalog all the routines using `BASIC` and `CATALOG`.

### 2. Create a Type Record in PGM.FILE
* Create a `PGM.FILE` record for the main routine.
* Set the `TYPE` to `B` (Batch).

### 3. Create a BATCH Record
* Create a record in the `BATCH` application.
* Set the `JOB.NAME` to your routine's name (`<RTN.NAME>`).
* Define the execution mode and frequency.

### 4. Create a Record in TSA.SERVICE
* Create a record in `TSA.SERVICE` with the same name as the batch record.
* Configure the `WORK.PROFILE` to define how the service is run. Set the `SERVICE.CONTROL` to `START` to start the service.

## Testing and Execution
* To test the service online without COB, you can start the TSM (Temenos Service Manager) service using `START.TSM -DEBUG`.
* Start your newly created service from `TSA.SERVICE`.
* You can also monitor the process using `COB.MONITOR` if the routine is added to the COB process, which shows the progress and execution of different threads.
