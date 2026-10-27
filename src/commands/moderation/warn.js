const Discord = require('discord.js');
const Schema = require('../../database/models/warnings');
const Case = require('../../database/models/warnCase');

module.exports = async (client, interaction) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms === false) return client.errNormal({ key: 'errors.noPermission', type: 'editreply' }, interaction);

    const member = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);
    const caseData = await Case.findOneAndUpdate(
        { Guild: interaction.guild.id },
        { $inc: { Case: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const caseNumber = caseData.Case;
    const warning = {
        Moderator: interaction.user.id,
        Reason: reason,
        Date: Date.now(),
        Case: caseNumber
    };

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id, User: member.id },
        { $push: { Warnings: warning } },
        { upsert: true, setDefaultsOnInsert: true }
    );

    try {
        await client.embed({
            titleKey: 'moderation.warnTitle',
            descKey: 'moderation.warnDescription',
            variables: { guild: interaction.guild.name },
            fields: [
                {
                    name: await client.t(interaction, 'moderation.moderator'),
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: await client.t(interaction, 'moderation.reason'),
                    value: reason,
                    inline: true
                }
            ]
        }, member);
    } catch (error) {
        console.error(`Unable to notify ${member.id} about warning ${caseNumber}:`, error);
    }

    client.emit('warnAdd', member, interaction.user, reason);
    return client.succNormal({
        key: 'errors.moderation.warnSuccess',
        fields: [
            {
                name: await client.t(interaction, 'moderation.user'),
                value: `${member}`,
                inline: true
            },
            {
                name: await client.t(interaction, 'moderation.moderator'),
                value: `${interaction.user}`,
                inline: true
            },
            {
                name: await client.t(interaction, 'moderation.reason'),
                value: reason,
                inline: false
            }
        ],
        type: 'editreply'
    }, interaction);
}

 
