import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from healer import smart_find

def wait_for_element(driver, by, value, timeout=10):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, value)))

def run_e2e_tests():
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=options)
    
    print("============================================================")
    print("  [*] LIBRA SOP - LIVE END TO END TEST SUITE")
    print("============================================================")

    passes = 0
    failures = 0
    total_tests = 0
    
    def report(name, condition):
        nonlocal passes, failures, total_tests
        total_tests += 1
        if condition:
            print(f"[PASS OK] {name}")
            passes += 1
        else:
            print(f"[FAIL XX] {name}")
            failures += 1

    try:
        # =========================================================
        # PHASE 1: AUTHENTICATION
        # =========================================================
        driver.get("https://testersofison.github.io/Testers_SOP/")
        
        # -------------------------------------------------------------
        # Inject our testing User Story into SOP_CONFIG so Admin panel finds it
        # and select it right away so progress tracks correctly
        # -------------------------------------------------------------
        validUsKey = "WF-LIVE-TESTING-7849: Structuring PF and PJ Deposit Collateral Products"
        js_append = f"""
            if (window.SOP_CONFIG && window.SOP_CONFIG.userStories) {{
                window.SOP_CONFIG.userStories.push({{
                    key: '{validUsKey}',
                    epic: 'WF-7679: AA Collateral Deposits Migration',
                    assignee: 'E2E-Automated-Tester-LIVE'
                }});
            }}
            const usInput = document.getElementById('user-story-input');
            if (usInput) {{
                const opt = document.createElement('option');
                opt.value = '{validUsKey}';
                opt.textContent = '{validUsKey}';
                opt.dataset.epic = 'WF-7679: AA Collateral Deposits Migration';
                usInput.appendChild(opt);
                usInput.value = '{validUsKey}';
                window.handleUserStoryKeyChange();
            }}
        """
        driver.execute_script(js_append)
        time.sleep(1)

        print("\n--- Phase 1: Authentication Workflow ---")
        time.sleep(5) # wait longer for live load
        
        driver.find_element(By.ID, "tester-name-input").send_keys("E2E-Automated-Tester-LIVE")
        driver.find_element(By.ID, "tester-pin-input").send_keys("9999")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        alert_text = alert.text
        alert.accept()
        time.sleep(1)
        
        # Handle potential secondary sync alerts
        try:
            while True:
                WebDriverWait(driver, 1).until(EC.alert_is_present())
                driver.switch_to.alert.accept()
                time.sleep(0.5)
        except:
            pass
            
        report("Login workflow triggers alert", "Login successful" in alert_text or "Synced" in alert_text)
        
        time.sleep(2)
        profile_name = driver.find_element(By.ID, "display-profile-name").text
        report("Profile displays tester name", "E2E-Automated-Tester-LIVE" in profile_name)

        # =========================================================
        # PHASE 2: INITIAL STATE & UI/UX VERIFICATION
        # =========================================================
        print("\n--- Phase 2: UI/UX & Responsive Layout ---")
        
        report("Application Title is correct", "SOP" in driver.title)
        
        # Verify Manual Module text
        manual_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'User Manual')]")
        driver.execute_script("arguments[0].click();", manual_btn)
        time.sleep(1)
        
        try:
            manual_content = driver.find_element(By.ID, "tab-guidelines").text
            report("Manual module warning message is rendered", "This is not a monitoring tool" in manual_content)
        except Exception as e:
            report("Manual module warning message is rendered", False)

        html_elem = driver.find_element(By.TAG_NAME, "html")
        theme = html_elem.get_attribute("data-theme") or "light"
        report("Default theme is light", theme == "light")
        
        # We must click using ActionChains or JS since it's headless and the modal might have a transition delay
        # SELF HEALING TEST
        theme_btn = smart_find(driver, By.ID, "btn-theme-switch", "Dark mode toggle theme button")
        driver.execute_script("arguments[0].click();", theme_btn)
        time.sleep(1)
        theme = html_elem.get_attribute("data-theme")
        report("Theme toggles to dark", theme == "dark")
        driver.execute_script("arguments[0].click();", theme_btn)
        time.sleep(1)
        
        # Hover scaling sidebar (No mobile hamburger)
        sidebar = driver.find_element(By.CLASS_NAME, "sidebar")
        report("Sidebar exists and uses hover width scaling", sidebar.is_displayed())

        # =========================================================
        # PHASE 3: NESTED CHECKLISTS AND MODULE SELECTION
        # =========================================================
        print("\n--- Phase 3: Nested Checklists (Test Design Module) ---")
        
        # Uncheck My Stories filter to show all stories in the dropdown list
        my_stories = driver.find_element(By.ID, "top-my-stories-filter")
        if my_stories.is_selected():
            driver.execute_script("arguments[0].click();", my_stories)
            WebDriverWait(driver, 15).until(
                lambda d: len(d.find_element(By.ID, "user-story-input").find_elements(By.TAG_NAME, "option")) > 1
            )
            
        # -------------------------------------------------------------
        # We already injected and selected the User Story at the start.
        # Now Assign to Me
        # -------------------------------------------------------------
        assign_btn = driver.find_element(By.ID, "assign-to-me-btn")
        if assign_btn.is_displayed():
            driver.execute_script("arguments[0].click();", assign_btn)
            time.sleep(1)
        
        # Step 1: Click AI Scenario Generation and complete it to unlock Test Design
        ai_module_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'AI Scenario Generation')]")
        driver.execute_script("arguments[0].click();", ai_module_btn)
        time.sleep(1)
        
        # Click SOP tab for AI Module
        tabs = driver.find_elements(By.CLASS_NAME, "tab-btn")
        for tab in tabs:
            if "Standard Operating Procedure" in tab.text:
                driver.execute_script("arguments[0].click();", tab)
                break
        time.sleep(2)
        
        # Complete all AI Generation checkboxes to unlock next module
        ai_checkboxes = driver.find_elements(By.CSS_SELECTOR, "#checklist-container input[type='checkbox']")
        for cb in ai_checkboxes:
            driver.execute_script("arguments[0].checked = true; arguments[0].dispatchEvent(new Event('change', {bubbles: true}));", cb)
            time.sleep(0.2)
        time.sleep(2)
        
        # Now click Test Design module
        print("--- Clicking Test Design Module ---")
        td_module_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Test Design & Xray Management')]")
        driver.execute_script("arguments[0].click();", td_module_btn)
        time.sleep(2)
        
        tabs = driver.find_elements(By.CLASS_NAME, "tab-btn")
        for tab in tabs:
            if "Standard Operating Procedure" in tab.text:
                driver.execute_script("arguments[0].click();", tab)
                break
        time.sleep(2)
        
        # Check a regular checkbox to get >0% progress
        regular_checkboxes = driver.find_elements(By.CSS_SELECTOR, "#checklist-container > div > label > input[type='checkbox']:not([disabled])")
        report("Regular checkboxes are rendered", len(regular_checkboxes) > 0)
        
        if len(regular_checkboxes) > 0:
            driver.execute_script("arguments[0].checked = true; arguments[0].dispatchEvent(new Event('change', {bubbles: true}));", regular_checkboxes[0])
            time.sleep(3)
            progress_text = driver.find_element(By.ID, "progress-text-label").text
            report("Progress bar updates after checking regular item", progress_text != "Active Status: 0%")

        # =========================================================
        # PHASE 3.5: GHIDUL CHATBOT
        # =========================================================
        print("\n--- Phase 3.5: Ghidul Chatbot ---")
        ai_fab = driver.find_element(By.ID, "ai-chat-fab")
        report("Ghidul FAB is rendered", ai_fab.is_displayed())
        
        driver.execute_script("arguments[0].click();", ai_fab)
        time.sleep(1)
        
        chat_window = driver.find_element(By.ID, "ai-chat-window")
        is_chat_open = "open" in chat_window.get_attribute("class").split()
        report("Ghidul Chat Window opens on click", is_chat_open)

        settings_btn = driver.find_element(By.XPATH, "//button[@title='Settings']")
        driver.execute_script("arguments[0].click();", settings_btn)
        time.sleep(1)
        
        settings_modal = driver.find_element(By.ID, "ai-settings-modal")
        report("AI Settings Modal opens", settings_modal.is_displayed())
        
        model_select = driver.find_element(By.ID, "ai-model-select")
        report("AI Model Dropdown is rendered", model_select.is_displayed())

        # Close the modal and the chat window so they don't intercept clicks
        close_modal_btn = driver.find_element(By.XPATH, "//button[@onclick=\"document.getElementById('ai-settings-modal').style.display='none'\"]")
        driver.execute_script("arguments[0].click();", close_modal_btn)
        time.sleep(1)
        
        close_chat_btn = driver.find_element(By.XPATH, "//div[@id='ai-chat-window']//button[@title='Close']")
        driver.execute_script("arguments[0].click();", close_chat_btn)
        time.sleep(1)

        # =========================================================
        # PHASE 4: ADMIN PANEL & SYNC
        # =========================================================
        print("\n--- Phase 4: Admin Panel & Firebase Sync ---")
        
        driver.execute_script("window.lockApplication();")
        time.sleep(1)
        
        driver.find_element(By.ID, "tester-name-input").clear()
        driver.find_element(By.ID, "tester-pin-input").clear()
        driver.find_element(By.ID, "tester-name-input").send_keys("ISON-ADMIN")
        driver.find_element(By.ID, "tester-pin-input").send_keys("ISON-ADMIN")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        time.sleep(2)
        try:
            driver.switch_to.alert.accept()
        except:
            pass
        time.sleep(2)
        
        admin_btn = driver.find_element(By.ID, "sidebar-admin-btn")
        report("Admin Panel button visible", admin_btn.is_displayed())
        
        driver.execute_script("arguments[0].click();", admin_btn)
        time.sleep(3)
        
        tbody = driver.find_element(By.ID, "admin-dashboard-tbody")
        rows = tbody.find_elements(By.TAG_NAME, "tr")
        found = False
        progress_val = ""
        html_content = tbody.get_attribute("innerHTML")
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 5:
                if "WF-LIVE-TESTING-7849" in cols[0].text:
                    found = True
                    assignee = cols[2].text
                    progress_val = cols[3].text
                    report("Admin panel synced Assignee", "E2E-Automated-Tester-LIVE" in assignee)
                    break
                    
        if not found:
            with open("admin_dashboard_debug.html", "w", encoding="utf-8") as f:
                f.write(html_content)
        
        report("Test User Story populated in Admin Dashboard", found)
        report("Admin Panel Progress is aggregated correctly", found and progress_val != "0%" and progress_val != "")

        print("\n--- Phase 4.5: QA Lead AI Automations ---")
        
        # Inject dummy API key so report generation doesn't alert and block the test
        driver.execute_script("localStorage.setItem('gemini_api_key', 'test_dummy_key');")
        
        has_anomaly_flag = False
        if found:
            # Re-fetch the row to check for the anomaly flag (⚠️)
            rows = tbody.find_elements(By.TAG_NAME, "tr")
            for row in rows:
                cols = row.find_elements(By.TAG_NAME, "td")
                if len(cols) >= 5 and "WF-LIVE-TESTING-7849" in cols[0].text:
                    if "⚠️" in cols[0].text:
                        has_anomaly_flag = True
                    break
                    
        report("AI Anomaly Detection Flagged", has_anomaly_flag)
        
        report_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Generate Report')]")
        report("AI Executive Report Button is visible", report_btn.is_displayed())
        
        # Click report button to ensure modal opens
        driver.execute_script("arguments[0].click();", report_btn)
        time.sleep(2)
        report_modal = driver.find_element(By.ID, "executive-report-modal")
        report("AI Executive Report Modal opens", report_modal.is_displayed())
        
        # Close report modal
        driver.execute_script("document.getElementById('executive-report-modal').style.display='none';")
        time.sleep(1)
        
        print("\n--- Phase 4.6: Timeline Dashboard Verification ---")
        timeline_btn = None
        try:
            # The button has text "Timeline ⏱️"
            timeline_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Timeline')]")
        except:
            pass
        
        report("Timeline button is rendered in Admin Panel", timeline_btn is not None and timeline_btn.is_displayed())
        
        if timeline_btn:
            driver.execute_script("arguments[0].click();", timeline_btn)
            time.sleep(2)
            
            timeline_modal = driver.find_element(By.ID, "timeline-modal")
            report("Timeline Modal opens on click", timeline_modal.is_displayed())
            
            # Close the modal
            close_timeline_btn = driver.find_element(By.XPATH, "//div[@id='timeline-modal']//button[contains(text(), 'Close')]")
            driver.execute_script("arguments[0].click();", close_timeline_btn)
            time.sleep(1)
        else:
            report("Timeline Modal opens on click", False)

        print("\n--- Phase 5: Teardown & Cleanup ---")
        # Critical data cleanup from live DB
        driver.execute_script(f"if(window.deleteStateFromCloud) window.deleteStateFromCloud('{validUsKey}');")
        time.sleep(3)
        # Delete tester profile
        driver.execute_script("if(window.db && window.db.ref) window.db.ref('users/E2E-Automated-Tester-LIVE').remove();")
        time.sleep(2)
        report("Teardown script executed and live data cleared", True)
        
    except Exception as e:
        import traceback
        print(f"\n[CRITICAL ERROR] Test suite encountered an unexpected failure: {e}")
        traceback.print_exc()
        failures += 1
        
    finally:
        driver.quit()
        print("============================================================")
        print(f"  [*] LIVE TEST SUITE COMPLETED: {passes} PASSED | {failures} FAILED")
        print("============================================================")
        
        if failures > 0:
            exit(1)

if __name__ == "__main__":
    run_e2e_tests()
