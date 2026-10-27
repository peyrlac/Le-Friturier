const Discord = require('discord.js');
const ms = require('ms');

module.exports = async (client, interaction, args) => {
    const gchannel = interaction.options.getChannel('channel');
    const duration = interaction.options.getString('duration');
    const winnerCount = interaction.options.getNumber('winners');
    const prize = interaction.options.getString('prize');
    const t = (key, variables = {}) => client.t(interaction, `commands.giveaway.${key}`, variables);

    client.giveawaysManager.start(gchannel, {
        duration: ms(duration),
        prize: `${client.emotes.normal.gift} - ${prize}`,
        lastChance: {
            enabled: true,
            content: await t('lastChance', { error: client.emotes.normal.error }),
            threshold: 5000,
            embedColor: '#FF0000'
        },
        pauseOptions: {
            isPaused: true,
            content: await t('pausedMessage'),
            unPauseAfter: null,
            embedColor: '#FFFF00'
        },
        winnerCount: parseInt(winnerCount),
        hostedBy: interaction.user,
        thumbnail: interaction.guild.iconURL({ dynamic: true, size: 1024 }),
        isDrop: true,
        messages: {
            giveaway: await t('title', { party: client.emotes.normal.party }),
            giveawayEnded: await t('endedTitle', { party: client.emotes.normal.party }),
            drawing: await t('drawing', { clock: client.emotes.normal.clock }),
            dropMessage: await t('dropMessage'),
            winMessage: await t('winMessage'),
            embedFooter: await t('footer'),
            embedColor: client.config.colors.normal,
            noWinner: await t('noWinner'),
            hostedBy: await t('hostedBy', { party: client.emotes.normal.party }),
            winners: await t('winners'),
            endedAt: await t('endedAt'),
            units: {
                seconds: await t('units.seconds'),
                minutes: await t('units.minutes'),
                hours: await t('units.hours'),
                days: await t('units.days'),
                pluralS: false
            },
        },

    }).then((gData) => {
        client.succNormal({ 
            key: 'commands.giveaway.started',
            variables: { channel: gchannel },
            type: 'ephemeraledit'
        }, interaction);
    });
}

