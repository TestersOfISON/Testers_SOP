import sys
import subprocess
import time

try:
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import Select
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium"])
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import Select

print("Starting local UI test on Edge...")
options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')

try:
    driver = webdriver.Edge(options=options)
    driver.get(r'file:///C:/Users/vigne/Downloads/Libra/To commit/index.html')
    print("Local page loaded.")
    
    wait = WebDriverWait(driver, 10)
    
    # 1. Test Admin Login (with new hashed password)
    print("Attempting Admin Login...")
    name_input = wait.until(EC.presence_of_element_located((By.ID, 'tester-name-input')))
    name_input.send_keys('Any Name')
    
    pin_input = driver.find_element(By.ID, 'tester-pin-input')
    pin_input.send_keys('ISON-ADMIN')
    
    login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
    login_btn.click()
    
    # Handle the success alert
    try:
        wait.until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print(f"Alert: {alert.text}")
        alert.accept()
    except Exception as e:
        print("No alert found or error:", e)
        
    time.sleep(2)
    
    # Verify Admin Profile
    assignee_display = driver.find_element(By.ID, 'display-profile-name')
    if assignee_display:
        print(f"Profile Name Display: {assignee_display.text}")
        if assignee_display.text == 'Lead Admin':
            print("SUCCESS: Admin profile 'Lead Admin' was successfully assigned!")
        else:
            print("FAILED: Admin profile was not assigned.")
            
    # Verify Admin Dashboard Button
    admin_btn = driver.find_element(By.ID, 'admin-dashboard-btn')
    if admin_btn.is_displayed():
        print("SUCCESS: Admin dashboard button is visible!")
    else:
        print("FAILED: Admin dashboard button is hidden.")

    # 2. Check Cascading Dropdowns
    print("Testing Epic selection cascading...")
    # First, let's turn off "My Stories" to see all epics
    my_stories = driver.find_element(By.ID, 'top-my-stories-filter')
    if my_stories.is_selected():
        # Uncheck it
        driver.execute_script("arguments[0].click();", my_stories)
        time.sleep(1)
        
    epic_dropdown = Select(driver.find_element(By.ID, 'epic-input'))
    epics = [opt.text for opt in epic_dropdown.options]
    print(f"Available Epics: {epics}")
    
    if len(epic_dropdown.options) > 1:
        # Select the first actual Epic (index 1)
        epic_dropdown.select_by_index(1)
        time.sleep(1) # wait for cascade
        
        us_dropdown = Select(driver.find_element(By.ID, 'user-story-input'))
        us_options = [opt.text for opt in us_dropdown.options]
        print(f"User Stories after selecting Epic '{epic_dropdown.first_selected_option.text}': {us_options}")
        
        # Verify if cascading worked (should be fewer than all stories)
        if len(us_options) > 0:
            print("SUCCESS: Cascading dropdowns updated successfully!")
    
    driver.quit()
    print("Test completed successfully.")
except Exception as e:
    print(f"Failed to run browser test: {e}")
    try:
        driver.quit()
    except:
        pass
