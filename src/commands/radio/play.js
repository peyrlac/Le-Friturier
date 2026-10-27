const Discord = require('discord.js');
const Schema = require("../../database/models/music");

module.exports = async (client, interaction, args) => {
    const t = (key, variables = {}) => client.t(interaction, `commands.radio.${key}`, variables);
    const webhookClientLogs = new Discord.WebhookClient({
        id: client.webhooks.voiceLogs.id,
        token: client.webhooks.voiceLogs.token,
    });

    const channel = interaction.member.voice?.channel;
    if (!channel) return client.errNormal({ key: 'commands.radio.noVoiceChannel', type: 'editreply' }, interaction);

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
        titleKey: 'commands.radio.startedTitle',
        descKey: 'commands.radio.startedDescription',
        fields: [{
            name: await t('startedBy'),
            value: `${interaction.user} (${interaction.user.tag})`,
            inline: true
        },
        {
            name: await t('channel'),
            value: `${channel} (${channel.name})`,
            inline: true
        },
        {
            name: await t('station'),
            value: `[Radio 538](https://www.538.nl/)`,
            inline: true
        },
        ],
        type: 'editreply'
    }, interaction)

    let embed = new Discord.EmbedBuilder()
        .setTitle(await t('startedLogTitle'))
        .setDescription(await t('startedLogDescription'))
        .addFields(
            { name: await t('startedBy'), value: `${interaction.user} (${interaction.user.tag})`, inline: true },
            { name: await t('channel'), value: `${channel} (${channel.name})`, inline: true },
            { name: await t('guild'), value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
        )
        .setColor(client.config.colors.normal)
        .setTimestamp();
    await webhookClientLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    });
}


