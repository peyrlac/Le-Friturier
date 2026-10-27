const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const text = interaction.options.getString('text');
    const reversedText = text.split("").reverse().join("");

    client.succNormal({
        key: 'fun.reverse',
        variables: { text: reversedText },
        type: 'editreply'
    }, interaction)
}

