import sys
import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

try:
    driver = webdriver.Edge(options=options)
    
    print("--- Testing index.html ---")
    driver.get(r'file:///C:/Users/vigne/Downloads/Libra/To commit/index.html')
    time.sleep(3) # Wait for modules to load
    
    # Try to execute a sync directly to see if Firebase throws an error
    driver.execute_script("""
        if (window.syncStateToCloud) {
            window.syncStateToCloud('TEST-123', 'ai_generation', { test: true }, 50);
        } else {
            console.error("syncStateToCloud is NOT defined!");
        }
    """)
    time.sleep(3) # Wait for network request to Firebase to complete/fail
    
    for entry in driver.get_log('browser'):
        if entry['level'] == 'SEVERE':
            print(f"[index.html ERROR] {entry['message']}")
            
    print("\n--- Testing dashboard.html ---")
    driver.get(r'file:///C:/Users/vigne/Downloads/Libra/To commit/dashboard.html')
    time.sleep(4) # Wait for Firebase onSnapshot
    
    for entry in driver.get_log('browser'):
        if entry['level'] == 'SEVERE':
            print(f"[dashboard.html ERROR] {entry['message']}")

    driver.quit()
except Exception as e:
    print(f"Failed to run browser test: {e}")
