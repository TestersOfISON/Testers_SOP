# T24 Application Architecture: AA Arrangement Input via IRIS

Based on the analysis of the video demonstration by Shiraz Juneja, the following architectural details, application structure, and navigation flows define how T24 handles Arrangement Architecture (AA) inputs through IRIS.

## 1. Core Architecture & T24 Application Structure
*   **Arrangement Architecture (AA) Distinction**: AA arrangements are fundamentally different from standard T24 applications. They require a specialized, multi-step route to input new deals, unlike the simpler flow of normal T24 modules.
*   **IRIS RESTful Services**: T24 exposes its functionalities via IRIS as REST web services, operating primarily with XML payloads in this context.
*   **Resource Introspection & Deployment**: To make an AA activity available via IRIS, developers must:
    1.  Introspect a version of the `AA.ARRANGEMENT.ACTIVITY` application (e.g., `AA.NEW`).
    2.  Include these new resources in a RIM (Resource Integration Manager).
    3.  Rebuild the application WAR file.
    4.  Deploy it to the server. The endpoint then becomes available in the service list (e.g., `AaArrangementActivity_AaNew`).
*   **Product Lines Prerequisite**: A minimum requirement for creating AA deals is having at least one Product Line configured and available in T24 (e.g., the `LENDING` product line used for creating margin loans or mortgages).

## 2. Navigation & API Flow for AA Arrangements
Inputting a new arrangement is a stateful, multi-step process utilizing HATEOAS (Hypermedia as the Engine of Application State) principles:

1.  **Initialization (`/new`)**:
    *   A `POST` request is sent to the new service endpoint with specific query parameters defining the context.
    *   Example: `/AaArrangementActivity_AaNew/new?Product=MARGIN.LOAN&Activity=LENDING-NEW-ARRANGEMENT`.
    *   T24 returns a minimal XML schema outlining the basic fields and links to subsequent actions.

2.  **Population & Runtime Validation (`/populate`)**:
    *   The returned XML contains a `rel="populate"` link. This is the API equivalent of the `validate` method in the standard T24 browser UI.
    *   The client injects core preliminary data (e.g., Customer ID: `100260`, Currency: `USD`) into the minimal XML and sends a `POST` request to the `/populate` endpoint.
    *   T24 dynamically processes this at runtime and responds with a massive, fully expanded XML structure containing all the Property Classes relevant to that specific product and activity.

3.  **Submission (`/input`)**:
    *   Once the payload is enriched with all mandatory business data (e.g., filling in the `Amount` field), it is submitted via the `rel="input"` link.
    *   **Architectural Note**: This submission uses a `PUT` request rather than a `POST`. This is because the arrangement activity record has already been created and temporarily saved in T24 in an `INAU` (Input Unauthorised) status during the earlier steps.

## 3. Property Classes & UI Generation
*   **Dynamic Property Classes**: The response from the `/populate` call returns a granular breakdown of the arrangement into discrete Property Classes. Examples include `CUSTOMER`, `ACCOUNT`, `OFFICERS`, `INTEREST`, `PAYMENT SCHEDULE`, `MESSAGING`, `PAYOFF`, and `COMMITMENT`.
*   **Screen/Tab Rendering**: The XML payload explicitly includes property class attributes (e.g., identifying data as belonging to `AA_ARR_PAYOFF_PropertyClass`). User agents (frontends) rely entirely on these static property class attributes to determine how to visually partition the deal into tabs and split screens for the end-user.

## 4. Error Handling and Overrides
*   **Contextual Validation Errors**: If the `PUT` request is missing data, T24 returns specific error codes. Crucially, these errors are nested and mapped directly to the offending Property Class (e.g., a "MISSING MANDATORY PROPERTY" error for the `Amount` field will be specifically located within the `COMMITMENT` property class structure).
*   **Override Mechanism**: Business rule warnings (e.g., "MATURITY.DATE NOT A WORKING DAY") are returned as Overrides. To bypass these, the exact override code string from the response must be copied, injected into the designated `<Override>` XML node, and the `PUT` request must be re-sent to instruct T24 that the user has explicitly accepted the warning.
