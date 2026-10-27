const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createI18n,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    applyCommandLocalizations,
} = require('../src/handlers/i18n');

test('translates keys in French and English with interpolation', () => {
    const i18n = createI18n();

    assert.equal(i18n.t('fr', 'common.success'), 'Opération effectuée avec succès.');
    assert.equal(
        i18n.t('en', 'commands.config.language.success', { language: 'English' }),
        'The server language is now English.'
    );
});

test('resolves command-domain keys without requiring the commands prefix', () => {
    const i18n = createI18n();

    assert.equal(i18n.t('en', 'games.snakeTitle'), 'Snake');
    assert.equal(
        i18n.t('fr', 'economy.pay.success', { user: '@Pierre' }),
        "Vous avez envoyé de l'argent à @Pierre."
    );
});

test('falls back to French when a key is missing from the requested locale', () => {
    const i18n = createI18n();

    assert.equal(i18n.t('en', 'common.onlyFrench'), 'Texte disponible uniquement en français.');
});

test('returns a visible fallback and warns for an unknown key', () => {
    const warnings = [];
    const i18n = createI18n({ warn: message => warnings.push(message) });

    assert.equal(i18n.t('fr', 'missing.key'), 'missing.key');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /missing\.key/);
});

test('exposes the supported locale contract', () => {
    assert.deepEqual(SUPPORTED_LOCALES, ['fr', 'en']);
    assert.equal(DEFAULT_LOCALE, 'fr');
});

test('client translations use the guild locale and fall back to French', async () => {
    const initializeI18n = require('../src/handlers/i18n');
    const Functions = require('../src/database/models/functions');
    const originalFindOne = Functions.findOne;

    Functions.findOne = () => ({
        select: () => ({
            lean: async () => ({ Language: 'en' })
        })
    });

    try {
        const client = {};
        initializeI18n(client);

        assert.equal(
            await client.t({ guild: { id: 'guild-en' } }, 'common.success'),
            'Operation completed successfully.'
        );
    }
    finally {
        Functions.findOne = originalFindOne;
    }
});

test('exposes the config language subcommand with both supported choices', () => {
    const command = require('../src/interactions/Command/config');
    const language = command.data.toJSON().options.find(option => option.name === 'language');

    assert.ok(language);
    assert.deepEqual(language.options[0].choices.map(({ name, value }) => ({ name, value })), [
        { name: 'Français', value: 'fr' },
        { name: 'English', value: 'en' },
    ]);
});

test('serializes native command localizations for Discord', () => {
    const command = require('../src/interactions/Command/config');
    applyCommandLocalizations(command);
    const data = command.data.toJSON();

    assert.deepEqual(data.name_localizations, { fr: 'config', 'en-US': 'config' });
    assert.deepEqual(data.description_localizations, {
        fr: 'Ajustez le bot à votre goût',
        'en-US': 'Customize the bot to your liking'
    });
});

test('response helpers resolve a translation key before sending an embed', async () => {
    const installEmbeds = require('../src/handlers/components/embed');
    const sent = [];
    const embed = {
        setTitle() { return this; },
        setDescription() { return this; },
        addFields() { return this; },
        setColor() { return this; },
    };
    const client = {
        config: { colors: { error: '#ED4245', normal: '#5865F2', succes: '#57F287' }, discord: { footer: 'footer' } },
        emotes: { normal: { error: 'x', check: 'ok' } },
        user: { username: 'test', avatarURL: () => null },
        templateEmbed: () => embed,
        t: async (_interaction, key) => key === 'errors.noPermission' ? 'Translated permission error' : key,
    };
    const interaction = {
        guild: { id: 'guild' },
        editReply: async payload => {
            sent.push(payload);
            return payload;
        },
    };

    installEmbeds(client);
    await client.errNormal({ key: 'errors.noPermission', type: 'editreply' }, interaction);

    assert.equal(sent[0].embeds[0].data.fields[0].value, '```Translated permission error```');
});

test('central response helpers translate common permission and success messages', async () => {
    const installEmbeds = require('../src/handlers/components/embed');
    const sent = [];
    const embed = {
        setTitle(value) { this.title = value; return this; },
        setDescription(value) { this.description = value; return this; },
        addFields(fields) { this.fields = fields; return this; },
        setColor() { return this; },
    };
    const translations = {
        'common.errorTitle': 'Translated error',
        'common.successTitle': 'Translated success',
        'common.errorComment': 'Translated comment',
        'common.requiredPermission': 'Translated permission',
        'common.tryAgainAt': 'Translated retry',
        'errors.noPermission': 'Translated permission error',
        'errors.botNoPermission': 'Translated bot permission error',
        'errors.alreadyPerformed': 'Translated wait error',
        'common.success': 'Translated success text',
    };
    const client = {
        config: { colors: { error: '#ED4245', normal: '#5865F2', succes: '#57F287' }, discord: { footer: 'footer' } },
        emotes: { normal: { error: 'x', check: 'ok' } },
        user: { username: 'test', avatarURL: () => null },
        templateEmbed: () => ({ ...embed }),
        t: async (_interaction, key) => translations[key] || key,
    };
    const interaction = {
        guild: { id: 'guild' },
        editReply: async payload => { sent.push(payload); return payload; },
    };

    installEmbeds(client);
    await client.errMissingPerms({ perms: 'ManageGuild', type: 'editreply' }, interaction);
    await client.succNormal({ key: 'common.success', type: 'editreply' }, interaction);

    assert.equal(sent[0].embeds[0].data.description, 'Translated permission error');
    assert.equal(sent[0].embeds[0].data.fields[0].name, 'Translated permission');
    assert.equal(sent[1].embeds[0].data.description, 'Translated success text');
    assert.match(sent[1].embeds[0].data.title, /Translated success/);
});
