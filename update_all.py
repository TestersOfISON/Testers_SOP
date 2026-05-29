import os

BASE_DIR = r"c:\Users\vigne\Downloads\Libra\To commit"

def update_index_html():
    path = os.path.join(BASE_DIR, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add User Manual to sidebar
    target1 = '<button class="accordion active">Test Design & Management</button>'
    replacement1 = '''<button class="panel-btn" style="margin-bottom: 15px; font-weight: bold; background: rgba(37, 99, 235, 0.1);" onclick="loadModule('manual')"><span class="icon">📖</span> User Manual & Guidelines</button>
    
    <button class="accordion active">Test Design & Management</button>'''
    content = content.replace(target1, replacement1)

    # 2. Update syncStateToCloud to include testerName
    target2 = '''updates['user_stories/' + userStoryKey + '/' + moduleId] = stateObject;
        updates['user_stories/' + userStoryKey + '/overallProgress'] = overallProgress;
        updates['user_stories/' + userStoryKey + '/lastUpdated'] = new Date().toISOString();'''
    replacement2 = '''const testerName = localStorage.getItem('testerName') || "Anonymous Tester";
        updates['user_stories/' + userStoryKey + '/' + moduleId] = stateObject;
        updates['user_stories/' + userStoryKey + '/overallProgress'] = overallProgress;
        updates['user_stories/' + userStoryKey + '/lastUpdated'] = new Date().toISOString();
        updates['user_stories/' + userStoryKey + '/assignedToName'] = testerName;'''
    content = content.replace(target2, replacement2)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("index.html updated")

def update_app_js():
    path = os.path.join(BASE_DIR, "js", "app.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Tester Name Prompt logic at DOMContentLoaded
    target1 = '''document.addEventListener('DOMContentLoaded', () => {
      updateUserStoryDropdown();'''
    replacement1 = '''document.addEventListener('DOMContentLoaded', () => {
      // Tester Name Prompt
      let testerName = localStorage.getItem('testerName');
      if (!testerName) {
        testerName = prompt("Welcome to Libra QA!\\n\\nPlease enter your name to continue:");
        if (!testerName || testerName.trim() === '') {
          testerName = "Anonymous Tester";
        }
        localStorage.setItem('testerName', testerName.trim());
      }
      updateUserStoryDropdown();'''
    content = content.replace(target1, replacement1)

    # 2. Update loadChecklistState for Sequential Module Locking
    target2 = '''function loadChecklistState(moduleId) {
      if (!moduleId) return;
      const isSOPModule = activeChecklistModules.includes(moduleId);
      const storyKey = isSOPModule ? getActiveUserStoryKey() : '';
      const tKey = storyKey ? storyKey : 'default';
      
      const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);'''
    replacement2 = '''function loadChecklistState(moduleId) {
      if (!moduleId) return;
      const isSOPModule = activeChecklistModules.includes(moduleId);
      const storyKey = isSOPModule ? getActiveUserStoryKey() : '';
      const tKey = storyKey ? storyKey : 'default';
      
      const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);

      // --- SEQUENTIAL MODULE LOCKING ---
      let moduleLocked = false;
      if (isSOPModule) {
        const moduleIndex = activeChecklistModules.indexOf(moduleId);
        if (moduleIndex > 0) {
          const prevModuleId = activeChecklistModules[moduleIndex - 1];
          const prevProgress = getModuleProgress(prevModuleId, storyKey);
          if (prevProgress.percent < 100) {
            moduleLocked = true;
          }
        }
      }

      const checklistContainer = document.getElementById('checklist-container');
      const existingBanner = document.getElementById('module-locked-banner');
      if (existingBanner) existingBanner.remove();

      if (moduleLocked) {
        const prevModuleName = qaModules[activeChecklistModules[activeChecklistModules.indexOf(moduleId) - 1]].title;
        const bannerHtml = `<div id="module-locked-banner" style="background: #fee2e2; color: #991b1b; padding: 15px; margin: 15px; border-radius: 6px; border: 1px solid #f87171; display: flex; align-items: center; gap: 10px; font-weight: 500;">
          <span style="font-size: 1.2rem;">🔒</span>
          Please complete 100% of "${prevModuleName}" to unlock this module.
        </div>`;
        checklistContainer.insertAdjacentHTML('afterbegin', bannerHtml);
      }'''
    content = content.replace(target2, replacement2)

    # 3. Update loadChecklistState bottom to disable locked checkboxes
    target3 = '''      evaluateChecklistLogic(moduleId);
      
      if (isSOPModule) {
        updateProgressBar();
      }
    }'''
    replacement3 = '''      evaluateChecklistLogic(moduleId);
      
      if (moduleLocked) {
        checkboxes.forEach(cb => cb.disabled = true);
      }

      if (isSOPModule) {
        updateProgressBar();
      }
    }'''
    content = content.replace(target3, replacement3)

    # 4. Update evaluateChecklistLogic to ignore (If applicable)
    target4 = '''function evaluateChecklistLogic(moduleId) {
      if (!moduleId) return;
      const data = qaModules[moduleId];'''
    replacement4 = '''function isOptional(itemText) {
      return typeof itemText === 'string' && itemText.includes('(If applicable)');
    }

    function evaluateChecklistLogic(moduleId) {
      if (!moduleId) return;
      const data = qaModules[moduleId];'''
    content = content.replace(target4, replacement4)
    
    # Inside evaluateChecklistLogic replacements
    content = content.replace(
        "if (!cb.checked) {\n              allPreviousChecked = false;\n            }",
        "if (!cb.checked && !isOptional(item)) {\n              allPreviousChecked = false;\n            }"
    )
    content = content.replace(
        "if (!cb.checked) {\n                allPreviousChecked = false;\n                entryAllChecked = false;\n              }",
        "if (!cb.checked && !isOptional(item)) {\n                allPreviousChecked = false;\n                entryAllChecked = false;\n              }"
    )

    # 5. Format labels in loadModule
    target5 = '''      // Build Interactive Checklist
      const checklistContainer = document.getElementById('checklist-container');
      checklistContainer.innerHTML = '';
      if (Array.isArray(data.checklist)) {'''
    replacement5 = '''      // Build Interactive Checklist
      const checklistContainer = document.getElementById('checklist-container');
      checklistContainer.innerHTML = '';
      
      function formatLabel(text) {
        if (text.includes('(If applicable)')) {
          return text.replace('(If applicable)', '<span style="color: #64748b; font-size: 0.9em; font-style: italic; font-weight: normal; margin-left: 5px;">(If applicable)</span>');
        }
        return text;
      }

      if (Array.isArray(data.checklist)) {'''
    content = content.replace(target5, replacement5)
    
    # Replace label rendering
    content = content.replace('<label for="${id}">${item}</label>', '<label for="${id}">${formatLabel(item)}</label>')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("app.js updated")

def update_dashboard_html():
    path = os.path.join(BASE_DIR, "dashboard.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add Assinee column & Action column to table header
    target1 = '''            <th style="padding: 15px; border-bottom: 2px solid var(--border);">User Story</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Overall Progress</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Last Updated</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Status</th>'''
    replacement1 = '''            <th style="padding: 15px; border-bottom: 2px solid var(--border);">User Story</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Tester</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Overall Progress</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Last Updated</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border);">Status</th>
            <th style="padding: 15px; border-bottom: 2px solid var(--border); text-align: center;">Actions</th>'''
    content = content.replace(target1, replacement1)

    # 2. Add header Refresh button and delete logic
    target2 = '''<h1 style="color: var(--primary); display: flex; align-items: center; gap: 15px;">
        <span style="font-size: 2rem;">📊</span> Global QA Dashboard
      </h1>'''
    replacement2 = '''<h1 style="color: var(--primary); display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span style="display: flex; align-items: center; gap: 15px;"><span style="font-size: 2rem;">📊</span> Global QA Dashboard</span>
        <button class="btn btn-primary" style="font-size: 1rem;" onclick="location.reload()">🔄 Refresh Dashboard</button>
      </h1>'''
    content = content.replace(target2, replacement2)

    # 3. Add import for update function and write delete function
    target3 = '''import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";'''
    replacement3 = '''import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";'''
    content = content.replace(target3, replacement3)
    
    target4 = '''    const tbody = document.getElementById('dashboard-tbody');
    const storiesRef = ref(db, 'user_stories');'''
    replacement4 = '''    const tbody = document.getElementById('dashboard-tbody');
    const storiesRef = ref(db, 'user_stories');
    
    window.deleteStoryFromCloud = async function(storyKey) {
      if (confirm(`Are you sure you want to completely erase ${storyKey} from the cloud database?`)) {
        try {
          await update(ref(db), { ['user_stories/' + storyKey]: null });
          console.log(`Deleted ${storyKey} from cloud.`);
        } catch(e) {
          alert("Error deleting from cloud.");
        }
      }
    };'''
    content = content.replace(target4, replacement4)

    # 4. Render Table Row with Tester and Action button
    target5 = '''        const data = childSnapshot.val();
        const key = childSnapshot.key;
        const progress = data.overallProgress || 0;
        const date = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown';'''
    replacement5 = '''        const data = childSnapshot.val();
        const key = childSnapshot.key;
        const tester = data.assignedToName || 'Unknown Tester';
        const progress = data.overallProgress || 0;
        const date = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown';'''
    content = content.replace(target5, replacement5)

    target6 = '''        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 600; color: var(--primary);">${key}</td>
          <td>${progressHtml}</td>
          <td style="color: #777; font-size: 0.9rem;">${date}</td>
          <td>${statusBadge}</td>
        `;'''
    replacement6 = '''        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 600; color: var(--primary);">${key}</td>
          <td style="color: #334155; font-weight: 500;">👤 ${tester}</td>
          <td>${progressHtml}</td>
          <td style="color: #777; font-size: 0.9rem;">${date}</td>
          <td>${statusBadge}</td>
          <td style="text-align: center;"><button class="btn" style="background: #ef4444; color: white; padding: 5px 10px; font-size: 0.8rem;" onclick="deleteStoryFromCloud('${key}')">Delete</button></td>
        `;'''
    content = content.replace(target6, replacement6)

    # Fix colspan on empty state
    content = content.replace('colspan="4"', 'colspan="6"')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("dashboard.html updated")

update_index_html()
update_app_js()
update_dashboard_html()
