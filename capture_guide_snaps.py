import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

ARTIFACT_DIR = r"C:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb"

def highlight(driver, element):
    driver.execute_script("arguments[0].setAttribute('style', arguments[1]);", element, "border: 4px solid red; padding: 5px;")

def unhighlight(driver, element):
    driver.execute_script("arguments[0].setAttribute('style', '');", element)

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1280,800')
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get("https://testersofison.github.io/Testers_SOP/")
        time.sleep(3)
        
        # 1. Login Screen
        try:
            name_input = driver.find_element(By.ID, "tester-name-input")
            pin_input = driver.find_element(By.ID, "tester-pin-input")
            login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
            
            highlight(driver, name_input)
            highlight(driver, pin_input)
            highlight(driver, login_btn)
            
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_login.png"))
            
            unhighlight(driver, name_input)
            unhighlight(driver, pin_input)
            unhighlight(driver, login_btn)
            
            # Login as admin
            name_input.send_keys("Test user")
            pin_input.send_keys("ISON-ADMIN")
            login_btn.click()
            time.sleep(2)
        except Exception as e:
            print("Error capturing login:", e)

        # 2. Main Dashboard (Sidebar & Top Nav)
        try:
            sidebar = driver.find_element(By.CLASS_NAME, "sidebar")
            top_nav = driver.find_element(By.CLASS_NAME, "top-nav")
            
            highlight(driver, sidebar)
            highlight(driver, top_nav)
            
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_dashboard.png"))
            unhighlight(driver, sidebar)
            unhighlight(driver, top_nav)
        except Exception as e:
            print("Error capturing dashboard:", e)
            
        # 3. SOP Checklist Tab
        try:
            # Expand accordion if needed
            accordions = driver.find_elements(By.CLASS_NAME, "accordion")
            for acc in accordions:
                if "Test Execution" in acc.text:
                    if "active" not in acc.get_attribute("class"):
                        acc.click()
                        time.sleep(1)
                    break
            
            module_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'UAT Testing')]")
            driver.execute_script("arguments[0].click();", module_btn)
            time.sleep(2)
            
            tabs_container = driver.find_element(By.ID, "tabs-container")
            highlight(driver, tabs_container)
            
            story_bar = driver.find_element(By.ID, "user-story-bar-container")
            highlight(driver, story_bar)
            
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_checklist.png"))
            unhighlight(driver, tabs_container)
            unhighlight(driver, story_bar)
        except Exception as e:
            print("Error capturing checklist:", e)
            
        # 4. Admin Panel
        try:
            admin_btn = driver.find_element(By.ID, "admin-dashboard-btn")
            highlight(driver, admin_btn)
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_admin_btn.png"))
            unhighlight(driver, admin_btn)
            
            # Open admin panel
            driver.execute_script("arguments[0].click();", admin_btn)
            time.sleep(1)
            
            admin_modal = driver.find_element(By.ID, "admin-dashboard-modal")
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_admin_panel.png"))
            
        except Exception as e:
            print("Error capturing admin panel:", e)

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
