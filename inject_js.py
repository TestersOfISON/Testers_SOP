import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Theme Toggle and Search Logic at the top of the file/on load
init_logic = """
document.addEventListener('DOMContentLoaded', () => {
  // Theme Logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        theme = 'light';
        themeToggle.textContent = '🌙';
      } else {
        theme = 'dark';
        themeToggle.textContent = '☀️';
      }
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update chart colors if it exists
      if (complianceChart) {
        complianceChart.data.datasets[0].backgroundColor[1] = theme === 'dark' ? '#334155' : '#e2e8f0';
        complianceChart.update();
      }
    });
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
"""

content = init_logic + '\n' + content

# 2. Inject Chart update & Confetti into updateUserStoryDashboard
dashboard_update_pattern = re.compile(r'(const overallProgress = getUserStoryOverallProgress\(activeKey\);)')
dashboard_update_replace = r'\1\n    updateComplianceChart(overallProgress);\n    if(overallProgress === 100 && typeof confetti === "function") { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); }'
content = dashboard_update_pattern.sub(dashboard_update_replace, content)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Logic injected into js/app.js successfully!")
