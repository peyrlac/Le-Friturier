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

function placeholders(value) {
  return [...String(value).matchAll(/\{([^{}]+)\}/g)].map(match => match[1]);
}

function sourceFiles() {
  return [
    ...filesIn('src/commands'),
    ...filesIn('src/interactions/Command'),
    ...filesIn('src/events'),
    ...filesIn('src/handlers')
  ];
}

function variableNames(objectSource) {
  return objectSource
    .split(',')
    .map(part => part.trim())
    .map(part => part.match(/^([A-Za-z_$][\w$]*)\s*(?::|$)/)?.[1])
    .filter(Boolean);
}

test('all static response keys exist in both locale catalogs', () => {
  const files = sourceFiles().filter(file => file !== path.join('src', 'handlers', 'features', 'registry.js'));
  const keyPattern = /\b(?:key|descKey|titleKey|labelKey):[ \t]*['"]([^'"]+)['"]|client\.t\([^,]+,[ \t]*['"]([^'"]+)['"]/g;
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

test('translation calls provide every interpolation variable required by the catalog', () => {
  const missing = [];
  const usagePattern = /(?:key|descKey|titleKey):\s*['"]([^'"]+)['"][\s\S]{0,500}?variables:\s*\{([^{}]*)\}/g;

  for (const file of sourceFiles()) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    let match;
    while ((match = usagePattern.exec(source))) {
      const key = match[1];
      const required = new Set(placeholders(localeValue(fr, key)));
      const provided = new Set(variableNames(match[2]));
      for (const variable of required) {
        if (!provided.has(variable)) missing.push(`${file}: ${key} requires {${variable}}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
