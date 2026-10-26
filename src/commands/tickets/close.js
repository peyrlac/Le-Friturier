const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");
const ticketMessageConfig = require("../../database/models/ticketMessage");

module.exports = async (client, interaction, args) => {
    const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
    const ticketData = await ticketChannels.findOne({ Guild: interaction.guild.id, channelID: interaction.channel.id });

    let type = 'reply';
    if (interaction.isCommand()) type = 'editreply';

    if (ticketData) {
        if (ticketData.resolved == true) return client.errNormal({
            key: 'tickets.alreadyClosed',
            type: 'ephemeraledit'
        }, interaction);

        if (data) {
            const ticketCategory = interaction.guild.channels.cache.get(data.Category);
            const logsChannel = interaction.guild.channels.cache.get(data.Logs);

            if (ticketCategory == undefined) {
                return client.errNormal({
                    key: 'tickets.closeSetupRequired',
                    type: type
                }, interaction);
            }

            if (interaction.guild.channels.cache.find(c => c.id === ticketCategory.id)) {
                client.users.fetch(ticketData.creator).then(async usr => {
                    interaction.channel.permissionOverwrites.edit(usr, {
                        ViewChannel: false,
                        SendMessages: false,
                        AttachFiles: false,
                        ReadMessageHistory: false,
                        AddReactions: false
                    });

                    try {
                        var closeMessageTicket = await client.t(usr, 'tickets.transcriptMessage');
                        let ticketMessageData = await ticketMessageConfig.findOne({ Guild: interaction.guild.id });
                        if (ticketMessageData) {
                            closeMessageTicket = ticketMessageData.dmMessage;
                        }

                        client.embed({
                            desc: closeMessageTicket,
                            fields: [
                                {
                                    name: await client.t(usr, 'tickets.closer'),
                                    value: `${interaction.user}`,
                                    inline: true
                                },
                                {
                                    name: await client.t(usr, 'tickets.ticketId'),
                                    value: `${ticketData.TicketID}`,
                                    inline: true
                                },
                                {
                                    name: await client.t(usr, 'tickets.server'),
                                    value: `${interaction.guild.name}`,
                                    inline: true
                                }
                            ]
                        }, usr)
                        client.transcript(interaction, usr).catch(error => {
                            console.error('Failed to create ticket transcript', error);
                        });
                    }
                    catch (error) {
                        console.error('Failed to process ticket transcript recipient', error);
                    }
                })

                if (logsChannel) {
                    client.embed({
                        titleKey: 'tickets.closed',
                        descKey: 'tickets.closed',
                        color: client.config.colors.error,
                        fields: [
                            {
                                name: await client.t(logsChannel, 'tickets.ticketId'),
                                value: `${ticketData.TicketID}`,
                            },
                            {
                                name: await client.t(logsChannel, 'tickets.closer'),
                                value: `${interaction.user.tag} (${interaction.user.id})`,
                            },
                            {
                                name: await client.t(logsChannel, 'tickets.creator'),
                                value: `<@!${ticketData.creator}>`,
                            },
                            {
                                name: await client.t(logsChannel, 'tickets.claimedBy'),
                                value: `<@!${ticketData.creator}>`,
                            },
                            {
                                name: await client.t(logsChannel, 'tickets.date'),
                                value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`,
                            }
                        ]
                    }, logsChannel)
                    client.transcript(interaction, logsChannel);
                }

                ticketData.resolved = true;
                await ticketData.save();

                await interaction.channel.edit({ name: `ticket-closed` });
                client.simpleEmbed({
                    descKey: 'tickets.closedBy',
                    variables: { user: interaction.user.id },
                    type: type
                }, interaction)

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('Bot_transcriptTicket')
                            .setEmoji('📝')
                            .setStyle(Discord.ButtonStyle.Primary),

                        new Discord.ButtonBuilder()
                            .setCustomId('Bot_openTicket')
                            .setEmoji('🔓')
                            .setStyle(Discord.ButtonStyle.Primary),

                        new Discord.ButtonBuilder()
                            .setCustomId('Bot_deleteTicket')
                            .setEmoji('⛔')
                            .setStyle(Discord.ButtonStyle.Danger),
                    );

                client.embed({
                    titleKey: 'tickets.closed',
                    descKey: 'tickets.closedPanel',
                    components: [row],
                }, interaction.channel)
            }
            else {
                return client.errNormal({
                    key: 'tickets.closeSetupRequired',
                    type: type
                }, interaction);

            }
        }
        else {
            return client.errNormal({
                key: 'tickets.closeSetupRequired',
                type: type
            }, interaction)
        }
    }
}


