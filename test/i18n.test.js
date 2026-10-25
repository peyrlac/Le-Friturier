const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createI18n,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
} = require('../src/handlers/i18n');

test('translates keys in French and English with interpolation', () => {
    const i18n = createI18n();

    assert.equal(i18n.t('fr', 'common.success'), 'Opération effectuée avec succès.');
    assert.equal(
        i18n.t('en', 'commands.config.language.success', { language: 'English' }),
        'The server language is now English.'
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

test('exposes the config language subcommand with both supported choices', () => {
    const command = require('../src/interactions/Command/config');
    const language = command.data.toJSON().options.find(option => option.name === 'language');

    assert.ok(language);
    assert.deepEqual(language.options[0].choices.map(({ name, value }) => ({ name, value })), [
        { name: 'Français', value: 'fr' },
        { name: 'English', value: 'en' },
    ]);
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
