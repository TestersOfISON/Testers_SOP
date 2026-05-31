import os
import time
import base64
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_base64_image(driver, element=None):
    if element:
        return element.screenshot_as_base64
    return driver.get_screenshot_as_base64()

def get_local_b64(path):
    try:
        with open(path, 'rb') as f:
            return base64.b64encode(f.read()).decode('utf-8')
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return ""

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1280,1024')
    options.add_argument('--allow-file-access-from-files')
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get("http://localhost:8080/index.html")
        time.sleep(3)
        
        # Ensure Light Theme is active.
        driver.execute_script("document.documentElement.setAttribute('data-theme', 'light'); document.body.setAttribute('data-theme', 'light');")
        time.sleep(1)

        # Capture Login
        login_b64 = get_base64_image(driver)

        # Login
        driver.find_element(By.ID, "tester-name-input").send_keys("Test user")
        driver.find_element(By.ID, "tester-pin-input").send_keys("1111")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        
        # Wait for alert and accept it
        try:
            WebDriverWait(driver, 15).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
        except Exception as e:
            print("No alert during login or took too long:", e)
            
        # Wait for the modal to close
        try:
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.ID, "name-modal")))
        except:
            print("Modal did not disappear. Hiding manually.")
            driver.execute_script("document.getElementById('name-modal').style.display = 'none';")

        time.sleep(3) # Wait for dashboard rendering
        
        # Force light theme again in case it reverted
        driver.execute_script("document.documentElement.setAttribute('data-theme', 'light'); document.body.setAttribute('data-theme', 'light');")
        time.sleep(1)

        # Capture Dashboard
        dashboard_b64 = get_base64_image(driver)

        # Highlight Toggle Theme button and capture
        try:
            theme_btn = driver.find_element(By.CLASS_NAME, "theme-toggle")
            driver.execute_script("arguments[0].style.border='4px solid red'", theme_btn)
            time.sleep(0.5)
            theme_toggle_b64 = get_base64_image(driver)
            driver.execute_script("arguments[0].style.border=''", theme_btn)
        except Exception as e:
            print("Could not find theme-toggle button:", e)
            theme_toggle_b64 = dashboard_b64

        # Load user provided images for points 4, 5, 6
        checklist_img_path = r"C:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\media__1780153747257.png"
        progress_img_path = r"C:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\media__1780153863817.png"
        pwa_img_path = r"C:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\media__1780153953740.png"

        checklist_b64 = get_local_b64(checklist_img_path)
        progress_b64 = get_local_b64(progress_img_path)
        pwa_b64 = get_local_b64(pwa_img_path)

        # Generate HTML Manual with page-break-before: always; on h2
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>User Manual</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    line-height: 1.6;
                    color: #333;
                }}
                h1 {{ color: #2c3e50; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }}
                h2 {{ color: #34495e; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; page-break-before: always; }}
                /* Exception for first h2 so it doesn't break right after h1 unnecessarily */
                h2:first-of-type {{ page-break-before: avoid; }}
                p {{ font-size: 14px; margin-bottom: 15px; }}
                .img-container {{ text-align: center; margin: 20px 0; }}
                img {{ max-width: 90%; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }}
            </style>
        </head>
        <body>
            <h1>Application User Manual</h1>
            <p>Welcome to the SOP Task Manager application. This manual will guide you through the essential functionalities to manage your tasks effectively.</p>
            
            <h2>1. How to Login</h2>
            <p>To access the system, you must enter your username and a 4-digit PIN. Once entered, click the <strong>Unlock</strong> button to log in.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{login_b64}" alt="Login Screen">
            </div>

            <h2>2. Dashboard Overview</h2>
            <p>After a successful login, you will see your Dashboard. It displays your assigned User Stories. You can filter the view to see only your tasks by checking the "My Stories" checkbox.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{dashboard_b64}" alt="Dashboard">
            </div>

            <h2>3. Toggling the Theme</h2>
            <p>The application supports both Light and Dark themes. To switch themes, click the <strong>Toggle Theme</strong> button located at the top right of the dashboard.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{theme_toggle_b64}" alt="Toggle Theme">
            </div>

            <h2>4. Managing User Stories & Progress Bar</h2>
            <p>Your active and completion status are displayed directly in the dashboard list. You can monitor your overall progression across all assigned tasks easily without opening each one.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{progress_b64}" alt="Progress Bar">
            </div>

            <h2>5. Using Checklist</h2>
            <p>Once you switch into a User Story, tasks are organized into Checklists. Your progress relies on the entry and exit criteria you complete. Marking items as done will update your status.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{checklist_b64}" alt="Checklists">
            </div>

            <h2>6. Installing Desktop Application</h2>
            <p>You can install the SOP Task Manager directly as a standalone desktop application for faster access. Look for the install icon (a small computer with a downward arrow) on the right side of your browser's address bar. Click it to install the app on your device.</p>
            <div class="img-container">
                <img src="data:image/png;base64,{pwa_b64}" alt="Install PWA">
            </div>
            
            <br><br><br>
            <p style="text-align:center; font-size: 12px; color: #888; page-break-before: avoid;">&copy; 2026 Testers SOP Application. All Rights Reserved.</p>
        </body>
        </html>
        """

        html_path = os.path.abspath("manual.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        driver.get("file:///" + html_path.replace('\\', '/'))
        time.sleep(2)
        
        print_options = {
            'landscape': False,
            'displayHeaderFooter': False,
            'printBackground': True,
            'preferCSSPageSize': True,
        }
        result = driver.execute_cdp_cmd("Page.printToPDF", print_options)
        
        pdf_path = os.path.abspath("User_Manual.pdf")
        with open(pdf_path, "wb") as f:
            f.write(base64.b64decode(result['data']))
            
        print(f"PDF generated successfully at: {pdf_path}")
        
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
