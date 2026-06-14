# DevOps Temenos T24 TAFJ - CI/CD Demonstration

This video demonstrates a fully automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for a Temenos T24 TAFJ environment using Jenkins, GitHub, and email notifications.

## Key Components

*   **Jenkins:** Used as the automation server to orchestrate the CI/CD pipeline.
*   **GitHub:** Used for source code management. Commits pushed to GitHub automatically trigger Jenkins builds.
*   **Visual Studio Code (VS Code):** Used as the Integrated Development Environment (IDE) by the developer to write and modify TAFJ routines and component files.
*   **Email Notifications:** Configured to notify developers of build successes and failures.

## Pipeline Workflow Demonstration

1.  **Initial State:** The video shows a Jenkins pipeline (`t24tafj`) with a history of builds, including a recent failed build. The failure is also reflected in the GitHub repository's build status.
2.  **Developer Workflow:**
    *   The developer uses VS Code to modify a TAFJ routine (`MTD.Greeting.b`) and a test program (`TestProg.b`).
    *   The changes are committed and pushed to a GitHub branch (`MT220002`).
3.  **Automated Build (Failure):**
    *   The push to GitHub automatically triggers a new Jenkins build.
    *   The pipeline goes through initialization, build, and test stages.
    *   The build fails during compilation because of a typo in the component name within the code.
    *   The developer receives an email notification with a link to the Jenkins console output to investigate the failure.
4.  **Fixing the Bug:**
    *   The developer identifies the error (incorrect component name) from the Jenkins logs and fixes it in VS Code.
    *   The fixed code is committed and pushed to GitHub.
5.  **Automated Build (Success):**
    *   Jenkins automatically triggers another build.
    *   This time, the compilation and deployment stages are successful.
    *   The developer receives a success email notification containing details of the commit that fixed the bug.
6.  **Verification:**
    *   The developer logs into the T24 development server.
    *   They execute the test program using the command `tRun TestProg` in the command prompt.
    *   The output `Hello Aaron!` confirms that the changes were successfully compiled and deployed.
    *   The video also shows the newly deployed JAR file (`EB_LocalDev.jar`) in the TAFJ deployment directory.

## Summary

This demo effectively illustrates how DevOps practices like CI/CD can be implemented in a Temenos T24 TAFJ environment, enabling automated compilation, testing, deployment, and immediate feedback loops for developers, ultimately improving software quality and release speed.
