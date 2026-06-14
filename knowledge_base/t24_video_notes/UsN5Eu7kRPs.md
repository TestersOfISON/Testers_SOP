# Temenos T24 Administration: Close of Business (COB)

## Objectives
* Understand the purpose of COB and how it is configured.
* Learn the stages of COB in T24.
* Learn how to run and monitor the progress of COB in T24.

## What is COB?
COB (Close of Business) is an essential part of any bank's daily processing that must run on every business day. Key activities during COB include:
* Calculation and posting of interest.
* Production of various reports (e.g., trial balance).
* Execution of standing orders.
* Changing the business date. 

If COB is not run, the system will not be able to advance to the next business date.

## Stages of Close of Business
There are five main stages of COB in T24, executed sequentially:
1. **A - Application:** The system executes jobs related to individual applications like fund transfers, accounts, forex, and securities.
2. **S - System Wide:** Executes jobs that are common to T24, such as system-wide interest calculation and posting.
3. **R - Reporting:** The system generates different reports such as the trial balance.
4. **D - Start of Day:** Changes the system date to the next business date and performs other important activities like executing standing orders.
5. **O - Online:** Involves non-critical reporting and activities (like clearing temporary working files) that can be performed after the system has gone online.

## Configuring COB
COB runs as a background service in T24. The main configuration steps involve:
1. **Defining Holidays (`HOLIDAY` table):** Ensure bank holidays are properly defined so the system knows the valid business days. 
   * The table uses the ISO country code (e.g., LU for Luxembourg) and the year. 
   * You configure weekends (e.g., Saturday and Sunday) and specific dates as holidays. This prevents COB from expecting to run on non-working days and helps calculate the next valid business date.
2. **Configuring Batch Jobs (`BATCH` table):** COB executes jobs grouped into batches. 
   * Every batch related to COB must be assigned to one of the five stages (A, S, R, D, or O).
   * Batches contain one or multiple jobs. You can define job frequencies (e.g., Daily, Monthly, Ad-hoc). Ad-hoc jobs will not run unless their frequency is changed.
3. **Workload Profile (`TSA.WORKLOAD.PROFILE`):** This table is used to define the number of agents required to run COB. This profile is then linked to the COB service record in the `TSA.SERVICE` table.

## Running and Monitoring COB
To execute and track the COB process:
1. **Start TSM Service:** TSM (Temenos Service Manager) runs other services in the background. In the jShell, execute the command `START.TSM`.
   * For troubleshooting or error tracing, you can run `START.TSM -DEBUG`.
2. **Start COB Service:** In the `TSA.SERVICE` application, pull up the `COB` record and set the service control action to `START`.
3. **Monitor Progress:** Launch the `COB.MONITOR` application. This provides a real-time dashboard showing the progress of each stage, the number of processed batches vs. total batches, and the overall percentage completed.
4. **Error Handling:** If there is an error during COB, the status will show it. You can check the details in `EB.EOD.ERROR` (and in COMO logs), resolve the underlying issue, and then resume COB.
