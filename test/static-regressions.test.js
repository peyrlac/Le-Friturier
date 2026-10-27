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
