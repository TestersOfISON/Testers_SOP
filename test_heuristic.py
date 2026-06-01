from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from healer import smart_find

options = Options()
options.add_argument('--headless=new')
driver = webdriver.Chrome(options=options)
driver.get(r"file:///c:/Users/vigne/Downloads/Libra/index.html")

try:
    print("Looking for theme toggle...")
    btn = smart_find(driver, By.ID, "btn-theme-switch", "Dark mode toggle theme button")
    print(f"Found element with id: {btn.get_attribute('id')}")
except Exception as e:
    print(f"Failed: {e}")
driver.quit()
