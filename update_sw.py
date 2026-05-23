import re

with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

# Bump cache version
sw_content = re.sub(r'qa-portal-cache-v4', 'qa-portal-cache-v5', sw_content)

# Update urlsToCache
urls_pattern = re.compile(r'(const urlsToCache = \[)(.*?)(\];)', re.DOTALL)
new_urls = """
  './index.html',
  './dashboard.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './js/firebase-sync.js'
"""
sw_content = urls_pattern.sub(r'\1' + new_urls + r'\3', sw_content)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

print("sw.js updated successfully")
