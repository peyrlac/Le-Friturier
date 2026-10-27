const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    let type = 'reply';
    if (interaction.isCommand()) type = 'editreply';

    const ticketData = await ticketChannels.findOne({ Guild: interaction.guild.id, channelID: interaction.channel.id });
    if (ticketData) {
            const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
                if (data) {
                    const ticketCategory = interaction.guild.channels.cache.get(data.Category);

                    if (ticketCategory == undefined) {
                        return client.errNormal({
                            key: 'tickets.setupRequired',
                            type: type
                        }, interaction);
                    }

                    if (interaction.channel.parentId == ticketCategory.id) {
                        await client.simpleEmbed({
                            descKey: 'tickets.transcriptSaving',
                            type: type
                        }, interaction);
                        await client.transcript(interaction, interaction.channel);
                        return client.simpleEmbed({ descKey: 'tickets.transcriptSaved', type: 'editreply' }, interaction);
                    }
                    else {
                        return client.errNormal({
                            key: 'tickets.notTicket',
                            type: type
                        }, interaction);

                    }
                }
                else {
                    return client.errNormal({
                        key: 'tickets.setupRequired',
                        type: type
                    }, interaction);
                }
            }
    }


