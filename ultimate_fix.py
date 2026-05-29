import re

def clean_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Remove duplicate JS imports at the bottom
    duplicate_scripts_pattern = re.compile(r'(\s*<script src="js/data\.js"></script>\s*<script type="module" src="js/firebase-sync\.js"></script>\s*<script src="js/app\.js"></script>){2,}', re.DOTALL)
    html = duplicate_scripts_pattern.sub(r'\n  <script src="js/data.js"></script>\n  <script type="module" src="js/firebase-sync.js"></script>\n  <script src="js/app.js"></script>\n', html)

    # 2. Remove the extra Mermaid tag in the head
    html = html.replace('<script src="https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js"></script>\n\n  <link rel="stylesheet"', '<link rel="stylesheet"')

    # 3. Fix the mismatched divs around the dashboard and tabs
    # Let's find the table end and rebuild the closing tags exactly.
    table_end_pattern = re.compile(r'</table>\s*</div>\s*</div>\s*</div>\s*<div id="tab-templates"', re.DOTALL)
    # The structure should be:
    # </table>
    # </div> <!-- closes overflow-x -->
    # </div> <!-- closes flex: 2 -->
    # </div> <!-- closes flex container -->
    # </div> <!-- closes dashboard-container -->
    # </div> <!-- closes tab-checklist -->
    
    html = re.sub(
        r'</table>\s*</div>\s*</div>\s*</div>\s*<div id="tab-templates"',
        r'</table>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div id="tab-templates"',
        html
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

clean_html(r'c:\Users\vigne\Downloads\Libra\index.html')
clean_html(r'c:\Users\vigne\Downloads\Libra\To commit\index.html')
clean_html(r'c:\Users\vigne\Downloads\Libra\PWA\index.html')

print("Index.html cleaned successfully across all folders.")
