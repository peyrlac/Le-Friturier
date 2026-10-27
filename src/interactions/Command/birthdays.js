const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.birthdays',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.birthdays.name'))
        .setDescription(getCommandMetadata('commandMetadata.birthdays.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.check.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.delete.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.list.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.set.description'))
                .addNumberOption(option => option.setName('day').setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.set.options.day.description')).setMinValue(1).setMaxValue(31).setRequired(true))
                .addNumberOption(option => option.setName('month').setDescription(getCommandMetadata('commandMetadata.birthdays.subcommands.set.options.month.description')).setMinValue(1).setMaxValue(12).setRequired(true))
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

 
