# Temenos Connectors: How to Configure TC Server and TC Client

## Overview
This video by mathisi digital explains how to configure both TC Server and TC Client for Temenos Connectors, and how to monitor the TC Server activities.

## Monitoring TC Server
- **TC Monitor:** A graphical tool used to monitor all activities of a TC Server, including adapters, listeners, and active connections.
- **Telnet:** If TC Monitor is not available, you can use Telnet to connect to the TC Server daemon port (e.g., `telnet <IP> <PORT>`) and monitor sessions, transactions, and listener statuses.

## Processing OFS without TC Server
You can process OFS messages directly from `jshell` (`jsh`) without a running TC Server using the `TCS` program.
- Connect to jshell: `jsh t24 ~`
- Example command: `TCS BALOFS` (where `BALOFS` is a valid OFS source)
- Once invoked, you can paste OFS strings (e.g., `ENQUIRY.SELECT,,...`) directly into the console to get responses.

## Configuring TC Server (`tcserver.xml`)
The main configuration sections you deal with are **Adapters** and **Listeners** (and optionally **Formatters** if not using OFS).

### Adapters
- **ID:** Must be unique (e.g., `T24` or `TEST`).
- **MAX_SESSIONS:** Maximum number of concurrent sessions.
- **TIMEOUT:** Time (in seconds) the adapter will wait for T24 to process a transaction before timing out (e.g., 30 or 120 seconds).
- **Paths:** Path to the T24 home directory (`GLOBUS_PATH`) and jBASE home directory (`JBASEPATH`).
- **PROGRAM:** The program to execute (usually `TCS` for processing OFS).
- **PARAMETER:** The `OFS_SOURCE` (e.g., `BALOFS`).

### Listeners
- Defines how clients connect to the TC Server.
- Each listener is linked to a specific adapter via `<ADAPTERID>`.
- **Type:** Defines the connection protocol, e.g., `tcp` (for standard TC Client connections), `raw-tcp` (for testing purposes with clear text), or `MQ` (if using a queue manager).
- **Port:** The port number clients will connect to (e.g., `10001`).

## Configuring TC Client (`channels.xml`)
The TC Client configuration defines how the client connects to the listeners set up on the TC Server.
- **Channel Name:** Identify the channel (e.g., `browser.1`).
- **Type:** Match the listener type (e.g., `tcp`).
- **Port:** Must match the port defined in the corresponding TC Server listener (e.g., `10001`).
- **Hostname:** The hostname or IP address of the TC Server (e.g., `localhost` or `127.0.0.1`).
