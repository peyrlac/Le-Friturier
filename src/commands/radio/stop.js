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

    client.radioStop(channel);

    await Schema.deleteOne({ Guild: interaction.guild.id });

    await client.embed({
        titleKey: 'commands.radio.stoppedTitle',
        descKey: 'commands.radio.stoppedDescription',
        fields: [{
            name: await t('stoppedBy'),
            value: `${interaction.user} (${interaction.user.tag})`,
            inline: true
        },
        {
            name: await t('channel'),
            value: `${channel} (${channel.name})`,
            inline: true
        }
        ],
        type: 'editreply'
    }, interaction)

    let embed = new Discord.EmbedBuilder()
        .setTitle(await t('stoppedLogTitle'))
        .setDescription(await t('stoppedLogDescription'))
        .addFields(
            { name: await t('stoppedBy'), value: `${interaction.user} (${interaction.user.tag})`, inline: true },
            { name: await t('channel'), value: `${channel} (${channel.name})`, inline: true },
            { name: await t('guild'), value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
        )
        .setColor(client.config.colors.normal)
        .setTimestamp();
    await webhookClientLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    });
};

