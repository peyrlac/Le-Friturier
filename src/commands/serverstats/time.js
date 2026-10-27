const moment = require('moment');
const momentTimezone = require('moment-timezone');

const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction, args) => {
    const requestedTimezone = interaction.options.getString('timezone');
    if (!momentTimezone.tz.zone(requestedTimezone)) return client.errNormal({ key: 'serverstats.invalidTimezone', type: 'editreply' }, interaction);
    const localizedTimeNow = moment().tz(requestedTimezone).format('HH:mm (z)');
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '⏰')
        .replace(`{name}`, localizedTimeNow);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Time', successKey: 'serverstats.timeCreated', updates: { TimeZone: requestedTimezone } });
}

