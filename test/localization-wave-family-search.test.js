const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const fr = require('../src/locales/fr.json');
const en = require('../src/locales/en.json');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function get(source, key) {
  return key.split('.').reduce((value, part) => value?.[part], source);
}

test('family and search response waves use localization keys', () => {
  const files = [
    'src/commands/famille/marier.js',
    'src/commands/famille/renier.js',
    'src/commands/famille/supprimer.js',
    'src/commands/search/corona.js',
    'src/commands/search/docs.js'
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /client\.(errNormal|succNormal)\(\{\s*(error|text):/);
  }

  const keys = [
    'family.selfMarriage',
    'family.alreadyMarried',
    'family.relativeMarriage',
    'family.selfDisown',
    'family.botDisown',
    'family.noRelative',
    'family.disowned',
    'family.resetConfirmTitle',
    'family.resetConfirmDescription',
    'family.resetSuccess',
    'family.resetTimeout',
    'search.invalidCountry',
    'search.docsNotFound',
    'search.coronaTitle',
    'search.confirmed',
    'search.recovered',
    'search.deaths'
  ];

  for (const key of keys) {
    assert.equal(typeof get(fr, key), 'string', `Missing French locale key: ${key}`);
    assert.equal(typeof get(en, key), 'string', `Missing English locale key: ${key}`);
  }
});
