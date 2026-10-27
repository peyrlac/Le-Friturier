const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.games',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.games.name'))
        .setDescription(getCommandMetadata('commandMetadata.games.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help') 
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('8ball')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.8ball.description'))
                .addStringOption(option => option.setName('question').setDescription(getCommandMetadata('commandMetadata.games.subcommands.8ball.options.question.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fasttype')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.fasttype.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('music-trivia')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.music-trivia.description'))
                .addNumberOption(option => option.setName('number').setDescription(getCommandMetadata('commandMetadata.games.subcommands.music-trivia.options.number.description')).setMinValue(1).setMaxValue(50).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roll')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.roll.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rps')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.rps.description'))
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription(getCommandMetadata('commandMetadata.games.subcommands.rps.options.option.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.games.subcommands.rps.options.option.choices.rock.name'), value: 'rock' },
                            { name: getCommandMetadata('commandMetadata.games.subcommands.rps.options.option.choices.paper.name'), value: 'paper' },
                            { name: getCommandMetadata('commandMetadata.games.subcommands.rps.options.option.choices.scissors.name'), value: 'scissors' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skipword')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.skipword.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('snake')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.snake.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('trivia')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.trivia.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('willyoupressthebutton')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.willyoupressthebutton.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('wouldyourather')
                .setDescription(getCommandMetadata('commandMetadata.games.subcommands.wouldyourather.description')),
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
