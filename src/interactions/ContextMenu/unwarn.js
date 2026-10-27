const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");

module.exports = {
    localizationKey: 'commandMetadata.unwarn',
    data: new ContextMenuCommandBuilder()
        .setName('Unwarn')
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

        if (perms == false) {
            client.errNormal({
                key: 'errors.noPermission',
                type: 'ephemeral'
            }, interaction);
            return;
        }
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });

        const member = interaction.guild.members.cache.get(interaction.targetId);

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });
        if (data) {
                const menu = new Discord.StringSelectMenuBuilder()
                    .setCustomId('unwarn')
                    .setPlaceholder(await client.t(interaction, 'moderation.selectWarning'));
                // Get all warnings and add them to a stringselectmenu 
                for (const element of data.Warnings) {
                    menu.addOptions({
                        label: `Case ${element.Case}`,
                        value: element.Case.toString(),
                        description: `${await client.t(interaction, 'moderation.reason')}: ${element.Reason}`
                    });
                }
                // Create a new message with the menu
                await client.embed({
                    title: await client.t(interaction, 'moderation.unwarnTitle'),
                    desc: await client.t(interaction, 'moderation.unwarnDescription', { guild: interaction.guild.name }),
                    components: [new Discord.ActionRowBuilder().addComponents(menu)],
                    type: 'ephemeraledit'
                }, interaction);

                // Create a new collector for the menu
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    if (i.customId === 'unwarn') {
                        // Remove the warning from the database
                        data.Warnings.splice(data.Warnings.findIndex(element => element.Case == i.values[0]), 1);
                        await data.save();
                        // Remove the menu from the message
                        await i.update({
                            components: []
                        });
                        // Send a success message
                        client.succNormal({
                            key: 'errors.moderation.warningRemoved',
                            fields: [
                                {
                                    name: await client.t(interaction, 'moderation.user'),
                                    value: `${member}`,
                                    inline: true
                                }
                            ],
                            type: 'ephemeraledit'
                        }, interaction);
                        client.emit('warnRemove', member, interaction.user)
                        client.embed({
                            title: await client.t(member, 'moderation.unwarnTitle'),
                            desc: await client.t(member, 'moderation.unwarnDescription', { guild: interaction.guild.name }),
                            fields: [
                                {
                                    name: await client.t(member, 'moderation.moderator'),
                                    value: interaction.user.tag,
                                    inline: true
                                },
                            ]
                        }, member).catch(() => { })
                    }
                });
            } else {
                return client.errNormal({
                    key: 'errors.moderation.noWarnings',
                    type: 'ephemeraledit'
                }, interaction);
            }
    },
};
