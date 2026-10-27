const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");

module.exports = {
    localizationKey: 'commandMetadata.warnings',
    data: new ContextMenuCommandBuilder()
        .setName('Warnings')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const perms = await client.checkPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false){
            client.errNormal({
                key: 'errors.noPermission',
                type: 'ephemeral'
            }, interaction);
            return;
        }
        await interaction.deferReply();

        const member = interaction.guild.members.cache.get(interaction.targetId);

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });
        if (data) {
                var fields = [];
                for (const element of data.Warnings) {
                    fields.push({
                        name: await client.t(interaction, 'moderation.warningCase', { case: element.Case }),
                        value: await client.t(interaction, 'moderation.warningDetails', { reason: element.Reason, moderator: `<@!${element.Moderator}>` }),
                        inline: true
                    })
                }
                return client.embed({
                    title: await client.t(interaction, 'moderation.warningsTitle'),
                    desc: await client.t(interaction, 'moderation.warningsDescription', { user: member.user.tag }),
                    fields: [
                        {
                            name: await client.t(interaction, 'moderation.total'),
                            value: `${data.Warnings.length}`,
                        },
                        ...fields
                    ],
                    type: 'editreply'
                }, interaction)
            }
            else {
                return client.embed({
                    title: await client.t(interaction, 'moderation.warningsTitle'),
                    desc: await client.t(interaction, 'moderation.noWarnings', { user: member.user.tag }),
                    type: 'editreply'
                }, interaction)
            }
    },
};
