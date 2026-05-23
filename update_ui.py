import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CDNs to Head
cdn_scripts = """
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
"""
content = content.replace('</head>', cdn_scripts + '</head>')

# 2. Add Theme Toggle to Header
header_pattern = re.compile(r'(<h2 style="margin: 0;">iSON - QA SOP Portal</h2>\n\s*</div>)')
theme_toggle_html = """
      <button id="theme-toggle" class="btn" style="background: transparent; color: white; font-size: 1.5rem; padding: 0 10px; margin: 0; border: none; box-shadow: none;">🌙</button>
"""
content = header_pattern.sub(r'\1' + theme_toggle_html, content)

# 3. Add Search Bar to Sidebar
sidebar_pattern = re.compile(r'(<div class="sidebar" id="sidebar">\n\s*<button class="close-sidebar" onclick="closeSidebarOnMobile\(\)">&times;</button>)')
search_bar_html = """
    <div style="padding: 15px 15px 5px 15px;">
      <input type="text" id="module-search" placeholder="Search modules..." style="width: 100%; padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg-color); color: var(--text-color); margin-bottom: 10px;">
    </div>
"""
content = sidebar_pattern.sub(r'\1\n' + search_bar_html, content)

# 4. Add Chart Canvas to Dashboard
dashboard_pattern = re.compile(r'(<h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.15rem; color: var\(--primary\);">User Stories SOP Progress Registry</h3>)')
chart_html = """
          <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px; max-width: 250px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
              <canvas id="complianceChart" width="200" height="200"></canvas>
            </div>
            <div style="flex: 2; min-width: 300px;">
"""
content = dashboard_pattern.sub(r'\1\n' + chart_html, content)

# Close the flex div added above before the closing div of dashboard
# The dashboard div closes before <div id="tab-templates"
closing_dashboard_pattern = re.compile(r'(</div>\n\s*</div>\n\s*</div>\n\n\s*<div id="tab-templates")')
content = closing_dashboard_pattern.sub(r'</div>\n        \1', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("UI elements injected into index.html")
