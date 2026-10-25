const Discord = require('discord.js');
const Schema = require('../../database/models/warnings');

module.exports = async (client, interaction) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms === false) {
        return client.errNormal({ key: 'errors.noPermission', type: 'editreply' }, interaction);
    }

    const member = interaction.options.getUser('user', true);
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });
    const titleKey = 'moderation.warningsTitle';

    if (!data) {
        return client.embed({
            titleKey,
            descKey: 'moderation.noWarnings',
            variables: { user: member.tag },
            type: 'editreply'
        }, interaction);
    }

    const fields = await Promise.all(data.Warnings.map(async warning => ({
        name: await client.t(interaction, 'moderation.warningCase', { case: warning.Case }),
        value: await client.t(interaction, 'moderation.warningDetails', {
            reason: warning.Reason,
            moderator: `<@!${warning.Moderator}>`
        }),
        inline: true
    })));

    return client.embed({
        titleKey,
        descKey: 'moderation.warningsDescription',
        variables: { user: member.tag },
        fields: [
            {
                name: await client.t(interaction, 'moderation.total'),
                value: `${data.Warnings.length}`
            },
            ...fields
        ],
        type: 'editreply'
    }, interaction);
};

