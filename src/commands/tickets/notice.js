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

    const ticketData = await ticketChannels.findOne({
        Guild: interaction.guild.id,
        channelID: interaction.channel.id
    });
    if (!ticketData) return;

    if (interaction.user.id === ticketData.creator) {
        return client.errNormal({
            key: 'tickets.ownNotice',
            type: 'ephemeral'
        }, interaction);
    }

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

    return client.simpleEmbed({
        descKey: 'tickets.notice',
        variables: { user: ticketData.creator, guild: interaction.guild.name },
        content: `<@!${ticketData.creator}>`,
        type: type
    }, interaction);
}


