
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

    window.toggleTheme = function() {
      const updateThemeDOM = () => {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        localStorage.setItem('theme_preference', newTheme);
        localStorage.setItem('sop_theme', newTheme);
        
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        
        if (typeof complianceChart !== 'undefined' && complianceChart) {
          complianceChart.data.datasets[0].backgroundColor[1] = newTheme === 'dark' ? '#334155' : '#e2e8f0';
          complianceChart.update();
        }
      };

      // Use the modern View Transitions API for a beautiful native cross-fade
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          updateThemeDOM();
        });
      } else {
        // Fallback for older browsers
        updateThemeDOM();
      }
    };

    // --- OFFLINE / ONLINE LOGIC ---
    window.addEventListener('online', () => {
      const ind = document.getElementById('offline-indicator');
      if (ind) ind.style.display = 'none';
      // Sync happens naturally on next action, but we could force a sync here if needed.
    });
    
    window.addEventListener('offline', () => {
      const ind = document.getElementById('offline-indicator');
      if (ind) ind.style.display = 'inline-block';
    });
    
    document.addEventListener('DOMContentLoaded', () => {
      if (!navigator.onLine) {
        const ind = document.getElementById('offline-indicator');
        if (ind) ind.style.display = 'inline-block';
      }
    });

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
    window.lockApplication = function() {
      // Clear admin status to fully lock it
      localStorage.removeItem('isAdmin');
      const adminBtn = document.getElementById('admin-dashboard-btn');
      if (adminBtn) adminBtn.style.display = 'none';

      const current = localStorage.getItem('testerName') || '';
      const modal = document.getElementById('name-modal');
      const nameInput = document.getElementById('tester-name-input');
      const pinInput = document.getElementById('tester-pin-input');
      if (modal && nameInput && pinInput) {
        nameInput.value = current;
        pinInput.value = ''; // Always clear PIN
        modal.style.display = 'flex';
      }
    };

    window.saveNameModal = async function() {
      const nameInput = document.getElementById('tester-name-input');
      const pinInput = document.getElementById('tester-pin-input');
      if (!nameInput || !pinInput) return;
      
      const newName = nameInput.value.trim();
      const pin = pinInput.value.trim();
      
      if (!newName) {
        alert("Username is required.");
        return;
      }

      // Check if entering Admin password (Discreet Admin Login)
      if (pin === "ISON-ADMIN") {
        localStorage.setItem('isAdmin', 'true');
        const adminBtn = document.getElementById('admin-dashboard-btn');
        if (adminBtn) adminBtn.style.display = 'inline-block';
        document.getElementById('name-modal').style.display = 'none';
        alert("Admin Mode unlocked successfully.");
        return;
      }
      
      if (pin.length !== 4) {
        alert("Please enter a 4-digit PIN.");
        return;
      }
      
      if (window.loginOrRegisterUser) {
        const result = await window.loginOrRegisterUser(newName, pin);
        if (!result.success) {
          alert(`Kindly try with correct '${newName}' user ID and password`);
          return;
        }
      }

      localStorage.setItem('testerName', newName);
      const displaySpan = document.getElementById('display-profile-name');
      if (displaySpan) displaySpan.innerText = newName;
      
      // Fetch assigned user stories
      if (window.fetchAssignedUserStories) {
        const count = await window.fetchAssignedUserStories(newName);
        alert(`Login successful! Synced ${count} user stories to your device.`);
      } else {
        alert("Name updated successfully!");
      }
      
      // Force sync current state
      if (typeof currentModuleId !== 'undefined' && currentModuleId) {
        saveChecklistState(currentModuleId);
      }
      
      // Fix 1: Refresh dropdowns with the new user's assigned stories
      if (window.fetchGlobalDataForDatalists) {
        window.fetchGlobalDataForDatalists();
      }
      
      document.getElementById('name-modal').style.display = 'none';
    };

    window.processAdminReset = async function() {
      const usernameInput = document.getElementById('reset-username');
      const pinInput = document.getElementById('reset-new-pin');
      const passInput = document.getElementById('reset-admin-pass');
      
      const username = usernameInput.value.trim();
      const newPin = pinInput.value.trim();
      const adminPass = passInput.value.trim();
      
      if (!username || !newPin || !adminPass) {
        alert("All fields are required.");
        return;
      }
      
      if (newPin.length !== 4) {
        alert("New PIN must be 4 digits.");
        return;
      }
      
      if (adminPass !== "ISON-ADMIN") {
        alert("Incorrect Lead Admin Password!");
        return;
      }
      
      if (window.adminResetUserPin) {
        const result = await window.adminResetUserPin(username, newPin);
        alert(result.message);
        if (result.success) {
          document.getElementById('admin-reset-modal').style.display = 'none';
          usernameInput.value = '';
          pinInput.value = '';
          passInput.value = '';
        }
      } else {
        alert("Database connection not ready.");
      }
    };

    // --- TICKET & REGISTRY UTILITIES ---
    function getActiveUserStoryKey() {
      const input = document.getElementById('user-story-input');
      return input ? input.value.trim().toUpperCase() : '';
    }

    function getTesterPrefix() {
      return localStorage.getItem('testerName') || 'Anonymous Tester';
    }

    function getUserStoryRegistry() {
      const saved = localStorage.getItem(`sop_user_story_registry_${getTesterPrefix()}`);
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
        localStorage.setItem(`sop_user_story_registry_${getTesterPrefix()}`, JSON.stringify(registry));
        updateUserStoryDropdown();
      }
    }

    function saveUserStoryMetadata(storyKey, moduleId, epicKey, assignee) {
      const tKey = storyKey ? storyKey : 'default';
      const existing = getUserStoryMetadata(tKey);
      const meta = {
        lastUpdated: new Date().toISOString(),
        lastModuleId: moduleId || existing.lastModuleId,
        epicKey: epicKey !== undefined ? epicKey : existing.epicKey,
        assignee: assignee !== undefined ? assignee : existing.assignee
      };
      localStorage.setItem(`sop_user_story_meta_${getTesterPrefix()}_${tKey}`, JSON.stringify(meta));
    }

    function getUserStoryMetadata(storyKey) {
      const tKey = storyKey ? storyKey : 'default';
      let meta = { lastUpdated: null, lastModuleId: null, epicKey: '', assignee: '' };
      
      const saved = localStorage.getItem(`sop_user_story_meta_${getTesterPrefix()}_${tKey}`);
      if (saved) {
        try { meta = { ...meta, ...JSON.parse(saved) }; } catch(e) {}
      }
      
      if (window.globalUserStories && window.globalUserStories[tKey]) {
        const fbData = window.globalUserStories[tKey];
        if (fbData.epicKey) meta.epicKey = fbData.epicKey;
        if (fbData.assignee || fbData.assignedToName) {
           meta.assignee = fbData.assignee || fbData.assignedToName;
        } else if (fbData.testers) {
           for (const tName in fbData.testers) {
             if (fbData.testers[tName].assignee === tName) {
               meta.assignee = tName;
               break;
             }
           }
        }
      }
      
      if (window.SOP_CONFIG && window.SOP_CONFIG.userStories) {
        const configStory = window.SOP_CONFIG.userStories.find(u => u.key === tKey);
        if (configStory) {
          if (configStory.epic) meta.epicKey = configStory.epic;
          if (configStory.assignee) meta.assignee = configStory.assignee;
        }
      }
      
      return meta;
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
      const saved = localStorage.getItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${tKey}`);
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
        if (textLabel) textLabel.innerText = "Active Status: 0%";
        if (fractionLabel) fractionLabel.innerText = "";
        if (fill) fill.style.width = "0%";
        return;
      }
      
      const storyKey = getActiveUserStoryKey();
      const { percent, checkedCount, totalCount } = getModuleProgress(currentModuleId, storyKey);
      
      if (textLabel) {
        textLabel.innerText = `Active Status: ${percent}%`;
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

    window.updateUserStoryDashboard = function() {
      const tbody = document.getElementById('user-story-dashboard-tbody');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      const registry = getUserStoryRegistry();
      
      // Update epic filter options if needed
      const epicFilterSelect = document.getElementById('dashboard-epic-filter');
      if (epicFilterSelect && epicFilterSelect.options.length <= 1) {
        const epics = new Set();
        if (window.SOP_CONFIG && window.SOP_CONFIG.epics) {
          window.SOP_CONFIG.epics.forEach(e => epics.add(e));
        }
        registry.forEach(key => {
          const meta = getUserStoryMetadata(key);
          if (meta.epicKey) epics.add(meta.epicKey);
        });
        epics.forEach(e => {
          const opt = document.createElement('option');
          opt.value = e;
          opt.textContent = e;
          epicFilterSelect.appendChild(opt);
        });
      }
      
      const epicFilter = epicFilterSelect ? epicFilterSelect.value : 'ALL';
      const assigneeFilterSelect = document.getElementById('dashboard-assignee-filter');
      const assigneeFilter = assigneeFilterSelect ? assigneeFilterSelect.value : 'ALL';
      const myName = localStorage.getItem('testerName') || '';
      
      let filteredRegistry = registry.filter(key => {
        const meta = getUserStoryMetadata(key);
        if (epicFilter !== 'ALL' && meta.epicKey !== epicFilter) return false;
        if (assigneeFilter === 'MINE' && meta.assignee !== myName) return false;
        return true;
      });
      
      if (filteredRegistry.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; color: #777; padding: 20px;">
              No matching user stories in list. Adjust filters or select a User Story to begin.
            </td>
          </tr>`;
        updateComplianceChart(0);
        return;
      }
      
      filteredRegistry.forEach(key => {
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
            <div style="display: flex; gap: 8px; justify-content: center; align-items: center; width: 100%;">
              <button class="btn btn-primary" style="margin: 0; padding: 5px 10px; font-size: 0.8rem; height: auto; white-space: nowrap;" onclick="handleUserStorySelect('${key}')">Switch</button>
              <button class="btn btn-success" style="margin: 0; padding: 5px 10px; font-size: 0.8rem; height: auto; white-space: nowrap;" onclick="exportUserStoryDirectly('${key}')">Export Story</button>
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
          localStorage.setItem(`sop_user_story_registry_${getTesterPrefix()}`, JSON.stringify(registry));
        }
        
        activeChecklistModules.forEach(moduleId => {
          localStorage.removeItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${key}`);
        });
        localStorage.removeItem(`sop_user_story_meta_${getTesterPrefix()}_${key}`);
        
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
          const saved = localStorage.getItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${storyKey}`);
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
            localStorage.removeItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${key}`);
          });
          localStorage.removeItem(`sop_user_story_meta_${getTesterPrefix()}_${key}`);
        });
        
        Object.keys(qaModules).forEach(moduleId => {
          localStorage.removeItem(`checklist_state_${getTesterPrefix()}_${moduleId}_default`);
          localStorage.removeItem(`checklist_state_${getTesterPrefix()}_${moduleId}`);
        });
        localStorage.removeItem(`sop_user_story_meta_${getTesterPrefix()}_default`);
        localStorage.removeItem(`sop_user_story_registry_${getTesterPrefix()}`);
        
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
            localStorage.setItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${tKey}`, JSON.stringify(states));
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
      
      const saved = localStorage.getItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${tKey}`);
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

    window.handleEpicKeyChange = function() {
      const usInput = document.getElementById('user-story-input');
      if (usInput) usInput.value = '';
      
      if (window.fetchGlobalDataForDatalists) {
        window.fetchGlobalDataForDatalists();
      }
      
      window.handleUserStoryKeyChange();
    };

    window.handleUserStoryKeyChange = function() {
      const storyKey = getActiveUserStoryKey();
      const meta = getUserStoryMetadata(storyKey);
      const epicInput = document.getElementById('epic-input');
      const usInput = document.getElementById('user-story-input');
      
      if (epicInput) {
        if (meta.epicKey) {
          epicInput.value = meta.epicKey;
        } else if (usInput && usInput.options[usInput.selectedIndex]) {
          epicInput.value = usInput.options[usInput.selectedIndex].dataset.epic || '';
        } else {
          epicInput.value = '';
        }
      }
      const assigneeDisplay = document.getElementById('current-assignee-display');
      const assignBtn = document.getElementById('assign-to-me-btn');
      const myName = localStorage.getItem('testerName') || '';
      
      if (assigneeDisplay) {
        assigneeDisplay.innerText = meta.assignee || 'Unassigned';
      }
      
      if (assignBtn) {
        if (meta.assignee === myName && myName !== '') {
          assignBtn.style.display = 'none';
        } else {
          assignBtn.style.display = 'inline-block';
        }
      }

      if (currentModuleId) {
        loadChecklistState(currentModuleId);
      }
    };

    window.handleUserStorySelect = function(storyKey) {
      const input = document.getElementById('user-story-input');
      if (input) {
        input.value = storyKey;
        input.dispatchEvent(new Event('change'));
      }
      window.handleUserStoryKeyChange();
    };

    window.assignToMe = function() {
      const storyKey = getActiveUserStoryKey();
      if (!storyKey) {
        alert("Please enter a User Story first.");
        return;
      }
      const myName = localStorage.getItem('testerName') || '';
      if (!myName) {
        alert("Please log in first using the profile button.");
        return;
      }
      saveUserStoryMetadata(storyKey, currentModuleId, undefined, myName);
      if (currentModuleId) saveChecklistState(currentModuleId);
      
      // Fix 3: Update local cache so the UI filters know you own it instantly
      if (!window.globalUserStories) window.globalUserStories = {};
      if (!window.globalUserStories[storyKey]) window.globalUserStories[storyKey] = {};
      window.globalUserStories[storyKey].assignee = myName;
      
      window.handleUserStoryKeyChange();
    };

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
        ["iSON - Tester's SOP Data Export"],
        ["User Story Reference:", displayKey],
        ["Generated Date:", new Date().toLocaleString()],
        [],
        ["Module Name", "Active Status", "Items Checked", "Total Items", "Last Updated"]
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
        "SOP CHECKLIST COMPLETION", 
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
        const saved = localStorage.getItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${tKey}`);
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
        ["User Story Key", "Last Active Module", "Active Status", "Checklist Completion", "Last Updated"]
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
          ["Checklist Completion:", `${getUserStoryOverallProgress(key)}%`],
          ["Generated Date:", new Date().toLocaleString()],
          [],
          ["Module", "Criteria Group", "Checklist Item Description", "Checked Status"]
        ];
        
        activeChecklistModules.forEach(moduleId => {
          const data = qaModules[moduleId];
          const saved = localStorage.getItem(`checklist_state_${getTesterPrefix()}_${moduleId}_${key}`);
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
      
      XLSX.writeFile(wb, "Testers_SOP_All_User_Stories_Export.xlsx");
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
      
      // Handle Flowchart & Checklist Tabs visibility
      const flowchartTabBtn = document.querySelector('.tab-btn[onclick*="flowchart"]');
      const checklistTabBtn = document.querySelector('.tab-btn[onclick*="checklist"]');
      if (moduleId === 'manual') {
          if (flowchartTabBtn) flowchartTabBtn.style.display = 'none';
          if (checklistTabBtn) checklistTabBtn.style.display = 'none';
      } else {
          if (flowchartTabBtn) flowchartTabBtn.style.display = 'inline-block';
          if (checklistTabBtn) checklistTabBtn.style.display = 'inline-block';
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
            <div class="checklist-item" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px; border-bottom: 1px solid var(--border);">
              <div style="display: flex; gap: 10px; flex-grow: 1;">
                <input type="checkbox" id="${id}" style="margin-top: 4px;">
                <label for="${id}" style="flex-grow: 1;">${formatLabel(item)}</label>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                <span id="note-icon-${moduleId}-${id}" style="display: none; color: #ef4444; font-size: 1.1rem; cursor: pointer;" title="View Note" onclick="openNoteModal('${moduleId}', '${id}')">🚩</span>
                <button onclick="openNoteModal('${moduleId}', '${id}')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 5px; color: #94a3b8; line-height: 1;" title="Add Note/Flag">⋮</button>
              </div>
            </div>`;
        });
      } else if (data.checklist) {
        if (data.checklist.entry_criteria && data.checklist.entry_criteria.length > 0) {
          checklistContainer.innerHTML += `<div style="padding: 10px 15px; font-weight: bold; background: rgba(37, 99, 235, 0.08); border-bottom: 1px solid var(--border);">Entry Criteria</div>`;
          data.checklist.entry_criteria.forEach((item, index) => {
            const id = `check-entry-${moduleId}-${index}`;
            checklistContainer.innerHTML += `
              <div class="checklist-item" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px; border-bottom: 1px solid var(--border);">
                <div style="display: flex; gap: 10px; flex-grow: 1;">
                  <input type="checkbox" id="${id}" style="margin-top: 4px;">
                  <label for="${id}" style="flex-grow: 1;">${formatLabel(item)}</label>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                  <span id="note-icon-${moduleId}-${id}" style="display: none; color: #ef4444; font-size: 1.1rem; cursor: pointer;" title="View Note" onclick="openNoteModal('${moduleId}', '${id}')">🚩</span>
                  <button onclick="openNoteModal('${moduleId}', '${id}')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 5px; color: #94a3b8; line-height: 1;" title="Add Note/Flag">⋮</button>
                </div>
              </div>`;
          });
        }
        if (data.checklist.exit_criteria && data.checklist.exit_criteria.length > 0) {
          checklistContainer.innerHTML += `<div style="padding: 10px 15px; font-weight: bold; background: rgba(16, 185, 129, 0.08); border-bottom: 1px solid var(--border); border-top: 1px solid var(--border);">Exit Criteria</div>`;
          data.checklist.exit_criteria.forEach((item, index) => {
            const id = `check-exit-${moduleId}-${index}`;
            checklistContainer.innerHTML += `
              <div class="checklist-item" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px; border-bottom: 1px solid var(--border);">
                <div style="display: flex; gap: 10px; flex-grow: 1;">
                  <input type="checkbox" id="${id}" style="margin-top: 4px;">
                  <label for="${id}" style="flex-grow: 1;">${formatLabel(item)}</label>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                  <span id="note-icon-${moduleId}-${id}" style="display: none; color: #ef4444; font-size: 1.1rem; cursor: pointer;" title="View Note" onclick="openNoteModal('${moduleId}', '${id}')">🚩</span>
                  <button onclick="openNoteModal('${moduleId}', '${id}')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 5px; color: #94a3b8; line-height: 1;" title="Add Note/Flag">⋮</button>
                </div>
              </div>`;
          });
        }
      }

      // Restore checklist checked state from localStorage
      loadChecklistState(moduleId);
      loadChecklistNotes(moduleId);

      switchTab('guidelines'); // Default to Guidelines instead of Standard Operating Procedure now that it's simpler
    }

    // --- NOTES LOGIC ---
    function getNotesKey(moduleId, explicitStoryKey) {
      const storyKey = explicitStoryKey || getActiveUserStoryKey();
      const testerName = localStorage.getItem('testerName') || 'default';
      return `checklist_notes_${testerName}_${moduleId}_${storyKey}`;
    }

    function loadChecklistNotes(moduleId) {
      if (!moduleId) return;
      
      // First, hide all existing note icons in this module
      const allIcons = document.querySelectorAll(`[id^="note-icon-${moduleId}-"]`);
      allIcons.forEach(icon => {
        icon.style.display = 'none';
        icon.title = '';
      });
      
      const tKey = document.getElementById('current-user-story-key').innerText.trim();
      const notesKey = getNotesKey(moduleId, tKey);
      
      try {
        const stored = localStorage.getItem(notesKey);
        if (stored) {
          const notes = JSON.parse(stored);
          for (const [itemId, noteData] of Object.entries(notes)) {
            const icon = document.getElementById(`note-icon-${moduleId}-${itemId}`);
            if (icon && noteData && noteData.text) {
              icon.style.display = 'inline-block';
              icon.title = `Note: ${noteData.text}\n(${new Date(noteData.timestamp).toLocaleString()})`;
            }
          }
        }
      } catch(e) {}
    }

    window.openNoteModal = function(moduleId, itemId) {
      const notesKey = getNotesKey(moduleId);
      let notes = {};
      try {
        const stored = localStorage.getItem(notesKey);
        if (stored) notes = JSON.parse(stored);
      } catch(e) {}
      
      document.getElementById('note-module-id').value = moduleId;
      document.getElementById('note-item-id').value = itemId;
      document.getElementById('note-text-input').value = (notes[itemId] && notes[itemId].text) ? notes[itemId].text : '';
      
      document.getElementById('notes-modal').style.display = 'flex';
    };

    window.saveNote = function() {
      const moduleId = document.getElementById('note-module-id').value;
      const itemId = document.getElementById('note-item-id').value;
      const text = document.getElementById('note-text-input').value.trim();
      
      const notesKey = getNotesKey(moduleId);
      let notes = {};
      try {
        const stored = localStorage.getItem(notesKey);
        if (stored) notes = JSON.parse(stored);
      } catch(e) {}
      
      if (text) {
        notes[itemId] = { text, timestamp: new Date().toISOString() };
      } else {
        delete notes[itemId];
      }
      
      localStorage.setItem(notesKey, JSON.stringify(notes));
      document.getElementById('notes-modal').style.display = 'none';
      
      loadChecklistNotes(moduleId);
      
      // Also sync to cloud when a note is added
      saveChecklistState(moduleId);
    };

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
        if (module.checklist) {
          if (Array.isArray(module.checklist)) {
            checklistMatch = module.checklist.some(item => typeof item === 'string' && item.toLowerCase().includes(q));
          } else {
            const entryMatch = module.checklist.entry_criteria ? module.checklist.entry_criteria.some(item => typeof item === 'string' && item.toLowerCase().includes(q)) : false;
            const exitMatch = module.checklist.exit_criteria ? module.checklist.exit_criteria.some(item => typeof item === 'string' && item.toLowerCase().includes(q)) : false;
            checklistMatch = entryMatch || exitMatch;
          }
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

    // INITIALIZATION
    document.addEventListener('DOMContentLoaded', () => {
      // Set tester profile name in UI
      const testerName = localStorage.getItem('testerName') || 'Anonymous Tester';
      const displaySpan = document.getElementById('display-profile-name');
      if (displaySpan) displaySpan.innerText = testerName;
      
      // Dynamic Epic/User Story Interaction
      const epicInput = document.getElementById('epic-input');
      const usInput = document.getElementById('user-story-input');
      
      if (usInput) {
        usInput.addEventListener('change', function(e) {
          const selectedUS = e.target.value.trim().toUpperCase();
          if (window.globalUserStories && window.globalUserStories[selectedUS]) {
            const epic = window.globalUserStories[selectedUS].epicKey;
            if (epic && epicInput) {
              epicInput.value = epic;
              // Trigger datalist filtering based on new epic
              epicInput.dispatchEvent(new Event('input'));
            }
          }
        });
      }
      
      if (epicInput) {
        epicInput.addEventListener('input', function(e) {
          const selectedEpic = e.target.value.trim().toUpperCase();
          const usList = document.getElementById('us-list');
          if (usList && window.globalUserStories) {
            usList.innerHTML = '';
            for (const key in window.globalUserStories) {
              if (!selectedEpic || window.globalUserStories[key].epicKey === selectedEpic) {
                const opt = document.createElement('option');
                opt.value = key;
                usList.appendChild(opt);
              }
            }
          }
        });
      }
      
      // Check Admin State
      if (localStorage.getItem('isAdmin') === 'true') {
        const adminBtn = document.getElementById('admin-dashboard-btn');
        if (adminBtn) adminBtn.style.display = 'inline-block';
      }
      
      // Fetch data for datalists
      if (window.fetchGlobalDataForDatalists) {
        setTimeout(() => window.fetchGlobalDataForDatalists(), 1000); // slight delay to ensure firebase init
      }

      loadTheme();
      updateUserStoryDropdown();
      updateUserStoryDashboard();
      loadModule('ai_generation');
    });