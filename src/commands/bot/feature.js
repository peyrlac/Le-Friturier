const { FEATURE_REGISTRY } = require('../../handlers/features');

function ownerId(client) {
    return client.config?.discord?.ownerId || process.env.BOT_OWNER_ID || client.application?.owner?.id;
}

module.exports = async (client, interaction) => {
    if (interaction.user.id !== ownerId(client)) {
        return client.errNormal({ key: 'features.ownerPermission', type: 'editreply' }, interaction);
    }

    const action = interaction.options.getString('action', true);
    if (action === 'list') {
        const lines = [];
        for (const definition of Object.values(FEATURE_REGISTRY)) {
            const state = await client.features.getFeatureState(definition.key);
            const label = await client.t(interaction, definition.labelKey);
            lines.push(`**${label}** — ${state.enabled ? 'enabled' : 'disabled'} (${state.source})`);
        }
        return client.embed({ titleKey: 'features.listTitle', desc: lines.join('\n'), type: 'editreply' }, interaction);
    }

    const feature = interaction.options.getString('feature', true);
    const definition = FEATURE_REGISTRY[feature];
    if (!definition || definition.alwaysOn) {
        return client.errNormal({ key: 'features.unknown', type: 'editreply' }, interaction);
    }

    const label = await client.t(interaction, definition.labelKey);
    if (action === 'reset') {
        await client.features.resetGlobalFeature(feature, { updatedBy: interaction.user.id });
        return client.succNormal({ key: 'features.reset', variables: { feature: label }, type: 'editreply' }, interaction);
    }

    if (action !== 'set') return client.errNormal({ key: 'features.unknown', type: 'editreply' }, interaction);
    const enabled = interaction.options.getBoolean('enabled', true);
    await client.features.setGlobalFeature(feature, enabled, { updatedBy: interaction.user.id });
    return client.succNormal({
        key: enabled ? 'features.enabled' : 'features.disabled',
        variables: { feature: label },
        type: 'editreply',
    }, interaction);
};
