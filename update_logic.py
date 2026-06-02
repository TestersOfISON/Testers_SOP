import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('window.openAdminDashboard', 'window.openAdminModule')
content = content.replace('openAdminDashboard()', 'openAdminModule()')

old_display = "document.getElementById('admin-dashboard-modal').style.display = 'flex';"
new_display = '''
      document.getElementById('current-module-title').innerText = 'Lead Admin Panel';
      document.querySelectorAll('.panel-btn').forEach(b => b.classList.remove('active-module'));
      const adminBtn = document.getElementById('sidebar-admin-btn');
      if (adminBtn) adminBtn.classList.add('active-module');
      
      document.getElementById('tabs-container').style.display = 'none';
      document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
      
      const ticketBar = document.getElementById('user-story-bar-container');
      const progressBar = document.getElementById('progress-bar-container');
      const dashboardContainer = document.getElementById('user-story-dashboard-container');
      if (ticketBar) ticketBar.style.display = 'none';
      if (progressBar) progressBar.style.display = 'none';
      if (dashboardContainer) dashboardContainer.style.display = 'none';

      document.getElementById('admin-module-container').style.display = 'flex';
      
      if (typeof closeSidebarOnMobile === 'function') closeSidebarOnMobile();
'''

if old_display in content:
    content = content.replace(old_display, new_display)
else:
    print("Could not find the old display string!")
    sys.exit(1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated index.html logic successfully')
