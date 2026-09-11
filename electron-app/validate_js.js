const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, 'thinkOS.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extract all <script> blocks
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = 0;

console.log('🔍 Checking Javascript syntax in FocusThinking.html...');

while ((match = scriptRegex.exec(htmlContent)) !== null) {
  const code = match[1];
  count++;
  const offset = htmlContent.substring(0, match.index).split('\n').length;
  try {
    // Check syntax of script block using native vm
    new vm.Script(code, { lineOffset: offset });
  } catch (err) {
    errors++;
    console.error(`\n❌ Syntax Error in <script> block #${count}:`);
    console.error(err.stack || err.message);
  }
}

if (errors === 0) {
  console.log(`\n✅ All ${count} <script> blocks are syntactically valid!`);
} else {
  console.log(`\n❌ Found ${errors} syntax errors!`);
  process.exit(1);
}
