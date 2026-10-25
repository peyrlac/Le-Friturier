const Discord = require('discord.js');

const Schema = require("../../database/models/stickymessages");

module.exports = async (client, interaction, args) => {
    const channel = interaction.options.getChannel('channel');
    const content = interaction.options.getString('message');

    const embed = new Discord.EmbedBuilder()
        .setDescription(`${content}`)
        .setColor(client.config.colors.normal);
    const msg = await channel.send({ embeds: [embed] });
    const data = await Schema.findOne({ Guild: interaction.guild.id, Channel: channel.id });
    if (data) {
        data.Channel = channel.id;
        data.Content = content;
        data.LastMessage = msg.id;
        await data.save();
    }
    else {
        await new Schema({
            Guild: interaction.guild.id,
            Channel: channel.id,
            LastMessage: msg.id,
            Content: content,
        }).save();
    }

    return client.succNormal({
        text: "Sticky message created",
        fields: [
            {
                name: `💬┆Message`,
                value: `${content}`
            }
        ],
        type: 'editreply'
    }, interaction)
}


