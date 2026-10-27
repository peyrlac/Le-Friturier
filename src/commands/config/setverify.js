const Discord = require('discord.js');

const Schema = require("../../database/models/verify");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const boolean = interaction.options.getBoolean('enable');
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    if (boolean == true) {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Channel = channel.id;
            data.Role = role.id
            data.save();
        }
        else {
            new Schema({
                Guild: interaction.guild.id,
                Channel: channel.id,
                Role: role.id
            }).save();
        }

        client.succNormal({
            key: 'commands.config.setverify.success',
            fields: [
                {
                    name: `📘┆Canal`,
                    value: `${channel} (${channel.name})`,
                    inline: true
                },
                {
                    name: `📛┆Role`,
                    value: `${role} (${role.name})`,
                    inline: true
                }
            ],
            type: 'editreply'
        }, interaction);

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('Bot_verify')
                    .setEmoji('✅')
                    .setStyle(Discord.ButtonStyle.Success),
            );

        client.embed({
            title: `${interaction.guild.name}・vérifier`,
            desc: `Cliquez sur le bouton pour vous vérifier`,
            components: [row]
        }, channel)
    }
}

