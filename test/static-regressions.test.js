const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const initializeI18n = require('../src/handlers/i18n');

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
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');

  assert.deepEqual(resolveCommandLocalizations(command), {
    name: { fr: 'fun', en: 'fun' },
    description: {
      fr: 'Exécuter les commandes amusantes du bot',
      en: 'Run fun commands in the bot'
    }
  });
});

test('tools command exposes localized top-level metadata', () => {
  const command = require(path.join(root, 'src/interactions/Command/tools.js'));
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');

  assert.deepEqual(resolveCommandLocalizations(command), {
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
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');
  const profileLocalizations = resolveCommandLocalizations(profile);
  const serverstatsLocalizations = resolveCommandLocalizations(serverstats);

  assert.equal(profileLocalizations.name.fr, 'profil');
  assert.equal(profileLocalizations.name.en, 'profile');
  assert.equal(serverstatsLocalizations.name.fr, 'statistiques');
  assert.equal(serverstatsLocalizations.name.en, 'serverstats');
});

test('message and context profile common responses use localization keys', () => {
  const message = read('src/interactions/Command/message.js');
  const profile = read('src/interactions/ContextMenu/profile.js');

  assert.match(message, /key:\s*['"]fun\.messageSent['"]/);
  assert.match(message, /key:\s*['"]errors\.developerOnly['"]/);
  assert.doesNotMatch(message, /Message has been sent successfully|Only Bot 2 developers are allowed/);
  assert.match(profile, /key:\s*['"]profile\.notFound['"]/);
  assert.doesNotMatch(profile, /No profile found! Open a profile with \/profile create/);
});

test('economy reset, leaderboard, and store use localization keys', () => {
  const clear = read('src/commands/economy/clear.js');
  const leaderboard = read('src/commands/economy/leaderboard.js');
  const store = read('src/commands/economy/store.js');

  for (const key of ['economy.reset.confirmTitle', 'economy.reset.confirmDescription', 'economy.reset.success', 'economy.reset.cancelled', 'economy.reset.timeout']) {
    const escapedKey = key.split('.').join('\\.');
    assert.match(clear, new RegExp(`(?:key:\\s*|client\\.t\\(interaction,\\s*)['"]${escapedKey}['"]`), key);
  }
  assert.match(leaderboard, /economy\.leaderboard\.noData/);
  assert.match(leaderboard, /economy\.leaderboard\.(moneyTitle|bankTitle)/);
  assert.match(store, /economy\.store\.notFound/);
  assert.match(store, /economy\.store\.(title|description|entry)/);
  assert.doesNotMatch(clear, /Reset economy|Are you sure you want to reset|economy has been successfully reset|economy reset has been cancelled|Time's up/);
  assert.doesNotMatch(leaderboard, /No data found|Money - \$\{|Bank - \$\{/);
  assert.doesNotMatch(store, /No store found in this guild|Bot's Store|To buy/);
});

test('remaining family adoption and divorce responses use localization keys', () => {
  const adoption = read('src/commands/famille/adopter.js');
  const divorce = read('src/commands/famille/divorcer.js');

  for (const key of ['family.selfAdoption', 'family.botAdoption', 'family.relativeAdoption', 'family.alreadyAdopted', 'family.adoptionTitle', 'family.adoptionDescription', 'family.adoptionAcceptedTitle', 'family.adoptionAcceptedDescription', 'family.adoptionDeclinedTitle', 'family.adoptionDeclinedDescription', 'family.adoptionTimeoutTitle', 'family.adoptionTimeoutDescription']) {
    assert.match(adoption, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  for (const key of ['family.selfDivorce', 'family.botDivorce', 'family.notMarried', 'family.divorceTitle', 'family.divorceDescription']) {
    assert.match(divorce, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  assert.doesNotMatch(adoption, /Tu ne peux pas|Cette personne a déjà|Adoption acceptée|Adoption refusée|n'a pas répondu/);
  assert.doesNotMatch(divorce, /Tu ne peux pas|Tu n'es pas marrier|Divorcés|viennent de divorcer/);
});

test('moderation context menu common responses use localization keys', () => {
  for (const file of ['warn.js', 'warnings.js', 'unwarn.js', 'userinfo.js']) {
    const source = read(`src/interactions/ContextMenu/${file}`);
    assert.doesNotMatch(source, /error:\s*[`"'](?:You don't have the required permissions|User has no warnings|This user is not in this guild)/, file);
  }
  assert.match(read('src/interactions/ContextMenu/warn.js'), /key:\s*['"]errors\.moderation\.warnSuccess['"]/);
  assert.match(read('src/interactions/ContextMenu/unwarn.js'), /key:\s*['"]errors\.moderation\.warningRemoved['"]/);
  assert.match(read('src/interactions/ContextMenu/unwarn.js'), /key:\s*['"]errors\.moderation\.noWarnings['"]/);
  assert.match(read('src/interactions/ContextMenu/userinfo.js'), /key:\s*['"]errors\.userNotInGuild['"]/);
});

test('localized levels and messages delegates contain no unreachable legacy implementation', () => {
  for (const file of [
    'src/commands/levels/leaderboard.js',
    'src/commands/levels/rewards.js',
    'src/commands/messages/add.js',
    'src/commands/messages/leaderboard.js',
    'src/commands/messages/remove.js',
    'src/commands/messages/rewards.js'
  ]) {
    const source = read(file);
    assert.doesNotMatch(source, /const Schema|No data found|No rewards found|Added \\\*\\\*|Removed \\\*\\\*/,
      file);
  }
});

test('interaction router user-facing responses use localization keys', () => {
  const source = read('src/events/client/interactionCreate.js');
  for (const key of ['router.banned', 'router.dmSent', 'router.cannotDM', 'router.helpTitle', 'router.helpDescription', 'router.verificationSuccess', 'router.captchaIncorrect', 'router.verificationUnavailable']) {
    assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  assert.doesNotMatch(source, /You have been banned by the developers|I can't DM you|Help panel|successfully verified|answered the captcha incorrectly|Verify is disabled/);
});

test('music lifecycle events use localization keys', () => {
  for (const file of ['queueEnd.js', 'playerMove.js', 'playerDisconnect.js']) {
    const source = read(`src/events/music/${file}`);
    assert.match(source, /key:\s*['"]music\.(queueEmpty|disconnected)['"]/ , file);
    assert.doesNotMatch(source, /Queue is empty|Music has stopped/ , file);
  }
});

test('search and tools response wave uses localization keys', () => {
  const files = [
    'src/commands/search/bing.js',
    'src/commands/search/crypto.js',
    'src/commands/search/ddg.js',
    'src/commands/search/github.js',
    'src/commands/search/google.js',
    'src/commands/search/hexcolour.js',
    'src/commands/search/itunes.js',
    'src/commands/search/npm.js',
    'src/commands/search/steam.js',
    'src/commands/search/translate.js',
    'src/commands/search/weather.js',
    'src/commands/search/youtube.js',
    'src/commands/tools/sourcebin.js',
    'src/commands/tools/url.js'
  ];

  for (const file of files) {
    const source = read(file);
    assert.match(source, /(?:key|titleKey|descKey):\s*['"](?:search|tools)\./, file);
    assert.doesNotMatch(source, /I have found the following|Please check your inputs|No account found|Color not found|Song not found|Package not found|Application not found|valid ISO language code|Invalid\*\* location|Your code has been posted|shortened url has been created/i, file);
  }
});

test('suggestions and sticky messages use localization keys', () => {
  const expectations = {
    'src/commands/suggestions/accept.js': ['suggestions.accepted', 'suggestions.notConfigured'],
    'src/commands/suggestions/deny.js': ['suggestions.denied', 'suggestions.notConfigured'],
    'src/commands/suggestions/send.js': ['suggestions.submitted', 'suggestions.title', 'suggestions.notConfigured'],
    'src/commands/stickymessages/messages.js': ['stickymessages.title', 'stickymessages.noData'],
    'src/commands/stickymessages/stick.js': ['stickymessages.created'],
    'src/commands/stickymessages/unstick.js': ['stickymessages.deleted', 'stickymessages.notFound']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /Suggestion successfully|No suggestion channel set|Sticky message (created|deleted)|No message found|No data found/i, file);
  }
  assert.match(read('src/commands/stickymessages/messages.js'), /data\.length/);
});

test('event participants uses localized success and error responses', () => {
  const source = read('src/commands/event/participants.js');
  for (const key of ['events.noThread', 'events.idRequired', 'events.notFound', 'events.noParticipants', 'events.listTitle', 'events.fetchError']) {
    assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  assert.doesNotMatch(source, /Événement non trouvé|Aucun participant disponible|Une erreur est survenue lors de la récupération/i);
});

test('direct message handlers honor their feature kill switches', () => {
  const triggers = read('src/handlers/response/triggers.js');
  const antispam = read('src/handlers/security/antispamLocalized.js');

  assert.match(triggers, /isFeatureEnabled\(['"]triggers['"],\s*message\.guild\.id\)/);
  assert.match(triggers, /isFeatureEnabled\(['"]triggers['"],\s*newMessage\.guild\.id\)/);
  assert.match(antispam, /isFeatureEnabled\(['"]antiSpam['"],\s*message\.guild\.id\)/);
});

test('announcement responses use localization keys', () => {
  for (const file of ['src/commands/announcement/create.js', 'src/commands/announcement/edit.js']) {
    const source = read(file);
    assert.match(source, /announcement\.(title|sent|edited|channel)/, file);
    assert.doesNotMatch(source, /Annonce|announcement has been|announcement was/i, file);
  }
});

test('guild information commands use localization keys for responses and labels', () => {
  const expectations = {
    'src/commands/guild/userinfo.js': ['guild.userNotFound', 'guild.userInfoTitle'],
    'src/commands/guild/inviteinfo.js': ['guild.inviteNotFound', 'guild.inviteInfoTitle'],
    'src/commands/guild/stealemoji.js': ['guild.emojiAdded', 'guild.emojiNotFound']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /This user is not in this guild|I couldn't find the server|Emoji successfully added|Emoji not found/i, file);
  }
});

test('native radio, report, and levels responses use localization keys', () => {
  const expectations = {
    'src/interactions/Command/radio.js': ['voice.notInVoice'],
    'src/interactions/Command/report.js': ['report.bugSent', 'report.userSent'],
    'src/interactions/Command/levels.js': ['levels.disabled']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /You're not in a voice channel|Bug successfully sent|User report successfully sent|level system is disabled/i, file);
  }
});

test('channel moderation responses use localization keys', () => {
  const expectations = {
    'src/commands/moderation/lock.js': 'moderation.channelLocked',
    'src/commands/moderation/unlock.js': 'moderation.channelUnlocked',
    'src/commands/moderation/lockdown.js': 'moderation.channelsLocked'
  };

  for (const [file, key] of Object.entries(expectations)) {
    const source = read(file);
    assert.match(source, new RegExp(key.replace('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /Channel locked successfully|Channel unlocked successfully|Channels locked successfully/i, file);
  }
});

test('reaction roles responses use localization keys', () => {
  const expectations = {
    'src/commands/reactionroles/button.js': ['reactionroles.noData', 'reactionroles.panelTitle', 'reactionroles.panelDescription', 'reactionroles.panelCreated'],
    'src/commands/reactionroles/delete.js': ['reactionroles.noData', 'reactionroles.deleted'],
    'src/commands/reactionroles/list.js': ['reactionroles.noData', 'reactionroles.listTitle']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /No data found|Reaction panel successfully created|successfully deleted/i, file);
  }
});

test('reaction role interaction responses use the active locale', () => {
  const source = read('src/events/client/interactionCreate.js');
  assert.match(source, /reactionroles\.(roleAdded|roleRemoved|rolesUpdated)/);
  assert.doesNotMatch(source, /was \$\{hasRole \? 'removed' : 'added'\}|I have updated the following roles for you/);
});

test('spoiler context menu exposes localized native metadata', () => {
  const source = read('src/interactions/ContextMenu/spoiler.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.spoiler['"]/);
});

test('all moderation and profile context menus expose localized native metadata', () => {
  const metadata = {
    warn: 'warn',
    unwarn: 'unwarn',
    warnings: 'warnings',
    userinfo: 'userinfo',
    profile: 'profile'
  };

  for (const [file, key] of Object.entries(metadata)) {
    const source = read(`src/interactions/ContextMenu/${file}.js`);
    assert.match(source, new RegExp(`localizationKey:\\s*['"]commandMetadata\\.${key}['"]`), file);
  }
});

test('activities command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/activities.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('afk command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/afk.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('birthdays command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/birthdays.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('announcement command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/announcement.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('autosetup command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/autosetup.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('custom commands command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/commands.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('developers command reads native metadata from the locale catalog', () => {
  const source = read('src/interactions/Command/developers.js');
  assert.match(source, /getCommandMetadata\(/);
  assert.doesNotMatch(source, /setDescription\(['"`]/);
});

test('move commands use localization keys for all user-facing responses', () => {
  const files = ['all.js', 'group.js', 'random.js', 'empty.js', 'split.js', 'regroup.js', 'emergency-meeting.js'];
  for (const file of files) {
    const source = read(`src/commands/move/${file}`);
    assert.match(source, /move\.[A-Za-z]+/, file);
    assert.doesNotMatch(source, /(?:error|text|title|desc):\s*[`'\"][A-Za-zÀ-ÿ]/, file);
  }
});

test('developer credit responses use localization keys', () => {
  const source = read('src/commands/developers/credits.js');
  assert.match(source, /developerCredits\.added/);
  assert.match(source, /developerCredits\.removed/);
  assert.doesNotMatch(source, /succNormal\(\{\s*text:/);
});

test('developer bot-ban responses use localization keys', () => {
  const source = read('src/commands/developers/ban.js');
  for (const key of ['developerAdmin.banSelf', 'developerAdmin.alreadyBanned', 'developerAdmin.banned', 'developerAdmin.notBanned', 'developerAdmin.unbanned']) {
    assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  assert.doesNotMatch(source, /You cannot ban yourself|has not been banned from the bot|Interdiction du bot|UNCANN/i);
});

test('moderation action responses use localization keys', () => {
  const expectations = {
    'src/commands/moderation/ban.js': ['errors.moderation.banNotified', 'errors.moderation.banNotNotified'],
    'src/commands/moderation/kick.js': ['errors.moderation.kickNotified', 'errors.moderation.kickNotNotified'],
    'src/commands/moderation/softban.js': ['errors.moderation.banNotified', 'errors.moderation.banNotNotified'],
    'src/commands/moderation/tempban.js': ['errors.moderation.banNotified', 'errors.moderation.banNotNotified'],
    'src/commands/moderation/timeout.js': ['errors.moderation.timeoutAlready', 'errors.moderation.timeoutSuccess', 'errors.moderation.timeoutFailed']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /successfully banned|successfully kicked|already timed out|can't timeout/i, file);
  }
});

test('voice-role setup responses use localization keys', () => {
  const source = read('src/commands/setup/voiceroles.js');
  for (const key of ['voiceRoles.noPermission', 'voiceRoles.invalidChannel', 'voiceRoles.setupSuccess', 'voiceRoles.noChannels', 'voiceRoles.progress', 'voiceRoles.setupAllSuccess']) {
    assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), key);
  }
  assert.doesNotMatch(source, /Vous n'avez pas la permission|doit être un salon vocal|Aucun salon vocal trouvé|Configuration des rôles vocaux/i);
});

test('ticket message configuration responses use localization keys', () => {
  const source = read('src/commands/config/ticketmessage.js');
  assert.match(source, /tickets\.messageSet/);
  assert.match(source, /tickets\.messageDataMissing/);
  assert.doesNotMatch(source, /message a été défini avec succès|Aucune donnée de message de ticket trouvé|The ticket message has been set successfully/i);
});

test('activities command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/activities.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.activities['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('afk command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/afk.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.afk['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('birthdays command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/birthdays.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.birthdays['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('bot command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/bot.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.bot['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('core moderation setup and ticket metadata is sourced from the locale catalogs', () => {
  for (const name of ['moderation', 'setup', 'tickets']) {
    const source = read(`src/interactions/Command/${name}.js`);
    assert.match(source, new RegExp(`localizationKey:\\s*['"]commandMetadata\\.${name}['"]`), name);
    assert.doesNotMatch(source, /localizations:\s*\{/);
  }
});

test('music and radio metadata is sourced from the locale catalogs', () => {
  for (const name of ['music', 'radio']) {
    const source = read(`src/interactions/Command/${name}.js`);
    assert.match(source, new RegExp(`localizationKey:\\s*['"]commandMetadata\\.${name}['"]`), name);
    assert.doesNotMatch(source, /localizations:\s*\{/);
  }
});

test('automod metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/automod.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.automod['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('triggers metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/triggers.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.triggers['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('config metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/config.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.config['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('fun and giveaway metadata is sourced from the locale catalogs', () => {
  for (const name of ['fun', 'giveaway']) {
    const source = read(`src/interactions/Command/${name}.js`);
    assert.match(source, new RegExp(`localizationKey:\\s*['"]commandMetadata\\.${name}['"]`), name);
    assert.doesNotMatch(source, /localizations:\s*\{/);
  }
});

test('advanced moderation responses use localization keys', () => {
  const expectations = {
    'src/commands/moderation/banlist.js': ['moderationExtras.emptyBanlist', 'moderationExtras.banlistTitle'],
    'src/commands/moderation/unban.js': ['moderationExtras.unbanned', 'moderationExtras.userNotFound'],
    'src/commands/moderation/demote.js': ['moderationExtras.demoteTitle', 'moderationExtras.demoteNotice', 'moderationExtras.demoted', 'moderationExtras.demoteFailed']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(key.replaceAll('.', '\\.') ), `${file}: ${key}`);
    assert.doesNotMatch(source, /This server has no bans|successfully unbanned|I could not find the user|User successfully demoted|I can't demote the user/i, file);
  }
});

test('casino command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/casino.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.casino['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('economy command metadata is sourced from the locale catalogs', () => {
  const source = read('src/interactions/Command/economy.js');
  assert.match(source, /localizationKey:\s*['"]commandMetadata\.economy['"]/);
  assert.doesNotMatch(source, /localizations:\s*\{/);
});

test('recurring economy rewards localize their embed field labels', () => {
  for (const name of ['beg', 'daily', 'hourly', 'monthly', 'weekly', 'yearly', 'present', 'work']) {
    const source = read(`src/commands/economy/${name}.js`);
    assert.match(source, /client\.t\(interaction, 'economy\.(?:amount|earned|job)'\)/, name);
    assert.doesNotMatch(source, /["'](?:Amount|Earned|Crime)["']/i, name);
  }
});

test('family overview localizes its embed labels and empty states', () => {
  const source = read('src/commands/famille/voir.js');
  for (const key of ['family.viewTitle', 'family.partner', 'family.parents', 'family.siblings', 'family.children']) {
    assert.match(source, new RegExp(`client\\.t\\(interaction, ['"]${key.replace('.', '\\.')}`), key);
  }
  assert.doesNotMatch(source, /Cette personne n['’]est pas mari|Cette personne n['’]a pas de parents|FrÃ¨res\/Soeurs|Famille de/, 'family overview literals');
});

test('tools embeds localize their titles, descriptions, and review labels', () => {
  const expectations = {
    'src/commands/tools/qrcode.js': ['tools.qrcodeTitle'],
    'src/commands/tools/encode.js': ['tools.encodeTitle', 'tools.encodeDescription', 'tools.input', 'tools.output'],
    'src/commands/tools/mcskin.js': ['tools.mcskinTitle', 'tools.mcskinUsage'],
    'src/commands/tools/reviewAsync.js': ['review.title', 'review.stars', 'review.note', 'review.notGiven']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replace('.', '\\.')}`), `${file}: ${key}`);
  }
});

test('giveaway lifecycle events use localized response keys', () => {
  const expectations = {
    'src/events/giveaway/giveawayEnded.js': ['giveawayEvents.endedTitle', 'giveawayEvents.wonDescription'],
    'src/events/giveaway/giveawayRerolled.js': ['giveawayEvents.endedTitle', 'giveawayEvents.wonDescription'],
    'src/events/giveaway/giveawayReactionAdded.js': ['giveawayEvents.entryApproved'],
    'src/events/giveaway/endedGiveawayReactionAdded.js': ['giveawayEvents.endedEntry']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
    assert.doesNotMatch(source, /Congratulations|Your entry into|unfortunately ended|Giveaway ended/, file);
  }
});

test('search embeds use localized field labels', () => {
  const expectations = {
    'src/commands/search/corona.js': ['search.confirmed', 'search.recovered', 'search.deaths'],
    'src/commands/search/github.js': ['search.github.name', 'search.github.company', 'search.github.bio', 'search.github.repositories', 'search.github.createdAt'],
    'src/commands/search/npm.js': ['search.package.name', 'search.package.version', 'search.package.description', 'search.package.keywords', 'search.package.author', 'search.package.downloads', 'search.package.lastPublish'],
    'src/commands/search/itunes.js': ['search.song.name', 'search.song.artist', 'search.song.album', 'search.song.length', 'search.song.genre', 'search.song.price', 'search.song.releaseDate'],
    'src/commands/search/steam.js': ['search.application.name', 'search.application.description', 'search.application.developers', 'search.application.publishers', 'search.application.price']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`client\\.t\\(interaction, ['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
});

test('ticket creation and closure embeds use localized labels', () => {
  const createSource = read('src/commands/tickets/createAsync.js');
  const closeSource = read('src/commands/tickets/close.js');
  for (const key of ['tickets.notGiven', 'tickets.openLogTitle', 'tickets.openLogDescription', 'tickets.creator', 'tickets.subject', 'tickets.createdAt']) {
    assert.match(createSource, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  for (const key of ['tickets.transcriptMessage', 'tickets.closer', 'tickets.ticketId', 'tickets.server', 'tickets.claimedBy', 'tickets.date']) {
    assert.match(closeSource, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  assert.doesNotMatch(createSource, /Open ticket|A new ticket has been created|Creator|Subject|Created at/);
  assert.doesNotMatch(closeSource, /Here is the transcript|Closer|Ticket id|Claimed by/);
});

test('soundboard commands localize the sound names passed to responses', () => {
  const files = fs.readdirSync(path.join(root, 'src/commands/soundboard')).filter(file => file.endsWith('.js'));
  for (const file of files) {
    const source = read(`src/commands/soundboard/${file}`);
    assert.match(source, /variables:\s*\{\s*sound:\s*await client\.t\(interaction, ['"]soundboard\.sounds\./, file);
    assert.doesNotMatch(source, /variables:\s*\{\s*sound:\s*["'][^"']+["']\s*\}/, file);
  }
});

test('developer badge responses use localization keys', () => {
  const source = read('src/commands/developers/badge.js');
  for (const key of ['developers.badgeNotFound', 'developers.badgeAlreadyAssigned', 'developers.badgeAdded', 'developers.badgeMissing', 'developers.badgeRemovedLast', 'developers.badgeRemoved']) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  assert.doesNotMatch(source, /Je ne trouve pas ce badge|Ces utilisateurs ont|The user doesn't have that badge|Ajouté le|Removed the|Enlevé le/);
});

test('warning context menus use localized moderation labels', () => {
  const expectations = {
    'src/interactions/ContextMenu/warnings.js': ['moderation.warningsTitle', 'moderation.warningsDescription', 'moderation.warningCase', 'moderation.warningDetails', 'moderation.total', 'moderation.noWarnings'],
    'src/interactions/ContextMenu/warn.js': ['moderation.warnTitle', 'moderation.warnDescription', 'moderation.moderator', 'moderation.reason', 'moderation.user'],
    'src/interactions/ContextMenu/unwarn.js': ['moderation.unwarnTitle', 'moderation.unwarnDescription', 'moderation.moderator', 'moderation.user', 'moderation.selectWarning']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/interactions/ContextMenu/warnings.js'), /The warnings of|has no warnings|Warning \*\*/);
  assert.doesNotMatch(read('src/interactions/ContextMenu/warn.js'), /You've been warned|setTitle\('Warn'\)|setPlaceholder\('Reason'\)/);
  assert.doesNotMatch(read('src/interactions/ContextMenu/unwarn.js'), /Select a warning|You've been unwarned/);
});

test('userinfo context menu uses localized profile labels', () => {
  const source = read('src/interactions/ContextMenu/userinfo.js');
  for (const key of [
    'userinfo.title',
    'userinfo.description',
    'userinfo.username',
    'userinfo.discriminator',
    'userinfo.nickname',
    'userinfo.noNickname',
    'userinfo.id',
    'userinfo.flagsLabel',
    'userinfo.noFlags',
    'userinfo.badges',
    'userinfo.noBadges',
    'userinfo.discordJoinedAt',
    'userinfo.serverJoinedAt',
    'userinfo.roles',
    'userinfo.noRoles'
  ]) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  assert.doesNotMatch(source, /User information|Information about|No nickname|Discord joined at|Server joined at/);
});

test('slots responses use a localized title', () => {
  const source = read('src/commands/casino/slots.js');
  assert.match(source, /titleKey:\s*['"]commands\.casino\.slots\.title['"]/);
  assert.doesNotMatch(source, /Slots/);
});

test('bot information embeds use localization keys', () => {
  const expectations = {
    'src/commands/bot/donate.js': ['botResponses.donateTitle', 'botResponses.donateDescription', 'botResponses.donateButton'],
    'src/commands/bot/support.js': ['botResponses.supportTitle', 'botResponses.supportDescription', 'botResponses.supportButton'],
    'src/commands/bot/owner.js': ['botResponses.ownerTitle', 'botResponses.ownerName', 'botResponses.ownerTag', 'botResponses.organization', 'botResponses.website'],
    'src/commands/bot/uptime.js': ['botResponses.uptimeTitle', 'botResponses.uptimeDescription', 'botResponses.uptimeDuration', 'botResponses.uptimeSince']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/commands/bot/donate.js'), /Click the button below|Donate/);
  assert.doesNotMatch(read('src/commands/bot/support.js'), /Rendez votre serveur|Support/);
  assert.doesNotMatch(read('src/commands/bot/uptime.js'), /Durée de la baisse|Voir le temps/);
});

test('blackjack responses use localization keys', () => {
  const source = read('src/commands/casino/blackjack.js');
  for (const key of [
    'commands.casino.blackjack.usage',
    'commands.casino.blackjack.title',
    'commands.casino.blackjack.hit',
    'commands.casino.blackjack.stand',
    'commands.casino.blackjack.player',
    'commands.casino.blackjack.dealer',
    'commands.casino.blackjack.instruction',
    'commands.casino.blackjack.goodLuck',
    'commands.casino.blackjack.timeout'
  ]) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  assert.doesNotMatch(source, /Blackjack|Toi|Pour frapper|Bonne chance|Perdu!!/);
});

test('crash responses use localization keys', () => {
  const source = read('src/commands/casino/crash.js');
  for (const key of [
    'commands.casino.crash.usage',
    'commands.casino.crash.started',
    'commands.casino.crash.multiplier',
    'commands.casino.crash.profit',
    'commands.casino.crash.results',
    'commands.casino.crash.loss'
  ]) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  assert.doesNotMatch(source, /Crash a commencé|Multiplicateur|Résultats de|Perte|Profit/);
});

test('roulette dynamic titles use localization keys', () => {
  const source = read('src/commands/casino/roulette.js');
  assert.match(source, /commands\.casino\.roulette\.usage/);
  assert.match(source, /commands\.casino\.roulette\.multiplier/);
  assert.doesNotMatch(source, /Multiplicateur:/);
});

test('remaining bot panels use localization keys', () => {
  const expectations = {
    'src/commands/bot/links.js': ['botResponses.linksTitle', 'botResponses.linksDescription', 'botResponses.linksPlaceholder', 'botResponses.supportServer', 'botResponses.inviteBot', 'botResponses.communityServer', 'botResponses.topgg'],
    'src/commands/bot/vote.js': ['botResponses.voteTitle', 'botResponses.voteButton'],
    'src/commands/bot/ping.js': ['botResponses.pingTitle', 'botResponses.botLatency', 'botResponses.apiLatency', 'botResponses.databaseLatency']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/commands/bot/links.js'), /Rien de sélectionné|Serveur d'assistance|Get access to all Bot links/);
  assert.doesNotMatch(read('src/commands/bot/vote.js'), /Vote for me/);
});

test('bot info embed uses localized labels', () => {
  const source = read('src/commands/bot/info.js');
  for (const key of [
    'botInfo.title', 'botInfo.description', 'botInfo.information', 'botInfo.general',
    'botInfo.botName', 'botInfo.botId', 'botInfo.shards', 'botInfo.owner', 'botInfo.developer',
    'botInfo.commands', 'botInfo.guilds', 'botInfo.currentGuilds', 'botInfo.members',
    'botInfo.voiceChannels', 'botInfo.channels', 'botInfo.createdAt', 'botInfo.system',
    'botInfo.uptime', 'botInfo.apiLatency', 'botInfo.botVersion', 'botInfo.nodeVersion',
    'botInfo.discordVersion', 'botInfo.memory', 'botInfo.links'
  ]) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  assert.doesNotMatch(source, /BOT INFORMATION|Bot est un bot|Nom de bot|Vitesse de l'API/);
});

test('changelogs embed uses localization keys', () => {
  const source = read('src/commands/bot/changelogs.js');
  for (const key of ['botResponses.changelogsTitle', 'botResponses.changelogs', 'botResponses.changelogEntry']) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  assert.doesNotMatch(source, /Changelogs|Dépendances mises à jour/);
});

test('help and invite panels use localization keys', () => {
  const help = read('src/interactions/Command/help.js');
  const invite = read('src/interactions/Command/invite.js');
  for (const key of ['helpResponses.placeholder', 'helpResponses.commands', 'helpResponses.invite', 'helpResponses.support', 'helpResponses.changelogs', 'helpResponses.title', 'helpResponses.description', 'helpResponses.menuBroken', 'helpResponses.bug', 'helpResponses.links']) {
    assert.match(help, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  for (const key of ['helpResponses.invite', 'helpResponses.support', 'helpResponses.inviteTitle', 'helpResponses.inviteDescription']) {
    assert.match(invite, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  assert.doesNotMatch(help, /Nothing selected|Show the commands|Help panel|Menu doesn't work/);
  assert.doesNotMatch(invite, /Make your server even better|setLabel\("Invite"\)/);
});

test('music interaction responses use localization keys', () => {
  const source = read('src/handlers/audio/music.js');
  for (const key of ['music.paused', 'music.resumed', 'music.stopped', 'music.startedInVoice', 'music.requestedBy', 'music.endsAt', 'music.author']) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  }
  assert.doesNotMatch(source, /Music is currently paused|Music is currently resumed|Music is currently stopped|Requested By|Ends at/);
});

test('warning lifecycle events use localization keys', () => {
  const expectations = {
    'src/events/warn/warnAdd.js': ['moderationEvents.warnTitle', 'moderationEvents.warnDescription', 'moderationEvents.user', 'moderationEvents.tag', 'moderationEvents.id', 'moderationEvents.moderator', 'moderationEvents.reason'],
    'src/events/warn/warnRemove.js': ['moderationEvents.unwarnTitle', 'moderationEvents.unwarnDescription', 'moderationEvents.user', 'moderationEvents.tag', 'moderationEvents.id', 'moderationEvents.moderator']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/events/warn/warnAdd.js'), /Member warned|A user has been warned|> User/);
  assert.doesNotMatch(read('src/events/warn/warnRemove.js'), /Member unwarned|A user has been unwarned|> User/);
});

test('help panel support and invite handlers use localization keys', () => {
  for (const file of ['src/handlers/helppanel/support.js', 'src/handlers/helppanel/invite.js']) {
    const source = read(file);
    for (const key of ['helpResponses.placeholder', 'helpResponses.commands', 'helpResponses.invite', 'helpResponses.support', 'helpResponses.changelogs']) {
      assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
    }
  }
  assert.match(read('src/handlers/helppanel/support.js'), /helpResponses.supportTitle/);
  assert.match(read('src/handlers/helppanel/invite.js'), /helpResponses.inviteTitle/);
  assert.doesNotMatch(read('src/handlers/helppanel/support.js'), /Nothing selected|Support server|Support`/);
  assert.doesNotMatch(read('src/handlers/helppanel/invite.js'), /Nothing selected|Make your server even better/);
});

test('guess game handlers use localization keys', () => {
  const expectations = {
    'src/handlers/games/guessWord.js': ['gameEvents.guessWordTitle', 'gameEvents.guessWordWon', 'gameEvents.guessedBy', 'gameEvents.correctWord', 'gameEvents.guessWordInstruction', 'gameEvents.word'],
    'src/handlers/games/guessNumber.js': ['gameEvents.guessNumberTitle', 'gameEvents.guessNumberWon', 'gameEvents.guessedBy', 'gameEvents.correctNumber', 'gameEvents.guessNumberInstruction']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/handlers/games/guessWord.js'), /Guess the word|The word is guessed|Correct word/);
  assert.doesNotMatch(read('src/handlers/games/guessNumber.js'), /Guess the number|The number is guessed|Correct number/);
});

test('counting errors use localization keys', () => {
  const source = read('src/handlers/games/counting.js');
  assert.match(source, /key:\s*['"]gameEvents\.countTwice['"]/);
  assert.match(source, /key:\s*['"]gameEvents\.countWrong['"]/);
  assert.match(source, /variables:\s*\{\s*count:\s*countData\.Count\s*\}/);
  assert.doesNotMatch(source, /You cannot count twice|The correct number was/);
});

test('choice games localize structural labels', () => {
  const rather = read('src/commands/games/wouldyourather.js');
  const press = read('src/commands/games/willyoupressthebutton.js');
  for (const key of ['games.choiceA', 'games.choiceB']) assert.match(rather, new RegExp(`['"]${key.replaceAll('.', '\\.')}`), key);
  assert.match(press, /games.but/);
  assert.doesNotMatch(rather, /\*\*A\)\*\*|\nB\)/);
  assert.doesNotMatch(press, /\*\*But\*\*/);
});

test('emoji lifecycle events use localization keys', () => {
  const expectations = {
    'src/events/emoji/emojiCreate.js': ['auditEvents.emojiCreatedTitle', 'auditEvents.emojiCreatedDescription', 'auditEvents.emoji', 'auditEvents.name', 'auditEvents.id', 'auditEvents.url'],
    'src/events/emoji/emojiUpdate.js': ['auditEvents.emojiUpdatedTitle', 'auditEvents.emojiUpdatedDescription', 'auditEvents.emoji', 'auditEvents.before', 'auditEvents.after', 'auditEvents.id'],
    'src/events/emoji/emojiDelete.js': ['auditEvents.emojiDeletedTitle', 'auditEvents.emojiDeletedDescription', 'auditEvents.name', 'auditEvents.id']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/events/emoji/emojiCreate.js'), /Emoji created|An emoji has been created|> Emoji|> Name|> ID|> Url/);
  assert.doesNotMatch(read('src/events/emoji/emojiUpdate.js'), /Emoji updated|An emoji has been updated|> Emoji|> Before|> After|> ID/);
  assert.doesNotMatch(read('src/events/emoji/emojiDelete.js'), /Emoji deleted|An emoji has been deleted|> Name|> ID/);
});

test('sticker lifecycle events use localization keys', () => {
  const expectations = {
    'src/events/sticker/stickerCreate.js': ['auditEvents.stickerCreatedTitle', 'auditEvents.stickerCreatedDescription', 'auditEvents.name', 'auditEvents.id', 'auditEvents.url'],
    'src/events/sticker/stickerUpdate.js': ['auditEvents.stickerUpdatedTitle', 'auditEvents.stickerUpdatedDescription', 'auditEvents.before', 'auditEvents.after', 'auditEvents.id'],
    'src/events/sticker/stickerDelete.js': ['auditEvents.stickerDeletedTitle', 'auditEvents.stickerDeletedDescription', 'auditEvents.name', 'auditEvents.id']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), `${file}: ${key}`);
  }
  assert.doesNotMatch(read('src/events/sticker/stickerCreate.js'), /Sticker created|A sticker has been created|> Name|> ID|> Url/);
  assert.doesNotMatch(read('src/events/sticker/stickerUpdate.js'), /Sticker updated|A sticker has been updated|> Before|> After|> ID/);
  assert.doesNotMatch(read('src/events/sticker/stickerDelete.js'), /Sticker deleted|A sticker has been deleted|> Name|> ID/);
});

test('role lifecycle events use localization keys', () => {
  const expectations = {
    'src/events/role/roleCreate.js': ['auditEvents.roleCreatedTitle', 'auditEvents.roleCreatedDescription', 'auditEvents.role', 'auditEvents.name', 'auditEvents.id', 'auditEvents.color', 'auditEvents.position', 'auditEvents.timestamp'],
    'src/events/role/roleDelete.js': ['auditEvents.roleDeletedTitle', 'auditEvents.roleDeletedDescription', 'auditEvents.role', 'auditEvents.name', 'auditEvents.id', 'auditEvents.color', 'auditEvents.position', 'auditEvents.timestamp'],
    'src/events/role/roleColorUpdate.js': ['auditEvents.roleColorUpdatedTitle', 'auditEvents.roleUpdatedDescription', 'auditEvents.role', 'auditEvents.before', 'auditEvents.after', 'auditEvents.id', 'auditEvents.timestamp'],
    'src/events/role/roleNameUpdate.js': ['auditEvents.roleNameUpdatedTitle', 'auditEvents.roleUpdatedDescription', 'auditEvents.role', 'auditEvents.before', 'auditEvents.after', 'auditEvents.id', 'auditEvents.timestamp'],
    'src/events/role/rolePermissionsUpdate.js': ['auditEvents.rolePermissionsUpdatedTitle', 'auditEvents.roleUpdatedDescription', 'auditEvents.role', 'auditEvents.before', 'auditEvents.after', 'auditEvents.id', 'auditEvents.timestamp', 'auditEvents.none']
  };
  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(file);
    for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), `${file}: ${key}`);
  }
  for (const file of Object.keys(expectations)) assert.doesNotMatch(read(file), /Role (created|deleted|color updated|name updated|permissions updated)|A role has been updated|> (Role|Name|ID|Color|Position|Timestamp|Before|After)/, file);
});

test('profile, serverstats, and tools metadata is sourced from the locale catalogs', () => {
  for (const name of ['profile', 'serverstats', 'tools']) {
    const source = read(`src/interactions/Command/${name}.js`);
    assert.match(source, new RegExp(`localizationKey:\\s*['"]commandMetadata\\.${name}['"]`), name);
    assert.doesNotMatch(source, /localizations:\s*\{/);
  }
});

test('core category commands expose localized top-level metadata', () => {
  for (const name of ['tickets', 'music', 'radio', 'giveaway', 'moderation', 'setup', 'bot', 'economy', 'casino']) {
    const command = require(path.join(root, `src/interactions/Command/${name}.js`));
    const localizations = initializeI18n.resolveCommandLocalizations(command);
    assert.ok(localizations?.name?.fr, name);
    assert.ok(localizations?.name?.en, name);
    assert.ok(localizations?.description?.fr, name);
    assert.ok(localizations?.description?.en, name);
  }
});

test('bot installs the feature manager before loading handlers', () => {
  const source = read('src/bot.js');
  assert.match(source, /installFeatureManager/);
  assert.match(source, /globalFeatures/);
  assert.match(source, /Features/);
});

test('interaction routing gates disabled commands before execution', () => {
  const source = read('src/events/client/interactionCreate.js');
  assert.match(source, /await client\.requireFeature\(interaction, cmd\.data\.name\)/);
  assert.match(source, /requireFeature\(interaction, cmd\.data\.name\)[\s\S]*if \(cmd\) return cmd\.run/);
});

test('automod protection responses use the active server locale', () => {
  for (const file of ['antiinvite.js', 'antilinks.js', 'antispam.js']) {
    const source = read(`src/commands/automod/${file}`);
    assert.match(source, /client\.t\(interaction, ['"]automod\.(antiInvite|antiLinks|antiSpam)['"]\)/, file);
    assert.match(source, /automod\.protection(Enabled|Disabled)/, file);
    assert.doesNotMatch(source, /est maintenant \*\*\$\{boolean \?/i, file);
  }
});

test('voice command responses use the active server locale', () => {
  for (const file of ['limit.js', 'lock.js', 'rename.js', 'unlock.js']) {
    const source = read(`src/commands/voice/${file}`);
    assert.match(source, /voice\.(notInVoice|cannotEdit|limitUpdated|locked|renamed|unlocked)/, file);
    assert.doesNotMatch(source, /You're not in a voice channel|You cannot edit this channel|succesfully/i, file);
  }
});

test('trigger list and documentation use the active server locale', () => {
  for (const file of ['src/commands/triggers/list.js', 'src/commands/triggers/documentation.js']) {
    const source = read(file);
    assert.match(source, /client\.t\(interaction, ['"]triggers\./, file);
    assert.doesNotMatch(source, /title:\s*['"]📃.*Liste des triggers['"]/i, file);
  }
});

test('economy operator responses use localization keys', () => {
  const expectations = {
    'addmoney.js': ['economy.addMoney.invalid', 'economy.addMoney.bot', 'economy.addMoney.success', 'economy.addMoney.noMoney'],
    'additem.js': ['economy.addItem.invalid', 'economy.addItem.everyone', 'economy.addItem.success'],
    'deposit.js': ['commands.economy.deposit.noMoney']
  };

  for (const [file, keys] of Object.entries(expectations)) {
    const source = read(`src/commands/economy/${file}`);
    for (const key of keys) assert.match(source, new RegExp(key.replace('.', '\\.'), 'g'), `${file}: ${key}`);
    assert.doesNotMatch(source, /Enter a valid number|You cannot add money|You don't have any money to deposit/i, file);
  }
});

test('economy balance and shop embeds use localization keys', () => {
  const balance = read('src/commands/economy/balance.js');
  const buy = read('src/commands/economy/buy.js');
  const deleteItem = read('src/commands/economy/deleteitem.js');

  for (const key of ['commands.economy.balance.title', 'commands.economy.balance.wallet', 'commands.economy.balance.bank', 'commands.economy.balance.total']) {
    assert.match(balance, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  for (const key of ['economy.buy.storeTitle', 'economy.buy.storeDescription', 'economy.buy.item']) {
    assert.match(buy, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  assert.match(deleteItem, /economy\.deleteItem\.role/);
  assert.doesNotMatch(balance, /Balance/);
  assert.doesNotMatch(buy, /Choose a item from the menu to buy|`[^`]*Store`/);
  assert.doesNotMatch(deleteItem, />Role/);
});

test('autosetup game and ticket panels use localization keys', () => {
  const games = read('src/commands/autosetup/games.js');
  const ticketPanel = read('src/commands/autosetup/ticketpanelAsync.js');
  for (const key of ['autosetup.games.countingTitle', 'autosetup.games.countingDescription', 'autosetup.games.guessNumberTitle', 'autosetup.games.guessNumberDescription', 'autosetup.games.guessWordTitle', 'autosetup.games.guessWordDescription', 'autosetup.games.word']) {
    assert.match(games, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  for (const key of ['setup.ticketpanel.title', 'setup.ticketpanel.description', 'setup.ticketpanel.button']) {
    assert.match(ticketPanel, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  assert.doesNotMatch(games, /C'est le début du comptage|Devinez le nombre entre|Mettez les lettres/);
  assert.doesNotMatch(ticketPanel, /Cliquez sur .* pour ouvrir un ticket|title: ["`]Tickets/);
});

test('guild channel and emoji information embeds use localization keys', () => {
  const channel = read('src/commands/guild/channelinfo.js');
  const emojis = read('src/commands/guild/emojis.js');
  for (const key of ['guild.channelInfo.title', 'guild.channelInfo.description', 'guild.channelInfo.type', 'guild.channelInfo.id', 'guild.channelInfo.createdAt', 'guild.channelInfo.topic', 'guild.channelInfo.nsfw', 'guild.channelInfo.parent', 'guild.channelInfo.notAvailable']) {
    assert.match(channel, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  for (const key of ['guild.emojis.title', 'guild.emojis.description', 'guild.emojis.animated', 'guild.emojis.standard']) {
    assert.match(emojis, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  assert.doesNotMatch(channel, /Channel information about|Made on|Subject|Parent/);
  assert.doesNotMatch(emojis, /Emoji's!|Animated \[|Standard \[/);
});

test('developer information panel uses localization keys', () => {
  const source = read('src/commands/developers/args.js');
  for (const key of ['developers.args.sent', 'developers.args.information.title', 'developers.args.information.welcomeTitle', 'developers.args.information.welcome', 'developers.args.information.whatTitle', 'developers.args.information.what', 'developers.args.information.helpTitle', 'developers.args.information.help', 'developers.args.information.helpUsTitle', 'developers.args.information.helpUs']) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }
  assert.doesNotMatch(source, /Le message a .* envoy|Bienvenue dans notre lieu de rencontre|Que puis-je faire ici\?|Comment obtenir de l'aide/);
});

test('developer rules panel uses localization keys', () => {
  const source = read('src/commands/developers/args.js');
  const keys = ['developers.args.rules.title', 'developers.args.rules.description'];
  for (let index = 1; index <= 10; index += 1) {
    keys.push(`developers.args.rules.rule${index}Title`, `developers.args.rules.rule${index}Description`);
  }
  for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  assert.doesNotMatch(source, /être respectueux|Aucune langue inappropriée|Pas de spam|No not join voice chat/);
});

test('developer applications panel uses localization keys', () => {
  const source = read('src/commands/developers/args.js');
  const keys = ['developers.args.applications.title', 'developers.args.applications.description'];
  for (let index = 1; index <= 6; index += 1) {
    keys.push(`developers.args.applications.field${index}Title`, `developers.args.applications.field${index}`);
  }
  for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  assert.doesNotMatch(source, /A very nice team|Access to the beta program|A nice rank and badge|Learn and grow|What does everything mean\?|Apply\?/);
});

test('developer booster perks panel uses localization keys', () => {
  const source = read('src/commands/developers/args.js');
  const keys = ['developers.args.boosterperks.title', 'developers.args.boosterperks.description'];
  for (let index = 1; index <= 11; index += 1) {
    keys.push(`developers.args.boosterperks.field${index}Title`, `developers.args.boosterperks.field${index}`);
  }
  for (const key of keys) assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  assert.doesNotMatch(source, /Use external stickers|Send TTS messages|Access to the hidden lounge|Change your nickname|Private giveaways|Custom role of your choice/);
});

test('developer links, rewards, and bots panels use localization keys', () => {
  const source = read('src/commands/developers/args.js');
  const keys = [
    'developers.args.links.title',
    'developers.args.links.description',
    'developers.args.links.servers',
    'developers.args.rewards.title',
    'developers.args.rewards.description',
    'developers.args.rewards.levelsTitle',
    'developers.args.rewards.specialTitle',
    'developers.args.rewards.economyTitle',
    'developers.args.ourbots.title',
    'developers.args.ourbots.description',
    'developers.args.ourbots.botTitle',
    'developers.args.ourbots.bot',
    'developers.args.ourbots.bot2Title',
    'developers.args.ourbots.bot2',
    'developers.args.ourbots.inviteTitle',
    'developers.args.ourbots.invite',
    'developers.args.ourbots.helpTitle',
    'developers.args.ourbots.help'
  ];

  for (const key of keys) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }

  assert.doesNotMatch(source, /See all the links from Bot Network|Role Rewards|Outside of a community we also maintain|What is Bot\?|How do I invite the bots\?/);
});

test('remaining hardcoded interaction responses use localization keys', () => {
  const sources = {
    developers: read('src/interactions/Command/developers.js'),
    embed: read('src/interactions/Command/embed.js'),
    aprilfools: read('src/commands/autosetup/aprilfools.js'),
    starboard: read('src/events/message/messageReactionAdd.js'),
    directMessages: read('src/events/message/messageCreate.js')
  };

  const expected = {
    developers: ['errors.developerOnly'],
    embed: ['embed.channelNotFound', 'embed.sent'],
    aprilfools: [
      'autosetup.aprilfools.success',
      'autosetup.aprilfools.error',
      'autosetup.aprilfools.textChannel',
      'autosetup.aprilfools.voiceChannel'
    ],
    starboard: [
      'starboard.cannotStarOwn',
      'starboard.cannotStarBot',
      'starboard.noChannel',
      'starboard.emptyMessage',
      'starboard.title',
      'starboard.stars',
      'starboard.message',
      'starboard.author',
      'starboard.jump'
    ],
    directMessages: ['messageEvents.cannotDM']
  };

  for (const [name, keys] of Object.entries(expected)) {
    for (const key of keys) {
      assert.match(sources[name], new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), `${name}: ${key}`);
    }
  }

  assert.doesNotMatch(sources.developers, /Only Bot developers are allowed/);
  assert.doesNotMatch(sources.embed, /Channel not found|Embed successfully sent/);
  assert.doesNotMatch(sources.aprilfools, /Configuration du poisson d'avril terminée|Une erreur s'est produite/);
  assert.doesNotMatch(sources.starboard, /You cannot star your own messages|No star channel found/);
  assert.doesNotMatch(sources.directMessages, /I can't DM you, maybe you have DM turned off/);
});

test('event reminder setup uses the active locale for its user-facing copy', () => {
  const source = read('src/events/client/interactionCreate.js');
  const keys = [
    'events.reminderCreatorOnly',
    'events.reminderUpdateCreatorOnly',
    'events.reminders.enable',
    'events.reminders.disable',
    'events.reminders.deleteEvent',
    'events.reminders.title',
    'events.reminders.welcome',
    'events.reminders.inviteTitle',
    'events.reminders.invite',
    'events.reminders.automaticTitle',
    'events.reminders.available',
    'events.reminders.unavailable',
    'events.reminders.availableFooter',
    'events.reminders.unavailableFooter',
    'events.reminders.enabledDescription',
    'events.reminders.disabledDescription',
    'events.reminders.reenabled',
    'events.reminders.disabled',
    'events.reminders.updateError',
    'events.reminders.deletedMessage',
    'events.reminders.configured',
    'events.reminders.setupError',
    'events.reminders.infoNotFound',
    'events.reminders.eventNotFound',
    'events.reminders.deleteCreatorOnly',
    'events.reminders.deleted',
    'events.reminders.deleteError'
  ];

  for (const key of keys) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }

  assert.doesNotMatch(source, /Activer les rappels|Désactiver les rappels|Configuration de l'événement|Les rappels ont été configurés|modifier les paramètres de rappel|Impossible de trouver les informations de l'événement|L'événement a été supprimé/);
});

test('activity launch responses use localization keys', () => {
  const source = read('src/handlers/functions/functions.js');
  for (const key of [
    'activities.startFailed',
    'activities.startButton',
    'activities.title',
    'activities.description'
  ]) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }

  assert.doesNotMatch(source, /Could not start \*\*\$\{name\}\*\*!|Start activity|Click on the \*\*button\*\*/);
});

test('interactive embed prompts use localization keys', () => {
  const source = read('src/interactions/Command/embed.js');
  const keys = [
    'embed.prompts.title',
    'embed.prompts.description',
    'embed.prompts.author',
    'embed.prompts.footer',
    'embed.prompts.thumbnail',
    'embed.prompts.image',
    'embed.prompts.url',
    'embed.prompts.color',
    'embed.invalidThumbnail',
    'embed.invalidImage',
    'embed.invalidUrl'
  ];

  for (const key of keys) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }

  assert.doesNotMatch(source, /Please enter a title|Please enter a description|Incorrect thumbnail link|Incorrect image link|Incorrect url/);
});

test('spoiler context menu responses use localization keys', () => {
  const source = read('src/interactions/ContextMenu/spoiler.js');
  const keys = [
    'spoiler.noPermission',
    'spoiler.prompt',
    'spoiler.cancelled',
    'spoiler.uploaded',
    'spoiler.imagePost',
    'spoiler.textPost',
    'spoiler.author',
    'spoiler.missingContext'
  ];

  for (const key of keys) {
    assert.match(source, new RegExp(`['"]${key.replaceAll('.', '\\\.')}`), key);
  }

  assert.doesNotMatch(source, /Tu ne possèdes pas la permission requise|Ajoute un contexte pour mieux décrire|Tu as annulé la mise en spoiler|Automatic upload of an image turned into a spoiler/);
});

test('level-up fallback messages use the active locale', () => {
  const source = read('src/events/message/messageCreate.js');
  assert.match(source, /levels\.up/);
  assert.doesNotMatch(source, /you are now level|\*\*GG\*\*/);
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
