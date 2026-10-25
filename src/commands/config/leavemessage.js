const Discord = require('discord.js');

const inviteMessages = require("../../database/models/inviteMessages");
const localizedLeaveMessage = require('./leavemessageLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLeaveMessage(client, interaction, args);
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const message = interaction.options.getString('message');

    if (message.toUpperCase() == "HELP") {
        return client.embed({
            title: `ℹ️・Welcome message options`,
            desc: `Leave message options: \n
            \`{user:username}\` - User's username
            \`{user:discriminator}\` - User's discriminator
            \`{user:tag}\` - User's tag
            \`{user:mention}\` - Mention a user

            \`{inviter:username}\` - inviter's username
            \`{inviter:discriminator}\` - inviter's discriminator
            \`{inviter:tag}\` - inviter's tag
            \`{inviter:mention}\` - inviter's mention
            \`{inviter:invites}\` - inviter's invites
            \`{inviter:invites:left}\` - inviter's left invites
            
            \`{guild:name}\` - Server name
            \`{guild:members}\` - Server members count`,
            type: 'editreply'
        }, interaction)
    }

    if (message.toUpperCase() == "DEFAULT") {
        inviteMessages.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
                data.inviteLeave = null;
                data.save();

                client.succNormal({
                    text: `Laissez le message supprimé!`,
                    type: 'editreply'
                }, interaction);
            }
        })
    }
    else {
        inviteMessages.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
                data.inviteLeave = message;
                data.save();
            }
            else {
                new inviteMessages({
                    Guild: interaction.guild.id,
                    inviteLeave: message
                }).save();
            }

            client.succNormal({
                text: `Le message de congé a été défini avec succès`,
                fields: [
                    {
                        name: `💬┆Message`,
                        value: `${message}`,
                        inline: true
                    },
                ],
                type: 'editreply'
            }, interaction)
        })
    }
}

