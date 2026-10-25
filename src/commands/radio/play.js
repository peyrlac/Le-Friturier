const Discord = require('discord.js');
const Schema = require("../../database/models/music");

module.exports = async (client, interaction, args) => {
    const webhookClientLogs = new Discord.WebhookClient({
        id: client.webhooks.voiceLogs.id,
        token: client.webhooks.voiceLogs.token,
    });

    let channel = interaction.member.voice ? interaction.member.voice.channel : null;
    if (!channel) return client.errNormal({ text: `Le canal n'existe pas!`, type: 'editreply' }, interaction);

    client.radioStart(channel);

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.Channel = channel.id;
        await data.save();
    }
    else {
        await new Schema({
            Guild: interaction.guild.id,
            Channel: channel.id,
        }).save();
    }

    await client.embed({
        title: `📻・Démarré la radio`,
        desc: `La radio a commencé avec succès \ nto faire partir le bot: \`rleave\``,
        fields: [{
            name: "👤┆Commencé par",
            value: `${interaction.user} (${interaction.user.tag})`,
            inline: true
        },
        {
            name: "📺┆Canal",
            value: `${channel} (${channel.name})`,
            inline: true
        },
        {
            name: "🎶┆Station de radio",
            value: `[Radio 538](https://www.538.nl/)`,
            inline: true
        },
        ],
        type: 'editreply'
    }, interaction)

    let embed = new Discord.EmbedBuilder()
        .setTitle(`📻・Started radio`)
        .setDescription(`_______________ \n\nRadio has started successfully`)
        .addFields(
            { name: "👤┆Started By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
            { name: "📺┆Channel", value: `${channel} (${channel.name})`, inline: true },
            { name: "⚙️┆Guild", value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
        )
        .setColor(client.config.colors.normal)
        .setTimestamp();
    await webhookClientLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    });
}


