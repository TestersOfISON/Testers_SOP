import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def run_sync_test():
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=options)
    
    print("============================================================")
    print("  🔄 ADMIN PANEL SYNCHRONIZATION TEST")
    print("============================================================")

    try:
        print("[*] Navigating to application...")
        driver.get("https://testersofison.github.io/Testers_SOP/")
        time.sleep(3)
        
        # 1. Login as a normal tester
        print("[*] Logging in as Tester-Sync...")
        driver.find_element(By.ID, "tester-name-input").send_keys("Tester-Sync")
        driver.find_element(By.ID, "tester-pin-input").send_keys("5555")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        time.sleep(2)
        try:
            driver.switch_to.alert.accept()
        except:
            pass
        time.sleep(2)
        
        # 2. Inject a new user story directly into Firebase for this test
        print("[*] Creating test user story 'SYNC-TEST-001'...")
        js_create = """
        const callback = arguments[arguments.length - 1];
        if (window.syncStateToCloud) {
            window.syncStateToCloud('SYNC-TEST-001', 'manual', {}, 0)
                .then(() => {
                    localStorage.setItem('sop_user_story_meta_Tester-Sync_SYNC-TEST-001', JSON.stringify({epicKey: 'TEST-EPIC'}));
                    callback('done');
                }).catch(e => callback(e.toString()));
        } else {
            callback('error');
        }
        """
        driver.execute_async_script(js_create)
        time.sleep(2)
        
        # 3. Use 'Assign to me' and update progress
        print("[*] Assigning story and updating progress...")
        js_update = """
        const callback = arguments[arguments.length - 1];
        
        // Mock UI selection
        const usInput = document.getElementById('user-story-input');
        if (usInput) {
            const opt = document.createElement('option');
            opt.value = 'SYNC-TEST-001';
            usInput.appendChild(opt);
            usInput.value = 'SYNC-TEST-001';
            window.handleUserStoryKeyChange();
            
            // Assign to me
            window.assignToMe();
            
            // Sync some fake progress
            if (window.syncStateToCloud) {
                window.syncStateToCloud('SYNC-TEST-001', 'manual', {'check-manual-0': true}, 50)
                    .then(() => callback('done'))
                    .catch(e => callback(e.toString()));
            } else {
                callback('done');
            }
        } else {
            callback('error');
        }
        """
        driver.execute_async_script(js_update)
        time.sleep(3)
        
        # 4. Logout (Lock app)
        print("[*] Logging out...")
        driver.execute_script("window.lockApplication();")
        time.sleep(1)
        
        # 5. Login as Lead Admin
        print("[*] Logging in as Lead Admin...")
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
        
        # 6. Open Admin Panel and verify
        print("[*] Opening Admin Panel...")
        admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
        if admin_btn.is_displayed():
            admin_btn.click()
            time.sleep(3)
            
            # Look for SYNC-TEST-001 in the table
            tbody = driver.find_element(By.ID, "admin-dashboard-tbody")
            rows = tbody.find_elements(By.TAG_NAME, "tr")
            found = False
            for row in rows:
                cols = row.find_elements(By.TAG_NAME, "td")
                if len(cols) >= 5:
                    us_name = cols[0].text
                    if us_name == "SYNC-TEST-001":
                        found = True
                        assignee = cols[2].text
                        progress_text = cols[3].text
                        
                        if "Tester-Sync" in assignee:
                            print(f"[PASS ✅] Assignee successfully synced: {assignee}")
                        else:
                            print(f"[FAIL ❌] Assignee is incorrect: {assignee}")
                            
                        if "50%" in progress_text:
                            print(f"[PASS ✅] Progress successfully synced and displayed: {progress_text}")
                        else:
                            print(f"[FAIL ❌] Progress is incorrect: {progress_text}")
                        break
            
            if not found:
                print("[FAIL ❌] Test user story was not found in Admin Panel!")
        else:
            print("[FAIL ❌] Admin button not visible!")
            
        print("[*] Cleaning up Firebase...")
        driver.execute_async_script("""
            const callback = arguments[arguments.length - 1];
            if (window.deleteStateFromCloud) {
                window.deleteStateFromCloud('SYNC-TEST-001').then(() => callback('done'));
            } else callback('done');
        """)
        
        print("\n============================================================")
        print("  🔄 TEST SUITE COMPLETED")
        print("============================================================")

    except Exception as e:
        print(f"\n[CRITICAL ERROR] Test script failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_sync_test()
