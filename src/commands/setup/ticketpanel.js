const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");

module.exports = async (client, interaction, args) => {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');

    const ticketData = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (ticketData) {
        const channel = interaction.guild.channels.cache.get(ticketData.Channel);
        const button = new Discord.ButtonBuilder()
            .setCustomId('Bot_openticket')
            .setLabel(name)
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('🎫')

        const row = new Discord.ActionRowBuilder()
            .addComponents(button)

        await client.embed({
            title: name,
            desc: description,
            components: [row]
        }, channel)

        return client.succNormal({
            key: 'commands.setup.ticketpanel.success',
            type: 'editreply'
        }, interaction);
    }

    return client.errNormal({
        key: 'commands.setup.ticketpanel.missingSetup',
        type: 'editreply'
    }, interaction);
}

