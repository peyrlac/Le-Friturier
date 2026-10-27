const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");

module.exports = async (client, interaction, args) => {
    const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
    const ticketData = await ticketChannels.findOne({ Guild: interaction.guild.id, channelID: interaction.channel.id })

    if (ticketData) {
        if (interaction.user.id !== ticketData.creator) {
            const perms = await client.checkUserPerms({
                flags: [Discord.PermissionsBitField.Flags.ManageMessages],
                perms: [Discord.PermissionsBitField.Flags.ManageMessages]
            }, interaction)

            if (perms == false) return;

            if (data) {
                if (ticketData.claimed == "" || ticketData.claimed == undefined || ticketData.claimed == "None") {
                    return client.errNormal({
                        key: 'tickets.notClaimed',
                        type: 'ephemeral'
                    }, interaction)
                }
                else {
                    if (ticketData.claimed == interaction.user.id) {
                        const ticketCategory = interaction.guild.channels.cache.get(data.Category);

                        if (ticketCategory == undefined) {
                            return client.errNormal({
                                key: 'tickets.setupRequired',
                                type: 'editreply'
                            }, interaction);
                        }

                        if (interaction.channel.parentId == ticketCategory.id) {

                            ticketData.claimed = "None";
                            await ticketData.save();

                            return client.simpleEmbed({
                                descKey: 'tickets.availableAgain',
                                type: 'editreply'
                            }, interaction)

                        }
                        else {
                            return client.errNormal({
                                key: 'tickets.notTicket',
                                type: 'editreply'
                            }, interaction)
                        }
                    }
                    else {
                        return client.errNormal({
                            key: 'tickets.notClaimedByYou',
                            type: 'editreply'
                        }, interaction)
                    }
                }
            }
            else {
                return client.errNormal({
                    key: 'tickets.setupRequired',
                    type: 'editreply'
                }, interaction)
            }
        }
    }
}


