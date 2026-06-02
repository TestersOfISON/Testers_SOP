import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract modal
start_str = '<div id="admin-dashboard-modal"'
end_str = '<!-- HIDDEN GLOBAL ANALYTICS MODAL -->'
start_idx = content.find(start_str)
end_idx = content.find(end_str)
if start_idx == -1 or end_idx == -1:
    print('Failed to find modal')
    sys.exit(1)

modal_block = content[start_idx:end_idx]

inner_start = modal_block.find('<div style="display: flex; justify-content: space-between;')
inner_end = modal_block.rfind('</div>', 0, modal_block.rfind('</div>', 0, modal_block.rfind('</div>')))
inner_content = modal_block[inner_start:inner_end + 6]

inner_content = inner_content.replace('<button class="btn btn-danger" onclick="document.getElementById(\'admin-dashboard-modal\').style.display=\'none\'" style="margin: 0;">Close</button>', '')

new_module = f'''
      <div id="admin-module-container" class="module-content" style="display: none; padding: 20px; flex-direction: column; height: 100%;">
        {inner_content}
      </div>
'''

content = content[:start_idx] + content[end_idx:]

insert_target = '<div id="tab-templates" class="tab-content"></div>'
insert_idx = content.find(insert_target)
if insert_idx == -1:
    print('Failed to find tab-templates')
    sys.exit(1)

content = content[:insert_idx + len(insert_target)] + new_module + content[insert_idx + len(insert_target):]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Migration successful')
