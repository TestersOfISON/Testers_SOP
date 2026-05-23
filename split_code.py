import os
import re

# Ensure directories exist
os.makedirs('css', exist_ok=True)
os.makedirs('js', exist_ok=True)

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
style_match = style_pattern.search(content)
if style_match:
    css_content = style_match.group(1).strip()
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)
    content = style_pattern.sub('<link rel="stylesheet" href="css/style.css">', content)
    print("Extracted style.css")

# Extract JS
script_pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
script_match = script_pattern.search(content)
if script_match:
    js_content = script_match.group(1).strip()
    
    # Split JS into data.js and app.js
    # qaModules starts with 'const qaModules =' and ends before 'const activeChecklistModules ='
    data_pattern = re.compile(r'(const qaModules = \{.*?\n    \};\n)', re.DOTALL)
    data_match = data_pattern.search(js_content)
    
    if data_match:
        data_content = data_match.group(1).strip()
        with open('js/data.js', 'w', encoding='utf-8') as f:
            f.write(data_content)
        print("Extracted data.js")
        
        app_content = js_content.replace(data_match.group(1), '').strip()
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(app_content)
        print("Extracted app.js")
        
        # Replace script tag
        replacement = '<script src="js/data.js"></script>\n  <script src="js/app.js"></script>'
        content = script_pattern.sub(replacement, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html")
