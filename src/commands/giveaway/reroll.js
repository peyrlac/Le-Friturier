const Discord = require('discord.js');
const ms = require('ms');

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Interaction} interaction
 * @param {*} args
 * @returns
 */
module.exports = async (client, interaction, args) => {
    const messageID = interaction.options.getString('message');
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageID);
    if (!giveaway) return client.errNormal({ key: 'giveaway.notInGuild', type: 'editreply' }, interaction)
    client.giveawaysManager.reroll(messageID).then(() => {
        client.succNormal({
            key: 'giveaway.rerolled',
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

