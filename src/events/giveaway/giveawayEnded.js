const Discord = require('discord.js');

module.exports = (client, giveaway, winners) => {
    winners.forEach((member) => {
        client.embed({
            title: await client.t(member, 'giveawayEvents.endedTitle'),
            desc: await client.t(member, 'giveawayEvents.wonDescription', { user: member.user.username }),
            fields: [
                {
                    name: await client.t(member, 'giveawayEvents.prize'),
                    value: `${giveaway.prize}`,
                    inline: true
                },
                {
                    name: await client.t(member, 'giveawayEvents.giveaway'),
                    value: `[${await client.t(member, 'giveawayEvents.viewLink')}](https://discordapp.com/channels/${giveaway.message.guildId}/${giveaway.message.channelId}/${giveaway.message.id})`,
                    inline: true
                }
            ]
        
        }, member).catch(() => { });
    });
};
