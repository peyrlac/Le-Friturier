const Discord = require('discord.js');

const ticketSchema = require("../../database/models/tickets");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const data = await ticketSchema.findOne({ Guild: interaction.guild.id });
    if (!data) {
        return client.errNormal({
            key: 'tickets.setupRequired',
            type: 'editreply'
        }, interaction);
    }

    const ticketCategory = interaction.guild.channels.cache.get(data.Category);
    const ticketRole = interaction.guild.roles.cache.get(data.Role);

    if (ticketCategory == undefined) {
        return client.errNormal({
            key: 'tickets.setupRequired',
            type: 'editreply'
        }, interaction);
    }

    if (interaction.channel.parentId != ticketCategory.id) {
        return client.errNormal({
            key: 'tickets.notTicket',
            type: 'editreply'
        }, interaction);
    }

    try {
        await interaction.channel.permissionOverwrites.edit(ticketRole, {
            ViewChannel: true,
            SendMessages: true,
            AttachFiles: true,
            ReadMessageHistory: true,
            AddReactions: true
        });

        return client.simpleEmbed({
            descKey: 'tickets.lowered',
            variables: { user: interaction.user.id },
            type: 'editreply'
        }, interaction);
    }
    catch {
        return client.errNormal({
            key: 'tickets.operationFailed',
            type: 'editreply'
        }, interaction);
    }
}


