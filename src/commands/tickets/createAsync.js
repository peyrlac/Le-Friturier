const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");
const ticketMessageConfig = require("../../database/models/ticketMessage");

module.exports = async (client, interaction, args) => {
    const reason = interaction.options?.getString('reason') || "Not given";
    const type = interaction.isCommand() ? 'editreply' : 'reply';

    const existingTicket = await ticketChannels.findOne({
        Guild: interaction.guild.id,
        creator: interaction.user.id,
        resolved: false
    });

    if (existingTicket) {
        return client.errNormal({
            key: 'tickets.limitReached',
            type: interaction.isCommand() ? 'ephemeraledit' : 'ephemeral'
        }, interaction);
    }

    const ticketData = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (!ticketData) {
        return client.errNormal({ key: 'tickets.setupRequired', type }, interaction);
    }

    const logsChannel = interaction.guild.channels.cache.get(ticketData.Logs);
    const ticketCategory = interaction.guild.channels.cache.get(ticketData.Category);
    const ticketRole = interaction.guild.roles.cache.get(ticketData.Role);
    if (!ticketCategory || !ticketRole) {
        return client.errNormal({ key: 'tickets.setupRequired', type }, interaction);
    }

    try {
        let openTicket = client.t(interaction, 'tickets.defaultOpenMessage');
        const ticketMessageData = await ticketMessageConfig.findOne({ Guild: interaction.guild.id });
        if (ticketMessageData?.openTicket) openTicket = ticketMessageData.openTicket;

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId('Bot_closeticket').setEmoji('🔒').setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId('Bot_claimTicket').setEmoji('✋').setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId('Bot_transcriptTicket').setEmoji('📝').setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId('Bot_noticeTicket').setEmoji('🔔').setStyle(Discord.ButtonStyle.Primary)
        );

        await client.embed({ descKey: 'tickets.progress', type: 'ephemeral' }, interaction);

        ticketData.TicketCount = (ticketData.TicketCount || 0) + 1;
        await ticketData.save();

        const ticketId = String(ticketData.TicketCount).padStart(4, '0');
        const permissions = [
            Discord.PermissionsBitField.Flags.AddReactions,
            Discord.PermissionsBitField.Flags.SendMessages,
            Discord.PermissionsBitField.Flags.ViewChannel,
            Discord.PermissionsBitField.Flags.AttachFiles,
            Discord.PermissionsBitField.Flags.ReadMessageHistory
        ];
        const channel = await interaction.guild.channels.create({
            name: `ticket-${ticketId}`,
            permissionOverwrites: [
                { deny: [Discord.PermissionsBitField.Flags.ViewChannel], id: interaction.guild.id },
                { allow: permissions, id: interaction.user.id },
                { allow: permissions, id: ticketRole.id }
            ],
            parent: ticketCategory.id
        });

        await client.embed({ descKey: 'tickets.created', type }, interaction);

        await new ticketChannels({
            Guild: interaction.guild.id,
            TicketID: ticketId,
            channelID: channel.id,
            creator: interaction.user.id,
            claimed: "None"
        }).save();

        if (logsChannel) {
            await client.embed({
                title: '📝・Open ticket',
                desc: `A new ticket has been created by ${interaction.user.tag} (${interaction.user.id}) in ${channel}.`
            }, logsChannel);
        }

        return client.embed({
            desc: openTicket,
            fields: [
                { name: '👤・Creator', value: `${interaction.user}`, inline: true },
                { name: '📄・Subject', value: `${reason}`, inline: true },
                { name: '⏰・Created at', value: `<t:${(Date.now() / 1000).toFixed(0)}:F>`, inline: true }
            ],
            components: [row],
            content: `${interaction.user}, ${ticketRole}`
        }, channel);
    }
    catch (error) {
        console.error(error);
        return client.errNormal({ key: 'tickets.operationFailed', type }, interaction);
    }
};
