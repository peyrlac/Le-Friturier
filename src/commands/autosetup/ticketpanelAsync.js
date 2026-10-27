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
        .setLabel(await client.t(interaction, 'setup.ticketpanel.button'))
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji('🎫');
    const row = new Discord.ActionRowBuilder().addComponents(button);

    await client.embed({
        title: await client.t(interaction, 'setup.ticketpanel.title'),
        desc: await client.t(interaction, 'setup.ticketpanel.description'),
        components: [row]
    }, channel);

    return client.succNormal({ key: 'setup.ticketpanel.success', type: 'editreply' }, interaction);
};
