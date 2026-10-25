const Discord = require('discord.js');
const ms = require('ms');

module.exports = async (client, interaction, args) => {
    const messageID = interaction.options.getString('message');
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageID);
    if (!giveaway) return client.errNormal({ key: 'giveaway.notInGuild', type: 'editreply' }, interaction)
    client.giveawaysManager.edit(messageID, {
        setEndTimestamp: Date.now()
    }).then(() => {
        client.succNormal({
            key: 'giveaway.ended',
            variables: { seconds: client.giveawaysManager.options.updateCountdownEvery / 1000 },
            type: 'editreply'
        }, interaction);
    }).catch((err) => {
        client.errNormal({
            key: 'giveaway.notFound',
            variables: { messageID },
            type: 'editreply'
        }, interaction)
    });
}


