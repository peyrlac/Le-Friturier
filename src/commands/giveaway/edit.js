const Discord = require('discord.js');
const ms = require('ms');

module.exports = async (client, interaction, args) => {
    const messageID = interaction.options.getString('message');
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageID);
    if (!giveaway) return client.errNormal({ key: 'giveaway.notInGuild', type: 'editreply' }, interaction)
    client.giveawaysManager.edit(messageID, {
        addTime: 5000,
    }).then(() => {
        const numberOfSecondsMax = client.giveawaysManager.options.updateCountdownEvery / 1000;
        client.succNormal({
            key: 'giveaway.updated',
            variables: { seconds: numberOfSecondsMax },
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


