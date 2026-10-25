const Discord = require('discord.js');

const Schema = require("../../database/models/stats");
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction, args) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '👤')
        .replace(`{name}`, `Members: ${interaction.guild.memberCount.toLocaleString()}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Members', successKey: 'serverstats.membersCreated' });
    var channelName = await client.getTemplate(interaction.guild);
    channelName = channelName.replace(`{emoji}`, "👤")
    channelName = channelName.replace(`{name}`, `Members: ${interaction.guild.memberCount.toLocaleString()}`)

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
                data.Members = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Members: channel.id
                }).save();
            }
        })

        client.succNormal({
            text: `Member count created!`,
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

