"""
==========================================================
 TEST SUITE: Theme Toggle & Admin Panel Functionality
 Target: https://testersofison.github.io/Testers_SOP/
 Author: Atlas (Automated Regression)
 Date: 2026-05-29
==========================================================
"""
import sys
import subprocess
import time
import json
import traceback

try:
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.common.action_chains import ActionChains
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium"])
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.common.action_chains import ActionChains

LIVE_URL = "https://testersofison.github.io/Testers_SOP/"
NORMAL_USER = "Test user"
NORMAL_PIN = "1111"
ADMIN_PIN = "ISON-ADMIN"

results = []

def record(test_id, name, status, detail=""):
    results.append({"id": test_id, "name": name, "status": status, "detail": detail})
    icon = "PASS ✅" if status == "PASS" else ("FAIL ❌" if status == "FAIL" else "WARN ⚠️")
    print(f"  [{icon}] {test_id}: {name}")
    if detail:
        print(f"          → {detail}")

def dismiss_alert(driver, timeout=5):
    """Dismiss any alert that pops up and return its text."""
    try:
        WebDriverWait(driver, timeout).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        text = alert.text
        alert.accept()
        return text
    except:
        return None

def login(driver, wait, username, pin):
    """Perform login with given credentials."""
    name_input = wait.until(EC.presence_of_element_located((By.ID, "tester-name-input")))
    name_input.clear()
    name_input.send_keys(username)
    pin_input = driver.find_element(By.ID, "tester-pin-input")
    pin_input.clear()
    pin_input.send_keys(pin)
    unlock_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
    unlock_btn.click()

def create_driver():
    """Create a fresh Edge WebDriver instance."""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-extensions")
    options.add_argument("--no-sandbox")
    driver = webdriver.Edge(options=options)
    driver.set_page_load_timeout(30)
    return driver

# ============================================================
#  TEST GROUP 1: THEME TOGGLE (Normal User)
# ============================================================
def run_theme_tests():
    print("\n" + "=" * 60)
    print("  GROUP 1: THEME TOGGLE TESTS")
    print("=" * 60)

    driver = create_driver()
    wait = WebDriverWait(driver, 15)

    try:
        # --- Setup: Login as normal user ---
        driver.get(LIVE_URL)
        time.sleep(3)
        login(driver, wait, NORMAL_USER, NORMAL_PIN)
        alert_text = dismiss_alert(driver, 8)
        time.sleep(2)

        # T1: Theme toggle button exists and is visible
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            is_displayed = toggle_btn.is_displayed()
            record("T1", "Theme toggle button exists and is visible",
                   "PASS" if is_displayed else "FAIL",
                   f"Displayed: {is_displayed}")
        except Exception as e:
            record("T1", "Theme toggle button exists and is visible", "FAIL", str(e))

        # T2: Default theme is 'light' (button shows moon 🌙)
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            btn_text = toggle_btn.text.strip()
            html_elem = driver.find_element(By.TAG_NAME, "html")
            data_theme = html_elem.get_attribute("data-theme") or "light"
            is_light = data_theme == "light"
            record("T2", "Default theme is light mode",
                   "PASS" if is_light else "WARN",
                   f"data-theme='{data_theme}', button text='{btn_text}'")
        except Exception as e:
            record("T2", "Default theme is light mode", "FAIL", str(e))

        # T3: Clicking toggle switches to dark mode
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            toggle_btn.click()
            time.sleep(1)
            html_elem = driver.find_element(By.TAG_NAME, "html")
            data_theme = html_elem.get_attribute("data-theme")
            btn_text = driver.find_element(By.ID, "theme-toggle").text.strip()
            is_dark = data_theme == "dark"
            record("T3", "Click toggle → switches to dark mode",
                   "PASS" if is_dark else "FAIL",
                   f"data-theme='{data_theme}', button text='{btn_text}'")
        except Exception as e:
            record("T3", "Click toggle → switches to dark mode", "FAIL", str(e))

        # T4: Clicking again switches back to light mode
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            toggle_btn.click()
            time.sleep(1)
            html_elem = driver.find_element(By.TAG_NAME, "html")
            data_theme = html_elem.get_attribute("data-theme")
            btn_text = driver.find_element(By.ID, "theme-toggle").text.strip()
            is_light = data_theme == "light"
            record("T4", "Click toggle again → switches back to light mode",
                   "PASS" if is_light else "FAIL",
                   f"data-theme='{data_theme}', button text='{btn_text}'")
        except Exception as e:
            record("T4", "Click toggle again → switches back to light mode", "FAIL", str(e))

        # T5: Theme persists in localStorage
        try:
            # Switch to dark to test persistence
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            toggle_btn.click()
            time.sleep(1)
            stored_theme = driver.execute_script("return localStorage.getItem('theme');")
            stored_pref = driver.execute_script("return localStorage.getItem('theme_preference');")
            stored_sop = driver.execute_script("return localStorage.getItem('sop_theme');")
            all_dark = (stored_theme == "dark" and stored_pref == "dark" and stored_sop == "dark")
            record("T5", "Theme persists in localStorage (all 3 keys)",
                   "PASS" if all_dark else "FAIL",
                   f"theme='{stored_theme}', theme_preference='{stored_pref}', sop_theme='{stored_sop}'")
        except Exception as e:
            record("T5", "Theme persists in localStorage (all 3 keys)", "FAIL", str(e))

        # T6: Theme persists after page reload
        try:
            driver.get(LIVE_URL)
            time.sleep(3)
            # Re-login
            login(driver, wait, NORMAL_USER, NORMAL_PIN)
            dismiss_alert(driver, 8)
            time.sleep(2)

            html_elem = driver.find_element(By.TAG_NAME, "html")
            data_theme = html_elem.get_attribute("data-theme")
            btn_text = driver.find_element(By.ID, "theme-toggle").text.strip()
            persisted = data_theme == "dark"
            record("T6", "Theme persists after page reload",
                   "PASS" if persisted else "FAIL",
                   f"data-theme='{data_theme}' after reload, button='{btn_text}'")
        except Exception as e:
            record("T6", "Theme persists after page reload", "FAIL", str(e))

        # T7: CSS variables change with theme
        try:
            bg_dark = driver.execute_script(
                "return getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();"
            )
            # Toggle to light
            driver.find_element(By.ID, "theme-toggle").click()
            time.sleep(1)
            bg_light = driver.execute_script(
                "return getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();"
            )
            different = bg_dark != bg_light
            record("T7", "CSS --bg-color changes between themes",
                   "PASS" if different else "FAIL",
                   f"Dark: '{bg_dark}', Light: '{bg_light}'")
        except Exception as e:
            record("T7", "CSS --bg-color changes between themes", "FAIL", str(e))

        # T8: Rapid toggle stress test (5 quick toggles)
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            for _ in range(5):
                toggle_btn.click()
                time.sleep(0.3)
            time.sleep(1)
            html_elem = driver.find_element(By.TAG_NAME, "html")
            final_theme = html_elem.get_attribute("data-theme")
            stored = driver.execute_script("return localStorage.getItem('theme');")
            in_sync = final_theme == stored
            record("T8", "Rapid toggle stress test (5 clicks) → DOM and localStorage in sync",
                   "PASS" if in_sync else "FAIL",
                   f"DOM data-theme='{final_theme}', localStorage='{stored}'")
        except Exception as e:
            record("T8", "Rapid toggle stress test (5 clicks)", "FAIL", str(e))

        # Take screenshot after theme tests
        driver.save_screenshot("test_theme_result.png")
        print("  📸 Screenshot saved: test_theme_result.png")

    except Exception as e:
        record("T_ERR", "Theme test group unexpected error", "FAIL", traceback.format_exc())
    finally:
        driver.quit()

# ============================================================
#  TEST GROUP 2: ADMIN PANEL FUNCTIONALITY
# ============================================================
def run_admin_tests():
    print("\n" + "=" * 60)
    print("  GROUP 2: ADMIN PANEL TESTS")
    print("=" * 60)

    driver = create_driver()
    wait = WebDriverWait(driver, 15)

    try:
        # --- Setup: Login as Admin ---
        driver.get(LIVE_URL)
        time.sleep(3)

        # A1: Admin login via hashed PIN
        try:
            login(driver, wait, "Admin", ADMIN_PIN)
            alert_text = dismiss_alert(driver, 8)
            time.sleep(2)
            is_admin_alert = alert_text and "Admin Mode" in alert_text
            record("A1", "Admin login with ISON-ADMIN PIN",
                   "PASS" if is_admin_alert else "FAIL",
                   f"Alert text: '{alert_text}'")
        except Exception as e:
            record("A1", "Admin login with ISON-ADMIN PIN", "FAIL", str(e))

        # A2: Username displays as 'Lead Admin'
        try:
            display_name = driver.find_element(By.ID, "display-profile-name")
            name_text = display_name.text.strip()
            record("A2", "Display name shows 'Lead Admin'",
                   "PASS" if name_text == "Lead Admin" else "FAIL",
                   f"Displayed name: '{name_text}'")
        except Exception as e:
            record("A2", "Display name shows 'Lead Admin'", "FAIL", str(e))

        # A3: Admin dashboard button is visible
        try:
            admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
            is_visible = admin_btn.is_displayed()
            record("A3", "Admin Panel button is visible after admin login",
                   "PASS" if is_visible else "FAIL",
                   f"Button displayed: {is_visible}")
        except Exception as e:
            record("A3", "Admin Panel button is visible after admin login", "FAIL", str(e))

        # A4: Admin Panel modal opens on click
        try:
            admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
            admin_btn.click()
            time.sleep(3)  # Wait for Firebase data to load
            modal = driver.find_element(By.ID, "admin-dashboard-modal")
            modal_visible = modal.is_displayed()
            record("A4", "Admin Panel modal opens on button click",
                   "PASS" if modal_visible else "FAIL",
                   f"Modal displayed: {modal_visible}")
        except Exception as e:
            record("A4", "Admin Panel modal opens on button click", "FAIL", str(e))

        # A5: Admin Panel header text is correct
        try:
            header = driver.find_element(By.XPATH, "//h3[contains(text(), 'Lead Admin Panel')]")
            record("A5", "Admin Panel header shows '👑 Lead Admin Panel'",
                   "PASS",
                   f"Header text: '{header.text}'")
        except Exception as e:
            record("A5", "Admin Panel header shows '👑 Lead Admin Panel'", "FAIL", str(e))

        # A6: Admin Panel table has data rows
        try:
            tbody = driver.find_element(By.ID, "admin-dashboard-tbody")
            rows = tbody.find_elements(By.TAG_NAME, "tr")
            has_data = len(rows) > 0
            # Check it's not just a "Loading..." or "No user stories" message
            first_row_text = rows[0].text if rows else ""
            is_real_data = has_data and "Loading" not in first_row_text
            record("A6", "Admin Panel table populates with user stories",
                   "PASS" if is_real_data else "WARN",
                   f"Row count: {len(rows)}, First row: '{first_row_text[:80]}...'")
        except Exception as e:
            record("A6", "Admin Panel table populates with user stories", "FAIL", str(e))

        # A7: Admin Panel table columns are correct (User Story, Epic, Assignee, Last Updated, Actions)
        try:
            headers = driver.find_elements(By.CSS_SELECTOR, "#admin-dashboard-modal thead th")
            header_texts = [h.text.strip() for h in headers]
            expected = ["User Story", "Epic", "Assignee", "Progress", "Last Updated", "Actions"]
            match = header_texts == expected
            record("A7", "Admin Panel table has correct column headers",
                   "PASS" if match else "FAIL",
                   f"Headers: {header_texts}")
        except Exception as e:
            record("A7", "Admin Panel table has correct column headers", "FAIL", str(e))

        # A8: Each data row has an 'Edit' button
        try:
            tbody = driver.find_element(By.ID, "admin-dashboard-tbody")
            rows = tbody.find_elements(By.TAG_NAME, "tr")
            edit_buttons = tbody.find_elements(By.XPATH, ".//button[contains(text(), 'Edit')]")
            all_have_edit = len(edit_buttons) >= len(rows) and len(rows) > 0
            record("A8", "Each data row has an Edit button",
                   "PASS" if all_have_edit else "WARN",
                   f"Data rows: {len(rows)}, Edit buttons: {len(edit_buttons)}")
        except Exception as e:
            record("A8", "Each data row has an Edit button", "FAIL", str(e))

        # A9: Create New Epic/User Story form elements exist
        try:
            epic_input = driver.find_element(By.ID, "admin-new-epic-input")
            us_input = driver.find_element(By.ID, "admin-new-us-input")
            assignee_input = driver.find_element(By.ID, "admin-new-assignee-input")
            all_exist = epic_input.is_displayed() and us_input.is_displayed() and assignee_input.is_displayed()
            record("A9", "Create New Epic/User Story form fields exist and are visible",
                   "PASS" if all_exist else "FAIL",
                   f"Epic: {epic_input.is_displayed()}, US: {us_input.is_displayed()}, Assignee: {assignee_input.is_displayed()}")
        except Exception as e:
            record("A9", "Create New Epic/User Story form fields exist", "FAIL", str(e))

        # A10: Close button works on Admin Panel modal
        try:
            close_btn = driver.find_element(By.XPATH, "//div[@id='admin-dashboard-modal']//button[contains(text(),'Close')]")
            close_btn.click()
            time.sleep(1)
            modal = driver.find_element(By.ID, "admin-dashboard-modal")
            is_hidden = not modal.is_displayed()
            record("A10", "Admin Panel modal Close button works",
                   "PASS" if is_hidden else "FAIL",
                   f"Modal hidden after close: {is_hidden}")
        except Exception as e:
            record("A10", "Admin Panel modal Close button works", "FAIL", str(e))

        # A11: localStorage has isAdmin set to 'true'
        try:
            is_admin = driver.execute_script("return localStorage.getItem('isAdmin');")
            record("A11", "localStorage 'isAdmin' is set to 'true'",
                   "PASS" if is_admin == "true" else "FAIL",
                   f"isAdmin='{is_admin}'")
        except Exception as e:
            record("A11", "localStorage 'isAdmin' is set to 'true'", "FAIL", str(e))

        # A12: Admin Panel button persists after page reload (admin state stays)
        try:
            driver.get(LIVE_URL)
            time.sleep(3)
            # The name-modal might appear again; check if admin state persists
            is_admin_stored = driver.execute_script("return localStorage.getItem('isAdmin');")
            record("A12", "Admin state (isAdmin) persists in localStorage after reload",
                   "PASS" if is_admin_stored == "true" else "FAIL",
                   f"isAdmin='{is_admin_stored}'")
        except Exception as e:
            record("A12", "Admin state persists after reload", "FAIL", str(e))

        # Take screenshot after admin tests
        driver.save_screenshot("test_admin_result.png")
        print("  📸 Screenshot saved: test_admin_result.png")

    except Exception as e:
        record("A_ERR", "Admin test group unexpected error", "FAIL", traceback.format_exc())
    finally:
        driver.quit()

# ============================================================
#  TEST GROUP 3: NORMAL USER SHOULD NOT SEE ADMIN PANEL
# ============================================================
def run_non_admin_tests():
    print("\n" + "=" * 60)
    print("  GROUP 3: NON-ADMIN USER RESTRICTION TESTS")
    print("=" * 60)

    driver = create_driver()
    wait = WebDriverWait(driver, 15)

    try:
        driver.get(LIVE_URL)
        time.sleep(3)

        # Clear any previous admin state
        driver.execute_script("localStorage.removeItem('isAdmin');")
        driver.get(LIVE_URL)
        time.sleep(3)

        login(driver, wait, NORMAL_USER, NORMAL_PIN)
        alert_text = dismiss_alert(driver, 8)
        time.sleep(2)

        # N1: Normal user login alert does NOT mention Admin
        try:
            is_normal = alert_text and "Admin" not in alert_text
            record("N1", "Normal user login alert does not mention 'Admin'",
                   "PASS" if is_normal else "FAIL",
                   f"Alert: '{alert_text}'")
        except Exception as e:
            record("N1", "Normal user login alert check", "FAIL", str(e))

        # N2: Admin Panel button is hidden for normal users
        try:
            admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
            is_hidden = not admin_btn.is_displayed()
            record("N2", "Admin Panel button is hidden for normal users",
                   "PASS" if is_hidden else "FAIL",
                   f"Button displayed: {admin_btn.is_displayed()}")
        except Exception as e:
            record("N2", "Admin Panel button is hidden for normal users", "FAIL", str(e))

        # N3: localStorage 'isAdmin' is NOT 'true' for normal users
        try:
            is_admin = driver.execute_script("return localStorage.getItem('isAdmin');")
            not_admin = is_admin != "true"
            record("N3", "Normal user does NOT have isAdmin='true' in localStorage",
                   "PASS" if not_admin else "FAIL",
                   f"isAdmin='{is_admin}'")
        except Exception as e:
            record("N3", "Normal user isAdmin check", "FAIL", str(e))

        # N4: Display name shows the normal username, NOT 'Lead Admin'
        try:
            display_name = driver.find_element(By.ID, "display-profile-name")
            name_text = display_name.text.strip()
            record("N4", "Normal user display name is not 'Lead Admin'",
                   "PASS" if name_text != "Lead Admin" and name_text == NORMAL_USER else "FAIL",
                   f"Displayed name: '{name_text}'")
        except Exception as e:
            record("N4", "Normal user display name check", "FAIL", str(e))

        # N5: Theme toggle still works for normal users
        try:
            toggle_btn = driver.find_element(By.ID, "theme-toggle")
            html_elem = driver.find_element(By.TAG_NAME, "html")
            before = html_elem.get_attribute("data-theme")
            toggle_btn.click()
            time.sleep(1)
            after = html_elem.get_attribute("data-theme")
            changed = before != after
            record("N5", "Theme toggle works for normal users",
                   "PASS" if changed else "FAIL",
                   f"Before: '{before}', After: '{after}'")
        except Exception as e:
            record("N5", "Theme toggle works for normal users", "FAIL", str(e))

        # Navigate to Standard Operating Procedure (Checklist) tab for SOP layout/filter checks
        try:
            tabs = driver.find_elements(By.CLASS_NAME, "tab-btn")
            for tab in tabs:
                if "Standard Operating Procedure" in tab.text:
                    driver.execute_script("arguments[0].click();", tab)
                    break
            time.sleep(2)
        except Exception as e:
            print("Failed to navigate to SOP checklist tab:", e)

        # N6: My Stories checkbox checked keeps dropdown layout inline (no wrap)
        try:
            my_stories = driver.find_element(By.ID, "top-my-stories-filter")
            if not my_stories.is_selected():
                driver.execute_script("arguments[0].click();", my_stories)
                time.sleep(1.5)
                
            loc_epic = driver.find_element(By.ID, "epic-input").location
            loc_us = driver.find_element(By.ID, "user-story-input").location
            is_inline = abs(loc_epic['y'] - loc_us['y']) < 15
            record("N6", "My Stories checkbox checked keeps dropdown layout inline (no wrap)",
                   "PASS" if is_inline else "FAIL",
                   f"Epic Y: {loc_epic['y']}, US Y: {loc_us['y']}, diff: {abs(loc_epic['y'] - loc_us['y'])}")
        except Exception as e:
            record("N6", "My Stories checkbox checked keeps dropdown layout inline (no wrap)", "FAIL", str(e))

        # N7: My Stories dropdown is not empty for Test user
        try:
            us_select = driver.find_element(By.ID, "user-story-input")
            options = us_select.find_elements(By.TAG_NAME, "option")
            has_assigned = len(options) > 1
            record("N7", "My Stories checkbox checked populates assigned user stories (not empty)",
                   "PASS" if has_assigned else "FAIL",
                   f"Options count: {len(options)}")
        except Exception as e:
            record("N7", "My Stories checkbox checked populates assigned user stories (not empty)", "FAIL", str(e))

        driver.save_screenshot("test_non_admin_result.png")
        print("  📸 Screenshot saved: test_non_admin_result.png")

    except Exception as e:
        record("N_ERR", "Non-admin test group unexpected error", "FAIL", traceback.format_exc())
    finally:
        driver.quit()

# ============================================================
#  TEST GROUP 4: WRONG ADMIN PASSWORD REJECTION
# ============================================================
def run_wrong_admin_tests():
    print("\n" + "=" * 60)
    print("  GROUP 4: WRONG ADMIN PASSWORD TESTS")
    print("=" * 60)

    driver = create_driver()
    wait = WebDriverWait(driver, 15)

    try:
        driver.get(LIVE_URL)
        time.sleep(3)
        # Clear admin state
        driver.execute_script("localStorage.removeItem('isAdmin');")
        driver.get(LIVE_URL)
        time.sleep(3)

        # W1: Wrong admin password does NOT grant admin access
        try:
            login(driver, wait, "Hacker", "WRONG-PASS")
            alert_text = dismiss_alert(driver, 8)
            time.sleep(2)

            # If an admin alert appeared, that's a security issue
            is_admin = driver.execute_script("return localStorage.getItem('isAdmin');")
            not_admin = is_admin != "true"
            no_admin_alert = alert_text is None or "Admin Mode" not in (alert_text or "")
            record("W1", "Wrong admin password does NOT grant admin access",
                   "PASS" if not_admin and no_admin_alert else "FAIL",
                   f"isAdmin='{is_admin}', alert='{alert_text}'")
        except Exception as e:
            record("W1", "Wrong admin password rejection", "FAIL", str(e))

        driver.save_screenshot("test_wrong_admin_result.png")
        print("  📸 Screenshot saved: test_wrong_admin_result.png")

    except Exception as e:
        record("W_ERR", "Wrong admin test group unexpected error", "FAIL", traceback.format_exc())
    finally:
        driver.quit()

# ============================================================
#  MAIN RUNNER
# ============================================================
if __name__ == "__main__":
    print("\n" + "🔬" * 30)
    print("  ATLAS REGRESSION TEST SUITE")
    print(f"  Target: {LIVE_URL}")
    print(f"  Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("🔬" * 30)

    run_theme_tests()
    run_admin_tests()
    run_non_admin_tests()
    run_wrong_admin_tests()

    # ========== SUMMARY ==========
    print("\n" + "=" * 60)
    print("  📊 TEST RESULTS SUMMARY")
    print("=" * 60)

    total = len(results)
    passed = sum(1 for r in results if r["status"] == "PASS")
    failed = sum(1 for r in results if r["status"] == "FAIL")
    warned = sum(1 for r in results if r["status"] == "WARN")

    print(f"\n  Total: {total}  |  ✅ Passed: {passed}  |  ❌ Failed: {failed}  |  ⚠️ Warnings: {warned}")
    print(f"  Pass Rate: {passed/total*100:.1f}%" if total > 0 else "  No tests ran.")

    if failed > 0:
        print("\n  ❌ FAILED TESTS:")
        for r in results:
            if r["status"] == "FAIL":
                print(f"     • {r['id']}: {r['name']}")
                if r["detail"]:
                    print(f"       → {r['detail']}")

    if warned > 0:
        print("\n  ⚠️ WARNINGS:")
        for r in results:
            if r["status"] == "WARN":
                print(f"     • {r['id']}: {r['name']}")
                if r["detail"]:
                    print(f"       → {r['detail']}")

    print("\n" + "=" * 60)
    print("  Test suite completed.")
    print("=" * 60)
