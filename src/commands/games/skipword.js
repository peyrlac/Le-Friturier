const Discord = require('discord.js');

const Schema = require("../../database/models/guessWord");

module.exports = async (client, interaction, args) => {
    let wordList = client.config.wordList;

    const data = await Schema.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
    if (!data) {
        return client.errNormal({
            key: 'games.skipWordWrongChannel',
            type: 'editreply'
        }, interaction);
    }

    try {
        wordList = wordList.split("\n");
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const shuffled = word.split('').sort(function () { return 0.5 - Math.random() }).join('');

        data.Word = word;
        await data.save();

        await client.succNormal({
            key: 'games.skipWordSkipped',
            type: 'ephemeral'
        }, interaction);

        return client.embed({
            titleKey: 'games.skipWordTitle',
            descKey: 'games.skipWordDescription',
            variables: { word: shuffled.toLowerCase() },
        }, interaction.channel);
    }
    catch (error) {
        return client.errNormal({
            key: 'common.error',
            type: 'ephemeral'
        }, interaction);
    }
}


