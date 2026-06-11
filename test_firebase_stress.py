import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def run_stress_test():
    options = Options()
    options.add_argument('--headless=new')
    driver = webdriver.Chrome(options=options)
    
    print("============================================================")
    print("  [*] FIREBASE PERFORMANCE STRESS TEST")
    print("============================================================")

    try:
        print("[*] Navigating to application...")
        driver.get("https://testersofison.github.io/Testers_SOP/")
        time.sleep(3)
        
        print("[*] Logging in...")
        driver.find_element(By.ID, "tester-name-input").send_keys("StressTester")
        driver.find_element(By.ID, "tester-pin-input").send_keys("9999")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock')]").click()
        time.sleep(2)
        try:
            driver.switch_to.alert.accept()
        except:
            pass
        time.sleep(2)
        
        print("[*] Executing Firebase stress load (50 sequential writes, 50 sequential reads)...")
        
        js_script = """
        const callback = arguments[arguments.length - 1];
        
        async function runStressTest() {
            let writeTimes = [];
            let readTimes = [];
            
            // 50 Writes
            for(let i = 0; i < 50; i++) {
                const start = performance.now();
                await window.syncStateToCloud('STRESS-TEST-123', 'manual', { 'step-1': true, 'iteration': i }, 100);
                writeTimes.push(performance.now() - start);
            }
            
            // 50 Reads
            for(let i = 0; i < 50; i++) {
                const start = performance.now();
                await window.fetchGlobalDataForDatalists();
                readTimes.push(performance.now() - start);
            }
            
            // Cleanup
            if (window.deleteStateFromCloud) {
                await window.deleteStateFromCloud('STRESS-TEST-123');
            }
            if (window.db && window.db.ref) {
                await window.db.ref('users/StressTester').remove();
            }
            
            const sumW = writeTimes.reduce((a, b) => a + b, 0);
            const sumR = readTimes.reduce((a, b) => a + b, 0);
            
            callback({
                avgWrite: sumW / 50,
                maxWrite: Math.max(...writeTimes),
                minWrite: Math.min(...writeTimes),
                avgRead: sumR / 50,
                maxRead: Math.max(...readTimes),
                minRead: Math.min(...readTimes)
            });
        }
        
        runStressTest().catch(err => callback({error: err.toString()}));
        """
        
        driver.set_script_timeout(120)
        results = driver.execute_async_script(js_script)
        
        if 'error' in results:
            print(f"[FAIL XX] Test encountered an error: {results['error']}")
        else:
            print("\n[PASS OK] Stress test completed successfully!")
            print("--- Write Performance (50 sequential updates) ---")
            print(f"Average: {results['avgWrite']:.2f} ms")
            print(f"Max latency: {results['maxWrite']:.2f} ms")
            print(f"Min latency: {results['minWrite']:.2f} ms")
            
            print("\n--- Read Performance (50 sequential fetches) ---")
            print(f"Average: {results['avgRead']:.2f} ms")
            print(f"Max latency: {results['maxRead']:.2f} ms")
            print(f"Min latency: {results['minRead']:.2f} ms")
            
    except Exception as e:
        print(f"\n[CRITICAL ERROR] Test script failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_stress_test()
