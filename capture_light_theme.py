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
        
        try:
            name_input = driver.find_element(By.ID, "tester-name-input")
            pin_input = driver.find_element(By.ID, "tester-pin-input")
            login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
            
            # Login as a normal tester
            name_input.send_keys("MyTester")
            pin_input.send_keys("1234")
            login_btn.click()
            time.sleep(2)
            try:
                alert = driver.switch_to.alert
                alert.accept()
            except:
                pass
            time.sleep(1)
        except Exception as e:
            print("Error capturing login:", e)

        # Main Dashboard - Light Theme
        try:
            driver.save_screenshot(os.path.join(ARTIFACT_DIR, "guide_dashboard_light.png"))
        except Exception as e:
            print("Error capturing dashboard:", e)

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
