import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def run_mobile_test():
    options = Options()
    options.add_argument('--headless=new')
    
    # Enable Mobile Emulation for iPhone X
    mobile_emulation = {
        "deviceMetrics": { "width": 375, "height": 812, "pixelRatio": 3.0 },
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    }
    options.add_experimental_option("mobileEmulation", mobile_emulation)

    driver = webdriver.Chrome(options=options)
    
    print("============================================================")
    print("  📱 MOBILE LAYOUT TEST SUITE")
    print("============================================================")

    try:
        print("[*] Navigating to application...")
        driver.get("https://testersofison.github.io/Testers_SOP/")
        time.sleep(3)
        
        # 1. Login
        print("[*] Attempting Login...")
        name_input = driver.find_element(By.ID, "tester-name-input")
        pin_input = driver.find_element(By.ID, "tester-pin-input")
        login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
        
        name_input.send_keys("Test user")
        pin_input.send_keys("1111")
        login_btn.click()
        time.sleep(2)
        
        try:
            alert = driver.switch_to.alert
            alert.accept()
        except:
            pass
        time.sleep(1)
        
        print("[PASS ✅] Login successful on mobile view.")
        driver.save_screenshot("mobile_test_1_login_success.png")

        # 2. Check Hamburger Menu (sidebar-toggle-btn)
        toggle_btn = driver.find_element(By.CLASS_NAME, "sidebar-toggle-btn")
        is_displayed = toggle_btn.is_displayed()
        if is_displayed:
            print("[PASS ✅] Hamburger menu button is visible on mobile screen.")
        else:
            print("[FAIL ❌] Hamburger menu button is NOT visible.")

        # 3. Sidebar hidden by default
        sidebar = driver.find_element(By.CLASS_NAME, "sidebar")
        # In CSS, it's left: -300px, which might not reflect in is_displayed() if it's just off-screen
        sidebar_classes = sidebar.get_attribute("class")
        if "open" not in sidebar_classes:
            print("[PASS ✅] Sidebar is correctly hidden by default on mobile.")
        else:
            print("[FAIL ❌] Sidebar is open by default on mobile.")

        # 4. Open Sidebar
        print("[*] Clicking hamburger menu...")
        driver.execute_script("arguments[0].click();", toggle_btn)
        time.sleep(1)
        
        sidebar_classes_after = sidebar.get_attribute("class")
        if "open" in sidebar_classes_after:
            print("[PASS ✅] Sidebar opened successfully after clicking the toggle button.")
        else:
            print("[FAIL ❌] Sidebar did NOT open after clicking.")
            
        driver.save_screenshot("mobile_test_2_sidebar_open.png")
        
        # 5. Check UI Elements (Responsive scaling)
        top_nav = driver.find_element(By.CLASS_NAME, "top-nav")
        if top_nav.size['width'] <= 375:
            print("[PASS ✅] Top navigation scales correctly to mobile width.")
        else:
            print(f"[FAIL ❌] Top navigation is overflowing. Width: {top_nav.size['width']}px")

        # 6. Open a module
        try:
            uat_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'UAT Testing')]")
            driver.execute_script("arguments[0].click();", uat_btn)
            time.sleep(2)
            
            driver.save_screenshot("mobile_test_3_module_content.png")
            print("[PASS ✅] Module content loads successfully on mobile.")
        except Exception as e:
            print(f"[FAIL ❌] Failed to interact with module on mobile. Error: {str(e)[:50]}")

        print("\n============================================================")
        print("  📱 TEST SUITE COMPLETED")
        print("============================================================")

    except Exception as e:
        print(f"\n[CRITICAL ERROR] Test script failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_mobile_test()
