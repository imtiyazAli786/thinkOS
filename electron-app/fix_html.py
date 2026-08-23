import re

html_path = "/Users/imtiyazali/Documents/03_PERSONAL/08_WebApps/Focused-Dashboard/think-dashboard/ThinkDashboard.html"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add a custom prompt modal HTML right after quickCaptureModal
modal_html = """
  <!-- Custom Prompt Modal -->
  <div id="customPromptModal" class="learning-modal-overlay hidden" style="z-index: 10000;">
    <div class="learning-modal" style="max-width: 360px;">
      <h2 id="customPromptMessage">Enter value</h2>
      <input type="text" id="customPromptInput" style="margin: 16px 0;" />
      <div class="learning-modal-actions">
        <button class="learning-modal-btn secondary" id="customPromptCancel">Cancel</button>
        <button class="learning-modal-btn primary" id="customPromptSubmit">OK</button>
      </div>
    </div>
  </div>
"""
if "customPromptModal" not in content:
    content = content.replace('id="quickCaptureModal"', 'id="quickCaptureModal"').replace('</div>\n  </div>', '</div>\n  </div>\n' + modal_html, 1)

# 2. Add customPrompt JS function
js_code = """
    // Custom Async Prompt
    function customPrompt(message, defaultValue = '') {
      return new Promise(resolve => {
        const modal = document.getElementById('customPromptModal');
        const msgEl = document.getElementById('customPromptMessage');
        const inputEl = document.getElementById('customPromptInput');
        const cancelBtn = document.getElementById('customPromptCancel');
        const submitBtn = document.getElementById('customPromptSubmit');
        
        msgEl.textContent = message;
        inputEl.value = defaultValue;
        modal.classList.remove('hidden');
        inputEl.focus();
        
        const cleanup = () => {
          modal.classList.add('hidden');
          cancelBtn.onclick = null;
          submitBtn.onclick = null;
          inputEl.onkeydown = null;
        };
        
        cancelBtn.onclick = () => { cleanup(); resolve(null); };
        submitBtn.onclick = () => { cleanup(); resolve(inputEl.value); };
        inputEl.onkeydown = (e) => {
          if (e.key === 'Enter') { cleanup(); resolve(inputEl.value); }
          if (e.key === 'Escape') { cleanup(); resolve(null); }
        };
      });
    }
"""
if "function customPrompt" not in content:
    content = content.replace('// UTILITIES', '// UTILITIES\n' + js_code)

# 3. Rewrite prompt usages to use customPrompt (async)
# createFinanceNote
content = re.sub(
    r"function createFinanceNote\(monthLabel\) \{\s*if \(\!monthLabel\) \{\s*const now = new Date\(\);\s*const defaultMonth = now.toLocaleString\('default', \{ month: 'long', year: 'numeric' \}\);\s*monthLabel = prompt\('Enter month name \(e.g. May 2026\):', defaultMonth\);\s*if \(\!monthLabel\) return;\s*monthLabel = monthLabel.trim\(\);\s*\}",
    r"async function createFinanceNote(monthLabel) {\n      if (!monthLabel) {\n        const now = new Date();\n        const defaultMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });\n        monthLabel = await customPrompt('Enter month name (e.g. May 2026):', defaultMonth);\n        if (!monthLabel) return;\n        monthLabel = monthLabel.trim();\n      }",
    content
)

# createMeetingNote
content = re.sub(
    r"function createMeetingNote\(title\) \{\s*const now = Date.now\(\);\s*const dateStr = new Date\(now\).toLocaleDateString\(\[\], \{ month: 'short', day: 'numeric', year: 'numeric' \}\);\s*if \(\!title\) \{\s*const userTitle = prompt\(\"Enter Meeting Title or Date\", `Meeting - \$\{dateStr\}`\);\s*if \(\!userTitle\) return;\s*title = userTitle.trim\(\);\s*\}",
    r"async function createMeetingNote(title) {\n      const now = Date.now();\n      const dateStr = new Date(now).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });\n      if (!title) {\n        const userTitle = await customPrompt(\"Enter Meeting Title or Date\", `Meeting - ${dateStr}`);\n        if (!userTitle) return;\n        title = userTitle.trim();\n      }",
    content
)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)
print("✅ Fixed prompt() usages")

