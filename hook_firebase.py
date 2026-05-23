import re

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Insert the script tag before app.js
script_tag = '<script type="module" src="js/firebase-sync.js"></script>\n  <script src="js/app.js"></script>'
html = html.replace('<script src="js/app.js"></script>', script_tag)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Hook into saveChecklistState
hook_pattern = re.compile(r'(localStorage\.setItem\(`checklist_state_\$\{moduleId\}_\$\{activeKey\}`,\s*JSON\.stringify\(states\)\);)')
hook_replace = r'\1\n      if (window.syncStateToCloud) {\n        window.syncStateToCloud(activeKey, moduleId, states, getUserStoryOverallProgress(activeKey));\n      }'
app_js = hook_pattern.sub(hook_replace, app_js)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Firebase hooked into app successfully!")
