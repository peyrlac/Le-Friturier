const Discord = require('discord.js');

const Schema = require("../../database/models/stats");
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction, args) => {
    const count = interaction.guild.channels.cache.filter(channel => channel.type === Discord.ChannelType.GuildStageVoice).size;
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🎤')
        .replace(`{name}`, `Stage Channels: ${count || 0}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'StageChannels', successKey: 'serverstats.stageChannelsCreated' });
    var channelName = await client.getTemplate(interaction.guild);
    channelName = channelName.replace(`{emoji}`, "🎤")
    channelName = channelName.replace(`{name}`, `Stage Channels: ${interaction.guild.channels.cache.filter(channel => channel.type ===  Discord.ChannelType.GuildStageVoice).size || 0}`)

    await interaction.guild.channels.create({
        name: channelName,
        type:  Discord.ChannelType.GuildVoice, permissionOverwrites: [
            {
                deny: [Discord.PermissionsBitField.Flags.Connect],
                id: interaction.guild.id
            },
        ],
    }).then(async (channel) => {
        Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
                data.StageChannels = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    StageChannels: channel.id
                }).save();
            }
        })

        client.succNormal({
            text: `Stage channel count created!`,
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel}`
                }
            ],
            type: 'editreply'
        }, interaction);
    })

}

