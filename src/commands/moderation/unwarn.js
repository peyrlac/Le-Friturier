const Discord = require('discord.js');
const Schema = require('../../database/models/warnings');

module.exports = async (client, interaction) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms === false) return;

    const member = interaction.options.getUser('user', true);
    const caseNumber = interaction.options.getInteger('case', true);
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });

    if (!data) return client.errNormal({ key: 'moderation.noWarnings', variables: { user: member.tag }, type: 'editreply' }, interaction);

    const warning = data.Warnings.find(item => item.Case === caseNumber);
    if (!warning) {
        return client.errNormal({
            key: 'moderation.caseNotFound',
            variables: { case: caseNumber },
            type: 'editreply'
        }, interaction);
    }

    data.Warnings.splice(data.Warnings.indexOf(warning), 1);
    await data.save();

    try {
        await client.embed({
        titleKey: 'moderation.unwarnTitle',
        descKey: 'moderation.unwarnDescription',
        variables: { guild: interaction.guild.name },
        fields: [
            {
                name: await client.t(interaction, 'moderation.moderator'),
                value: interaction.user.tag,
                inline: true
            },
        ]
        }, member);
    } catch (error) {
        console.error(`Unable to notify ${member.id} about removed warning ${caseNumber}:`, error);
    }

    client.emit('warnRemove', member, interaction.user)
    client.succNormal({
        key: 'moderation.unwarnSuccess',
        fields: [
            {
                name: await client.t(interaction, 'moderation.user'),
                value: `${member}`,
                inline: true
            }
        ],
        type: 'editreply'
    }, interaction);
}

