
document.addEventListener('DOMContentLoaded', () => {
  // Theme Initialization
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Sidebar Search Logic
  const moduleSearch = document.getElementById('module-search');
  if (moduleSearch) {
    moduleSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const sidebarBtns = document.querySelectorAll('.panel-btn');
      sidebarBtns.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes(query)) {
          btn.style.display = 'block';
        } else {
          btn.style.display = 'none';
        }
      });
    });
  }
});

let complianceChart = null;
function updateComplianceChart(percent) {
  const ctx = document.getElementById('complianceChart');
  if (!ctx) return;
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const bgColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  
  if (complianceChart) {
    complianceChart.data.datasets[0].data = [percent, 100 - percent];
    complianceChart.data.datasets[0].backgroundColor[1] = bgColor;
    complianceChart.update();
  } else {
    // wait for Chart to load from CDN
    if(typeof Chart === 'undefined') return;
    complianceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [ '#10b981', bgColor ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } }
      }
    });
  }
}

try {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
  }
} catch(e) {
  console.error("Mermaid initialization failed", e);
}

    // Apply saved theme preference on page load
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }

    // --- DATA STORE FOR QA MODULES ---
    
    const activeChecklistModules = ['ai_generation', 'test_design', 'scenario_validation', 'uat', 'smoke', 'prl', 'regression'];
    let currentModuleId = null;

    // --- ACCORDION LOGIC ---
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) { panel.style.maxHeight = null; } 
        else { panel.style.maxHeight = panel.scrollHeight + "px"; }
      });
    }

    // --- TAB LOGIC ---
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      if (typeof event !== 'undefined' && event && event.target && event.target.classList) {
        event.target.classList.add('active');
      } else {
        const btn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
        if (btn) btn.classList.add('active');
      }
      
      const tabContent = document.getElementById(`tab-${tabId}`);
      if (tabContent) tabContent.classList.add('active');
    }

    // --- THEME TOGGLE ---
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('theme_preference', newTheme);
      
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
      
      if (typeof complianceChart !== 'undefined' && complianceChart) {
        complianceChart.data.datasets[0].backgroundColor[1] = newTheme === 'dark' ? '#334155' : '#e2e8f0';
        complianceChart.update();
      }
    }

    // --- SIDEBAR TOGGLE FOR MOBILE ---
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    }

    function closeSidebarOnMobile() {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
    }

    // --- TESTER NAME MANAGEMENT ---
    window.changeTesterName = function() {
      const current = localStorage.getItem('testerName') || '';
      const newName = prompt("Update your name for the QA Dashboard:", current);
      if (newName && newName.trim() !== '') {
        localStorage.setItem('testerName', newName.trim());
        alert("Name updated successfully! Your progress will now be synced under: " + newName.trim());
        // Force sync current state to update name in cloud immediately
        if (typeof currentModuleId !== 'undefined' && currentModuleId) {
          saveChecklistState(currentModuleId);
        }
      }
    };

    // --- TICKET & REGISTRY UTILITIES ---
    function getActiveUserStoryKey() {
      const input = document.getElementById('user-story-input');
      return input ? input.value.trim().toUpperCase() : '';
    }

    function getUserStoryRegistry() {
      const saved = localStorage.getItem('sop_user_story_registry');
      if (!saved) return [];
      try {
        return JSON.parse(saved);
      } catch(e) {
        return [];
      }
    }

    function addToUserStoryRegistry(storyKey) {
      if (!storyKey) return;
      const registry = getUserStoryRegistry();
      if (!registry.includes(storyKey)) {
        registry.push(storyKey);
        localStorage.setItem('sop_user_story_registry', JSON.stringify(registry));
        updateUserStoryDropdown();
      }
    }

    function saveUserStoryMetadata(storyKey, moduleId) {
      const tKey = storyKey ? storyKey : 'default';
      const meta = {
        lastUpdated: new Date().toISOString(),
        lastModuleId: moduleId
      };
      localStorage.setItem(`sop_user_story_meta_${tKey}`, JSON.stringify(meta));
    }

    function getUserStoryMetadata(storyKey) {
      const tKey = storyKey ? storyKey : 'default';
      const saved = localStorage.getItem(`sop_user_story_meta_${tKey}`);
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
      return { lastUpdated: null, lastModuleId: null };
    }

    function updateUserStoryDropdown() {
      const select = document.getElementById('user-story-select');
      if (!select) return;
      
      const registry = getUserStoryRegistry();
      select.innerHTML = '<option value="">-- Recent User Stories --</option>';
      
      registry.forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key;
        select.appendChild(opt);
      });
      
      const activeKey = getActiveUserStoryKey();
      if (activeKey) {
        select.value = activeKey;
      }
    }

    function getModuleProgress(moduleId, storyKey) {
      const data = qaModules[moduleId];
      if (!data || !data.checklist) return { percent: 0, checkedCount: 0, totalCount: 0 };
      
      let totalCount = 0;
      let checkedCount = 0;
      
      const tKey = storyKey ? storyKey : 'default';
      const saved = localStorage.getItem(`checklist_state_${moduleId}_${tKey}`);
      let states = {};
      if (saved) {
        try { states = JSON.parse(saved); } catch(e) {}
      }
      
      if (Array.isArray(data.checklist)) {
        totalCount = data.checklist.length;
        data.checklist.forEach((item, index) => {
          const id = `check-${moduleId}-${index}`;
          if (states[id]) checkedCount++;
        });
      } else {
        const entry = data.checklist.entry_criteria || [];
        const exit = data.checklist.exit_criteria || [];
        totalCount = entry.length + exit.length;
        entry.forEach((item, index) => {
          const id = `check-entry-${moduleId}-${index}`;
          if (states[id]) checkedCount++;
        });
        exit.forEach((item, index) => {
          const id = `check-exit-${moduleId}-${index}`;
          if (states[id]) checkedCount++;
        });
      }
      
      const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
      return { percent, checkedCount, totalCount };
    }

    function getUserStoryOverallProgress(storyKey) {
      let grandTotal = 0;
      let grandChecked = 0;
      for (const moduleId of activeChecklistModules) {
        const { checkedCount, totalCount } = getModuleProgress(moduleId, storyKey);
        grandTotal += totalCount;
        grandChecked += checkedCount;
      }
      return grandTotal > 0 ? Math.round((grandChecked / grandTotal) * 100) : 0;
    }

    function updateProgressBar() {
      const fill = document.getElementById('progress-bar-fill');
      const textLabel = document.getElementById('progress-text-label');
      const fractionLabel = document.getElementById('progress-fraction-label');
      
      if (!currentModuleId) {
        if (textLabel) textLabel.innerText = "Module Progress: 0%";
        if (fractionLabel) fractionLabel.innerText = "";
        if (fill) fill.style.width = "0%";
        return;
      }
      
      const storyKey = getActiveUserStoryKey();
      const { percent, checkedCount, totalCount } = getModuleProgress(currentModuleId, storyKey);
      
      if (textLabel) {
        textLabel.innerText = `Module Progress: ${percent}%`;
      }
      if (fractionLabel) {
        fractionLabel.innerText = `${checkedCount} of ${totalCount} items checked`;
      }
      if (fill) {
        fill.style.width = `${percent}%`;
        let hue = Math.round((percent / 100) * 120); 
        fill.style.backgroundColor = `hsl(${hue}, 80%, 45%)`;
      }
    }

    function updateUserStoryDashboard() {
      const tbody = document.getElementById('user-story-dashboard-tbody');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      const registry = getUserStoryRegistry();
      
      if (registry.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; color: #777; padding: 20px;">
              No active user stories in registry. Enter a User Story Key above to start tracking.
            </td>
          </tr>`;
        updateComplianceChart(0);
        return;
      }
      
      registry.forEach(key => {
        const meta = getUserStoryMetadata(key);
        const activeModuleTitle = meta.lastModuleId && qaModules[meta.lastModuleId] 
          ? qaModules[meta.lastModuleId].title 
          : "N/A";
        
        const moduleProgressObj = meta.lastModuleId 
          ? getModuleProgress(meta.lastModuleId, key) 
          : { percent: 0 };
        const moduleProgress = meta.lastModuleId ? `${moduleProgressObj.percent}%` : "0%";
        const overallProgress = `${getUserStoryOverallProgress(key)}%`;
        const formattedDate = meta.lastUpdated 
          ? new Date(meta.lastUpdated).toLocaleString() 
          : "N/A";
          
        const tr = document.createElement('tr');
        tr.style.cursor = 'default';
        tr.innerHTML = `
          <td style="padding: 10px 5px; font-weight: 600; color: var(--primary);">${key}</td>
          <td style="padding: 10px 5px;">${activeModuleTitle}</td>
          <td style="padding: 10px 5px;">
            <span style="background: rgba(37, 99, 235, 0.1); color: var(--primary); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
              ${moduleProgress}
            </span>
          </td>
          <td style="padding: 10px 5px;">
            <span style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
              ${overallProgress}
            </span>
          </td>
          <td style="padding: 10px 5px; text-align: center;">
            <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary" style="margin: 0; padding: 5px 10px; font-size: 0.8rem; height: auto;" onclick="handleUserStorySelect('${key}')">Switch</button>
              <button class="btn btn-success" style="margin: 0; padding: 5px 10px; font-size: 0.8rem; height: auto;" onclick="exportUserStoryDirectly('${key}')">Export Story</button>
              <button class="btn btn-danger" style="margin: 0; padding: 5px 10px; font-size: 0.8rem; background: var(--danger); height: auto;" onclick="deleteUserStoryFromRegistry('${key}')">Delete</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
      
      // Update the compliance chart visually
      const currentKey = getActiveUserStoryKey();
      if (currentKey) {
        updateComplianceChart(getUserStoryOverallProgress(currentKey));
      } else if (registry.length > 0) {
        updateComplianceChart(getUserStoryOverallProgress(registry[0]));
      } else {
        updateComplianceChart(0);
      }
    }

    function deleteUserStoryFromRegistry(key) {
      if (confirm(`Are you sure you want to delete all checklist progress for user story ${key}?`)) {
        const registry = getUserStoryRegistry();
        const index = registry.indexOf(key);
        if (index > -1) {
          registry.splice(index, 1);
          localStorage.setItem('sop_user_story_registry', JSON.stringify(registry));
        }
        
        activeChecklistModules.forEach(moduleId => {
          localStorage.removeItem(`checklist_state_${moduleId}_${key}`);
        });
        localStorage.removeItem(`sop_user_story_meta_${key}`);
        
        const currentActiveKey = getActiveUserStoryKey();
        if (currentActiveKey === key) {
          document.getElementById('user-story-input').value = '';
          handleUserStoryKeyChange();
        }
        
        // Push deletion to Firebase Cloud
        if (window.deleteStateFromCloud) {
          window.deleteStateFromCloud(key);
        }
        
        updateUserStoryDropdown();
        updateUserStoryDashboard();
      }
    }

    window.syncAllToCloud = function() {
      if (!window.syncStateToCloud) {
        alert("Firebase is not initialized or accessible in this environment.");
        return;
      }
      const registry = getUserStoryRegistry();
      if (registry.length === 0) {
        alert("No local stories to push.");
        return;
      }
      
      registry.forEach(storyKey => {
        const meta = getUserStoryMetadata(storyKey);
        const progress = getUserStoryOverallProgress(storyKey);
        for (const moduleId of activeChecklistModules) {
          const saved = localStorage.getItem(`checklist_state_${moduleId}_${storyKey}`);
          if (saved) {
            window.syncStateToCloud(storyKey, moduleId, JSON.parse(saved), progress);
          }
        }
      });
      alert(`Successfully pushed all ${registry.length} local user stories to the cloud database!`);
    }

    // --- RESET ACTIONS ---
    function resetCurrentChecklist() {
      if (!currentModuleId) {
        alert("Please select a module first.");
        return;
      }
      const storyKey = getActiveUserStoryKey();
      const displayKey = storyKey ? `for user story ${storyKey}` : "for this module";
      if (confirm(`Are you sure you want to reset all checklist items ${displayKey}?`)) {
        const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        saveChecklistState(currentModuleId);
      }
    }

    function resetAllData() {
      if (confirm("WARNING: This will permanently delete ALL active user stories, their metadata, and their checklist progress. Are you sure you want to continue?")) {
        const registry = getUserStoryRegistry();
        registry.forEach(key => {
          activeChecklistModules.forEach(moduleId => {
            localStorage.removeItem(`checklist_state_${moduleId}_${key}`);
          });
          localStorage.removeItem(`sop_user_story_meta_${key}`);
        });
        
        Object.keys(qaModules).forEach(moduleId => {
          localStorage.removeItem(`checklist_state_${moduleId}_default`);
          localStorage.removeItem(`checklist_state_${moduleId}`);
        });
        localStorage.removeItem(`sop_user_story_meta_default`);
        localStorage.removeItem('sop_user_story_registry');
        
        document.getElementById('user-story-input').value = '';
        if (currentModuleId) {
          loadChecklistState(currentModuleId);
        }
        
        updateUserStoryDropdown();
        updateUserStoryDashboard();
        alert("All user story checklist data has been reset.");
      }
    }

    // --- CHECKLIST LOGIC ---

    function isOptional(itemText) {
      return typeof itemText === 'string' && itemText.includes('(If applicable)');
    }

    function evaluateChecklistLogic(moduleId) {
      if (!moduleId) return;
      const data = qaModules[moduleId];
      if (!data || !data.checklist) return;
      let stateChanged = false;

      if (Array.isArray(data.checklist)) {
        let allPreviousChecked = true;
        data.checklist.forEach((item, index) => {
          const id = `check-${moduleId}-${index}`;
          const cb = document.getElementById(id);
          if (cb) {
            cb.disabled = !allPreviousChecked;
            if (cb.disabled && cb.checked) {
              cb.checked = false;
              stateChanged = true;
            }
            if (!cb.checked && !isOptional(item)) {
              allPreviousChecked = false;
            }
          }
        });
      } else {
        let entryAllChecked = true;
        if (data.checklist.entry_criteria) {
          let allPreviousChecked = true;
          data.checklist.entry_criteria.forEach((item, index) => {
            const id = `check-entry-${moduleId}-${index}`;
            const cb = document.getElementById(id);
            if (cb) {
              cb.disabled = !allPreviousChecked;
              if (cb.disabled && cb.checked) {
                cb.checked = false;
                stateChanged = true;
              }
              if (!cb.checked && !isOptional(item)) {
                allPreviousChecked = false;
                entryAllChecked = false;
              }
            }
          });
        }
        
        if (data.checklist.exit_criteria) {
          let allPreviousChecked = entryAllChecked;
          data.checklist.exit_criteria.forEach((item, index) => {
            const id = `check-exit-${moduleId}-${index}`;
            const cb = document.getElementById(id);
            if (cb) {
              cb.disabled = !allPreviousChecked;
              if (cb.disabled && cb.checked) {
                cb.checked = false;
                stateChanged = true;
              }
              if (!cb.checked && !isOptional(item)) {
                allPreviousChecked = false;
              }
            }
          });
        }
      }
      return stateChanged;
    }

    // --- LOCAL STORAGE FUNCTIONALITY ---
    function saveChecklistState(moduleId) {
      if (!moduleId) return;
      const isSOPModule = activeChecklistModules.includes(moduleId);
      const storyKey = isSOPModule ? getActiveUserStoryKey() : '';
      const tKey = storyKey ? storyKey : 'default';
      
      const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
      const states = {};
      checkboxes.forEach(cb => {
        states[cb.id] = cb.checked;
      });
            localStorage.setItem(`checklist_state_${moduleId}_${tKey}`, JSON.stringify(states));
      if (window.syncStateToCloud && isSOPModule) {
        window.syncStateToCloud(tKey, moduleId, states, getUserStoryOverallProgress(tKey));
      }

      if (isSOPModule) {
        if (storyKey) {
          addToUserStoryRegistry(storyKey);
        }
        saveUserStoryMetadata(storyKey, moduleId);
        updateProgressBar();
        updateUserStoryDashboard();
      }
    }

    function loadChecklistState(moduleId) {
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
      }
      
      const saved = localStorage.getItem(`checklist_state_${moduleId}_${tKey}`);
      if (saved) {
        try {
          const states = JSON.parse(saved);
          for (const [id, checked] of Object.entries(states)) {
            const cb = document.getElementById(id);
            if (cb) {
              cb.checked = checked;
            }
          }
        } catch (e) {
          console.error("Error loading checklist state", e);
        }
      }
      
      evaluateChecklistLogic(moduleId);
      
      if (moduleLocked) {
        checkboxes.forEach(cb => cb.disabled = true);
      }

      if (isSOPModule) {
        updateProgressBar();
      }
    }

    function handleUserStoryKeyChange() {
      const storyKey = getActiveUserStoryKey();
      if (currentModuleId) {
        loadChecklistState(currentModuleId);
      }
      updateUserStoryDashboard();
    }

    function handleUserStorySelect(storyKey) {
      const input = document.getElementById('user-story-input');
      if (input) {
        input.value = storyKey;
      }
      if (currentModuleId) {
        loadChecklistState(currentModuleId);
      }
      updateUserStoryDashboard();
    }

    // --- SHEETJS EXCEL EXPORT WORKBOOKS ---
    function exportSingleUserStoryToExcel() {
      const storyKey = getActiveUserStoryKey();
      exportUserStoryDirectly(storyKey);
    }

    function exportUserStoryDirectly(storyKey) {
      if (typeof XLSX === 'undefined') {
        alert("Excel export library (SheetJS) is not loaded yet. Please wait a moment.");
        return;
      }
      
      const wb = XLSX.utils.book_new();
      const displayKey = storyKey ? storyKey : 'General_Global';
      
      // SUMMARY SHEET
      const summaryData = [
        ["iSON - Tester's SOP Progress Report"],
        ["User Story Reference:", displayKey],
        ["Generated Date:", new Date().toLocaleString()],
        [],
        ["Module Name", "Module Progress Rate", "Items Checked", "Total Items", "Last Updated"]
      ];
      
      let grandTotal = 0;
      let grandChecked = 0;
      
      activeChecklistModules.forEach(moduleId => {
        const { percent, checkedCount, totalCount } = getModuleProgress(moduleId, storyKey);
        const meta = getUserStoryMetadata(storyKey);
        const lastUpdatedStr = (percent > 0 && meta.lastUpdated) 
          ? new Date(meta.lastUpdated).toLocaleString() 
          : "N/A";
          
        summaryData.push([
          qaModules[moduleId].title,
          `${percent}%`,
          checkedCount,
          totalCount,
          lastUpdatedStr
        ]);
        
        grandTotal += totalCount;
        grandChecked += checkedCount;
      });
      
      summaryData.push([]);
      summaryData.push([
        "OVERALL COMPLIANCE RATE", 
        `${grandTotal > 0 ? Math.round((grandChecked / grandTotal) * 100) : 0}%`,
        grandChecked,
        grandTotal,
        ""
      ]);
      
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      wsSummary['!cols'] = [
        {wch: 45}, // Module Name
        {wch: 22}, // Progress Rate
        {wch: 15}, // Checked
        {wch: 15}, // Total
        {wch: 25}  // Last Updated
      ];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary Dashboard");
      
      // DETAILED AUDIT SHEET
      const auditData = [
        ["Module", "Criteria Group", "Checklist Item Description", "Checked Status"]
      ];
      
      activeChecklistModules.forEach(moduleId => {
        const data = qaModules[moduleId];
        const tKey = storyKey ? storyKey : 'default';
        const saved = localStorage.getItem(`checklist_state_${moduleId}_${tKey}`);
        let states = {};
        if (saved) {
          try { states = JSON.parse(saved); } catch(e) {}
        }
        
        if (Array.isArray(data.checklist)) {
          data.checklist.forEach((item, index) => {
            const id = `check-${moduleId}-${index}`;
            const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
            auditData.push([data.title, "Standard Checklist", item, status]);
          });
        } else if (data.checklist) {
          const entry = data.checklist.entry_criteria || [];
          const exit = data.checklist.exit_criteria || [];
          
          entry.forEach((item, index) => {
            const id = `check-entry-${moduleId}-${index}`;
            const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
            auditData.push([data.title, "Entry Criteria", item, status]);
          });
          
          exit.forEach((item, index) => {
            const id = `check-exit-${moduleId}-${index}`;
            const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
            auditData.push([data.title, "Exit Criteria", item, status]);
          });
        }
      });
      
      const wsDetailed = XLSX.utils.aoa_to_sheet(auditData);
      wsDetailed['!cols'] = [
        {wch: 35}, // Module
        {wch: 18}, // Criteria Group
        {wch: 80}, // Checklist Item Description
        {wch: 18}  // Checked Status
      ];
      XLSX.utils.book_append_sheet(wb, wsDetailed, "Detailed Audit Log");
      
      XLSX.writeFile(wb, `Testers_SOP_${displayKey}.xlsx`);
    }

    function exportAllUserStoriesToExcel() {
      if (typeof XLSX === 'undefined') {
        alert("Excel export library (SheetJS) is not loaded yet. Please wait a moment.");
        return;
      }
      
      const registry = getUserStoryRegistry();
      if (registry.length === 0) {
        alert("No user stories found in the registry to export. Work on some user stories first!");
        return;
      }
      
      const wb = XLSX.utils.book_new();
      
      // REGISTRY SUMMARY SHEET
      const summaryData = [
        ["iSON - Tester's SOP Global Registry Dashboard"],
        ["Generated Date:", new Date().toLocaleString()],
        [],
        ["User Story Key", "Last Active Module", "Active Module Progress", "Overall SOP Compliance", "Last Updated"]
      ];
      
      registry.forEach(key => {
        const meta = getUserStoryMetadata(key);
        const activeModuleTitle = meta.lastModuleId && qaModules[meta.lastModuleId] 
          ? qaModules[meta.lastModuleId].title 
          : "N/A";
        
        const moduleProgressObj = meta.lastModuleId 
          ? getModuleProgress(meta.lastModuleId, key) 
          : { percent: 0 };
        const moduleProgress = meta.lastModuleId ? `${moduleProgressObj.percent}%` : "0%";
        const overallProgress = `${getUserStoryOverallProgress(key)}%`;
        const formattedDate = meta.lastUpdated 
          ? new Date(meta.lastUpdated).toLocaleString() 
          : "N/A";
          
        summaryData.push([
          key,
          activeModuleTitle,
          moduleProgress,
          overallProgress,
          formattedDate
        ]);
      });
      
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      wsSummary['!cols'] = [
        {wch: 18}, // User Story Key
        {wch: 35}, // Last Active Module
        {wch: 22}, // Active Module Progress
        {wch: 25}, // Overall Compliance
        {wch: 25}  // Last Updated
      ];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Registry Dashboard");
      
      // INDEPENDENT SHEETS FOR EACH USER STORY
      const usedSheetNames = new Set();
      registry.forEach(key => {
        const auditData = [
          ["User Story SOP Audit Log"],
          ["User Story Key:", key],
          ["Overall Compliance:", `${getUserStoryOverallProgress(key)}%`],
          ["Generated Date:", new Date().toLocaleString()],
          [],
          ["Module", "Criteria Group", "Checklist Item Description", "Checked Status"]
        ];
        
        activeChecklistModules.forEach(moduleId => {
          const data = qaModules[moduleId];
          const saved = localStorage.getItem(`checklist_state_${moduleId}_${key}`);
          let states = {};
          if (saved) {
            try { states = JSON.parse(saved); } catch(e) {}
          }
          
          if (Array.isArray(data.checklist)) {
            data.checklist.forEach((item, index) => {
              const id = `check-${moduleId}-${index}`;
              const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
              auditData.push([data.title, "Standard Checklist", item, status]);
            });
          } else if (data.checklist) {
            const entry = data.checklist.entry_criteria || [];
            const exit = data.checklist.exit_criteria || [];
            
            entry.forEach((item, index) => {
              const id = `check-entry-${moduleId}-${index}`;
              const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
              auditData.push([data.title, "Entry Criteria", item, status]);
            });
            
            exit.forEach((item, index) => {
              const id = `check-exit-${moduleId}-${index}`;
              const status = states[id] ? "COMPLETED" : "NOT COMPLETED";
              auditData.push([data.title, "Exit Criteria", item, status]);
            });
          }
        });
        
        const wsStory = XLSX.utils.aoa_to_sheet(auditData);
        wsStory['!cols'] = [
          {wch: 35}, // Module
          {wch: 18}, // Criteria Group
          {wch: 80}, // Checklist Item Description
          {wch: 18}  // Checked Status
        ];
        
        // Sanitize sheet name to fit Excel limitations (max 31 chars, no special chars)
        let baseName = key.replace(/[\\\/\?\*\[\]\:]/g, "").substring(0, 31);
        if (!baseName) baseName = "UserStory";
        let safeSheetName = baseName;
        let counter = 1;
        while (usedSheetNames.has(safeSheetName.toLowerCase())) {
          const suffix = `_${counter}`;
          safeSheetName = baseName.substring(0, 31 - suffix.length) + suffix;
          counter++;
        }
        usedSheetNames.add(safeSheetName.toLowerCase());
        XLSX.utils.book_append_sheet(wb, wsStory, safeSheetName);
      });
      
      XLSX.writeFile(wb, "Testers_SOP_All_User_Stories_Report.xlsx");
    }

    // --- LOAD MODULE ---
    function loadModule(moduleId) {
      const data = qaModules[moduleId];
      if (!data) return;
      currentModuleId = moduleId;

      // Close sidebar if on mobile
      closeSidebarOnMobile();

      // Hide/Show User Story tracking & progress based on module type
      const isSOPModule = activeChecklistModules.includes(moduleId);
      const ticketBar = document.getElementById('user-story-bar-container');
      const progressBar = document.getElementById('progress-bar-container');
      const dashboardContainer = document.getElementById('user-story-dashboard-container');
      const resetAllBtn = document.getElementById('reset-all-btn');
      
      if (ticketBar) ticketBar.style.display = isSOPModule ? 'flex' : 'none';
      if (progressBar) progressBar.style.display = isSOPModule ? 'block' : 'none';
      if (dashboardContainer) dashboardContainer.style.display = isSOPModule ? 'block' : 'none';
      if (resetAllBtn) resetAllBtn.style.display = isSOPModule ? 'inline-block' : 'none';

      // Update Active State in Sidebar
      document.querySelectorAll('.panel-btn').forEach(btn => btn.classList.remove('active-module'));
      const sidebarBtns = document.querySelectorAll('.panel-btn');
      for (let btn of sidebarBtns) {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${moduleId}'`)) {
          btn.classList.add('active-module');
          break;
        }
      }
      
      // Update Title & Show Tabs
      document.getElementById('current-module-title').innerText = data.title;
      document.getElementById('tabs-container').style.display = 'flex';

      // Load Text Content
      document.getElementById('tab-guidelines').innerHTML = data.guidelines;
      
      // Handle Templates Tab
      const templateTabBtn = document.querySelector('.tab-btn[onclick*="templates"]');
      if (data.templates && data.templates.trim() !== '' && !data.templates.includes("No specific templates required") && !data.templates.includes("Use the Testing Estimation Form")) {
          templateTabBtn.style.display = 'inline-block';
          document.getElementById('tab-templates').innerHTML = data.templates;
      } else {
          templateTabBtn.style.display = 'none';
          if (document.getElementById('tab-templates').classList.contains('active')) {
              switchTab('guidelines'); // switch to guidelines if templates tab was active
          }
      }
      
      // Render Mermaid Flowchart
      const mermaidContainer = document.getElementById('mermaid-container');
      if (data.mermaid && data.mermaid.trim() !== '') {
        try {
          mermaid.render('dynamic-mermaid-svg', data.mermaid, function(svgCode) {
            mermaidContainer.innerHTML = svgCode;
          });
        } catch (err) {
          mermaidContainer.innerHTML = `<p style="color:red; font-weight:bold;">Chart Syntax Error. Please check Mermaid code formatting.</p>`;
        }
      } else {
        mermaidContainer.innerHTML = '';
      }

      // Build Interactive Checklist
      const checklistContainer = document.getElementById('checklist-container');
      checklistContainer.innerHTML = '';
      
      function formatLabel(text) {
        if (text.includes('(If applicable)')) {
          return text.replace('(If applicable)', '<span style="color: #64748b; font-size: 0.9em; font-style: italic; font-weight: normal; margin-left: 5px;">(If applicable)</span>');
        }
        return text;
      }

      if (Array.isArray(data.checklist)) {
        data.checklist.forEach((item, index) => {
          const id = `check-${moduleId}-${index}`;
          checklistContainer.innerHTML += `
            <div class="checklist-item">
              <input type="checkbox" id="${id}">
              <label for="${id}">${formatLabel(item)}</label>
            </div>`;
        });
      } else if (data.checklist) {
        if (data.checklist.entry_criteria && data.checklist.entry_criteria.length > 0) {
          checklistContainer.innerHTML += `<div style="padding: 10px 15px; font-weight: bold; background: rgba(37, 99, 235, 0.08); border-bottom: 1px solid var(--border);">Entry Criteria</div>`;
          data.checklist.entry_criteria.forEach((item, index) => {
            const id = `check-entry-${moduleId}-${index}`;
            checklistContainer.innerHTML += `
              <div class="checklist-item">
                <input type="checkbox" id="${id}">
                <label for="${id}">${formatLabel(item)}</label>
              </div>`;
          });
        }
        if (data.checklist.exit_criteria && data.checklist.exit_criteria.length > 0) {
          checklistContainer.innerHTML += `<div style="padding: 10px 15px; font-weight: bold; background: rgba(16, 185, 129, 0.08); border-bottom: 1px solid var(--border); border-top: 1px solid var(--border);">Exit Criteria</div>`;
          data.checklist.exit_criteria.forEach((item, index) => {
            const id = `check-exit-${moduleId}-${index}`;
            checklistContainer.innerHTML += `
              <div class="checklist-item">
                <input type="checkbox" id="${id}">
                <label for="${id}">${formatLabel(item)}</label>
              </div>`;
          });
        }
      }

      // Restore checklist checked state from localStorage
      loadChecklistState(moduleId);

      switchTab('guidelines'); // Default to Guidelines instead of Standard Operating Procedure now that it's simpler
    }

    // Set up global event delegation for saving checkbox changes
    document.getElementById('checklist-container').addEventListener('change', function(e) {
      if (e.target && e.target.type === 'checkbox' && currentModuleId) {
        evaluateChecklistLogic(currentModuleId);
        saveChecklistState(currentModuleId);
      }
    });

    // --- TAB SWITCHING ---
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(`tab-${tabId}`).classList.add('active');
      
      // Find the button that called this and make it active
      const buttons = document.querySelectorAll('.tab-btn');
      for(let btn of buttons) {
        if(btn.getAttribute('onclick').includes(tabId)) {
          btn.classList.add('active');
          break;
        }
      }
      
      // Mermaid fix for rendering inside hidden tabs
      if(tabId === 'flowchart' && currentModuleId) {
          const data = qaModules[currentModuleId];
          try {
            mermaid.render('dynamic-mermaid-svg', data.mermaid, function(svgCode) {
              document.getElementById('mermaid-container').innerHTML = svgCode;
            });
          } catch(e) {}
      }
    }

    // --- GLOBAL SEARCH ---
    function handleSearch(query) {
      const resultsContainer = document.getElementById('search-results');
      if (!query || query.trim() === '') {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        return;
      }
      
      const q = query.toLowerCase().trim();
      const results = [];
      
      for (const [key, module] of Object.entries(qaModules)) {
        let matchScore = 0;
        let matchDetails = [];
        
        if (module.title.toLowerCase().includes(q)) {
          matchScore += 10;
          matchDetails.push("Title Match");
        }
        
        const guidelinesText = module.guidelines.replace(/<[^>]*>/g, '').toLowerCase();
        if (guidelinesText.includes(q)) {
          matchScore += 5;
          matchDetails.push("Guidelines");
        }
        
        let checklistMatch = false;
        if (Array.isArray(module.checklist)) {
          checklistMatch = module.checklist.some(item => item.toLowerCase().includes(q));
        } else {
          const entryMatch = module.checklist.entry_criteria ? module.checklist.entry_criteria.some(item => item.toLowerCase().includes(q)) : false;
          const exitMatch = module.checklist.exit_criteria ? module.checklist.exit_criteria.some(item => item.toLowerCase().includes(q)) : false;
          checklistMatch = entryMatch || exitMatch;
        }
        if (checklistMatch) {
          matchScore += 3;
          matchDetails.push("Standard Operating Procedure");
        }
        
        if (module.templates && module.templates.toLowerCase().includes(q)) {
          matchScore += 2;
          matchDetails.push("Templates");
        }
        
        if (matchScore > 0) {
          results.push({
            key: key,
            title: module.title,
            score: matchScore,
            details: matchDetails.join(', ')
          });
        }
      }
      
      results.sort((a, b) => b.score - a.score);
      
      if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 12px; color: #777; text-align: center;">No results found</div>';
      } else {
        resultsContainer.innerHTML = results.map(res => `
          <div class="search-result-item" onclick="selectSearchResult('${res.key}', '${res.details}')">
            <div style="font-weight: bold; color: var(--primary);">${res.title}</div>
            <div style="font-size: 0.85rem; color: #777; margin-top: 2px;">Match: ${res.details}</div>
          </div>
        `).join('');
      }
      resultsContainer.style.display = 'block';
    }
    
    function selectSearchResult(moduleId, details) {
      const sidebarBtns = document.querySelectorAll('.panel-btn');
      let targetBtn = null;
      for (let btn of sidebarBtns) {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${moduleId}'`)) {
          targetBtn = btn;
          break;
        }
      }
      
      if (targetBtn) {
        const panel = targetBtn.closest('.panel');
        if (panel) {
          const accordionBtn = panel.previousElementSibling;
          if (accordionBtn && !accordionBtn.classList.contains('active')) {
            accordionBtn.click();
          }
        }
        targetBtn.click();
      } else {
        loadModule(moduleId);
      }
      
      if (details.includes("Templates")) {
        switchTab('templates');
      } else if (details.includes("Standard Operating Procedure")) {
        switchTab('checklist');
      } else {
        switchTab('guidelines');
      }
      
      document.getElementById('global-search').value = '';
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
    
    window.addEventListener('click', function(e) {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(e.target)) {
        document.getElementById('search-results').style.display = 'none';
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      updateUserStoryDropdown();
      updateUserStoryDashboard();
      loadModule('ai_generation');
    });