const qaModules = {
      "manual": {
        title: "User Manual & Guidelines",
        guidelines: `<h3>About This Tool</h3>
          <p style="font-size: 1.1rem; border-left: 4px solid var(--primary); padding-left: 15px; margin: 20px 0; background: rgba(37,99,235,0.05); padding: 15px;">
            <strong>Note:</strong> This is not a monitoring tool. It's a self evaluation tool which helps fellow testers to follow the prescribed standard operating procedure of the client, Libra Bank. Happy testing!
          </p>
          <h3>1. Application Layout & Navigation</h3>
          <p>The application consists of a persistent left-hand sidebar for navigation and a main content area for viewing guidelines, flowcharts, checklists, and documentation.</p>
          <ul class="guideline-list">
            <li><strong>Test Design & Management</strong>: Workflows for AI scenario generation and test validation.</li>
            <li><strong>Test Execution</strong>: Testing procedures across UAT, Smoke, PRL, and Regression.</li>
            <li><strong>Defect Management</strong>: Logging and processing workflows for Bugs and Incidents.</li>
            <li><strong>Specialized Testing</strong>: API, UI/UX, Smartwatch, and Mobile testing guidelines.</li>
          </ul>

          <h3>2. Authentication & Profiles</h3>
          <p>The application includes a profile-based logging system to ensure that all tasks, checklists, and notes are securely saved to your local device and synchronized with your assigned tasks.</p>
          <p><strong>How to Log In:</strong> If this is your first time using the application, you will need to create a profile.</p>
          <ol class="guideline-list" style="list-style-type: decimal; padding-left: 20px;">
            <li>Enter your desired <strong>Username</strong> (e.g., <code>Tester01</code>).</li>
            <li>Create and enter a secure <strong>4-digit PIN</strong> that you will use to log in going forward.</li>
            <li>Click <strong>Unlock</strong>. The system will register your new profile instantly!</li>
          </ol>
          <p style="font-size: 1.1rem; border-left: 4px solid var(--danger); padding-left: 15px; margin: 20px 0; background: rgba(239,68,68,0.05); padding: 15px;"><strong>IMPORTANT:</strong> Your session state is saved locally. If you see the ☁️🚫 icon, it means you are working offline. All progress is cached locally and will sync once you are back online.</p>

          <h3>3. Thematic Customization (Light Mode)</h3>
          <p>By default, the application runs in a beautifully designed Light mode which proudly displays the ISON and Libra logos in the background to make you feel right at home!</p>
          <ul class="guideline-list">
            <li><strong>Toggle Button</strong>: If you prefer, you can click the 🌙/☀️ icon in the top right corner to instantly switch to the dark theme.</li>
            <li>Your preference is saved and will automatically apply upon your next visit.</li>
          </ul>

          <h3>4. SOP Checklists & Progress Management</h3>
          <p>Each module includes actionable checklists and standard operating procedures. As you progress through a module, your completion status is dynamically logged.</p>
          <ul class="guideline-list">
            <li><strong>Checkboxes</strong>: Click the checkboxes next to each SOP item to mark it as completed.</li>
            <li><strong>Progress Bar</strong>: The progress bar at the top of the checklist visually displays your module progress (e.g., "75% - 3 of 4 items checked").</li>
            <li><strong>Notes & Flags</strong>: Click the 📝 icon next to any checklist item to add a specific note or flag a risk for that step.</li>
          </ul>

          <h3>5. Global Search</h3>
          <p>Looking for a specific procedure, like "API Testing" or "UAT"? Use the <strong>Global Search</strong> bar located in the top navigation menu. It provides real-time, fuzzy-search suggestions across all guidelines, templates, and checklists to help you find exactly what you need in seconds.</p>`,
        mermaid: ``,
        checklist: null,
        templates: ""
      },
      "ai_generation": {
        title: "AI Scenario Generation via UiPath",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Tools:</strong> Access UiPath Test Manager via Jira Link or URL. Authentication via email.</li>
            <li><strong>Context:</strong> ALWAYS select relevant documents (attachments/US description) for the context.</li>
            <li><strong>Evaluation:</strong> Perform Initial Evaluation (Relevance, logic, coverage) -> Detailed Evaluation (Ethics, prerequisites, acceptance criteria).</li>
            <li><strong>Integration:</strong> Saving in Test Manager automatically pushes scenarios to Jira in 'Drafturi Test Manager' Xray folder.</li>
            <li><strong>Refinement:</strong> Ensure proper limits (Max 50 steps), positive/negative constraints, and expected behavior. Tester remains final owner.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Open Test Manager via Jira/URL"] --> B["Select Prompt (Positive/Negative)"]
            B --> C["Provide Context (Attach docs)"]
            C --> D["Generate Tests (Claude model)"]
            D --> E["Initial Evaluation (Logic/Relevance)"]
            E --> F{"Acceptable?"}
            F -- No --> G["Adjust Prompt & Context"] --> D
            F -- Yes --> H["Detailed Evaluation & Refine Steps"]
            H --> I["Click 'Create tests'"]
            I --> J["Tests auto-push to Jira 'Drafturi'"]
            J --> K["Assign to Self & Move to Scrum Subfolder"]`,
        checklist: {
          entry_criteria: [
            "Login to UiPath Test Manager using QA Email.",
            "Select appropriate prompt from library.",
            "Select User Story attachments for context."
          ],
          exit_criteria: [
            "Perform Initial Evaluation for logical errors and relevance.",
            "Complete Detailed Evaluation and refine test steps.",
            "Verify tests are pushed to Jira Xray folder successfully.",
            "Change Assignee to self and move tests to proper Scrum folder."
          ]
        },
        templates: `<div class="code-block">Approved Prompts in Test Manager:
- Positive Scenario Test Creator
- Negative Scenario Test Creator
- Non-functional Test Case Generator
- UI/UX Non-functional Test Generator</div>`
      },
      "test_design": {
        title: "Test Design & Xray Management",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Structure:</strong> Max 50 steps per LX. 3 columns: Action, Data, Expected Result.</li>
            <li><strong>Naming:</strong> ScrumName - USName - [scenario type] (positive, negative, regression, smoke, non-functional).</li>
            <li><strong>Call Test:</strong> Use to re-use common blocks (e.g., Login, Logout) and avoid duplication.</li>
            <li><strong>Archiving:</strong> Move outdated or unneeded LXs to the 'Arhivate' folder with 'Archived' status instead of deleting.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Analyze US/Requirement"] --> B{"Common steps?"}
            B -- Yes --> C["Use Call Test function"]
            B -- No --> D["Write new steps manually"]
            C & D --> E{"Exceeds 50 steps?"}
            E -- Yes --> F["Split into multiple LXs (Part1, Part2)"]
            E -- No --> G["Set Labels (US number, scenario type)"]
            G --> H["Link Issue to US"]
            H --> I["Test creation complete"]`,
        checklist: {
          entry_criteria: [
            "Complete a 'User Story Comprehension Walkthrough' (As Is vs To Be) with the QA Lead.",
            "Verify functional requirements & specifications are clear.",
            "Confirm Xray folder structure is set up for the Scrum team."
          ],
          exit_criteria: [
            "Verify LX names follow 'ScrumName - USName - type' format.",
            "Confirm LXs are linked to the corresponding User Story in Jira.",
            "Ensure no single LX exceeds 50 steps.",
            "Ensure correct labels are added to each LX."
          ]
        },
        templates: `<div class="code-block">Example LX Name:
Creatio - Non-resident individual client without card with high risk degree (D-E) - positive scenario 1

Mandatory Labels:
- US Number (e.g., SCRT-6538)
- Scenario Type (e.g., positive, negative, regression, smoke, non-functional)</div>`
      },
      "scenario_validation": {
        title: "Scenario Validation",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Responsibility:</strong> Tester transmits scenarios for validation to PO, Application Owner, and Project Beneficiary.</li>
            <li><strong>Exceptions:</strong> Scenarios for Incidents DO NOT require PO validation.</li>
            <li><strong>Wait:</strong> DO NOT execute testing on UAT until scenarios are validated by the PO.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Test Scenarios Written"] --> B["Send for Validation"]
            B --> C{"Is it an Incident?"}
            C -- Yes --> D["Skip Validation -> Proceed to Testing"]
            C -- No --> E["PO / App Owner / Beneficiary Reviews"]
            E --> F{"Approved?"}
            F -- No --> G["Update Scenarios"] --> B
            F -- Yes --> H["Scenarios Validated -> Proceed to Testing"]`,
        checklist: {
          entry_criteria: [
            "Compile all created LXs for the US.",
            "Send notification/email to PO, App Owner, Beneficiary."
          ],
          exit_criteria: [
            "Receive explicit approval from PO.",
            "Update any scenarios as per feedback."
          ]
        },
        templates: ""
      },
      "uat": {
        title: "UAT Testing Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Prerequisites:</strong> Test scenarios must be validated in Jira by PO.</li>
            <li><strong>Scope:</strong> Execute ALL LXs created for the US (Happy path, negative, UI/UX, etc.).</li>
            <li><strong>Execution Rule:</strong> All steps must have PASS status. Evidence is NO LONGER required unless a bug occurs.</li>
            <li><strong>Bugs:</strong> Development environment must be set to 'UAT'.</li>
            <li><strong>Completion:</strong> After UAT, US status goes to 'Approval Required' for the DEMO.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["US status: Ready for Testing"] --> D{"LX Validation by PO?"}
            D -- Yes --> D1{"Sub-Task Exists?"}
            D -- No --> W["Wait for validation"] --> D1
            D1 -- Yes --> C["Modify Estimate"]
            D1 -- No --> D2["Create Sub-Task"] --> C
            C --> F["Execute all LXs"]
            F --> G{"All steps pass?"}
            G -- No --> H["Open Bug - Env: UAT"] --> I["Bug status: Ready for testing"] --> J["Retest"]
            J --> K{"Fixed?"}
            K -- Yes --> L["Mark sub-test execution: Done"]
            K -- No --> J
            G -- Yes --> L
            L --> N["US Status: Approval Required"] --> O["Hold DEMO"]`,
        checklist: {
          entry_criteria: [
            "Verify Test Scenarios are Validated by PO.",
            "Verify/Create 'UAT Testing' Sub-Test Execution.",
            "Modify 'Original Estimate' to actual time."
          ],
          exit_criteria: [
            "Execute ALL test scenarios (No 'Aborted' statuses without comment).",
            "If Bug found: Create Issue with Env 'UAT'. (If applicable)",
            "Retest all bugs after Dev fix. (If applicable)",
            "Transition US to 'Approval Required'."
          ]
        },
        templates: ""
      },
      "smoke": {
        title: "Smoke Testing (PRL)",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Environment:</strong> PRL. Should be executed after deployment of each new build on Prelive.</li>
            <li><strong>Scope:</strong> Run at Epic level. Need not to run on all User stories. Use only LXs from 'Smoke Tests' folders.</li>
            <li><strong>Failure Rule:</strong> If an LX fails, all testing on the build should be halted until fixed.</li>
            <li><strong>Bugs:</strong> Must have Label: 'Smoke' & Env: 'Prelive'.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["New build on Prelive"] --> B["Create Smoke Sub-Task"]
            B --> C["Add LXs from Smoke Tests folder"]
            C --> D["Execute Scenarios"]
            D --> E{"Step Fail?"}
            E -- Yes --> F["Stop Testing & Open Bug"]
            F --> G["Bug status: Ready for testing"] --> H["Retest"] --> I{"Fixed?"}
            I -- Yes --> D
            I -- No --> H
            E -- No --> K["Proceed to PRL Testing"]`,
        checklist: {
          entry_criteria: [
            "Create 'Smoke PRL Testing' Sub-Task.",
            "Add ONLY LXs from 'Smoke Tests' folder."
          ],
          exit_criteria: [
            "Execute. Interrupt immediately if any step fails.",
            "If Bug: Label 'Smoke', Env 'Prelive'. (If applicable)"
          ]
        },
        templates: ""
      },
      "prl": {
        title: "PRL (Prelive) Testing",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Prerequisites:</strong> Smoke Testing must be successfully finalized (All PASS).</li>
            <li><strong>Scope:</strong> Run at least one Happy Path LX.</li>
            <li><strong>Retesting Rule:</strong> Mandatory to retest UAT bugs with 'Major' or 'Blocker' severity. Check the 'Retested in Prelive' box.</li>
            <li><strong>Bugs:</strong> Development environment must be set to 'Prelive'.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Smoke Test Passed"] --> B["Create PRL Testing Sub-Task"]
            B --> C["Add Happy Path LXs"]
            C --> D["Retest UAT Major/Blocker Bugs"]
            D --> E{"Bugs Fixed in PRL?"}
            E -- Yes --> F["Check 'Retested in Prelive'"] --> G["Execute Happy Path"]
            E -- No --> H["Re-open Bug"]
            G --> I{"All Pass?"}
            I -- Yes --> J["Ready for Regression"]
            I -- No --> K["Open Bug - Env: Prelive"]`,
        checklist: {
          entry_criteria: [
            "Verify Smoke Testing is 100% PASS.",
            "Add Happy path LX(s) to Sub-Test Execution."
          ],
          exit_criteria: [
            "Retest UAT bugs (Major/Blocker severity ONLY). (If applicable)",
            "Check 'Retested in Prelive' for verified bugs. (If applicable)",
            "Execute Happy path LXs."
          ]
        },
        templates: ""
      },
      "regression": {
        title: "Regression Testing",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Environment:</strong> Last testing stage in Prelive. Run at Epic level.</li>
            <li><strong>Scope:</strong> Re-executing tests to verify recent changes haven't broken existing functions. Use LXs from 'Regression Tests' folders.</li>
            <li><strong>Bugs:</strong> Bugs reported here must have the 'regression' label and Env 'Prelive'.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["PRL Testing Finished"] --> B["Create Regression Sub-Task"]
            B --> C["Add LXs from Regression folder"]
            C --> D["Execute Regression Suite"]
            D --> E{"Step Fail?"}
            E -- Yes --> F["Open Bug - Label: regression"]
            F --> G["Dev Fixes & Retest"]
            E -- No --> H["US Ready for Release"]`,
        checklist: {
          entry_criteria: [
            "Create 'Regression PRL Testing' Sub-Task.",
            "Add LXs from 'Regression Tests' folder."
          ],
          exit_criteria: [
            "Execute all regression scenarios.",
            "If Bug: Label 'regression', Env 'Prelive'. (If applicable)"
          ]
        },
        templates: ""
      },
      "bugs": {
        title: "Bugs Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Reporting:</strong> Open directly from LX test step execution (attaches automatically) OR at Scrum level.</li>
            <li><strong>Categories:</strong> Bug, Gap, Settings, Non-bug, Incomplete specs, Legacy, Performance, UI/UX.</li>
            <li><strong>Evidence:</strong> Attaching evidence (Printscreen/Video) is MANDATORY for bugs.</li>
            <li><strong>Retesting:</strong> Tester who reported the bug must retest it after DEV marks it 'Ready for testing'.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Bug Identified"] --> B{"In LX?"}
            B -- Yes --> C["Open from LX Step"]
            B -- No --> D["Open at Scrum Level"]
            C & D --> E["Fill Severity, Env, Image"]
            E --> F["Status: Open"] --> G["Status: In Progress"] --> H["Status: Ready for testing"]
            H --> I["Tester Retests"]
            I --> J{"Fixed?"}
            J -- Yes --> K["Status: Finalized"]
            J -- No --> L["Status: Re-open"] --> G`,
        checklist: {
          entry_criteria: [
            "Complete Pre-Bug Checklist (Verify test data validity, cross-check against AC, search for duplicates).",
            "Attempt to reproduce the bug.",
            "Select Correct Category and Reproducibility (Always/Sometimes).",
            "Select Severity (Trivial, Minor, Medium, Major, Blocker)."
          ],
          exit_criteria: [
            "Fill 'Steps to reproduce', 'Actual result', 'Expected result'.",
            "Attach Screenshot or Video evidence."
          ]
        },
        templates: `
          <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 15px; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #d97706;">🐛 AI Bug Report Beautifier</h3>
            </div>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              
              <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                <h4 style="margin-top: 0; margin-bottom: 10px; color: var(--text-color);">1. Raw Notes</h4>
                <p style="font-size: 0.85rem; color: #777; margin-top: 0;">Fill in the details. PII is scrubbed locally before hitting the AI.</p>
                
                <label style="font-size: 0.85rem; font-weight: bold; margin-bottom: 5px;">Title</label>
                <input type="text" id="bug-title-input" class="form-input" style="margin-bottom: 15px; padding: 8px;" placeholder="e.g. Transfer crash on MM">
                
                <label style="font-size: 0.85rem; font-weight: bold; margin-bottom: 5px;">Description (Expected / Actual Result)</label>
                <textarea id="bug-desc-input" class="form-input" style="min-height: 80px; resize: vertical; padding: 8px; margin-bottom: 15px; font-family: monospace;" placeholder="Expected success, actual 500 error"></textarea>
                
                <label style="font-size: 0.85rem; font-weight: bold; margin-bottom: 5px;">Steps to Reproduce</label>
                <textarea id="bug-steps-input" class="form-input" style="min-height: 100px; resize: vertical; padding: 8px; font-family: monospace;" placeholder="Navigate to link, click transfer..."></textarea>
                
                <button class="btn btn-primary" style="margin-top: 15px; width: 100%; background: #d97706;" onclick="formatBugReport()">Scrub & Beautify ✨</button>
              </div>

              <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                <h4 style="margin-top: 0; margin-bottom: 10px; color: var(--text-color);">2. Formatted Bug Report / AI QA</h4>
                <p style="font-size: 0.85rem; color: #777; margin-top: 0;">Confluence format or AI follow-up questions.</p>
                <textarea id="bug-formatted-output" class="form-input" style="flex-grow: 1; min-height: 250px; resize: none; padding: 10px; font-family: monospace; background: rgba(0,0,0,0.02);" readonly placeholder="Result will appear here..."></textarea>
                <button class="btn btn-success" style="margin-top: 15px; width: 100%;" onclick="copyBugReport()">Copy to Clipboard 📋</button>
              </div>

            </div>
          </div>
        `
      },
      "incidents": {
        title: "Incidents Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Definition:</strong> An unplanned interruption identified in Live (Production).</li>
            <li><strong>Workflow:</strong> Testing is required in both UAT and PRL environments.</li>
            <li><strong>Exceptions:</strong> Scenarios for Incidents DO NOT require PO validation. A DEMO meeting is NOT held. Evidence is NOT required.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Incident Identified in Live"] --> B["Create 'Defining Scenarios' Sub-task"]
            B --> C["Identify/Create LX (Label: Incident)"]
            C --> D["Create UAT Testing Sub-task"]
            D --> E["Execute UAT Tests"]
            E --> F["Create PRL Testing Sub-task"]
            F --> G["Execute PRL Tests"]
            G --> H{"Fixed?"}
            H -- Yes --> I["Status: Ready for Release"]
            H -- No --> J["Re-open Bug / Return to Dev"]`,
        checklist: {
          entry_criteria: [
            "Identify Incident ticket in Jira.",
            "Create 'Defining Scenarios' sub-task.",
            "Create or assign testing LXs with 'Incident' label."
          ],
          exit_criteria: [
            "Execute testing in UAT environment.",
            "Execute testing in PRL environment.",
            "Transition Incident to Ready for Release without PO validation or DEMO."
          ]
        },
        templates: ""
      },
      "api_testing": {
        title: "API Testing Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Tools:</strong> Postman or Swagger UI.</li>
            <li><strong>Swagger UI:</strong> Used for quick endpoint validation, automatic client SDK generation, and server stubs (via Swagger Codegen).</li>
            <li><strong>Postman:</strong> Used for executing endpoint collections, modifying JSON bodies, and setting up Auth tokens.</li>
            <li><strong>Execution:</strong> Import collections, configure auth, run endpoint, and modify request payload body.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["API Testing Task Assigned"] --> B{"Choose Tool"}
            B -- Swagger --> C["Open Swagger UI URL"]
            B -- Postman --> D["Open Postman"]
            C --> E["Execute Endpoint & Verify"]
            D --> F["Import API Collection"]
            F --> G["Set Authentication (Bearer/Basic)"]
            G --> H["Modify Request Body"]
            H --> E
            E --> I{"Response 200 OK?"}
            I -- Yes --> J["API Test Passed"]
            I -- No --> K["Log API Bug"]`,
        checklist: {
          entry_criteria: [
            "Obtain API collection / Swagger URL.",
            "Configure Auth token/Bearer token."
          ],
          exit_criteria: [
            "Run endpoint successfully and verify status code (200 OK).",
            "Validate response payload structure and data fields.",
            "Document parameters and request/response in test case."
          ]
        },
        templates: `<div class="code-block">Swagger URLs:
- ibk-test.libra.bank/IBK_WEB_API_DEV2/
- https://ibk-test.libra.bank/WEBAPI_IMBK_13287//swagger/ui/index#/</div>`
      },
      "ui_ux": {
        title: "UI/UX & Smartwatch Testing",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Smartwatch Scope:</strong> Verify interaction, synchronization, and stability between the phone and smartwatch (Notifications, Bluetooth pairing, connection loss, user feedback).</li>
            <li><strong>Mobile UI/UX:</strong> Special attention to design consistency, state management, screen resizing/orientation, gesture interactions, dark mode, and Romanian/English localization.</li>
            <li><strong>Feedback:</strong> Verify haptic, visual, and auditory responses are immediate and correct.</li>
            <li><strong>Compatibility:</strong> Run tests on various smartwatch models (Apple Watch, Samsung Galaxy Watch).</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Mobile/Smartwatch Build Ready"] --> B["Pair Phone & Smartwatch via Bluetooth"]
            B --> C["Trigger App Notifications"]
            C --> D{"Sync Successful?"}
            D -- No --> E["Log Sync Bug"]
            D -- Yes --> F["Test Connection Loss & Reconnection"]
            F --> G["Test UI/UX Gestures & Responses"]
            G --> H["Verify Haptic/Visual Feedback"]
            H --> I["Validation Complete"]`,
        checklist: {
          entry_criteria: [
            "Connect physical device to laptop via ApowerMirror.",
            "Enable Bluetooth pairing between phone and smartwatch.",
            "Install correct mobile app build."
          ],
          exit_criteria: [
            "Verify data sync (notifications, read/unread states) on smartwatch.",
            "Verify notification display (emojis, links, formatting).",
            "Verify smartwatch compatibility (Apple Watch, Samsung Galaxy Watch).",
            "Validate UI/UX adaptability, dark mode, and localization (RO/EN)."
          ]
        },
        templates: ""
      },
      "integrated": {
        title: "Integrated Testing Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Scope:</strong> Required when a project involves multiple teams (e.g., Core Banking + Frontend).</li>
            <li><strong>Creation:</strong> Must create 'Integrated testing' issue type and corresponding Xray sub-folders.</li>
            <li><strong>Execution:</strong> Conducted sequentially in UAT and PRL, coordinating between involved scrum teams.</li>
            <li><strong>Bugs:</strong> Bug reporting must clearly state the integrated nature and be assigned to the proper component/team.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Cross-team Feature"] --> B["Create 'Integrated testing' Issue"]
            B --> C["Create Xray sub-folder"]
            C --> D["Define cross-team scenarios"]
            D --> E["UAT Integrated Testing"]
            E --> F["PRL Integrated Testing"]
            F --> G{"Bugs found?"}
            G -- Yes --> H["Open Integrated Testing Bug -> Assign to specific team"]
            G -- No --> I["Finalized Integrated Testing"]`,
        checklist: {
          entry_criteria: [
            "Create 'Integrated testing' Issue type in Jira.",
            "Create a dedicated Xray sub-folder.",
            "Define cross-system test scenarios."
          ],
          exit_criteria: [
            "Execute UAT Integrated testing.",
            "Execute PRL Integrated testing.",
            "Coordinate bug reporting with the responsible team."
          ]
        },
        templates: ""
      },
      "mobile": {
        title: "Mobile Testing Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Scope:</strong> iOS, Android, Huawei (Real physical devices only). Also covers Smartwatch testing if applicable.</li>
            <li><strong>Execution:</strong> UAT, PRL, and Regression tests run on iOS and Android. Smoke tests run on ALL THREE (including Huawei).</li>
            <li><strong>Language:</strong> Must verify both Romanian and English language pages within the same scenario.</li>
            <li><strong>Tools:</strong> Use ApowerMirror for screen projection and capturing bug evidence.</li>
            <li><strong>UI/UX:</strong> Special attention to design consistency, state management, and gesture interactions.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Mobile Build Ready"] --> B["Install App via ApowerMirror"]
            B --> C["Execute on iOS"]
            B --> D["Execute on Android"]
            B --> E["Execute on Huawei - Smoke Only"]
            C & D & E --> F{"Bug Found?"}
            F -- Yes --> G["Record/Screenshot via ApowerMirror"] --> H["Open Bug"]
            F -- No --> I["Testing Complete"]`,
        checklist: {
          entry_criteria: [
            "Connect devices to PC via ApowerMirror."
          ],
          exit_criteria: [
            "Execute scenarios on iOS physical device.",
            "Execute scenarios on Android physical device.",
            "Execute Smoke tests on Huawei device.",
            "Verify UI/UX adaptability (Resizing, dark mode, gestures).",
            "Verify both RO and EN localizations."
          ]
        },
        templates: ""
      },
      "agile": {
        title: "Agile / Scrum Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Role of Tester:</strong> Analyzes US, participates in Ceremonies (Daily, Planning, Review, Retrospective), reports bugs, executes tests.</li>
            <li><strong>Estimates:</strong> Testing effort must be estimated in Story Points alongside dev effort.</li>
            <li><strong>Testing Stages:</strong> Defining scenarios in sprint -> UAT execution -> Bug reporting -> Demo.</li>
            <li><strong>Escalation:</strong> Immediately escalate to TLTesting@librabank.ro if blockages appear.</li>
          </ul>
          <br/>
          <h3>Estimates in Agile\\SCRUM (Story Points Estimation)</h3>
          <p>How user stories are estimated in story points:</p>
          <ol class="guideline-list" style="list-style-type: decimal; padding-left: 20px;">
            <li><strong>A baseline reference is chosen:</strong> Each team refers to the reference user stories.</li>
            <li><strong>Complexity is analyzed:</strong> The total effort necessary for completion is considered, including: complexity, duration, uncertainty.</li>
            <li><strong>The modified Fibonacci sequence is used:</strong> The values are: 1, 2, 3, 5, 8, 13 SP.</li>
            <li><strong>The estimation is done as a team (Planning Poker):</strong> Each member votes. Differences are discussed and re-voted. If a US exceeds 20 SP, it should be split. Estimation must include both testing and development effort.</li>
          </ol>
          <br/>
          <p><strong>Example Estimates:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem;">
            <tr style="background: var(--bg-color); border-bottom: 2px solid var(--border);">
              <th style="padding: 8px; text-align: left;">Story Point</th>
              <th style="padding: 8px; text-align: left;">Defining Scenarios</th>
              <th style="padding: 8px; text-align: left;">UAT Testing</th>
              <th style="padding: 8px; text-align: left;">PRL Testing</th>
              <th style="padding: 8px; text-align: left;">Total</th>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 8px;">1 SP</td><td style="padding: 8px;">30m</td><td style="padding: 8px;">45m</td><td style="padding: 8px;">15m</td><td style="padding: 8px;">1.5h</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 8px;">2 SP</td><td style="padding: 8px;">1h</td><td style="padding: 8px;">1.5h</td><td style="padding: 8px;">0.5h</td><td style="padding: 8px;">3h</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 8px;">3 SP</td><td style="padding: 8px;">1h</td><td style="padding: 8px;">2.5h</td><td style="padding: 8px;">1h</td><td style="padding: 8px;">4.5h</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 8px;">5 SP</td><td style="padding: 8px;">2h</td><td style="padding: 8px;">4h</td><td style="padding: 8px;">1.5h</td><td style="padding: 8px;">7.5h</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 8px;">8 SP</td><td style="padding: 8px;">3h</td><td style="padding: 8px;">7h</td><td style="padding: 8px;">2h</td><td style="padding: 8px;">12h</td>
            </tr>
          </table>
          <p style="font-size: 0.8rem; margin-top: 10px;"><em>* IMPORTANT: These values are purely indicative, each team adjusts its estimates based on experience.</em></p>`,
        mermaid: `flowchart TD
            A["Sprint Planning"] --> B["Analyze US & Story Points"]
            B --> C["Sprint Backlog Created"]
            C --> D["Define Test Scenarios"]
            D --> E["Daily Scrum"]
            E --> F["UAT Execution"]
            F --> G["Demo"]
            G --> H["Sprint Retrospective"]`,
        checklist: {
          entry_criteria: [
            "Provide Story Point estimation during Sprint Planning.",
            "Define Test scenarios based on US Acceptance Criteria.",
            "Attend Daily Scrum and report blockers."
          ],
          exit_criteria: [
            "Execute UAT during the sprint timeline.",
            "Prepare for and hold Demo."
          ]
        },
        templates: ""
      },
      "demo": {
        title: "DEMO Presentation",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Purpose:</strong> Obtain acceptance from PO and Beneficiary after UAT testing.</li>
            <li><strong>Preview:</strong> For complex projects, a DEMO Preview meeting/email is required 1 day before.</li>
            <li><strong>Data:</strong> Do not use manipulated test data. Use data as close to production as possible.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["UAT Complete"] --> B["US Status: Approval Required"]
            B --> C{"Complex Project?"}
            C -- Yes --> D["Hold DEMO Preview Meeting"]
            C -- No --> E["Send DEMO Preview Email"]
            D & E --> F["Scrum Master Invites Team"]
            F --> G["Hold Official DEMO"]
            G --> H{"Acceptance?"}
            H -- Yes --> I["Transition to Final Test"]
            H -- No --> J["Return to In Testing"]`,
        checklist: {
          entry_criteria: [
            "Verify test scenarios are PO validated.",
            "Check for open bugs (escalate Blockers to TL).",
            "Confirm all Acceptance Criteria are met."
          ],
          exit_criteria: [
            "Prepare realistic Test Data (no DB manipulation).",
            "Verify environment stability before meeting."
          ]
        },
        templates: `<div class="code-block">DEMO Preview Email:
Subject: Validation of flows presented in the DEMO meeting
To: Product Owner, Beneficiary
CC: BA, Tester, TL

Hello,
We wish to inform you regarding the flows that will be included in the DEMO:
- User Stories: [List]
- Scenarios: [List]
- Known limitations: [List]
- Unresolved bugs: [List]

Please send observations before the meeting.</div>`
      },
      "timelogging": {
        title: "Logging Time & Team Back-up",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Logging:</strong> Time MUST be logged daily in Jira for accountability.</li>
            <li><strong>Out of Project:</strong> Log time in Jira tasks correctly even if working outside the main team/project.</li>
            <li><strong>Back-up System:</strong> Testers have a primary team and a secondary back-up team allocation.</li>
            <li><strong>Workload:</strong> Must ensure activity across both teams to maintain KPI targets and monthly productivity.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Daily Work Started"] --> B["Work on Primary Team Tasks"]
            B --> C{"Primary Team Blocked?"}
            C -- Yes --> D["Switch to Secondary (Back-up) Team"]
            C -- No --> E["Continue Primary"]
            D & E --> F["End of Day"]
            F --> G["Log Time in Jira (Tasks/Sub-tasks)"]
            G --> H["Verify Monthly Productivity KPI"]`,
        checklist: {
          entry_criteria: [
            "Verify primary team workload.",
            "Check secondary team board if primary is blocked.",
            "Ensure Terramind activity tracking is active."
          ],
          exit_criteria: [
            "Log hours in Jira for all executed tasks at the end of the day."
          ]
        },
        templates: ""
      },
      "waterfall": {
        title: "Waterfall Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Methodology:</strong> Linear stages. Testing begins ONLY after code is completely developed.</li>
            <li><strong>Documentation:</strong> Scenarios defined only after FSD/TDD documentation is approved.</li>
            <li><strong>Estimation:</strong> 2 stages. High-level initially, then detailed using the Testing Estimation Form .xlsx (Optimistic, Pessimistic, Most Likely).</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Requirements Analysis"] --> B["System Design"]
            B --> C["Implementation/Coding"]
            C --> D["Testing Phase"]
            D --> E["Write Test Scenarios"] --> F["Execute Tests"]
            F --> G["Launch / Go Live"]`,
        checklist: {
          entry_criteria: [
            "Provide High-Level estimate during Requirements stage.",
            "Provide Detailed estimate (Optimistic/Pessimistic) via Excel.",
            "Write scenarios based on approved FSD/TDD.",
            "Wait for Development Phase to completely finish."
          ],
          exit_criteria: [
            "Execute functional and integration testing."
          ]
        },
        templates: ""
      }
    };