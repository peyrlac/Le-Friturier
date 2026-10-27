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

test('music progress bars remain bounded for streams and completed tracks', () => {
  const createProgressBar = require('../src/handlers/music/createProgressBar');

  assert.equal(createProgressBar(null, null), '🔘▬▬▬▬▬▬▬▬▬');
  assert.equal(createProgressBar(100, -10), '🔘▬▬▬▬▬▬▬▬▬');
  assert.equal(createProgressBar(100, 50), '▬▬▬▬▬🔘▬▬▬▬');
  assert.equal(createProgressBar(100, 200), '▬▬▬▬▬▬▬▬▬🔘');
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

test('handler loader skips utility modules that do not export a factory', () => {
  const source = read('src/bot.js');

  assert.match(source, /typeof\s+handlerModule\s*===\s*['"]function['"]/);
  assert.match(source, /dir\s*===\s*['"]serverstats['"]\s*&&\s*handler\s*===\s*['"]createStatsChannel\.js['"]/);
});

test('healthcheck path is portable and creates its parent directory', () => {
  const source = read('src/bot.js');

  assert.match(source, /os\.tmpdir\(\)/);
  assert.match(source, /mkdirSync\([^\n]*recursive:\s*true/);
});

test('Mongo connection accepts optional DNS servers for SRV resolution', () => {
  const source = read('src/database/connect.js');

  assert.match(source, /MONGO_DNS_SERVERS/);
  assert.match(source, /dns\.setServers\(/);
});

test('Lavalink nodes come only from explicit environment configuration', () => {
  const source = read('src/bot.js');

  assert.match(source, /createLavalinkNodes/);
  assert.match(source, /LAVALINK_ENABLED/);
  assert.doesNotMatch(source, /lavalink\.techpoint\.world|password:\s*['"]techpoint['"]|lava\.link/);
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
    const source = read(path.join('src', file));
    assert.doesNotMatch(source, /\.catch\(\{\}\)/, file);
    assert.doesNotMatch(source, /findOne\([^\n]*,\s*async\s*\(err/, file);
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

test('moderation wave uses translation keys for common responses', () => {
  const files = [
    'src/commands/moderation/clear.js',
    'src/commands/moderation/ban.js',
    'src/commands/moderation/warn.js',
  ];

  for (const file of files) {
    assert.match(read(file), /key:\s*["'][^"']+\.[^"']+/i, file);
  }
});

test('giveaway manager messages use localization keys', () => {
  for (const file of ['src/commands/giveaway/start.js', 'src/commands/giveaway/drop.js']) {
    const source = read(file);

    assert.match(source, /commands\.giveaway\./, file);
    assert.doesNotMatch(source, /LAST CHANCE|GIVEAWAY ENDED|Congratulations/, file);
  }
});

test('radio commands use localization keys for user-facing responses', () => {
  for (const file of ['src/commands/radio/play.js', 'src/commands/radio/playing.js', 'src/commands/radio/stop.js']) {
    const source = read(file);

    assert.match(source, /commands\.radio\./, file);
    assert.doesNotMatch(source, /Started radio|Radio stopped|Informations radio|La radio a commencé/, file);
  }
});

test('fun command exposes localized top-level metadata', () => {
  const command = require(path.join(root, 'src/interactions/Command/fun.js'));

  assert.deepEqual(command.localizations, {
    name: { fr: 'fun', en: 'fun' },
    description: {
      fr: 'Exécuter les commandes amusantes du bot',
      en: 'Run fun commands in the bot'
    }
  });
});

test('tools command exposes localized top-level metadata', () => {
  const command = require(path.join(root, 'src/interactions/Command/tools.js'));

  assert.deepEqual(command.localizations, {
    name: { fr: 'outils', en: 'tools' },
    description: {
      fr: 'Utiliser les outils du bot',
      en: 'Use the bot tools'
    }
  });
});

test('tools response wave uses translation keys', () => {
  const files = [
    'src/commands/tools/anagram.js',
    'src/commands/tools/button.js',
    'src/commands/tools/decode.js',
    'src/commands/tools/emojify.js'
  ];

  for (const file of files) {
    const source = read(file);
    assert.match(source, /tools\.[A-Za-z]+/, file);
  }

  assert.doesNotMatch(read('src/commands/tools/anagram.js'), /No word found|I formed a word/);
  assert.doesNotMatch(read('src/commands/tools/button.js'), /cannot be longer than 50|Click the button/);
  assert.doesNotMatch(read('src/commands/tools/decode.js'), /only decode binary|I have decoded/);
  assert.doesNotMatch(read('src/commands/tools/emojify.js'), /cannot be longer than 4096/);
});

test('image attachment commands localize their embed titles', () => {
  const files = [
    'src/commands/images/ad.js',
    'src/commands/images/bed.js',
    'src/commands/images/blur.js',
    'src/commands/images/burn.js'
  ];

  for (const file of files) {
    assert.match(read(file), /client\.t\(interaction, ['"]images\.[A-Za-z]+Title['"]\)/, file);
  }
});

test('profile wave localizes fields and select placeholders', () => {
  assert.match(read('src/commands/profile/age.js'), /profile\.ageField/);
  assert.match(read('src/commands/profile/color.js'), /profile\.colorField/);
  assert.match(read('src/commands/profile/origin.js'), /profile\.originField/);

  const gender = read('src/commands/profile/gender.js');
  assert.match(gender, /profile\.genderPlaceholder/);
  assert.doesNotMatch(gender, /Nothing selected/);
});

test('profile collection additions localize their field labels', () => {
  const fields = {
    food: 'food',
    artist: 'artists',
    hobby: 'hobbies',
    pet: 'pets',
    song: 'songs',
    movie: 'movies',
    actor: 'actors'
  };

  for (const [command, field] of Object.entries(fields)) {
    const source = read(`src/commands/profile/add${command}.js`);
    assert.match(source, new RegExp(`profile\\.fields\\.${field}`), command);
  }
});

test('profile collection removals and serverstats time use shared localization', () => {
  const fields = {
    food: 'food',
    artist: 'artists',
    hobby: 'hobbies',
    pet: 'pets',
    song: 'songs',
    movie: 'movies',
    actor: 'actors'
  };

  for (const [command, field] of Object.entries(fields)) {
    const source = read(`src/commands/profile/del${command}.js`);
    assert.match(source, new RegExp(`profile\\.fields\\.${field}`), command);
  }

  const time = read('src/commands/serverstats/time.js');
  assert.match(time, /serverstats\.timeCreated/);
  assert.doesNotMatch(time, /Timezone is not valid|Voice channel count created/);
  assert.doesNotMatch(time, /const time = interaction\.options/);
});

test('profile text updates localize their field labels', () => {
  assert.match(read('src/commands/profile/aboutme.js'), /profile\.fields\.aboutMe/);
  assert.match(read('src/commands/profile/status.js'), /profile\.fields\.status/);
});

test('profile and serverstats commands expose localized top-level metadata', () => {
  const profile = require(path.join(root, 'src/interactions/Command/profile.js'));
  const serverstats = require(path.join(root, 'src/interactions/Command/serverstats.js'));

  assert.equal(profile.localizations.name.fr, 'profil');
  assert.equal(profile.localizations.name.en, 'profile');
  assert.equal(serverstats.localizations.name.fr, 'statistiques');
  assert.equal(serverstats.localizations.name.en, 'serverstats');
});

test('core category commands expose localized top-level metadata', () => {
  for (const name of ['tickets', 'music', 'radio', 'giveaway', 'moderation', 'setup', 'bot', 'economy', 'casino']) {
    const command = require(path.join(root, `src/interactions/Command/${name}.js`));
    assert.ok(command.localizations?.name?.fr, name);
    assert.ok(command.localizations?.name?.en, name);
    assert.ok(command.localizations?.description?.fr, name);
    assert.ok(command.localizations?.description?.en, name);
  }
});

test('warnings command uses async persistence and localized responses', () => {
  const source = read('src/commands/moderation/warnings.js');

  assert.doesNotMatch(source, /findOne\([^\n]*,\s*async\s*\(err/);
  assert.match(source, /Schema\.findOne\([\s\S]*?\);/);
  assert.match(source, /(?:key|titleKey|descKey):\s*['"][^'"]+/);
});

test('warn command allocates cases and stores warnings atomically', () => {
  const source = read('src/commands/moderation/warn.js');

  assert.doesNotMatch(source, /findOne\([^\n]*,\s*async\s*\(err/);
  assert.match(source, /\$inc:\s*\{\s*Case:\s*1\s*\}/);
  assert.match(source, /\$push:\s*\{\s*Warnings:/);
});

test('casino transactions keep dynamic values valid and atomic', () => {
  const roulette = read('src/commands/casino/roulette.js');
  const blackjack = read('src/commands/casino/blackjack.js');

  assert.doesNotMatch(roulette, /variables:\s*\{\s*amount,\s*coins:/);
  assert.match(roulette, /variables:\s*\{\s*amount:\s*money,\s*coins:/);
  assert.doesNotMatch(blackjack, /data\.save\(\)/);
  assert.match(blackjack, /client\.(addMoney|removeMoney)\(/);
});
