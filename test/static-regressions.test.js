const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('prefix fallback uses the configured discord prefix', () => {
  const source = read('src/events/message/messageCreate.js');

  assert.doesNotMatch(source, /client\.config\.Discord\.prefix/);
  assert.match(source, /client\.config\.discord\.prefix/);
});

test('simple custom commands return their own response', () => {
  const source = read('src/events/message/messageCreate.js');

  assert.doesNotMatch(source, /if\s*\(cmd\)\s*\{\s*return message\.channel\.send\(\{ content: cmdx\.Responce \}\);/);
  assert.match(source, /if\s*\(cmd\)\s*\{\s*return message\.channel\.send\(\{ content: cmd\.Responce \}\);/);
});

test('slash command registration uses Discord REST v10', () => {
  const source = read('src/handlers/loaders/commands.js');

  assert.doesNotMatch(source, /new REST\(\{ version: '9' \}\)/);
  assert.match(source, /new REST\(\{ version: '10' \}\)/);
});

test('shared embed helpers expose French labels', () => {
  const source = read('src/handlers/components/embed.js');

  assert.doesNotMatch(source, /Error!|Success!|Something went wrong!|Required Permission/);
  assert.match(source, /Erreur !/);
  assert.match(source, /Succes !|SuccÃƒÂ¨s !/);
});
test('advanced custom commands return their own response', () => {
  const source = read('src/events/message/messageCreate.js');

  assert.match(source, /if \(cmdx\) \{[\s\S]*?if \(cmdx\.Action == "Normal"\) \{[\s\S]*?return message\.channel\.send\(\{ content: cmdx\.Responce \}\);/);
});
test('central user-facing files do not contain mojibake markers', () => {
  const files = [
    'src/handlers/components/embed.js',
    'src/events/client/interactionCreate.js',
    'src/interactions/Command/afk.js',
    'src/interactions/Command/triggers.js',
    'src/interactions/Command/move.js'
  ];

  for (const file of files) {
    assert.doesNotMatch(read(file), /Ã|Â|â\u0080|â|ðŸ|ãƒ|ï»¿/, file);
  }
});

test('interaction replies do not use deprecated fetchReply options', () => {
  const commandFiles = fs.readdirSync(path.join(root, 'src/interactions/Command'))
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    assert.doesNotMatch(read(`src/interactions/Command/${file}`), /deferReply\(\{ fetchReply: true \}\)/, file);
  }

  assert.doesNotMatch(read('src/commands/search/steam.js'), /deferReply\(\{ fetchReply: true \}\)/);
  assert.doesNotMatch(read('src/handlers/components/embed.js'), /fetchReply:\s*true/);
});

test('audited interaction code uses valid reply APIs', () => {
  const interactionSource = read('src/events/client/interactionCreate.js');
  const docsSource = read('src/commands/search/docs.js');

  assert.doesNotMatch(interactionSource, /interaction\.channel\.send\(/);
  assert.doesNotMatch(interactionSource, /\.catch\(\{\}\)/);
  assert.doesNotMatch(docsSource, /interaction\.editreply\(/);
});

test('empty catch handlers and per-interaction reminder initialization are gone', () => {
  const sourceFiles = fs.readdirSync(path.join(root, 'src'), { recursive: true })
    .filter(file => file.endsWith('.js'));

  for (const file of sourceFiles) {
    assert.doesNotMatch(read(path.join('src', file)), /\.catch\(\{\}\)/, file);
  }

  const interactionSource = read('src/events/client/interactionCreate.js');
  assert.equal((interactionSource.match(/createManager\(\)/g) || []).length, 1);
});

test('wave 1-2 commands use translation keys for migrated responses', () => {
  const migrated = [
    'src/commands/config/language.js',
    'src/commands/config/levels.js',
    'src/commands/config/setcolor.js',
    'src/commands/setup/channelsorter.js',
    'src/commands/setup/deletesetup.js',
    'src/commands/bot/ping.js',
    'src/commands/bot/vote.js',
  ];

  for (const file of migrated) {
    assert.match(read(file), /(?:key|descKey):[\s\S]{0,120}['"`]commands\.[\w.]+['"`]/, file);
  }
});
