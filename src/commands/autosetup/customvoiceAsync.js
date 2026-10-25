const Discord = require('discord.js');
const voiceSchema = require("../../database/models/voice");

module.exports = async (client, interaction, args) => {
    try {
        const category = await interaction.guild.channels.create({
            name: "Custom voice",
            type: Discord.ChannelType.GuildCategory
        });
        const channel = await interaction.guild.channels.create({
            name: "➕ Créer un salon vocal",
            type: Discord.ChannelType.GuildVoice,
            parent: category.id,
            permissionOverwrites: [{
                deny: [Discord.PermissionsBitField.Flags.Speak],
                id: interaction.guild.id
            }]
        });

        const data = await voiceSchema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Category = category.id;
            data.Channel = channel.id;
            data.ChannelName = "{emoji} {channel name}";
            await data.save();
        }
        else {
            await new voiceSchema({
                Guild: interaction.guild.id,
                Channel: channel.id,
                ChannelName: "{emoji} {channel name}",
                Category: category.id
            }).save();
        }

        return client.succNormal({
            key: 'setup.customvoice.success',
            fields: [{ name: '📘・Canal', value: `${channel} (${channel.name})` }],
            type: 'editreply'
        }, interaction);
    }
    catch (error) {
        console.error(error);
        return client.errNormal({ key: 'setup.customvoice.error', type: 'editreply' }, interaction);
    }
};
