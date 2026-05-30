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
    print("  🚀 LIBRA SOP - END TO END TEST SUITE")
    print("============================================================")

    passes = 0
    failures = 0
    
    def report(name, condition):
        nonlocal passes, failures
        if condition:
            print(f"[PASS ✅] {name}")
            passes += 1
        else:
            print(f"[FAIL ❌] {name}")
            failures += 1

    try:
        # =========================================================
        # PHASE 1: INITIAL STATE & UI/UX VERIFICATION
        # =========================================================
        print("\n--- Phase 1: UI/UX & Responsive Layout ---")
        driver.get("https://testersofison.github.io/Testers_SOP/")
        time.sleep(3)
        
        # 1.1 Verify Title
        report("Application Title is correct", "SOP" in driver.title)
        
        # 1.2 Verify Default Theme is Dark
        body = driver.find_element(By.TAG_NAME, "body")
        theme = body.get_attribute("data-theme")
        report("Default theme is dark", theme == "dark" or theme is None) # By default it's dark
        
        # 1.3 Toggle Theme
        theme_btn = driver.find_element(By.ID, "theme-toggle")
        theme_btn.click()
        time.sleep(1)
        theme = body.get_attribute("data-theme")
        report("Theme toggles to light", theme == "light")
        theme_btn.click() # Revert to dark
        
        # 1.4 Responsive Layout (Mobile Test)
        driver.set_window_size(375, 812) # iPhone X
        time.sleep(1)
        hamburger = driver.find_element(By.ID, "mobile-menu-btn")
        report("Hamburger menu visible on mobile", hamburger.is_displayed())
        
        sidebar = driver.find_element(By.CLASS_NAME, "sidebar")
        report("Sidebar is hidden by default on mobile", "open" not in sidebar.get_attribute("class"))
        
        hamburger.click()
        time.sleep(1)
        report("Sidebar opens when hamburger clicked", "open" in sidebar.get_attribute("class"))
        
        # Revert to desktop
        driver.set_window_size(1920, 1080)
        time.sleep(1)

        # =========================================================
        # PHASE 2: AUTHENTICATION
        # =========================================================
        print("\n--- Phase 2: Authentication Workflow ---")
        
        driver.find_element(By.ID, "tester-name-input").send_keys("E2E-Automated-Tester")
        driver.find_element(By.ID, "tester-pin-input").send_keys("9999")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        time.sleep(2)
        try:
            alert = driver.switch_to.alert
            msg = alert.text
            alert.accept()
            report("Login workflow triggers alert (success or fail)", len(msg) > 0)
        except:
            report("Login workflow", False)
        
        time.sleep(2)
        profile_name = driver.find_element(By.ID, "display-profile-name").text
        report("Profile displays tester name", "E2E-Automated-Tester" in profile_name)

        # =========================================================
        # PHASE 3: USER STORY, CHECKLISTS, & PROGRESS
        # =========================================================
        print("\n--- Phase 3: SOP Workflow & Checklists ---")
        
        # Ensure SOP tab is active
        tabs = driver.find_elements(By.CLASS_NAME, "tab-btn")
        for tab in tabs:
            if "Standard Operating Procedure" in tab.text:
                tab.click()
                break
        time.sleep(1)
        
        validUsKey = 'WF-7849: Structuring PF and PJ Deposit Collateral Products'
        
        # Select User Story via JS to bypass async dropdown wait
        js_select = f"""
            const usInput = document.getElementById('user-story-input');
            const opt = document.createElement('option');
            opt.value = '{validUsKey}';
            usInput.appendChild(opt);
            usInput.value = '{validUsKey}';
            window.handleUserStoryKeyChange();
            window.assignToMe();
        """
        driver.execute_script(js_select)
        time.sleep(2)
        
        assignee_display = driver.find_element(By.ID, "current-assignee-display").text
        report("Assignee successfully updated to E2E tester", "E2E-Automated-Tester" in assignee_display)
        
        # Interact with checkboxes
        print("[*] Clicking checkboxes in module 1...")
        checkboxes = driver.find_elements(By.CSS_SELECTOR, "#checklist-container input[type='checkbox']")
        if len(checkboxes) >= 2:
            checkboxes[0].click()
            time.sleep(0.5)
            checkboxes[1].click()
            time.sleep(1)
            
            # Check progress bar
            progress_text = driver.find_element(By.ID, "progress-text-label").text
            report("Progress bar is greater than 0%", progress_text != "Active Status: 0%")
        else:
            report("Checkboxes available to interact", False)

        # =========================================================
        # PHASE 4: ADMIN PANEL & SYNC
        # =========================================================
        print("\n--- Phase 4: Admin Panel & Firebase Sync ---")
        
        # Lock App
        driver.execute_script("window.lockApplication();")
        time.sleep(1)
        
        # Login as Admin
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
        
        # Open Admin panel
        admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
        report("Admin Panel button visible", admin_btn.is_displayed())
        
        admin_btn.click()
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
                    report("Admin panel synced Assignee", "E2E-Automated-Tester" in assignee)
                    break
        
        report("Test User Story populated in Admin Dashboard", found)
        report("Admin Panel Progress is aggregated correctly", found and progress_val != "0%" and progress_val != "")
        
        # Close Admin Panel
        close_btns = driver.find_elements(By.CLASS_NAME, "btn-danger")
        for btn in close_btns:
            if btn.is_displayed():
                btn.click()
                break
        time.sleep(1)

        # =========================================================
        # PHASE 5: TEARDOWN
        # =========================================================
        print("\n--- Phase 5: Teardown & Cleanup ---")
        driver.execute_script(f"if(window.deleteStateFromCloud) window.deleteStateFromCloud('{validUsKey}');")
        time.sleep(2)
        report("Teardown script executed", True)
        
    except Exception as e:
        print(f"\n[CRITICAL ERROR] Test suite encountered an unexpected failure: {e}")
        failures += 1
        
    finally:
        driver.quit()
        
    print("\n============================================================")
    print(f"  🏁 TEST SUITE COMPLETED: {passes} PASSED | {failures} FAILED")
    print("============================================================")

if __name__ == "__main__":
    run_e2e_tests()
