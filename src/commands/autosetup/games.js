const Discord = require('discord.js');

const Counting = require("../../database/models/countChannel");
const GTN = require("../../database/models/guessNumber");
const GTW = require("../../database/models/guessWord");
const WordSnake = require("../../database/models/wordsnake");

module.exports = async (client, interaction, args) => {
    const choice = interaction.options.getString('setup');

    if (choice == "counting") {
        interaction.guild.channels.create({
            name: "counting",
            type: Discord.ChannelType.GuildText
        }).then(async (ch) => {
            client.embed({
                title: await client.t(interaction, 'autosetup.games.countingTitle'),
                desc: await client.t(interaction, 'autosetup.games.countingDescription')
            }, ch)

            client.createChannelSetup(Counting, ch, interaction)
        })
    }

    if (choice == "gtn") {
        interaction.guild.channels.create({
            name:"guess-the-number",
            type: Discord.ChannelType.GuildText
        }).then(async (ch) => {
            client.embed({
                title: await client.t(interaction, 'autosetup.games.guessNumberTitle'),
                desc: await client.t(interaction, 'autosetup.games.guessNumberDescription')
            }, ch)

            client.createChannelSetup(GTN, ch, interaction)
        })
    }

    if (choice == "gtw") {
        interaction.guild.channels.create({
            name: "guess-the-word",
            type: Discord.ChannelType.GuildText
        }).then(async (ch) => {
            var word = "start";
            var shuffled = word.split('').sort(function () { return 0.5 - Math.random() }).join('');

            client.embed({
                title: await client.t(interaction, 'autosetup.games.guessWordTitle'),
                desc: await client.t(interaction, 'autosetup.games.guessWordDescription'),
                fields: [
                    {
                        name: await client.t(interaction, 'autosetup.games.word'),
                        value: `${shuffled.toLowerCase()}`
                    }
                ],
            }, ch)

            client.createChannelSetup(GTW, ch, interaction)
        })
    }

    if (choice == "wordsnake") {
        interaction.guild.channels.create({
            name: "word-snake",
            type: Discord.ChannelType.GuildText
        }).then((ch) => {
            client.createChannelSetup(WordSnake, ch, interaction)
        })
    }
}

