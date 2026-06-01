import traceback
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

def smart_find(driver, by, locator, description):
    try:
        return driver.find_element(by, locator)
    except NoSuchElementException:
        print(f"\n[SELF-HEALING] ⚠️ Element '{locator}' not found! Attempting to heal for: '{description}'...")
        
        # Scrape interactive elements (buttons, inputs, links)
        elements = driver.find_elements(By.XPATH, "//button | //input | //a")
        
        best_match = None
        best_score = 0.0
        
        for el in elements:
            try:
                # Text content
                text = el.text.strip()
                title = el.get_attribute("title") or ""
                id_attr = el.get_attribute("id") or ""
                class_attr = el.get_attribute("class") or ""
                
                combined_text = f"{text} {title} {id_attr} {class_attr}".lower()
                
                # Check for exact keyword matching
                keywords = description.lower().split()
                matches = sum(1 for k in keywords if k in combined_text)
                
                score = matches / len(keywords) if keywords else 0
                
                # Heavily penalize large text blocks
                if len(text) > 50:
                    score = 0
                
                if score > 0:
                    clean_text = combined_text.encode('ascii', 'ignore').decode('ascii')
                    print(f"   [Debug] '{clean_text[:50]}' -> Score: {score:.2f} (matches: {matches})", flush=True)
                
                if score > best_score:
                    best_score = score
                    best_match = el
            except Exception:
                pass
                
        if best_match and best_score >= 0.3:
            new_id = best_match.get_attribute("id")
            
            if new_id:
                print(f"[SELF-HEALING] Found new element with ID: '{new_id}' (Confidence: {best_score*100:.0f}%)")
                # Only patch the file if we originally searched by ID, or if we want to upgrade to ID
                if by == By.ID:
                    _patch_file(locator, new_id)
                return driver.find_element(By.ID, new_id)
            else:
                if best_match.text:
                    new_xpath = f"//{best_match.tag_name}[contains(text(), '{best_match.text.strip()}')]"
                else:
                    raise Exception(f"[SELF-HEALING] Failed. Match found but no reliable XPath could be generated.")
                    
                print(f"[SELF-HEALING] Found new element with XPath: '{new_xpath}' (Confidence: {best_score*100:.0f}%)")
                if by == By.XPATH:
                    _patch_file(locator, new_xpath)
                return driver.find_element(By.XPATH, new_xpath)
                
        raise Exception(f"[SELF-HEALING] ❌ Failed. Could not find alternative for '{description}'")

def _patch_file(old_locator, new_locator):
    stack = traceback.extract_stack()
    target_frame = None
    for frame in reversed(stack):
        if not frame.filename.endswith("healer.py"):
            target_frame = frame
            break
            
    if target_frame:
        filepath = target_frame.filename
        line_num = target_frame.lineno
        
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        target_line = lines[line_num - 1]
        
        # Simple text replacement for the locator string
        new_line = target_line.replace(f'"{old_locator}"', f'"{new_locator}"').replace(f"'{old_locator}'", f"'{new_locator}'")
        lines[line_num - 1] = new_line
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.writelines(lines)
            
        print(f"[SELF-HEALING] 🪄 Successfully patched test script at line {line_num} with new locator.")
