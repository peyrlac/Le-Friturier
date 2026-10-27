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

test('tools, notes, and thanks response waves use localization keys', () => {
  const files = [
    'src/commands/tools/enlarge.js',
    'src/commands/tools/mcstatus.js',
    'src/commands/tools/pwdgen.js',
    'src/commands/tools/remindAsync.js',
    'src/commands/notepad/notes.js',
    'src/commands/thanks/thanks.js'
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /client\.(errNormal|succNormal)\(\{\s*(error|text):/);
  }

  for (const key of [
    'tools.invalidEmoji',
    'tools.serverNotFound',
    'tools.remoteDataUnavailable',
    'tools.passwordSent',
    'tools.generatedPassword',
    'tools.password',
    'tools.length',
    'tools.reminderExists',
    'tools.reminderSet',
    'tools.reminderEndTime',
    'tools.reminder',
    'tools.reminderEnded',
    'notepad.noNotes',
    'thanks.self',
    'thanks.alreadyGiven',
    'thanks.success'
  ]) {
    assert.equal(typeof get(fr, key), 'string', `Missing French locale key: ${key}`);
    assert.equal(typeof get(en, key), 'string', `Missing English locale key: ${key}`);
  }
});

test('soundboard responses use shared localized voice and playback keys', () => {
  const directory = path.join(root, 'src/commands/soundboard');
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join('src/commands/soundboard', file));

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /client\.errNormal\(\{\s*error:/);
    assert.doesNotMatch(source, /client\.succNormal\(\{\s*text:/);
  }

  for (const key of ['soundboard.notInVoice', 'soundboard.notSameVoice', 'soundboard.started']) {
    assert.equal(typeof get(fr, key), 'string', `Missing French locale key: ${key}`);
    assert.equal(typeof get(en, key), 'string', `Missing English locale key: ${key}`);
  }
});

test('developer and fun responses use localization keys', () => {
  for (const file of ['src/commands/developers/eval.js', 'src/commands/fun/token.js']) {
    const source = read(file);
    assert.doesNotMatch(source, /client\.errNormal\(\{\s*error:/);
    assert.doesNotMatch(source, /client\.succNormal\(\{\s*text:/);
  }

  for (const key of [
    'developers.tokenRefusal',
    'developers.evalTitle',
    'developers.input',
    'developers.output',
    'developers.error',
    'fun.tokenTitle',
    'fun.tokenUnavailable'
  ]) {
    assert.equal(typeof get(fr, key), 'string', `Missing French locale key: ${key}`);
    assert.equal(typeof get(en, key), 'string', `Missing English locale key: ${key}`);
  }
});
