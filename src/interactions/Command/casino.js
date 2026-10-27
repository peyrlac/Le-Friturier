const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.casino',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.casino.name'))
        .setDescription(getCommandMetadata('commandMetadata.casino.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.casino.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('blackjack')
                .setDescription(getCommandMetadata('commandMetadata.casino.subcommands.blackjack.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.casino.subcommands.blackjack.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crash')
                .setDescription(getCommandMetadata('commandMetadata.casino.subcommands.crash.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.casino.subcommands.crash.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roulette')
                .setDescription(getCommandMetadata('commandMetadata.casino.subcommands.roulette.description'))
                .addStringOption(option => option.setName('color').setDescription(getCommandMetadata('commandMetadata.casino.subcommands.roulette.options.color.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.casino.subcommands.roulette.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('slots')
                .setDescription(getCommandMetadata('commandMetadata.casino.subcommands.slots.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.casino.subcommands.slots.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
    ,

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

 
