const test = require('node:test');
const assert = require('node:assert/strict');

const { createFeatureManager } = require('../src/handlers/features');
const { createI18n } = require('../src/handlers/i18n');

const registry = {
    music: { key: 'music', defaultEnabled: true, surfaces: ['command', 'event'] },
    maintenance: { key: 'maintenance', defaultEnabled: false, surfaces: ['event'] },
};

function createStore(initialGuild = {}, initialGlobal = {}) {
    const state = {
        guild: { Features: { ...initialGuild } },
        global: { Features: { ...initialGlobal } },
    };

    return {
        state,
        readGuild: async () => state.guild,
        readGlobal: async () => state.global,
        writeGuild: async update => { state.guild = update; return update; },
        writeGlobal: async update => { state.global = update; return update; },
    };
}

test('feature manager uses registry defaults and reports their source', async () => {
    const store = createStore();
    const features = createFeatureManager({ registry, ...store });

    assert.deepEqual(await features.getFeatureState('music', 'guild-1'), {
        feature: 'music',
        enabled: true,
        source: 'default',
    });
    assert.equal((await features.getFeatureState('maintenance', 'guild-1')).enabled, false);
});

test('global override has priority over a guild override', async () => {
    const store = createStore({ music: false }, { music: true });
    const features = createFeatureManager({ registry, ...store });

    assert.deepEqual(await features.getFeatureState('music', 'guild-1'), {
        feature: 'music',
        enabled: true,
        source: 'global',
    });
});

test('guild changes invalidate the cache and reset to the default', async () => {
    const store = createStore();
    let reads = 0;
    const features = createFeatureManager({
        registry,
        ...store,
        readGuild: async () => { reads += 1; return store.state.guild; },
    });

    await features.getFeatureState('music', 'guild-1');
    await features.getFeatureState('music', 'guild-1');
    assert.equal(reads, 1);

    await features.setGuildFeature('music', 'guild-1', false);
    assert.equal((await features.getFeatureState('music', 'guild-1')).enabled, false);
    await features.resetGuildFeature('music', 'guild-1');
    assert.equal((await features.getFeatureState('music', 'guild-1')).enabled, true);
});

test('unknown features are rejected without touching persistence', async () => {
    const store = createStore();
    const features = createFeatureManager({ registry, ...store });

    await assert.rejects(
        () => features.setGuildFeature('unknown', 'guild-1', false),
        /Unknown feature/
    );
    assert.deepEqual(store.state.guild.Features, {});
});

test('read failures fall back to the registry default and log a warning', async () => {
    const warnings = [];
    const features = createFeatureManager({
        registry,
        readGuild: async () => { throw new Error('database unavailable'); },
        readGlobal: async () => ({}),
        logger: { warn: message => warnings.push(message) },
    });

    assert.equal((await features.getFeatureState('music', 'guild-1')).enabled, true);
    assert.equal(warnings.length, 1);
});

test('feature settings have a server override field and a global singleton model', () => {
    const Functions = require('../src/database/models/functions');
    const GlobalFeatures = require('../src/database/models/globalFeatures');

    assert.equal(Functions.schema.path('Features').instance, 'Mixed');
    assert.equal(GlobalFeatures.schema.path('Key').options.default, 'global');
    assert.equal(GlobalFeatures.schema.path('Features').instance, 'Mixed');
});

test('feature status messages are available in both supported locales', () => {
    const i18n = createI18n();

    assert.equal(i18n.t('fr', 'features.disabled', { feature: 'Musique' }), 'La fonctionnalité Musique est désactivée.');
    assert.equal(i18n.t('en', 'features.disabled', { feature: 'Music' }), 'The Music feature is disabled.');
    assert.equal(i18n.t('fr', 'features.music.label'), 'Musique');
});

test('subcommand loader resolves grouped command paths', () => {
    const { resolveSubcommandPath } = require('../src/handlers/functions/functions');

    assert.equal(resolveSubcommandPath({
        commandName: 'config',
        options: {
            getSubcommandGroup: () => 'feature',
            getSubcommand: () => 'list',
        },
    }), 'config/feature/list');
    assert.equal(resolveSubcommandPath({
        commandName: 'language',
        options: {
            getSubcommandGroup: () => null,
            getSubcommand: () => 'set',
        },
    }), 'language/set');
});

test('guild feature set persists an override and returns a localized confirmation', async () => {
    const run = require('../src/commands/config/feature/set');
    let saved;
    let response;
    const client = {
        checkUserPerms: async () => true,
        features: { setGuildFeature: async (...args) => { saved = args; } },
        t: async (_interaction, key) => key === 'features.music.label' ? 'Musique' : key,
        succNormal: async payload => { response = payload; },
    };
    const interaction = {
        guild: { id: 'guild-1' },
        options: {
            getString: name => name === 'feature' ? 'music' : null,
            getBoolean: () => false,
        },
    };

    await run(client, interaction);

    assert.deepEqual(saved, ['music', 'guild-1', false]);
    assert.equal(response.key, 'features.disabled');
    assert.equal(response.variables.feature, 'Musique');
});

test('global feature controls reject non-owner users before changing state', async () => {
    const run = require('../src/commands/bot/feature');
    let changed = false;
    let response;
    const client = {
        config: { discord: { ownerId: 'owner-1' } },
        features: { setGlobalFeature: async () => { changed = true; } },
        errNormal: async payload => { response = payload; },
    };
    const interaction = {
        user: { id: 'member-1' },
        options: {
            getString: name => ({ action: 'set', feature: 'music' }[name]),
            getBoolean: () => false,
        },
    };

    await run(client, interaction);

    assert.equal(changed, false);
    assert.equal(response.key, 'features.ownerPermission');
});

test('client feature guard blocks disabled interactions with a localized response', async () => {
    let response;
    const store = createStore({}, { music: false });
    const client = {
        t: async (_interaction, key) => key === 'features.music.label' ? 'Musique' : key,
        errNormal: async payload => { response = payload; },
    };
    const manager = require('../src/handlers/features').installFeatureManager(client, { registry, ...store });

    assert.equal(await client.requireFeature({ guild: { id: 'guild-1' } }, 'music'), false);
    assert.equal(response.key, 'features.globallyDisabled');
    assert.equal(response.variables.feature, 'Musique');
    assert.equal(manager, client.features);
});
