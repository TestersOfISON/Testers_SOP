# DevOps in Banking: Temenos T24 TAFJ CI/CD with Jenkins and GitHub

## Overview
A technical demonstration by Aaron from Mathisi Digital on implementing Continuous Integration and Continuous Deployment (CI/CD) in a Temenos T24 TAFJ environment. The workflow integrates a TAFJ development server, GitHub for version control, and Jenkins for automated pipeline execution.

## The CI/CD Workflow
1. **Code Commit**: A developer writes or modifies T24 routines/components using an IDE (like Visual Studio Code) and commits the changes to a Git branch (e.g., `MT220002`).
2. **GitHub Webhook Trigger**: Pushing the commit to GitHub automatically triggers a webhook to the Jenkins server.
3. **Jenkins Pipeline Execution**: 
   - **Init**: Initializes the environment and checks out code from the SCM.
   - **Build**: Compiles the T24 basic source code and components using the Temenos TAFJ Compiler Runner.
   - **Test**: Executes automated test programs to ensure logical correctness.
   - **Deploy**: If successful, packages the code (e.g., into `.jar` files) and deploys it to the target T24 deployment directory using deployment scripts (e.g., Windows batch files).
4. **Feedback Loop**:
   - Jenkins sends the build status back to GitHub, marking the commit status checks as successful or failed directly in the GitHub UI.
   - Automated email notifications containing build logs and status are sent to the developer.

## Technical Details & Tools
- **Source Code Management**: Git, GitHub
- **CI/CD Orchestration**: Jenkins (Declarative Pipeline)
- **Development Environment**: Visual Studio Code, Windows 10 OS
- **T24 Specifics**:
  - **TAFJ Compiler**: Used to compile basic source code into Java class files and package them.
  - **Routines & Components**: Demonstrated with `MTD.Greeting` routine and `EB.LocalDev.component`.
  - **Testing**: Using `tRun` to execute test programs from the command line (e.g., `tRun TestProg`).
  - **Deployment**: Compiled resources like `EB_LocalDev.jar` are copied directly into the TAFJ deployment folder (`C:\Temenos\TAFJ\deploy`).

## Practical Scenario: Fixing a Build Failure
The video highlights a scenario where a pipeline fails during the build phase due to a typo in a T24 TAFJ component.
- **Identification**: Jenkins console logs identify a compilation error due to an incorrect symbol/name in `EB.LocalDev.component`. 
- **Resolution**: The developer fixes the naming error in VS Code, updates the test routine to call `MTD.Greeting` (to output "Hello Aaron!"), commits via the terminal, and pushes the code.
- **Automated Recovery**: GitHub notifies Jenkins, which triggers a new pipeline run. The console output shows successful compilation of the files, execution of `TestProg` during the test phase, and the packaging and deployment of `EB_LocalDev.jar`. 
- **Verification**: The developer logs into the Windows Server via Remote Desktop, opens the command prompt, and runs `tRun TestProg` directly, confirming the changes successfully reached the development environment and generate the expected output.
