const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const fr = require('../src/locales/fr.json');
const en = require('../src/locales/en.json');

function filesIn(directory) {
  const result = [];
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...filesIn(relative));
    else if (entry.name.endsWith('.js')) result.push(relative);
  }
  return result;
}

function getValue(source, key) {
  return key.split('.').reduce((value, part) => value?.[part], source);
}

function localeValue(source, key) {
  return getValue(source, key) ?? getValue(source, key.startsWith('commands.') ? key : `commands.${key}`);
}

test('all static response keys exist in both locale catalogs', () => {
  const files = [...filesIn('src/commands'), ...filesIn('src/interactions/Command')];
  const keyPattern = /\b(?:key|descKey|titleKey):[ \t]*['"]([^'"]+)['"]|client\.t\([^,]+,[ \t]*['"]([^'"]+)['"]/g;
  const missing = [];

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    let match;
    while ((match = keyPattern.exec(source))) {
      const key = match[1] || match[2];
      if (key.endsWith('.')) continue;
      if (!localeValue(fr, key) || !localeValue(en, key)) missing.push(`${file}: ${key}`);
    }
  }

  assert.deepEqual(missing, []);
});

test('every translated string keeps the same interpolation placeholders', () => {
  const placeholders = value => [...String(value).matchAll(/\{([^{}]+)\}/g)].map(match => match[1]).sort();
  const mismatches = [];

  function walk(french, english, prefix = '') {
    for (const key of new Set([...Object.keys(french || {}), ...Object.keys(english || {})])) {
      const current = prefix ? `${prefix}.${key}` : key;
      const frValue = french?.[key];
      const enValue = english?.[key];
      if (typeof frValue === 'string' && typeof enValue === 'string') {
        if (JSON.stringify(placeholders(frValue)) !== JSON.stringify(placeholders(enValue))) mismatches.push(current);
      } else if (frValue && enValue && typeof frValue === 'object' && typeof enValue === 'object') {
        walk(frValue, enValue, current);
      }
    }
  }

  walk(fr, en);
  assert.deepEqual(mismatches, []);
});
