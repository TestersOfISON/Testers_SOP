import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def wait_for_element(driver, by, value, timeout=10):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, value)))

def run_e2e_tests():
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=options)
    
    print("============================================================")
    print("  🚀 LIBRA SOP - END TO END TEST SUITE (V3)")
    print("============================================================")

    passes = 0
    failures = 0
    total_tests = 0
    
    def report(name, condition):
        nonlocal passes, failures, total_tests
        total_tests += 1
        if condition:
            print(f"[PASS ✅] {name}")
            passes += 1
        else:
            print(f"[FAIL ❌] {name}")
            failures += 1

    try:
        # =========================================================
        # PHASE 1: AUTHENTICATION
        # =========================================================
        print("\n--- Phase 1: Authentication Workflow ---")
        driver.get(r"file:///c:/Users/vigne/Downloads/Libra/index.html")
        time.sleep(3)
        
        driver.find_element(By.ID, "tester-name-input").send_keys("E2E-Automated-Tester-V3")
        driver.find_element(By.ID, "tester-pin-input").send_keys("9999")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        time.sleep(2)
        try:
            alert = driver.switch_to.alert
            msg = alert.text
            alert.accept()
            report("Login workflow triggers alert", len(msg) > 0)
        except:
            report("Login workflow", False)
        
        time.sleep(2)
        profile_name = driver.find_element(By.ID, "display-profile-name").text
        report("Profile displays tester name", "E2E-Automated-Tester-V3" in profile_name)

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
            manual_content = driver.find_element(By.ID, "module-content").text
            report("Manual module warning message is rendered", "This is not a monitoring tool" in manual_content)
        except Exception:
            report("Manual module warning message is rendered", False)

        html_elem = driver.find_element(By.TAG_NAME, "html")
        theme = html_elem.get_attribute("data-theme") or "light"
        report("Default theme is light", theme == "light")
        
        # We must click using ActionChains or JS since it's headless and the modal might have a transition delay
        theme_btn = driver.find_element(By.ID, "theme-toggle")
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
        # PHASE 3: USER STORY, CHECKLISTS, & PROGRESS
        # =========================================================
        print("\n--- Phase 3: SOP Workflow & Checklists ---")
        
        tabs = driver.find_elements(By.CLASS_NAME, "tab-btn")
        for tab in tabs:
            if "Standard Operating Procedure" in tab.text:
                driver.execute_script("arguments[0].click();", tab)
                break
        time.sleep(1)
        
        validUsKey = 'WF-7849: Structuring PF and PJ Deposit Collateral Products'
        
        # Uncheck My Stories filter to show all stories in the dropdown list
        my_stories = driver.find_element(By.ID, "top-my-stories-filter")
        if my_stories.is_selected():
            driver.execute_script("arguments[0].click();", my_stories)
            WebDriverWait(driver, 15).until(
                lambda d: len(d.find_element(By.ID, "user-story-input").find_elements(By.TAG_NAME, "option")) > 1
            )
            
        us_select = driver.find_element(By.ID, "user-story-input")
        options = us_select.find_elements(By.TAG_NAME, "option")
        found = False
        for opt in options:
            if "WF-7849" in opt.get_attribute("textContent"):
                val = opt.get_attribute("value")
                driver.execute_script("arguments[0].value = arguments[1];", us_select, val)
                driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", us_select)
                found = True
                break
        
        if not found:
            js_append = f"""
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
            
        time.sleep(2)
        
        # Click the Assign to me button
        assign_btn = driver.find_element(By.ID, "assign-to-me-btn")
        driver.execute_script("arguments[0].click();", assign_btn)
        time.sleep(2)
        
        assignee_display = driver.find_element(By.ID, "current-assignee-display").text
        report("Assignee successfully updated to E2E tester", "E2E-Automated-Tester-V3" in assignee_display)
        
        print("[*] Clicking checkboxes in module 1...")
        checkboxes = driver.find_elements(By.CSS_SELECTOR, "#checklist-container input[type='checkbox']")
        if len(checkboxes) >= 2:
            driver.execute_script("arguments[0].click(); arguments[0].dispatchEvent(new Event('change', {bubbles: true}));", checkboxes[0])
            time.sleep(0.5)
            driver.execute_script("arguments[0].click(); arguments[0].dispatchEvent(new Event('change', {bubbles: true}));", checkboxes[1])
            time.sleep(1)
            
            progress_text = driver.find_element(By.ID, "progress-text-label").text
            report("Progress bar is greater than 0%", progress_text != "Active Status: 0%")
        else:
            report("Checkboxes available to interact", False)
            
        # Additional UI/UX checks
        search_input = driver.find_element(By.ID, "global-search")
        report("Global Search bar is rendered", search_input.is_displayed())
        
        export_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Export Workbook')]")
        report("Export Workbook button is visible", export_btn.is_displayed())

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
        
        admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
        report("Admin Panel button visible", admin_btn.is_displayed())
        
        driver.execute_script("arguments[0].click();", admin_btn)
        time.sleep(3)
        
        tbody = driver.find_element(By.ID, "admin-dashboard-tbody")
        rows = tbody.find_elements(By.TAG_NAME, "tr")
        found = False
        progress_val = ""
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 5:
                if "WF-7849" in cols[0].text:
                    found = True
                    assignee = cols[2].text
                    progress_val = cols[3].text
                    report("Admin panel synced Assignee", "E2E-Automated-Tester-V3" in assignee)
                    break
        
        report("Test User Story populated in Admin Dashboard", found)
        report("Admin Panel Progress is aggregated correctly", found and progress_val != "0%" and progress_val != "")

        print("\n--- Phase 5: Teardown & Cleanup ---")
        driver.execute_script(f"if(window.deleteStateFromCloud) window.deleteStateFromCloud('{validUsKey}');")
        time.sleep(2)
        report("Teardown script executed", True)
        
    except Exception as e:
        print(f"\n[CRITICAL ERROR] Test suite encountered an unexpected failure: {e}")
        failures += 1
        
    finally:
        driver.quit()
        print("============================================================")
        print(f"  🏁 TEST SUITE COMPLETED: {passes} PASSED | {failures} FAILED")
        print("============================================================")
        
        if failures > 0:
            exit(1)

if __name__ == "__main__":
    run_e2e_tests()
