module.exports = async (client, interaction) => {
    const t = (key, variables = {}) => client.t(interaction, `commands.radio.${key}`, variables);
    const channel = interaction.member.voice?.channel;

    if (!channel) return client.errNormal({ key: 'commands.radio.noVoiceChannel', type: 'editreply' }, interaction);

    return client.embed({
        titleKey: 'commands.radio.infoTitle',
        descKey: 'commands.radio.infoDescription',
        fields: [
            {
                name: await t('listeners'),
                value: `${channel.members.size} ${await t('listeners')}`,
                inline: true,
            },
            {
                name: await t('connectedChannel'),
                value: `${channel} (${channel.name})`,
                inline: true,
            },
            {
                name: await t('station'),
                value: '[Radio 538](https://www.538.nl/)',
                inline: true,
            },
        ],
        type: 'editreply',
    }, interaction);
};

