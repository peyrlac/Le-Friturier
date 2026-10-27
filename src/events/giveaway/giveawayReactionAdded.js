const Discord = require('discord.js');

module.exports = (client, giveaway, member, reaction) => {
    client.succNormal({
        key: 'giveawayEvents.entryApproved',
        variables: { link: `https://discordapp.com/channels/${giveaway.message.guildId}/${giveaway.message.channelId}/${giveaway.message.id}` }
    }, member).catch(() => { });
};
