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

print("Starting live test on Edge...")
options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')

try:
    driver = webdriver.Edge(options=options)
    driver.get('https://testersofison.github.io/Testers_SOP/')
    print("Page loaded.")
    
    wait = WebDriverWait(driver, 10)
    
    # 1. Login
    print("Attempting login...")
    name_input = wait.until(EC.presence_of_element_located((By.ID, 'tester-name-input')))
    name_input.send_keys('Test user')
    
    pin_input = driver.find_element(By.ID, 'tester-pin-input')
    pin_input.send_keys('1111')
    
    login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]")
    login_btn.click()
    print("Login button clicked.")
    
    time.sleep(3) # Wait for firebase sync and UI load
    
    # 2. Check Layout changes
    print("Checking layout changes...")
    my_stories_cb = driver.find_element(By.ID, 'top-my-stories-filter')
    if my_stories_cb:
        print(f"My Stories checkbox found! Checked status: {my_stories_cb.is_selected()}")
    
    assignee_display = driver.find_element(By.ID, 'current-assignee-display')
    if assignee_display:
        print(f"Assignee display found! Text: {assignee_display.text}")
    
    # 3. Check Cascading Dropdowns
    print("Testing Epic selection...")
    epic_dropdown = Select(driver.find_element(By.ID, 'epic-input'))
    epics = [opt.text for opt in epic_dropdown.options]
    print(f"Available Epics: {epics}")
    
    if len(epic_dropdown.options) > 1:
        # Select the first actual Epic
        epic_dropdown.select_by_index(1)
        time.sleep(1) # wait for cascade
        
        us_dropdown = Select(driver.find_element(By.ID, 'user-story-input'))
        us_options = [opt.text for opt in us_dropdown.options]
        print(f"User Stories after selecting Epic '{epic_dropdown.first_selected_option.text}': {us_options}")
    
    # 4. Take Screenshot
    screenshot_path = 'live_test_screenshot.png'
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")
    
    driver.quit()
    print("Test completed successfully.")
except Exception as e:
    print(f"Failed to run browser test: {e}")
    try:
        driver.quit()
    except:
        pass
