import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Rename 'ticket' to 'userStory' across IDs and variables
replacements = {
    'jira-ticket-input': 'user-story-input',
    'jira-ticket-select': 'user-story-select',
    'ticket-bar-container': 'user-story-bar-container',
    'ticket-dashboard-container': 'user-story-dashboard-container',
    'ticket-dashboard-table': 'user-story-dashboard-table',
    'ticket-dashboard-tbody': 'user-story-dashboard-tbody',
    'sop_ticket_registry': 'sop_user_story_registry',
    'sop_ticket_meta_': 'sop_user_story_meta_',
    'getActiveTicketKey': 'getActiveUserStoryKey',
    'getTicketRegistry': 'getUserStoryRegistry',
    'addToTicketRegistry': 'addToUserStoryRegistry',
    'saveTicketMetadata': 'saveUserStoryMetadata',
    'getTicketMetadata': 'getUserStoryMetadata',
    'updateTicketDropdown': 'updateUserStoryDropdown',
    'updateTicketDashboard': 'updateUserStoryDashboard',
    'getTicketOverallProgress': 'getUserStoryOverallProgress',
    'deleteTicketFromRegistry': 'deleteUserStoryFromRegistry',
    'handleTicketKeyChange': 'handleUserStoryKeyChange',
    'handleTicketSelect': 'handleUserStorySelect',
    'ticketKey': 'storyKey'
}

for old, new in replacements.items():
    content = content.replace(old, new)
    
# Replace 'Ticket' with 'User Story' in UI labels carefully
content = content.replace('Active ticket content', 'User Story')
content = content.replace('Jira Ticket Key', 'User Story Key')
content = content.replace('Enter Jira Ticket Number', 'Enter User Story Key')
content = content.replace('>Ticket<', '>User Story<')
content = content.replace('deleteTicket(', 'deleteUserStory(')
content = content.replace('exportTicketToExcel(', 'exportUserStoryToExcel(')
content = content.replace('exportAllTicketsToExcel(', 'exportAllUserStoriesToExcel(')


# 2. Add sequential logic CSS
css_pattern = r'(\.checklist-item input\[type="checkbox"\] \{.*?\})'
new_css = r'\1\n    .checklist-item input[type="checkbox"]:disabled { opacity: 0.4; cursor: not-allowed; }\n    .checklist-item input[type="checkbox"]:disabled + label { opacity: 0.5; cursor: not-allowed; }'
content = re.sub(css_pattern, new_css, content)

# 3. Inject evaluateChecklistLogic() function
logic_func = """
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
            if (!cb.checked) {
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
              if (!cb.checked) {
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
              if (!cb.checked) {
                allPreviousChecked = false;
              }
            }
          });
        }
      }
      return stateChanged;
    }
"""

content = content.replace('// --- LOCAL STORAGE FUNCTIONALITY ---', '// --- CHECKLIST LOGIC ---\n' + logic_func + '\n    // --- LOCAL STORAGE FUNCTIONALITY ---')

# 4. Integrate into loadChecklistState
load_checklist_pattern = r'(console\.error\("Error loading checklist state", e\);\n\s*\}\n\s*\})'
load_checklist_replace = r'\1\n      \n      evaluateChecklistLogic(moduleId);'
content = re.sub(load_checklist_pattern, load_checklist_replace, content)

# 5. Integrate into event listener
event_listener_pattern = r"(document\.getElementById\('checklist-container'\)\.addEventListener\('change', function\(e\) \{\n\s*if \(e\.target && e\.target\.type === 'checkbox' && currentModuleId\) \{\n)(\s*saveChecklistState\(currentModuleId\);\n\s*\})"
event_listener_replace = r"\1        evaluateChecklistLogic(currentModuleId);\n\2"
content = re.sub(event_listener_pattern, event_listener_replace, content)

# 6. Ensure user story selectors and Excel exports are ONLY visible for SOP modules
# The render function updates `document.getElementById('user-story-bar-container').style.display`
# Let's find loadModule and update it.
load_module_pattern = r"(function loadModule\(moduleId\) \{\n\s*currentModuleId = moduleId;\n\s*const data = qaModules\[moduleId\];\n\s*if \(!data\) return;\n\n\s*// Update Title and Subtitle)"
load_module_replace = r"\1\n\n      // Scope User Story features exclusively to Test Design & Execution modules\n      const userStoryBar = document.getElementById('user-story-bar-container');\n      if (activeChecklistModules.includes(moduleId)) {\n        userStoryBar.style.display = 'flex';\n      } else {\n        userStoryBar.style.display = 'none';\n      }\n"
content = re.sub(load_module_pattern, load_module_replace, content)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('index.html updated successfully!')
