const Discord = require('discord.js');
const ticketSchema = require("../../database/models/tickets");

module.exports = async (client, interaction, args) => {
    const ticketData = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (!ticketData) {
        return client.errNormal({ key: 'setup.ticketpanel.missingSetup', type: 'editreply' }, interaction);
    }

    const channel = interaction.guild.channels.cache.get(ticketData.Channel);
    if (!channel) {
        return client.errNormal({ key: 'setup.ticketpanel.missingSetup', type: 'editreply' }, interaction);
    }

    const button = new Discord.ButtonBuilder()
        .setCustomId('Bot_openticket')
        .setLabel("Tickets")
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji('🎫');
    const row = new Discord.ActionRowBuilder().addComponents(button);

    await client.embed({
        title: "Tickets",
        desc: "Cliquez sur 🎫 pour ouvrir un ticket",
        components: [row]
    }, channel);

    return client.succNormal({ key: 'setup.ticketpanel.success', type: 'editreply' }, interaction);
};
