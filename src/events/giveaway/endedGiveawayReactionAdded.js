const Discord = require('discord.js');

module.exports = (client, giveaway, member, reaction) => {
    client.errNormal({
        key: 'giveawayEvents.endedEntry'
    }, member).catch(() => { });
};
