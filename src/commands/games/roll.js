const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    var result = Math.ceil(Math.random() * 6);

    client.embed({
        titleKey: 'games.rollTitle',
        descKey: 'games.rolled',
        variables: { result },
        type: 'editreply'
    }, interaction);
}


