# Mandatory Developer Rules & Workflow Guidelines

> [!IMPORTANT]
> This document outlines the mandatory rules and workflow guidelines that must be strictly followed whenever modifications, bug fixes, or enhancements are made to the Tester's SOP application.

---

## The Mandatory 3-Step Change Process

Whenever any changes are made to the codebase of the application, you **must** execute the following steps in sequence before declaring the task complete:

### 1. Commit Code to Live on GitHub
All modifications must be committed and pushed to the remote repository.
- Ensure the commit message is clear and references the changes made.
- Push the changes to the remote branch (e.g., `main` or the active feature branch on `https://github.com/TestersOfISON/Testers_SOP.git`).
- Example command sequence:
  ```bash
  git add .
  git commit -m "Brief description of the fix or feature"
  git push origin main
  ```

### 2. Update Test Scenarios
Keep the end-to-end testing scenarios in sync with the latest application updates.
- If new features, elements, classes, or behaviors are introduced, update the test suite script (e.g., [e2e_test_suite_v3.py](file:///c:/Users/vigne/Downloads/Libra/e2e_test_suite_v3.py) or subsequent versioned script) accordingly.
- Ensure the tests match the updated selectors, DOM structure, and logic of the UI/UX.

### 3. Run a Complete End-to-End Testing Suite
Validate that all features remain unbroken by running the full E2E automation suite.
- Execute the E2E Python/Selenium automation tests locally to verify compatibility.
- Ensure all phases of the test suite (Authentication, UI/UX and layout, SOP checklist workflow, progress updates, and Firebase synchronization) pass successfully.
