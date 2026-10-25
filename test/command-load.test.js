const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

function listJavaScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listJavaScriptFiles(filePath) : [filePath];
  }).filter((filePath) => filePath.endsWith('.js'));
}

test('all command modules load without errors', () => {
  const commandRoot = path.join(process.cwd(), 'src', 'commands');
  const commandFiles = listJavaScriptFiles(commandRoot);
  const failures = [];

  for (const filePath of commandFiles) {
    try {
      delete require.cache[require.resolve(filePath)];
      require(filePath);
    } catch (error) {
      failures.push(`${path.relative(process.cwd(), filePath)}: ${error.message}`);
    }
  }

  assert.equal(failures.length, 0, failures.join('\n'));
});
