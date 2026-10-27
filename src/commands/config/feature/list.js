const { FEATURE_REGISTRY } = require('../../../handlers/features');

module.exports = async (client, interaction) => {
    const lines = [];
    for (const definition of Object.values(FEATURE_REGISTRY)) {
        const label = await client.t(interaction, definition.labelKey);
        const state = await client.features.getFeatureState(definition.key, interaction.guild.id);
        const status = await client.t(interaction, state.enabled ? 'features.enabled' : 'features.disabled', { feature: label });
        lines.push(`**${label}** — ${status} (${state.source})`);
    }

    return client.embed({
        key: 'features.listTitle',
        titleKey: 'features.listTitle',
        desc: lines.join('\n'),
        type: 'editreply',
    }, interaction);
};
