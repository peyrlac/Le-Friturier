const Discord = require('discord.js');

const Schema = require("../../database/models/stats");
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction, args) => {
    const animatedCount = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🤡')
        .replace(`{name}`, `Animated Emojis: ${animatedCount || '0'}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'AnimatedEmojis', successKey: 'serverstats.animatedEmojisCreated' });
    let EmojiCount = 0;
    let Animated = 0;
    let OverallEmojis = 0;

    interaction.guild.emojis.cache.forEach((emoji) => {
        OverallEmojis++;
        if (emoji.animated) {
            Animated++;
        } else {
            EmojiCount++;
        }
    });

    var channelName = await client.getTemplate(interaction.guild);
    channelName = channelName.replace(`{emoji}`, "🤡")
    channelName = channelName.replace(`{name}`, `Animated Emojis: ${Animated || '0'}`)

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
                data.AnimatedEmojis = channel.id;
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    AnimatedEmojis: channel.id
                }).save();
            }
        })

        client.succNormal({
            text: `Animated emoji's count created!`,
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

