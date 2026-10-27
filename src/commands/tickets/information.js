const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");

module.exports = async (client, interaction, args) => {
    const ticketData = await ticketChannels.findOne({
        Guild: interaction.guild.id,
        channelID: interaction.channel.id
    });
    if (!ticketData) return;

    const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (!data) {
        return client.errNormal({ key: 'tickets.setupRequired', type: 'editreply' }, interaction);
    }

    const ticketCategory = interaction.guild.channels.cache.get(data.Category);
    if (ticketCategory == undefined) {
        return client.errNormal({ key: 'tickets.setupRequired', type: 'editreply' }, interaction);
    }

    if (interaction.channel.parentId != ticketCategory.id) {
        return client.errNormal({ key: 'tickets.notTicket', type: 'editreply' }, interaction);
    }

    const loadingMessage = await client.embed({
        descKey: 'tickets.informationLoading',
        type: 'editreply'
    }, interaction);
    await client.transcript(interaction, interaction.channel);

    return client.embed({
        titleKey: 'tickets.informationTitle',
        fields: [
            { name: await client.t(interaction, 'tickets.ticketName'), value: `\`${interaction.channel.name}\``, inline: true },
            { name: await client.t(interaction, 'tickets.channelId'), value: `\`${interaction.channel.id}\``, inline: true },
            { name: await client.t(interaction, 'tickets.creator'), value: `<@!${ticketData.creator}>`, inline: true },
            { name: await client.t(interaction, 'tickets.claimedBy'), value: `<@!${ticketData.claimed}>`, inline: true },
            { name: await client.t(interaction, 'tickets.ticketId'), value: `${ticketData.TicketID}`, inline: true }
        ],
        type: 'editreply'
    }, loadingMessage);
}


