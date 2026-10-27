const Discord = require('discord.js');
const Schema = require('../../database/models/stats');

module.exports = async (client, interaction, { channelName, field, successKey, updates = {} }) => {
    const channel = await interaction.guild.channels.create({
        name: channelName,
        type: Discord.ChannelType.GuildVoice,
        permissionOverwrites: [{
            deny: [Discord.PermissionsBitField.Flags.Connect],
            id: interaction.guild.id
        }]
    });

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data[field] = channel.id;
        Object.assign(data, updates);
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, [field]: channel.id, ...updates }).save();
    }

    const channelLabel = await client.t(interaction, 'serverstats.channel');
    return client.succNormal({
        key: successKey,
        fields: [{ name: channelLabel, value: String(channel) }],
        type: 'editreply'
    }, interaction);
};
