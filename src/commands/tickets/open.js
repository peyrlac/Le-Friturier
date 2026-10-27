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

    if (ticketData.resolved == false) return client.errNormal({
        key: 'tickets.alreadyOpen',
        type: 'ephemeraledit'
    }, interaction);

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

    const user = await client.users.fetch(ticketData.creator);
    await interaction.channel.permissionOverwrites.edit(user, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        ReadMessageHistory: true,
        AddReactions: true
    });

    const ticketid = String(ticketData.TicketID).padStart(4, 0);
    await interaction.channel.setName(`ticket-${ticketid}`);

    ticketData.resolved = false;
    await ticketData.save();

    return client.simpleEmbed({
        descKey: 'tickets.opened',
        variables: { user: interaction.user.id },
        type: type
    }, interaction);
}


