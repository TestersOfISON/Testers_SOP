import sys
import subprocess
import time

try:
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium"])
    from selenium import webdriver
    from selenium.webdriver.edge.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

try:
    driver = webdriver.Edge(options=options)
    driver.get(r'file:///C:/Users/vigne/Downloads/Libra/To commit/index.html')
    time.sleep(2) # Give it time to load and throw errors
    
    print("Browser logs:")
    for entry in driver.get_log('browser'):
        print(f"[{entry['level']}] {entry['message']}")
        
    driver.quit()
except Exception as e:
    print(f"Failed to run browser test: {e}")
