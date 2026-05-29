import re

def update_html():
    with open('Gemini01.html', 'r', encoding='utf-8') as f:
        content = f.read()

    new_sidebar = """  <aside class="sidebar">
    <div class="sidebar-header">QA Confluence Master</div>
    
    <button class="accordion active">Test Design & Management</button>
    <div class="panel" style="max-height: 500px;">
      <button class="panel-btn active-module" onclick="loadModule('ai_gen')">AI Test Generation</button>
      <button class="panel-btn" onclick="loadModule('xray_rules')">Xray Test Repository</button>
      <button class="panel-btn" onclick="loadModule('scenario_validation')">Scenario Validation</button>
    </div>

    <button class="accordion">Test Execution</button>
    <div class="panel">
      <button class="panel-btn" onclick="loadModule('uat')">1. UAT Testing</button>
      <button class="panel-btn" onclick="loadModule('smoke')">2. Smoke Testing (PRL)</button>
      <button class="panel-btn" onclick="loadModule('prl')">3. PRL Testing</button>
      <button class="panel-btn" onclick="loadModule('regression')">4. Regression Testing</button>
    </div>

    <button class="accordion">Defect Management</button>
    <div class="panel">
      <button class="panel-btn" onclick="loadModule('bugs')">Bugs Workflow</button>
      <button class="panel-btn" onclick="loadModule('incidents')">Incidents Workflow</button>
    </div>

    <button class="accordion">Specialized Testing</button>
    <div class="panel">
      <button class="panel-btn" onclick="loadModule('integrated')">Integrated Testing</button>
      <button class="panel-btn" onclick="loadModule('mobile')">Mobile Testing</button>
    </div>

    <button class="accordion">Agile & Ceremonies</button>
    <div class="panel">
      <button class="panel-btn" onclick="loadModule('agile')">Agile/Scrum Workflow</button>
      <button class="panel-btn" onclick="loadModule('demo')">DEMO Presentation</button>
      <button class="panel-btn" onclick="loadModule('timelogging')">Logging Time & Teams</button>
      <button class="panel-btn" onclick="loadModule('waterfall')">Waterfall Workflow</button>
    </div>
  </aside>"""

    # Replacing the sidebar
    content = re.sub(r'<aside class="sidebar">.*?</aside>', new_sidebar, content, flags=re.DOTALL)

    new_qa_modules = r"""    const qaModules = {
      "ai_gen": {
        title: "AI Test Generation (UiPath)",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Tools:</strong> Access UiPath Test Manager via Jira Link or URL. Authentication via email.</li>
            <li><strong>Context:</strong> ALWAYS select relevant documents (attachments/US description) for the context.</li>
            <li><strong>Evaluation:</strong> Perform Initial Evaluation (Relevance, logic, coverage) -> Detailed Evaluation (Ethics, prerequisites, acceptance criteria).</li>
            <li><strong>Integration:</strong> Saving in Test Manager automatically pushes scenarios to Jira in 'Drafturi Test Manager' Xray folder.</li>
            <li><strong>Refinement:</strong> Ensure proper limits (Max 50 steps), positive/negative constraints, and expected behavior.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Open Test Manager"] --> B["Select Prompt (Positive/Negative/Non-functional)"]
            B --> C["Provide Context (Attach docs)"]
            C --> D["Generate Tests (Claude model)"]
            D --> E["Initial Evaluation"]
            E --> F{"Acceptable?"}
            F -- No --> G["Adjust Prompt/Context"] --> D
            F -- Yes --> H["Detailed Evaluation & Refine Steps"]
            H --> I["Create tests"]
            I --> J["Tests push to Jira (Drafturi folder)"]
            J --> K["Assignee = Self, Link to US, Move to subfolder"]`,
        checklist: [
          "Authenticate to UiPath Test Manager via Email.",
          "Provide necessary context and attachments to AI.",
          "Generate and perform Initial Evaluation.",
          "Perform Detailed Evaluation (Refine steps).",
          "Save tests. Navigate to Jira.",
          "Assign test to self, link to US, move to proper Xray folder."
        ],
        templates: "<em>Prompts: 'Positive Scenario Test Creator', 'Negative Scenario Test Creator', 'UI/UX Non-functional Test Generator'.</em>"
      },
      "xray_rules": {
        title: "Xray Test Repository & Rules",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Structure:</strong> Max 50 steps per LX. 3 columns: Action, Data, Expected Result.</li>
            <li><strong>Naming:</strong> ScrumName - USName - [scenario type].</li>
            <li><strong>Scenario Types:</strong> Positive (happy path), Negative (invalid input), Regression, UI/UX, Smoke, Non-functional.</li>
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
        checklist: [
          "Ensure LX is in the correct Xray subfolder.",
          "Name format: ScrumName - USName - scenario type.",
          "Verify max 50 steps per LX.",
          "Check if 'Call Test' can be used for repetitive steps.",
          "Add Label with US number and scenario type.",
          "Link LX to the User Story (Issue type: tests)."
        ],
        templates: "<em>Example Name: 'Creatio - Non-resident client - positive scenario 1'</em>"
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
        checklist: [
          "Compile all created LXs for the US.",
          "Send notification/email to PO, App Owner, Beneficiary.",
          "Receive explicit approval from PO.",
          "Update any scenarios as per feedback."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Verify Test Scenarios are Validated by PO.",
          "Verify/Create 'UAT Testing' Sub-Test Execution.",
          "Modify 'Original Estimate' to actual time.",
          "Execute ALL test scenarios (No 'Aborted' statuses without comment).",
          "If Bug found: Create Issue with Env 'UAT'.",
          "Retest all bugs after Dev fix.",
          "Transition US to 'Approval Required'."
        ],
        templates: "<em>Use standard bug template. If bug not fixed, request conditional acceptance from PO.</em>"
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
        checklist: [
          "Create 'Smoke PRL Testing' Sub-Task.",
          "Add ONLY LXs from 'Smoke Tests' folder.",
          "Execute. Interrupt immediately if any step fails.",
          "If Bug: Label 'Smoke', Env 'Prelive'."
        ],
        templates: "<em>No templates required.</em>"
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
        checklist: [
          "Verify Smoke Testing is 100% PASS.",
          "Add Happy path LX(s) to Sub-Test Execution.",
          "Retest UAT bugs (Major/Blocker severity ONLY).",
          "Check 'Retested in Prelive' for verified bugs.",
          "Execute Happy path LXs."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Create 'Regression PRL Testing' Sub-Task.",
          "Add LXs from 'Regression Tests' folder.",
          "Execute all regression scenarios.",
          "If Bug: Label 'regression', Env 'Prelive'."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Attempt to reproduce the bug.",
          "Select Correct Category and Reproducibility (Always/Sometimes).",
          "Select Severity (Trivial, Minor, Medium, Major, Blocker).",
          "Fill 'Steps to reproduce', 'Actual result', 'Expected result'.",
          "Attach Screenshot or Video evidence."
        ],
        templates: `<div class="code-block">Bug Detailing Template:
Steps to reproduce:
1. Navigate to [Link]
2. Login with user [User] / role [Role]
3. Click on [Button]
4. Enter [Data]

Actual Result: The system throws error 500.
Expected Result: The system processes the payment and shows success screen.</div>`
      },
      "incidents": {
        title: "Incidents Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Definition:</strong> An unplanned interruption identified in Live.</li>
            <li><strong>Workflow:</strong> Testing is required in both UAT and PRL environments.</li>
            <li><strong>Exceptions:</strong> Scenarios for Incidents DO NOT require PO validation. A DEMO meeting is NOT held. Evidence is NOT required.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Incident Opened"] --> B["Create Defining Scenarios Sub-task"]
            B --> C["Create UAT Testing Sub-task"]
            C --> D["Create PRL Testing Sub-task"]
            D --> E["Execute in UAT"] --> F["Execute in PRL"]
            F --> G{"Fixed?"}
            G -- Yes --> H["Status: Ready for Release"]
            G -- No --> I["Status: Re-open"]`,
        checklist: [
          "Create 'Defining Scenarios' Sub-task.",
          "Identify or Create LX (Must have 'Incident' label).",
          "Create UAT Testing Sub-task & Execute.",
          "Create PRL Testing Sub-task & Execute."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Create 'Integrated testing' Issue type in Jira.",
          "Create a dedicated Xray sub-folder.",
          "Define cross-system test scenarios.",
          "Execute UAT Integrated testing.",
          "Execute PRL Integrated testing.",
          "Coordinate bug reporting with the responsible team."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Connect devices to PC via ApowerMirror.",
          "Execute scenarios on iOS physical device.",
          "Execute scenarios on Android physical device.",
          "Execute Smoke tests on Huawei device.",
          "Verify UI/UX adaptability (Resizing, dark mode, gestures).",
          "Verify both RO and EN localizations."
        ],
        templates: "<em>No specific templates required.</em>"
      },
      "agile": {
        title: "Agile / Scrum Workflow",
        guidelines: `<h3>Core Rules</h3>
          <ul class="guideline-list">
            <li><strong>Role of Tester:</strong> Analyzes US, participates in Ceremonies (Daily, Planning, Review, Retrospective), reports bugs, executes tests.</li>
            <li><strong>Estimates:</strong> Testing effort must be estimated in Story Points alongside dev effort.</li>
            <li><strong>Testing Stages:</strong> Defining scenarios in sprint -> UAT execution -> Bug reporting -> Demo.</li>
            <li><strong>Escalation:</strong> Immediately escalate to TLTesting@librabank.ro if blockages appear.</li>
          </ul>`,
        mermaid: `flowchart TD
            A["Sprint Planning"] --> B["Analyze US & Story Points"]
            B --> C["Sprint Backlog Created"]
            C --> D["Define Test Scenarios"]
            D --> E["Daily Scrum"]
            E --> F["UAT Execution"]
            F --> G["Demo"]
            G --> H["Sprint Retrospective"]`,
        checklist: [
          "Provide Story Point estimation during Sprint Planning.",
          "Define Test scenarios based on US Acceptance Criteria.",
          "Attend Daily Scrum and report blockers.",
          "Execute UAT during the sprint timeline.",
          "Prepare for and hold Demo."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Verify test scenarios are PO validated.",
          "Check for open bugs (escalate Blockers to TL).",
          "Confirm all Acceptance Criteria are met.",
          "Prepare realistic Test Data (no DB manipulation).",
          "Verify environment stability before meeting."
        ],
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
        checklist: [
          "Verify primary team workload.",
          "Check secondary team board if primary is blocked.",
          "Log hours in Jira for all executed tasks at the end of the day.",
          "Ensure Terramind activity tracking is active."
        ],
        templates: "<em>No specific templates required.</em>"
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
        checklist: [
          "Provide High-Level estimate during Requirements stage.",
          "Provide Detailed estimate (Optimistic/Pessimistic) via Excel.",
          "Write scenarios based on approved FSD/TDD.",
          "Wait for Development Phase to completely finish.",
          "Execute functional and integration testing."
        ],
        templates: "<em>Use the Testing Estimation Form .xlsx for tracking.</em>"
      }
    };"""

    # Replacing the qaModules object
    content = re.sub(r'    const qaModules = \{.*?\n    \};\n', new_qa_modules + '\n', content, flags=re.DOTALL)

    # We also need to fix default loading if 'uat' was hardcoded or if active class is missing on initial load.
    # The default script loads nothing on startup, user clicks.
    
    with open('Gemini01.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_html()
