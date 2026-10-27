const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createI18n,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    applyCommandLocalizations,
    resolveCommandLocalizations,
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
        { name: 'Anglais', value: 'en' },
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

test('config exposes grouped feature controls and bot exposes global feature controls', () => {
    const config = require('../src/interactions/Command/config');
    const bot = require('../src/interactions/Command/bot');
    const featureGroup = config.data.toJSON().options.find(option => option.name === 'feature');
    const botFeature = bot.data.toJSON().options.find(option => option.name === 'feature');

    assert.equal(featureGroup.type, 2);
    assert.deepEqual(featureGroup.options.map(option => option.name), ['list', 'set', 'reset']);
    assert.equal(botFeature.type, 1);
    assert.equal(botFeature.options.find(option => option.name === 'action').required, true);
});

test('automod exposes localized command metadata and option descriptions', () => {
  const command = require('../src/interactions/Command/automod');
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');

  assert.deepEqual(resolveCommandLocalizations(command), {
    name: { fr: 'automod', en: 'automod' },
    description: { fr: 'Gérer la modération automatique', en: 'Manage automatic moderation' },
    subcommands: {
      help: { description: { fr: 'Voir l’aide de la modération automatique', en: 'View automatic moderation help' } },
      antiinvite: {
        description: { fr: 'Activer ou désactiver l’anti-invitation', en: 'Enable or disable anti-invite protection' },
        options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
      },
      antilinks: {
        description: { fr: 'Activer ou désactiver l’anti-liens', en: 'Enable or disable anti-links protection' },
        options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
      },
      antispam: {
        description: { fr: 'Activer ou désactiver l’anti-spam', en: 'Enable or disable anti-spam protection' },
        options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
      },
      linkschannel: {
        description: { fr: 'Gérer les salons autorisés pour les liens', en: 'Manage channels allowed to contain links' },
        options: {
          type: { description: { fr: 'Action à effectuer', en: 'Action to perform' } },
          channel: { description: { fr: 'Salon concerné', en: 'Target channel' } }
        }
      }
    },
    subcommandGroups: {
      blacklist: {
        description: { fr: 'Gérer la liste noire', en: 'Manage the blacklist' },
        subcommands: {
          display: { description: { fr: 'Afficher la liste noire', en: 'Display the blacklist' } },
          add: {
            description: { fr: 'Ajouter un mot à la liste noire', en: 'Add a word to the blacklist' },
            options: { word: { description: { fr: 'Mot à ajouter', en: 'Word to add' } } }
          },
          remove: {
            description: { fr: 'Supprimer un mot de la liste noire', en: 'Remove a word from the blacklist' },
            options: { word: { description: { fr: 'Mot à supprimer', en: 'Word to remove' } } }
          }
        }
      }
    }
  });
});

test('afk and activities expose localized metadata', () => {
  const afk = require('../src/interactions/Command/afk');
  const activities = require('../src/interactions/Command/activities');
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');

  assert.deepEqual(resolveCommandLocalizations(afk), {
    name: { fr: 'afk', en: 'afk' },
    description: { fr: 'Gérer son statut AFK', en: 'Manage your AFK status' },
    subcommands: {
      help: { description: { fr: 'Voir l’aide de la catégorie AFK', en: 'View AFK category help' } },
      set: {
        description: { fr: 'Se mettre en AFK', en: 'Set your AFK status' },
        options: { reason: { description: { fr: 'Raison de votre AFK', en: 'Reason for your AFK status' } } }
      },
      list: { description: { fr: 'Afficher les utilisateurs AFK', en: 'List AFK users' } }
    }
  });

  assert.deepEqual(resolveCommandLocalizations(activities), {
    name: { fr: 'activités', en: 'activities' },
    description: { fr: 'Démarrer une activité', en: 'Start an activity' },
    options: { activity: { description: { fr: 'Activité à démarrer', en: 'Activity to start' } } }
  });
});

test('voice exposes localized metadata and supports localized channel responses', () => {
  const command = require('../src/interactions/Command/voice');
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');

  assert.equal(command.localizationKey, 'commandMetadata.voice');
  assert.deepEqual(resolveCommandLocalizations(command), {
    name: { fr: 'vocal', en: 'voice' },
    description: { fr: 'Gérer les salons vocaux', en: 'Manage voice channels' }
  });
});

test('family, search, and thanks expose metadata keys backed by locale JSON', () => {
  for (const name of ['famille', 'search', 'thanks', 'announcement', 'autosetup', 'invite', 'notepad', 'report', 'suggestions', 'commands', 'embed', 'event', 'help', 'stickymessages', 'invites', 'levels', 'messages', 'reactionroles', 'developers', 'games', 'guild', 'images', 'message', 'move', 'soundboard']) {
    const command = require(`../src/interactions/Command/${name}`);
    assert.equal(typeof command.localizationKey, 'string');
    assert.ok(resolveCommandLocalizations(command));
  }
});

test('remaining native commands localize every subcommand, group, and option description', () => {
  const commandNames = ['developers', 'games', 'guild', 'images', 'message', 'move', 'soundboard'];

  const assertLocalized = (node, path) => {
    assert.deepEqual(Object.keys(node.description_localizations || {}).sort(), ['en-US', 'fr'], `${path} description`);
    for (const child of node.options || []) {
      assertLocalized(child, `${path}.${child.name}`);
    }
  };

  for (const name of commandNames) {
    const command = require(`../src/interactions/Command/${name}`);
    applyCommandLocalizations(command);
    assertLocalized(command.data.toJSON(), name);
  }
});

test('triggers exposes localized metadata for its management surface', () => {
  const command = require('../src/interactions/Command/triggers');
  const { resolveCommandLocalizations } = require('../src/handlers/i18n');
  const localizations = resolveCommandLocalizations(command);

  assert.equal(localizations.name.fr, 'triggers');
  assert.equal(localizations.name.en, 'triggers');
  assert.equal(localizations.description.en, 'Trigger responses to matching messages');
  assert.deepEqual(Object.fromEntries(Object.entries(localizations.subcommands.add.options).map(([key, value]) => [key, { description: value.description }])), {
    alias: { description: { fr: 'Alias du trigger', en: 'Trigger alias' } },
    type: { description: { fr: 'Type de réponse', en: 'Response type' } },
    regex: { description: { fr: 'Filtre regex', en: 'Regex filter' } },
    regexflags: { description: { fr: 'Flags regex additionnels', en: 'Additional regex flags' } },
    response: { description: { fr: 'Réponse du bot', en: 'Bot response' } },
    isactive: { description: { fr: 'Statut du trigger', en: 'Trigger status' } },
    mention: { description: { fr: 'Mentionner lors de la réponse', en: 'Mention when responding' } },
    replied: { description: { fr: 'Format de la réponse', en: 'Response format' } },
    emotes: { description: { fr: 'Emotes ajoutées lors de la réaction', en: 'Emotes added to the reaction' } },
    timedeletion: { description: { fr: 'Délai avant suppression', en: 'Delay before deletion' } }
  });
  assert.equal(localizations.subcommands.add.options.type.choices['1'].name.fr, 'Répond');
  assert.equal(localizations.subcommands.add.options.type.choices['1'].name.en, 'Reply');
  assert.equal(localizations.subcommands.add.options.isactive.choices.false.name.fr, 'Désactivé');
  assert.equal(localizations.subcommands.add.options.isactive.choices.false.name.en, 'Disabled');
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

test('serializes command metadata from locale JSON using localizationKey', () => {
    const { SlashCommandBuilder } = require('discord.js');
    const command = {
        data: new SlashCommandBuilder()
            .setName('voice')
            .setDescription('Manage voice channels'),
        localizationKey: 'commandMetadata.voice'
    };

    applyCommandLocalizations(command);
    const data = command.data.toJSON();

    assert.deepEqual(data.name_localizations, { fr: 'vocal', 'en-US': 'voice' });
    assert.deepEqual(data.description_localizations, {
        fr: 'Gérer les salons vocaux',
        'en-US': 'Manage voice channels'
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

test('serializes localized choice names from command metadata', () => {
  const command = require('../src/interactions/Command/message');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const choices = command.data.toJSON().options.find(option => option.name === 'message').choices;

  assert.deepEqual(choices.find(choice => choice.value === 'information').name_localizations, {
    fr: 'Information',
    'en-US': 'Information'
  });
  assert.deepEqual(choices.find(choice => choice.value === 'rules').name_localizations, {
    fr: 'Règles',
    'en-US': 'Rules'
  });
});

test('serializes localized game choice names from command metadata', () => {
  const command = require('../src/interactions/Command/games');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const option = command.data.toJSON().options
    .find(subcommand => subcommand.name === 'rps').options
    .find(child => child.name === 'option');

  assert.deepEqual(option.choices.find(choice => choice.value === 'rock').name_localizations, {
    fr: '🪨 Pierre',
    'en-US': '🪨 Rock'
  });
});

test('serializes localized report choice names from command metadata', () => {
  const command = require('../src/interactions/Command/report');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const choices = command.data.toJSON().options.find(option => option.name === 'type').choices;

  assert.deepEqual(choices.find(choice => choice.value === 'bug').name_localizations, {
    fr: 'Bug',
    'en-US': 'Bug'
  });
  assert.deepEqual(choices.find(choice => choice.value === 'user').name_localizations, {
    fr: 'Utilisateur',
    'en-US': 'User'
  });
});

test('serializes localized developer choice names from command metadata', () => {
  const command = require('../src/interactions/Command/developers');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const credits = command.data.toJSON().options.find(option => option.name === 'credits').options;
  const creditChoices = credits.find(option => option.name === 'type').choices;
  const panelChoices = command.data.toJSON().options.find(option => option.name === 'args').options
    .find(option => option.name === 'message').choices;

  assert.deepEqual(creditChoices.find(choice => choice.value === 'add').name_localizations, {
    fr: 'Ajouter',
    'en-US': 'Add'
  });
  assert.deepEqual(panelChoices.find(choice => choice.value === 'ourbots').name_localizations, {
    fr: 'Nos bots',
    'en-US': 'Our bots'
  });
});

test('serializes localized trigger choice names from command metadata', () => {
  const command = require('../src/interactions/Command/triggers');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const add = command.data.toJSON().options.find(option => option.name === 'add').options;
  const typeChoices = add.find(option => option.name === 'type').choices;
  const activeChoices = add.find(option => option.name === 'isactive').choices;

  assert.deepEqual(typeChoices.find(choice => choice.value === '1').name_localizations, {
    fr: 'Répond',
    'en-US': 'Reply'
  });
  assert.deepEqual(activeChoices.find(choice => choice.value === 'false').name_localizations, {
    fr: 'Désactivé',
    'en-US': 'Disabled'
  });
});

test('serializes localized config choice names from command metadata', () => {
  const command = require('../src/interactions/Command/config');
  const { applyCommandLocalizations } = require('../src/handlers/i18n');

  applyCommandLocalizations(command);
  const languageChoices = command.data.toJSON().options.find(option => option.name === 'language').options[0].choices;
  const ticketChoices = command.data.toJSON().options.find(option => option.name === 'ticketmessage').options
    .find(option => option.name === 'type').choices;

  assert.deepEqual(languageChoices.find(choice => choice.value === 'fr').name_localizations, {
    fr: 'Français',
    'en-US': 'French'
  });
  assert.deepEqual(ticketChoices.find(choice => choice.value === 'close').name_localizations, {
    fr: 'Fermeture par DM',
    'en-US': 'Close by DM'
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

test('economy and casino publish localized subcommands and options', () => {
    const economy = require('../src/interactions/Command/economy');
    const casino = require('../src/interactions/Command/casino');
    applyCommandLocalizations(economy);
    applyCommandLocalizations(casino);

    const economyData = economy.data.toJSON();
    const casinoData = casino.data.toJSON();
    const pay = economyData.options.find(option => option.name === 'pay');
    const roulette = casinoData.options.find(option => option.name === 'roulette');

    assert.deepEqual(pay.description_localizations, {
        fr: 'Payer un utilisateur',
        'en-US': 'Pay a user'
    });
    assert.deepEqual(roulette.description_localizations, {
        fr: 'Jouer à la roulette',
        'en-US': 'Play roulette'
    });
    assert.deepEqual(roulette.options.find(option => option.name === 'amount').description_localizations, {
        fr: 'Entrez un montant',
        'en-US': 'Enter an amount'
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
