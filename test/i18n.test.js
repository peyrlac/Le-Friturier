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

test('French and English catalogs stay structurally aligned', () => {
    const fr = require('../src/locales/fr.json');
    const en = require('../src/locales/en.json');
    const flatten = (value, prefix = '', result = {}) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            for (const [key, nested] of Object.entries(value)) {
                flatten(nested, prefix ? `${prefix}.${key}` : key, result);
            }
        }
        else {
            result[prefix] = true;
        }
        return result;
    };
    const frKeys = Object.keys(flatten(fr));
    const enKeys = Object.keys(flatten(en));

    assert.deepEqual(frKeys.filter(key => !enKeys.includes(key)), ['common.onlyFrench']);
    assert.deepEqual(enKeys.filter(key => !frKeys.includes(key)), []);
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

test('config language persists the selected locale before replying', async () => {
    const command = require('../src/commands/config/language');
    const Functions = require('../src/database/models/functions');
    const originalFindOneAndUpdate = Functions.findOneAndUpdate;
    let update;
    let response;

    Functions.findOneAndUpdate = async (...args) => {
        update = args;
        return { Guild: 'guild', Language: 'en' };
    };

    try {
        const client = {
            checkUserPerms: async () => true,
            succNormal: async payload => {
                response = payload;
                return payload;
            },
            errNormal: async payload => payload,
        };
        const interaction = {
            guild: { id: 'guild' },
            options: { getString: () => 'en' },
        };

        await command(client, interaction);

        assert.equal(update[0].Guild, 'guild');
        assert.deepEqual(update[1], { $set: { Language: 'en' } });
        assert.equal(response.key, 'commands.config.language.success');
        assert.equal(response.variables.language, 'English');
    }
    finally {
        Functions.findOneAndUpdate = originalFindOneAndUpdate;
    }
});

test('config language rejects locales outside the supported set', async () => {
    const command = require('../src/commands/config/language');
    const Functions = require('../src/database/models/functions');
    const originalFindOneAndUpdate = Functions.findOneAndUpdate;
    let persisted = false;
    let error;

    Functions.findOneAndUpdate = async () => {
        persisted = true;
    };

    try {
        const client = {
            checkUserPerms: async () => true,
            errNormal: async payload => {
                error = payload;
                return payload;
            },
        };
        const interaction = {
            guild: { id: 'guild' },
            options: { getString: () => 'de' },
        };

        await command(client, interaction);

        assert.equal(persisted, false);
        assert.equal(error.key, 'errors.unsupportedLanguage');
    }
    finally {
        Functions.findOneAndUpdate = originalFindOneAndUpdate;
    }
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

test('serializes subcommand and option localizations for Discord', () => {
    const { SlashCommandBuilder } = require('discord.js');
    const command = {
        data: new SlashCommandBuilder()
            .setName('sample')
            .setDescription('Sample')
            .addSubcommand(subcommand => subcommand
                .setName('language')
                .setDescription('Language')
                .addStringOption(option => option
                    .setName('locale')
                    .setDescription('Locale')
                    .setRequired(true)
                )
            ),
        localizations: {
            name: { fr: 'exemple', en: 'sample' },
            description: { fr: 'Exemple', en: 'Sample' },
            subcommands: {
                language: {
                    name: { fr: 'langue', en: 'language' },
                    description: { fr: 'Choisir la langue', en: 'Choose the language' },
                    options: {
                        locale: {
                            description: { fr: 'Langue du serveur', en: 'Server language' }
                        }
                    }
                }
            }
        }
    };

    applyCommandLocalizations(command);
    const data = command.data.toJSON();
    const subcommand = data.options[0];
    const option = subcommand.options[0];

    assert.deepEqual(subcommand.name_localizations, { fr: 'langue', 'en-US': 'language' });
    assert.deepEqual(subcommand.description_localizations, {
        fr: 'Choisir la langue',
        'en-US': 'Choose the language'
    });
    assert.deepEqual(option.description_localizations, {
        fr: 'Langue du serveur',
        'en-US': 'Server language'
    });
});

test('serverstats publishes localized subcommand descriptions', () => {
    const command = require('../src/interactions/Command/serverstats');
    applyCommandLocalizations(command);
    const data = command.data.toJSON();
    const boosts = data.options.find(option => option.name === 'boosts');
    const time = data.options.find(option => option.name === 'time');
    const timezone = time.options.find(option => option.name === 'timezone');

    assert.deepEqual(boosts.description_localizations, {
        fr: 'Suivre le nombre de boosts',
        'en-US': 'Keep track of the boost count'
    });
    assert.deepEqual(timezone.description_localizations, {
        fr: 'Fuseau horaire à utiliser (ex. Europe/Amsterdam)',
        'en-US': 'The timezone you want to set (e.g. Europe/Amsterdam)'
    });
});

test('profile publishes localized subcommands, groups, and options', () => {
    const command = require('../src/interactions/Command/profile');
    applyCommandLocalizations(command);
    const data = command.data.toJSON();
    const create = data.options.find(option => option.name === 'create');
    const actor = data.options.find(option => option.name === 'actor');
    const addActor = actor.options.find(option => option.name === 'addactor');
    const actorOption = addActor.options.find(option => option.name === 'actor');

    assert.deepEqual(create.description_localizations, {
        fr: 'Créer votre profil',
        'en-US': 'Create your profile'
    });
    assert.deepEqual(actor.description_localizations, {
        fr: 'Gérer votre acteur préféré',
        'en-US': 'Set your favorite actor'
    });
    assert.deepEqual(actorOption.description_localizations, {
        fr: 'Acteur à ajouter',
        'en-US': 'The actor you want to add'
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

test('central error helper localizes its title and error label', async () => {
    const installEmbeds = require('../src/handlers/components/embed');
    let sent;
    const embed = {
        setTitle(value) { this.title = value; return this; },
        setDescription(value) { this.description = value; return this; },
        addFields(fields) { this.fields = fields; return this; },
        setColor() { return this; },
    };
    const translations = {
        'errors.generic': 'Localized description',
        'common.errorTitle': 'Localized error',
        'common.errorComment': 'Localized comment',
    };
    const client = {
        config: { colors: { error: '#ED4245', normal: '#5865F2', succes: '#57F287' }, discord: { footer: 'footer' } },
        emotes: { normal: { error: 'ERR', check: 'OK' } },
        user: { username: 'test', avatarURL: () => null },
        templateEmbed: () => ({ ...embed }),
        t: async (_interaction, key) => translations[key] || key,
    };
    const interaction = {
        guild: { id: 'guild' },
        reply: async payload => {
            sent = payload;
            return payload;
        },
    };

    installEmbeds(client);
    await client.errNormal({ error: 'detail', type: 'reply' }, interaction);

    assert.equal(sent.embeds[0].data.title, 'ERR・Localized error');
    assert.equal(sent.embeds[0].data.fields[0].name, 'Localized comment');
});

test('response helper keeps withResponse and ephemeral flags for ephemeral replies', async () => {
    const Discord = require('discord.js');
    const installEmbeds = require('../src/handlers/components/embed');
    let sent;
    const client = {
        config: { colors: { error: '#ED4245', normal: '#5865F2', succes: '#57F287' }, discord: { footer: 'footer' } },
        emotes: { normal: { error: 'ERR', check: 'OK' } },
        user: { username: 'test', avatarURL: () => null },
    };
    const interaction = {
        reply: async payload => {
            sent = payload;
            return payload;
        },
    };

    installEmbeds(client);
    await client.sendEmbed({ embeds: [], type: 'ephemeral' }, interaction);

    assert.equal(sent.withResponse, true);
    assert.equal(sent.flags, Discord.MessageFlags.Ephemeral);
});

test('permission error helpers localize their shared error title', async () => {
    const installEmbeds = require('../src/handlers/components/embed');
    let sent;
    const client = {
        config: { colors: { error: '#ED4245', normal: '#5865F2', succes: '#57F287' }, discord: { footer: 'footer' } },
        emotes: { normal: { error: 'ERR', check: 'OK' } },
        user: { username: 'test', avatarURL: () => null },
        templateEmbed: () => ({
            setTitle(value) { this.title = value; return this; },
            setDescription(value) { this.description = value; return this; },
            addFields(fields) { this.fields = fields; return this; },
            setColor() { return this; },
        }),
        t: async (_interaction, key) => ({
            'common.errorTitle': 'Localized error',
            'common.requiredPermission': 'Localized permission',
            'errors.noPermission': 'Localized description',
        }[key] || key),
    };
    const interaction = {
        guild: { id: 'guild' },
        reply: async payload => {
            sent = payload;
            return payload;
        },
    };

    installEmbeds(client);
    await client.errMissingPerms({ perms: 'ManageGuild', type: 'reply' }, interaction);

    assert.equal(sent.embeds[0].data.title, 'ERR・Localized error');
});
