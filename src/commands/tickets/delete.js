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

    const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (!data) {
        return client.errNormal({
            key: 'tickets.setupRequired',
            type: type
        }, interaction);
    }

    const ticketCategory = interaction.guild.channels.cache.get(data.Category);
    if (ticketCategory == undefined) {
        return client.errNormal({
            key: 'tickets.setupRequired',
            type: type
        }, interaction);
    }

    if (interaction.channel.parentId != ticketCategory.id) {
        return client.errNormal({
            key: 'tickets.notTicket',
            type: type
        }, interaction);
    }

    await client.simpleEmbed({
        descKey: 'tickets.deleteCountdown',
        type: type
    }, interaction);

    setTimeout(async () => {
        try {
            await interaction.channel.delete();
            await ticketChannels.deleteOne({
                Guild: interaction.guild.id,
                channelID: interaction.channel.id
            });
        }
        catch (error) {
            console.error(error);
        }
    }, 5000);
}


