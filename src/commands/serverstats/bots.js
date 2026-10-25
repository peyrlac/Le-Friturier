const Discord = require('discord.js');

const Schema = require("../../database/models/stats");
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction, args) => {
    const guildMembers = await interaction.guild.members.fetch();
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🤖')
        .replace(`{name}`, `Bots: ${guildMembers.filter(member => member.user.bot).size || 0}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Bots', successKey: 'serverstats.botsCreated' });
    const members = await interaction.guild.members.fetch();

    var channelName = await client.getTemplate(interaction.guild);
    channelName = channelName.replace(`{emoji}`, "🤖")
    channelName = channelName.replace(`{name}`, `Bots: ${members.filter(member => member.user.bot).size || 0}`)

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
                data.Bots = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Bots: channel.id
                }).save();
            }
        })

        client.succNormal({
            text: `Bots count created!`,
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

