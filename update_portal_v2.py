import re

def update_html():
    with open('Gemini01.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Execution Details Form & Log Buttons
    execution_hub_pattern = r'<div class="execution-details-box">.*?</div>\s*<h3.*?Standard Operating Procedure Checklist</h3>\s*<div id="checklist-container".*?</div>\s*<div.*?LOG EXECUTION.*?</div>'
    new_execution_hub = r"""<h3 style="margin-bottom: 15px;">Standard Operating Procedure Checklist</h3>
        <div id="checklist-container" style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 8px; overflow: hidden;"></div>"""
    content = re.sub(execution_hub_pattern, new_execution_hub, content, flags=re.DOTALL)

    # 2. Remove Logs Tab Button
    content = re.sub(r'<button class="tab-btn" onclick="switchTab\(\'logs\'\)">Execution Logs</button>', '', content)

    # 3. Remove Logs Tab Content Area
    content = re.sub(r'<div id="tab-logs" class="tab-content">.*?</div>', '', content, flags=re.DOTALL)

    # 4. Remove JS functions related to logs
    content = re.sub(r'// --- FORM SUBMISSION & LOGGING ---.*?// --- EXPORT LOGS ---.*?\}', '', content, flags=re.DOTALL)
    # The regex above might be tricky if braces are unbalanced. Let's do string replacement for the JS part.
    
    # Let's completely rewrite the script tag from loadModule onwards, it's safer.
    script_pattern = r'function loadModule\(moduleId\) \{.*?</script>'
    new_script = """function loadModule(moduleId) {
      const data = qaModules[moduleId];
      if (!data) return;
      currentModuleId = moduleId;

      // Update Active State in Sidebar
      document.querySelectorAll('.panel-btn').forEach(btn => btn.classList.remove('active-module'));
      event.target.classList.add('active-module');
      
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
      try {
        mermaid.render('dynamic-mermaid-svg', data.mermaid, function(svgCode) {
          mermaidContainer.innerHTML = svgCode;
        });
      } catch (err) {
        mermaidContainer.innerHTML = `<p style="color:red; font-weight:bold;">Chart Syntax Error. Please check Mermaid code formatting.</p>`;
      }

      // Build Interactive Checklist
      const checklistContainer = document.getElementById('checklist-container');
      checklistContainer.innerHTML = '';
      data.checklist.forEach((item, index) => {
        const id = `check-${moduleId}-${index}`;
        checklistContainer.innerHTML += `
          <div class="checklist-item">
            <input type="checkbox" id="${id}">
            <label for="${id}">${item}</label>
          </div>`;
      });

      switchTab('guidelines'); // Default to Guidelines instead of Execution Hub now that it's simpler
    }

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
  </script>"""
    
    content = re.sub(script_pattern, new_script, content, flags=re.DOTALL)
    
    # 5. Update templates in qaModules object
    content = content.replace('"<em>Prompts: \'Positive Scenario Test Creator\', \'Negative Scenario Test Creator\', \'UI/UX Non-functional Test Generator\'.</em>"', '`<div class="code-block">Prompts available in Test Manager:\n- Positive Scenario Test Creator\n- Negative Scenario Test Creator\n- Non-functional Test Case Generator\n- UI/UX Non-functional Test Generator</div>`')
    content = content.replace('"<em>Example Name: \'Creatio - Non-resident client - positive scenario 1\'</em>"', '`<div class="code-block">Example LX Name:\nCreatio - Non-resident individual client without card with high risk degree (D-E) - positive scenario 1\n\nLabel rules:\n- Must include US number\n- Must include scenario type (positive, negative, regression, smoke, non-functional)</div>`')
    
    # Replace all "<em>No specific templates required.</em>", "<em>No templates required.</em>", etc. with empty string
    content = re.sub(r'"<em>No specific templates required\.</em>"', '""', content)
    content = re.sub(r'"<em>No templates required\.</em>"', '""', content)
    content = re.sub(r'"<em>Use standard bug template\. If bug not fixed, request conditional acceptance from PO\.</em>"', '""', content)
    content = re.sub(r'"<em>Use the Testing Estimation Form \.xlsx for tracking\.</em>"', '""', content)
    
    with open('Gemini01.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_html()
