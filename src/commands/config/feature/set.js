const Discord = require('discord.js');
const { FEATURE_REGISTRY } = require('../../../handlers/features');

module.exports = async (client, interaction) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.Administrator],
        perms: [Discord.PermissionsBitField.Flags.Administrator],
    }, interaction);
    if (perms === false) return;

    const feature = interaction.options.getString('feature', true);
    const enabled = interaction.options.getBoolean('enabled', true);
    const definition = FEATURE_REGISTRY[feature];
    if (!definition || definition.alwaysOn) {
        return client.errNormal({ key: 'features.unknown', type: 'editreply' }, interaction);
    }

    await client.features.setGuildFeature(feature, interaction.guild.id, enabled);
    const label = await client.t(interaction, definition.labelKey);
    return client.succNormal({
        key: enabled ? 'features.enabled' : 'features.disabled',
        variables: { feature: label },
        type: 'editreply',
    }, interaction);
};
